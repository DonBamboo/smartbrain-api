const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const image = require('./controllers/image');

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

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if (isValid) {
			return db.select('*').from('users')
				.where('email', '=', req.body.email)
				.then(user => {
					res.json(user[0])
				})
				.catch(err => res.status(400).json('unable to get user'))
		} else {
		res.status(400).json('wrong credentials1')
		}
	})
	.catch(err => res.status(400).json('wrong credentials2'))
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
		return db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					email: email,
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
	.catch(err => res.status(400).json('unable to register!'))
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id}).then(user => {
		if (user.length) {
			res.json(user[0])
		} else {
			res.status(400).json('Not Found!')
		}
	})
	.catch(err => res.status(400).json('Error Getting User!'))
})

app.put('/image', (req, res) => { image.handleImage(req, res)})

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res)})


app.listen(5000, () => {
	console.log('app is running on port 5000');
});