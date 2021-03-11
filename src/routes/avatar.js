//these two lines needed to use require in Node.js >14
import { createRequire } from 'module';
const require = createRequire(import.meta.url);


import express from 'express';
import { debug } from '../utils/logger.js';
import { Data } from '../utils/data.js';
import * as Constants from '../constants.js';

const Avatar = require('avatar-builder');

var router = express.Router();

router.use(function (req, res, next) {

  var avatarFunction = Avatar.Image.identicon;
  if (req.query.type) {
    const type = req.query.type;
    switch (type) {
      case "identicon":
        avatarFunction = Avatar.Image.identicon;
        break;
      case "github":
        avatarFunction = Avatar.Image.github;
        break;
      case "square":
        avatarFunction = Avatar.Image.square;
        break;
      case "triangle":
        avatarFunction = Avatar.Image.triangle;
        break;
      case "male8bit":
        avatarFunction = Avatar.Image.male8bit;
        break;
      case "female8bit":
        avatarFunction = Avatar.Image.female8bit;
        break;
      case "cat":
        avatarFunction = Avatar.Image.cat;
        break;
      default:
        avatarFunction = Avatar.Image.identicon;
    }

  }
  res.locals.avatarFunction = avatarFunction;
  next()

});

router.get('/', function (req, res, next) {

  res.locals.contentType = Constants.helpTextContentType;
  res.locals.body = Constants.helpText;
  next();
});

//get /avatar/:string?type=cat,8bitmale&size=128&mask=circle,roundedRect (square is default if no param)&output=png,base64
//type=identicon is default
//size defaul 128
//mask default square = none
//output=png,base64 and png is default
router.get('/:string', function (req, res, next) {

  //check size
  var size = 128;
  if (req.query.size) {
    debug(`req.query.size: ${req.query.size}`);
    size = parseInt(req.query.size);
    if (isNaN(size) == true) {
      size = 128;
    }
  }

  //check mask
  var avatarFunction = res.locals.avatarFunction();
  if (req.query.mask) {
    const mask = req.query.mask;
    switch (mask.toLowerCase()) {
      case "circle":
        avatarFunction = Avatar.Image.circleMask(res.locals.avatarFunction());
        break;
      case "roundedrect":
        var radius = 10.0/57.0 * size;
        debug("rounded rect radius:",radius);
        avatarFunction = Avatar.Image.roundedRectMask(res.locals.avatarFunction(), radius);
        break;
      default:
        avatarFunction = res.locals.avatarFunction();

    }
  }


  const avatar = Avatar.builder(avatarFunction, size, size, { cache: Avatar.Cache.lru() });

  debug(`req.params.string: ${req.params.string}`);
  avatar.create(req.params.string).then(buffer => {
    /* png buffer */

    var outputType = "png";
    if (req.query.output) {
      debug(`req.query.output: ${req.query.output}`);
      outputType = req.query.output;
    }

    switch (outputType.toLowerCase()) {
      case "png":
        res.locals.contentType = "image/png";
        res.locals.body = buffer;
        break;
      case "base64":
        res.locals.contentType = "text/plain";
        res.locals.body = buffer.toString('base64');
        break;
      default:
        res.locals.contentType = "image/png";
        res.locals.body = buffer;

    }
    next()

  });


});

//send output
router.use(function (req, res, next) {

  res.writeHead(200, { "Content-Type": res.locals.contentType });
  res.end(res.locals.body);

});



export { router };