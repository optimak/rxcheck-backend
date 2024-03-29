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
    try {
        const existingUser = await knex("users").where({"email": email});


        if (existingUser){
            return res.status(400).send("Email already on file");
        }
    } catch (error) {
        console.log(error)
    }
   

    const hashedPassword = bcrypt.hashSync(password);

    // Create the new user
    const newUser = {
        full_name,
        email,
        age,
        gender,
        password: hashedPassword,
        preexisting_conditions
    };

    // Insert it into our database
    try {
        await knex("users").insert(newUser);
        res.status(201).send("Registered successfully");
    } catch (error) {
        console.error(error);
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
      return res.status(400).send("Invalid email");
    }
  
    // Validate the password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid password");
    }
  
    // Generate a token
    const token = jwt.sign(
      { id: user.id, email: user.email },
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

};