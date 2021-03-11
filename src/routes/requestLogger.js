import express from 'express';
import {debug} from '../utils/logger.js';


var router = express.Router();

//request logger

router.use(function (req, res, next) {
  debug("request URL",req.originalUrl);
  next();
})

export { router};