/**
 * FormsController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    formPost: (request, response) => {
        // Debug output
        console.log("Received POST for submission");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        console.log("HEADERS:", request.headers);
        console.log("BODY:", request.body);

        response.statusCode = 200;
        response.json({});
    },

    getFormList: (request, response) => {
        console.log("Received GET for formList");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        console.log("HEADERS:", request.headers);
        console.log("BODY:", request.body);

        response.statusCode = 200;
        response.json({});
    }
};

