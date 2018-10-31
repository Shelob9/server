const express = require( 'express' );

const app = express();

app.get("/", (req, res) => {
  res.send(`Hi Roy!`);
});

const server = app.listen(process.env.PORT, () => {
  console.log("Started at http://localhost:%d\n", server.address().port);
});
