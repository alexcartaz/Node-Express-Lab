// import your node modules

const express = require('express');
const db = require('./data/db.js');
const server = express();
/*
server.use(express.urlencoded({
	extended: true
}));
*/
server.use(express.json());

// add your server code starting here
server.listen(5000, () => console.log('server running'));

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

/*
Method	Endpoint	Description
POST	/api/posts	Creates a post using the information sent inside the request body.
GET	/api/posts	Returns an array of all the post objects contained in the database.
GET	/api/posts/:id	Returns the post object with the specified id.
DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
 */

server.get('/api/posts/:id', (req, res) => {
	const id = req.params.id;

	db.findById(id)
	  .then(posts => {
	  	if (posts.length > 0) {
	  		res.status(200).json(posts);
	  	}else{
	  		res.status(404).json({message: 'The post with the specified ID does not exist.'});
	  	}
	  })
	  .catch(err => {
		res.status(500).json({ error: "The post information could not be retrieved." });
	  })
});

server.get('/api/posts', (req, res) => {
	db.find()
	  .then(users => {
	  	res.status(200).json(users);
	  })
	  .catch(err => {
		res.status(500).json({ error: "The post information could not be retrieved." });
	  })
});


/*
When the client makes a POST request to /api/posts:

If the request body is missing the title or contents property:

cancel the request.
respond with HTTP status code 400 (Bad Request).
return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.
If the information about the post is valid:

save the new post the the database.
return HTTP status code 201 (Created).
return the newly created post.
If there's an error while saving the post:

cancel the request.
respond with HTTP status code 500 (Server Error).
return the following JSON object: { error: "There was an error while saving the post to the database" }.
*/

server.post('/api/posts', (req, res) => {
	console.log(req.body);
	if(req.body.title === undefined || req.body.contents === undefined || req.body.title === '' || req.body.contents === ''){
		res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
	}else{
		db.insert({title: req.body.title, contents: req.body.contents})
		  .then(post => {
		  	res.status(201).json(post);
		  })
		  .catch(err => {
			res.status(500).json({ error: "There was an error while saving the post to the database." });
		  });
	}
});

/*
When the client makes a DELETE request to /api/posts/:id:

If the post with the specified id is not found:

return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The post with the specified ID does not exist." }.
If there's an error in removing the post from the database:

cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The post could not be removed" }.
 */

server.delete('/api/posts/:id', (req, res) => {
	const id = req.params.id;
	console.log(id);
	db.findById(id)
	  .then(posts => {
	  	console.log(posts);
	  	if (posts.length > 0) {
	  		db.remove(id)
	  		.then(numberOfPostsRemoved => {
	  			if(numberOfPostsRemoved === 1){
					res.status(202).json({message: "Post successfully deleted."});
				}else{
					res.status(202).json({message: "Request accepted but no object deleted."});
				}
	  		})
	  		.catch(err => {
	  			res.status(500).json({ error: "The post could not be removed." });
	  		});
	  	}else{
	  		res.status(404).json({ message: "The post with the specified ID does not exist." });
	  	}
	  })
	  .catch(err => {
		res.status(500).json({ error: "The post information could not be retrieved." });
	  })
});

/*
When the client makes a PUT request to /api/posts/:id:

If the post with the specified id is not found:

return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The post with the specified ID does not exist." }.
If the request body is missing the title or contents property:

cancel the request.
respond with HTTP status code 400 (Bad Request).
return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.
If there's an error when updating the post:

cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The post information could not be modified." }.
If the post is found and the new information is valid:

update the post document in the database using the new information sent in the request body.
return HTTP status code 200 (OK).
return the newly updated post.
 */

server.put('/api/posts/:id', (req, res) => {
	const id = req.params.id;
	db.findById(id)
	  .then(posts => {
	  	if (posts.length > 0) {
	  		if(req.body.title === '' || req.body.contents === ''){
				res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
			}else{
				posts[0].title = req.body.title;
				posts[0].contents = req.body.contents;
				db.update(id, posts[0])
				.then(postUpdatedCount => {
					if(postUpdatedCount === 1){
						res.status(200).json(posts[0]);
					}else{
						res.status(202).json({message: "Request accepted, however no posts were updated."});
					}
				})
		  		.catch(err => {
		  			res.status(500).json({ error: "The post information could not be modified." });
		  		});
	  		}
	  	}else{
	  		res.status(404).json({ message: "The post with the specified ID does not exist." });
	  	}
	  })
	  .catch(err => {
		res.status(500).json({ error: "The post information could not be retrieved." });
	  })
});
