#  :pill: rxcheck-backend
This repository serves as the backend for :pill: [rxcheck](https://github.com/optimak/rxcheck)
## Installation



To run the app,
1.  Start a mySQL database instance on your computer, 
	- create a database, 
	-  based on the credentials, add a .env file with the values in the form below: 
```
PORT=8080
DB_HOST=*your database host* e.g 127.0.0.1
DB_NAME=*your database name* e.g rxcheck
DB_USER=*your database user name*
DB_PASSWORD=*your database password*
JWT_KEY=*randomly generated alpha-numeric string of about 30 characters* e.g aggjqldlww79sweq28v9eczpcom1z3
```
> :memo: **Note**
 If port *8080* is already in use, it could be changed to another port, as long as the corresponding port number in the [rxcheck](https://github.com/optimak/rxcheck) front-end is updated in its .env file.


Once this is done:

2.  run  `npm install ` in your terminal after cloning the repository.
```bash
npm install
```

3.  run `npx knex migrate:latest` to run migration files.
```bash
npx knex migrate:latest
```

4. run `npx knex seed:run` to seed the database .
```bash
npx knex seed:run
```
5. Then run  `npm start` to start the server :rocket:.
```bash
npm start
```

The corresponding front-end application can be found [here](https://github.com/optimak/rxcheck#installation).
