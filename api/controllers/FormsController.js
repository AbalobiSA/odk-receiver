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

        let xml_template = `
            <forms>
            <form url="https://abalobi-fisher.appspot.com/formXml?formId=Fisher_Logbook_v2_0">Fisher_Logbook_v2_0</form>
            </forms>
        `;

        response.statusCode = 200;
        response.json({});
    }
};

