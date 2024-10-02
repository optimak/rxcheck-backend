const knex = require('knex')(require('../knexfile'));
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// const register = async (req, res) => {
//     // POST /auth/register
//     // - Creates a new user.
//     // - Expected body: { full_name, email, age, gender, password, preexisting_conditions }
//     //might add image later on
//     const { full_name, email, age, gender, password, preexisting_conditions } = req.body;

//     if (!full_name || !email || !password) {
//         return res.status(400).send("Please enter the required fields");
//     }

//     const existingUser = await knex("users").where({ "email": email });


//     if (existingUser.length > 0) {
//         return res.status(400).send("Email already on file");
//     } else {


//         try {
//             const hashedPassword = bcrypt.hashSync(password);

//             // Create the new user
//             const newUser = {
//                 full_name,
//                 email,
//                 age: isNaN(Number(age)) ? 0 : Number(age),
//                 gender,
//                 password: hashedPassword,
//                 preexisting_conditions
//             };

//             // Insert it into our database
//             await knex("users").insert(newUser);
//             res.status(201).send("Registered successfully");

       
//         } catch (error) {
//             res.status(400).send("Failed registration");
//         }
//     }



// };

const register = async (req, res) => {
    // POST /auth/register
    // Expected body: { full_name, email, age, gender, password, preexisting_conditions }

    const { full_name, email, age, gender, password, preexisting_conditions } = req.body;

    // Check for required fields
    if (!full_name || !email || !password) {
        return res.status(400).send("Please enter the required fields");
    }

    try {
        // Check if user exists in Supabase Auth
        const { data: existingUser } = await supabase.auth.signInWithPassword({ email, password });
        if (existingUser) {
            return res.status(400).send("Email already on file");
        }

        // Register user in Supabase Auth for authentication
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return res.status(400).send("Failed to register user in Supabase Auth");
        }

        // Prepare the additional fields for your database
        const newUser = {
            full_name,
            email,
            age: isNaN(Number(age)) ? 0 : Number(age),
            gender,
            password: bcrypt.hashSync(password),  // Hash the password for additional security
            preexisting_conditions,
        };

        // Insert the additional profile data into the users table in your database
        await knex("users").insert(newUser);

        // Respond with a success message
        res.status(201).send("Registered successfully and profile created");
    } catch (error) {
        res.status(400).send("Failed registration");
    }
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
    // check if there is no auth header provided
    if (!req.headers.authorization) {
        return res.status(401).send("Please login");
    }

    // Parse the bearer token
    const authHeader = req.headers.authorization;
    const authToken = authHeader.split(" ")[1];

    // Verify the token
    try {
        const currentTimestamp = new Date().toISOString();
        const decodedToken = jwt.verify(authToken, process.env.JWT_KEY);
        const issuedAt = new Date(decodedToken.iat * 1000);
        //update llast login to this one, issued_at where user_id == this
       

        // Respond with the appropriate user data
        const user = await knex("users").where({ id: decodedToken.id }).first();
        delete user.password;
        await knex('users')
        .where({ id: decodedToken.id })
        .update({
          last_login: currentTimestamp
        });
       

        // Update the last_login column for the user with id = 4
        
        res.send(user);
    } catch (error) {
        res.status(401).send("Invalid auth token");
    }
};



const userMeds = async (req, res) => {
    //get comments on a medication
    const { user_id } = req.params;
    try {

        const searchResults = await knex('users_medications')
            .join('medications', 'medications.id', '=', 'users_medications.medication_id')
            .where({ 'users_medications.user_id': req.params.user_id })
            .select('users_medications.user_id','medications.*', 'medications.id as medication_id');

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

    
    const newUserMed = {
        user_id,
        medication_id,

    };

    try {
      
        const existingUserMed = await knex('users_medications')
            .where({ medication_id: medication_id, user_id: user_id });
        if (existingUserMed.length) {
            await knex('users_medications')
                .where({ medication_id: medication_id, user_id: user_id }).del();
        }
        await knex('users_medications')
            .insert(newUserMed);

        res.json(newUserMed);
    } catch (err) {
        res.status(400).send(`Error sending comment: ${err}`);
    }
};



const deleteUserMeds = async (req, res) => {
    //DELETE users med on a medication
  
    const { user_id, med_id } = req.params;


    try {

        const deletedUserMeds = await knex('users_medications')
            .where({ 'medication_id': med_id,'user_id': user_id })
            .del();
        if (deletedUserMeds === 0) {
            return res.status(404).json({ message: "User Med not found" });
        }


        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(`Error deleting comment: ${err}`);
    }
};






module.exports = {
    register,
    login,
    getProfile,
    userMeds,
    addUserMeds,
    deleteUserMeds

};