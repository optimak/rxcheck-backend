const knex = require('knex')(require('../knexfile'));
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    // POST /auth/register
    // - Creates a new user.
    // - Expected body: { full_name, email, age, gender, password, preexisting_conditions }
    // B444 - Expected body: { first_name, last_name, phone, address, email, password }
    console.log(req.body)
    const { full_name, email, age, gender, password, preexisting_conditions } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).send("Please enter the required fields");
    }

    const existingUser = await knex("users").where({ "email": email });


    if (existingUser.length > 0) {
        return res.status(400).send("Email already on file");
    } else {


        try {
            // else {
            const hashedPassword = bcrypt.hashSync(password);

            // Create the new user
            const newUser = {
                full_name,
                email,
                age: isNaN(Number(age)) ? 0 : Number(age),
                gender,
                password: hashedPassword,
                preexisting_conditions
            };

            // Insert it into our database
            // try {
            await knex("users").insert(newUser);
            res.status(201).send("Registered successfully");

            // }
            console.log("older", existingUser)
        } catch (error) {
            // console.log(error)
            console.error(error);
            res.status(400).send("Failed registration");
        }
    }


    // const hashedPassword = bcrypt.hashSync(password);

    // // Create the new user
    // const newUser = {
    //     full_name,
    //     email,
    //     age: Number(age),
    //     gender,
    //     password: hashedPassword,
    //     preexisting_conditions
    // };

    // // Insert it into our database
    // try {
    //     await knex("users").insert(newUser);
    //     res.status(201).send("Registered successfully");
    //     } catch (error) {
    //         console.error(error);
    //         res.status(400).send("Failed registration");
    //     }
};



const login = async (req, res) => {
    // ## POST /auth/login
    // -   Generates and responds a JWT for the user to use for future authorization.
    // -   Expected body: { email, password }
    // -   Response format: { token: "JWT_TOKEN_HERE" }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).send("Please enter the required fields");
    }

    // Find the user
    const user = await knex("users").where({ email: email }).first();
    if (!user) {
        return res.status(400).send("Email Address doesn't exist. Sign Up");
    }

    // Validate the password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send("Invalid password");
    }

    // Generate a token
    const token = jwt.sign(
        { id: user.id, email: user.email, full_name: user.full_name },
        process.env.JWT_KEY,
        { expiresIn: "8h" }
    );

    res.send({ token });
};



//Get registered profile after registering and logging in
const getProfile = async (req, res) => {
    // If there is no auth header provided
    if (!req.headers.authorization) {
        return res.status(401).send("Please login");
    }

    // Parse the bearer token
    const authHeader = req.headers.authorization;
    const authToken = authHeader.split(" ")[1];

    // Verify the token
    try {
        const decodedToken = jwt.verify(authToken, process.env.JWT_KEY);

        // Respond with the appropriate user data
        const user = await knex("users").where({ id: decodedToken.id }).first();
        delete user.password;
        res.send(user);
    } catch (error) {
        res.status(401).send("Invalid auth token");
    }
};



const userMeds = async (req, res) => {
    //get comments on a medication
    const { user_id } = req.params;
    //  console.log('query',query);
    try {

        const searchResults = await knex('users_medications')
            .join('medications', 'medications.id', '=', 'users_medications.medication_id')
            .where({ 'users_medications.user_id': req.params.user_id })
            .select('users_medications.user_id','medications.*', 'medications.id as medication_id');

        console.log(searchResults)
        res.json(searchResults);
    } catch (err) {
        res.status(400).send(`Error retrieving user meds: ${err}`);
    }
};

const addUserMeds = async (req, res) => {
    //add comments on a medication
    //receives user_id, medication_id, content) 
    // will add  summary later)
    const { user_id } = req.params;
    const {  medication_id } = req.body;

    // if (!content) {
    //     return res.status(400).send("Please enter a comment");
    // }
    const newUserMed = {
        user_id,
        medication_id,

    };

    try {
        // const synonyms = await expand_query_with_synonyms(query); USE FOR SUMMARY? OPEN_AI
        ///// ONE MORE THING CHi
        // first check if there's a userid med combo for the user. if yes, do a put/replace in the knex
        const existingUserMed = await knex('users_medications')
            .where({ medication_id: medication_id, user_id: user_id });
        if (existingUserMed.length) {
            await knex('users_medications')
                .where({ medication_id: medication_id, user_id: user_id }).del();
            console.log("deleted extra")
        }
        await knex('users_medications')
            .insert(newUserMed);

        console.log(newUserMed, existingUserMed)
        res.json(newUserMed);
    } catch (err) {
        res.status(400).send(`Error sending comment: ${err}`);
    }
};



const deleteUserMeds = async (req, res) => {
    //DELETE users med on a medication
  
    const { user_id, med_id } = req.params;
    // const { medication_id : med_id } = req.body;


    try {

        const deletedUserMeds = await knex('users_medications')
            .where({ 'medication_id': med_id,'user_id': user_id })
            .del();
        console.log(deletedUserMeds)
        if (deletedUserMeds === 0) {
            console.log(deletedUserMeds)
            return res.status(404).json({ message: "User Med not found" });
        }


        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(`Error deleting comment: ${err}`);
    }
};







// const add = async (req, res) => {
//     if (!req.body.warehouse_id || !req.body.item_name || !req.body.description || !req.body.category || !req.body.status || !req.body.quantity) {

//         return res.status(400).json({
//             message: "Please provide values for all fields: warehouse_id, item_name, description, category, status and quantity",
//         });
//     } else if (Number.isNaN(Number(req.body.quantity))) {
//         return res.status(400).json({
//             message: "Please provide a valid number for quantity",
//         });
//     }

//     try {
//         const warehouseItem = await knex("warehouses")
//             .where({ id: req.body.warehouse_id });

//         if (warehouseItem.length === 0) {
//             return res.status(400).json({
//                 message: `Warehouse with ID ${req.body.warehouse_id} does not exist`
//             });
//         }

//         const result = await knex("inventories").insert(req.body);

//         const newInventoryId = result[0];
//         const createdInventory = await knex("inventories").where({ id: newInventoryId });

//         res.status(201).json(createdInventory);
//     } catch (error) {
//         res.status(500).json({
//             message: `Unable to add item to inventory }: ${error}`
//         });

//     }
// };
module.exports = {
    register,
    login,
    getProfile,
    userMeds,
    addUserMeds,
    deleteUserMeds

};