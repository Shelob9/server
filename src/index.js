const express = require( 'express' );
const app = express();

const fs = require('fs');

/**
 * Get a promise that can discover a WordPress site's REST API
 * @return {Promise<*>}
 */
async function getSite() {
	const config = require('../config' );
	const site = await require('wpapi').discover(config.API_URL);
	return site;
}

/**
 * Post Route
 */
app.get("/posts",async (req, res) => {
	try{
		const site = await getSite();
		try{
			const posts = await site.posts();
			return res.json(posts);
		}catch (e) {
			res.status(500);
			return res.json(e);
		}
	}catch (e) {
		res.status(500);
		return res.json(e);
	}



});


/**
 * Not found response
 * @type {{code: string, message: string, data: {status: number}}}
 */
const notFound = {
	code: "rest_post_invalid_id",
	message: "Invalid post ID.",
	data: {
		status: 404
	}
};



app.get("/posts/:postName", async (req, res) => {
	const cwd = process.cwd();
  	const {postName} = req.params;
  	const path = cwd + '/content/wp-json' + '/posts/' + postName + '.json';
  	const exists = fs.existsSync(path);
	if (exists) {
		const post = require(path);
		res.json(post.data);
	} else {
		try{
			const site = await getSite();
			try{
				const post = await site.posts().slug(postName);
				if( post.length ){
					await fs.writeFileSync(path,JSON.stringify(post[0]));
					return res.json(post[0]);
				}
				res.status(404);
				res.json(notFound);
			}catch (e) {

				res.status(500);
				return res.json(e);
			}
		}catch (e) {
			res.status(500);
			return res.json(e);
		}
	}

});

const server = app.listen(process.env.PORT, () => {
  console.log("Started at http://localhost:%d\n", server.address().port);
});
