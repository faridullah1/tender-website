const path = require('path');
const express = require('express');
const compression = require('compression');
const app = express();

app.use(express.json());
app.use(compression());
app.use(express.static(__dirname + '/dist/wissal'));

app.get('/*', (req, res) => {    
	res.sendFile(path.join(__dirname+'/dist/wissal/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});