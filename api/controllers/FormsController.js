/**
 * FormsController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    formPost: (request, response) => {
        // Debug output
        console.log("Received POST for formPost");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        response.statusCode = 200;
        response.json({});
    }
};

