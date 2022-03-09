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
    host : '127.0.0.1',
    port : 4444,
    user : 'postgres',
    password : 'Desktop!brew#321',
    database : 'smartbrain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send(database.users);})
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res, db)})

app.listen(5000, () => {
	console.log('app is running on port 5000');
});