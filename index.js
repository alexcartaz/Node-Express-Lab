// import your node modules

const express = require('express');
const db = require('./data/db.js');
const server = express();

// add your server code starting here
server.listen(5000, () => console.log('test'));

/*
server.get('/', (req, res) => {
	//res.send('hello');
	db.find()
	  .then(users => {
	  	res.send({users});
	  })
	  .catch(err => {
	  	res.send(err);
	  });
});
*/

server.get('/api/users/:userid', (req, res) => {
	const id = req.params.userid;

	db.findById(id)
	  .then(user => {
	  	if (user.length > 0) {
	  		res.status(200).json(user);
	  	}else{
	  		res.status(404).json({message: 'The post with the specified ID does not exist.'});
	  	}
	  })
	  .catch(err => {
		res.status(500).json({ error: "The post information could not be retrieved." });
	  })
});