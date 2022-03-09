const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const register = require('./controllers/register');
const profile = require('./controllers/profile');

const db = knex({
	client: 'pg',
  	connection: {
    connectionString: process.env.DATABASE_URL,
   	ssl: {
    		rejectUnauthorized: false
    	}
	}
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send('It is working!');})
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res, db)})

app.listen(process.env.PORT || 5000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});