const express = require( 'express' );
const app = express();

const fs = require('fs');
app.get("/", (req, res) => {
  res.send(`Hi Roy!`);
});

const wpContentPath =  '/content/wp-json';
app.get("/posts/:postName", (req, res) => {
	const cwd = process.cwd();
  	const {postName} = req.params;
  	const path = cwd + wpContentPath + '/posts/' + postName + '.json';
  	const exists = fs.existsSync(path);
  	const post = require(path);
	res.json(post.data);
});
const server = app.listen(process.env.PORT, () => {
  console.log("Started at http://localhost:%d\n", server.address().port);
});
