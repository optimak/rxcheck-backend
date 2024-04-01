# rxcheck-backend
### Overview
The following endpoints were created:
- Sign up : POST */users/register* ; 
Body: 
`{
    "full_name": "Test Name ",
    "email" : "test@gmail.com",
    "password": "testpassword"
}`
- Log in : POST  */users/login* ; 
Body: 
`{
    "email" : "test@gmail.com",
    "password": "testpassword"
}`
- Get Profile : GET */users/profile* ; 
Bearer token obtained from Log in is used.



### Features The following endpoints were created: 
- Get Medication Comments : GET *comments/:medicationID* ; 
- Add Comment : POST *comments/:medicationID*; 
Sample Body:
`{ "user_id": 2, "medication_id": 10, "content": "content of comment submitted" }`
- Delete Comment : DELETE *comments/:medicationID*; 
- Get Medications : GET *medications* ; 
- Get Medications by condication (indication): GET *medications/search* ; 
?query=*query*


To use, add an env file in the form below: 
PORT=8080
DB_HOST=*your database host* like 127.0.0.1
DB_NAME=*your database name*
DB_USER=*your database user name*
DB_PASSWORD=*your database password*
API_KEY=*api key from open ai will be used in later updates. if any errors kindly sign up on open ai's website https://openai.com/product*
JWT_KEY=*randomly generated alpha-numeric string of about 30 characters*

Then, run  `npm install ` in your terminal after cloning the repository.
Then run  `npm start`.
