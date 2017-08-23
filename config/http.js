/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'myRequestLogger',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    myRequestLogger: function (req, res, next) {
        console.log("Requested :: ", req.method, req.url);
        return next();
    },


  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  * Note that Sails uses an internal instance of Skipper by default; to      *
  * override it and specify more options, make sure to "npm install skipper" *
  * in your project first.  You can also specify a different body parser or  *
  * a custom function with req, res and next parameters (just like any other *
  * middleware function).                                                    *
  *                                                                          *
  ***************************************************************************/

  bodyParser: (function() {
      // Initialize a skipper instance with the default options
      let skipper = require('skipper')({
          strict: true,
          limit: '50mb'
      });
      // Initialize an express-xml-bodyparser instance with the default options
      let xmlparser = require('express-xml-bodyparser')();
      // Create and return the middleware function
      let util = require("util");
      let fs = require("fs");
      let multer = require('multer');
      let upload = multer().array();

      let SalesforceHeader = "text/xml; charset=utf-8";

      return function (req, res, next) {
          // If we see an application/xml header, parse the body as XML
          console.log("CONTENT TYPE: " + req.headers['content-type']);

          if (req.headers['content-type'] === 'application/xml'
              || req.headers['content-type'] === 'text/xml'
              // || req.headers['content-type'] !== undefined
              // && req.headers['content-type'].includes("multipart/form-data")
              || req.headers['content-type'] === 'application/x-www-form-urlencoded'
              || req.headers['content-type'] === SalesforceHeader) {
              console.log("XML DETECTED");
              return xmlparser(req, res, next);
          }

          else if (req.headers['content-type'] !== undefined
              && req.headers['content-type'].includes("multipart/form-data")) {
                console.log("FORM MULTIPART DATA DETECTED");
                // console.log(util.inspect(res));
                // fs.writeFile("datafiles/request.json", util.inspect(res), (err, success) => console.log("Done!"));

                // return upload(req, res, (err) => {
                //     if (err) {
                //         console.log(err);
                //     }
                //     next();
                // });

              return skipper(req, res, () => {
                  req.file().upload({

                  }, (err, uploadedFiles) => {
                      if (err) {
                          console.log("Error!:", err);
                          next();
                      } else {
                          console.log(`${uploadedFiles.length} uploaded successfully!`)
                          console.log(uploadedFiles)
                      }
                  });
              })
          }
          // Otherwise use Skipper to parse the body
          console.log("JSON DETECTED!");
          return skipper(req, res, next);
      };

  })()

  },

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};
