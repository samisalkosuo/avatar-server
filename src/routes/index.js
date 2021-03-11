import express from 'express';
import { debug } from '../utils/logger.js';
import { Data } from '../utils/data.js';
import * as Constants from '../constants.js';

var router = express.Router();

router.get('/', function (req, res) {

  res.writeHead(200, { "Content-Type": Constants.helpTextContentType });
  res.end(Constants.helpText);
  /*res.writeHead(200, {"Content-Type": "text/html"});
  res.end(Constants.helpText)
  res.write("<html><body>");
  res.write("<h2>"+Data.state.appName+"</h2>");
  res.write("</body></html>");
  res.end(); 
  */

});

export { router };