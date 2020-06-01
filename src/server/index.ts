import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import fs from 'fs';

import User from '../models/app.models';

// Initialize configuration
dotenv.config();

// Gets pathTo from project root
const pathTo = require(path.resolve(fs.realpathSync(process.cwd()), 'pathTo'));

const port = process.env.SERVER_PORT;
const client = process.env.CLIENT_OUTPUT;

const app = express();

app.use(express.static(pathTo.output));

// Define a route handler for the default single page app
app.get('/', (req, res) => {
  res.render('index.html');
});

// Start the express server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
