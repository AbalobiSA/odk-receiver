/**
 * FormsController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let fs = require('fs');
const constants = {
    SERVER_URL: "http://192.168.0.185:1337"
};

module.exports = {
    formPost: (request, response) => {
        // Debug output
        console.log("Received POST for submission");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        console.log("HEADERS:", request.headers);
        console.log("BODY:", request.body);

        response.statusCode = 200;
        // response.edit
    },

    getFormList: (request, response) => {
        console.log("Received GET for formList");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        console.log("HEADERS:", request.headers);
        console.log("BODY:", request.body);

        let xml_template = `
            <xforms xmlns="http://openrosa.org/xforms/xformsList">
                <xform><formID>Fisher_Logbook_v2_0</formID>
                <name>Fisher_Logbook_v2_0</name>
                <majorMinorVersion>2017080400</majorMinorVersion>
                <version>2017080400</version>
                <hash>md5:0aa2171c93080736874e456879c26aa0</hash>
                <downloadUrl>${constants.SERVER_URL}/formXml?formId=Fisher_Logbook_v2_0</downloadUrl>
                <manifestUrl>${constants.SERVER_URL}/xformsManifest?formId=Fisher_Logbook_v2_0</manifestUrl>
                </xform>
            </xforms>
        `;

        response.statusCode = 200;
        response = inject_headers(response);
        response.send(xml_template);
    },

    getFormManifest: (request, response) => {
        console.log("Received GET for FORM MANIFEST");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        let formId = request.query.formId;
        console.log("Form ID:", formId);
        let manifest_string=`
            <manifest xmlns="http://openrosa.org/xforms/xformsManifest">
                <mediaFile>
                <filename>odk_media.zip</filename>
                <hash>md5:d925dd11a632242cc982355434ea1c42</hash>
                <downloadUrl>
                    ${constants.SERVER_URL}/xformsDownload
                </downloadUrl>
                </mediaFile>
            </manifest>
        `;

        response = inject_headers(response);
        response.send(manifest_string);
    },

    getXformsDownload: (request, response) => {
        console.log("Received GET for FORM DOWNLOAD");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        let fileData = fs.readFile("api/controllers/forms/odk_media.zip", {}, (err, data) => {
            response = inject_headers(response);
            if (err) {
                response.statusCode = 500;
                response.send();
            } else {
                response.set("Content-Type", "application/x-zip-compressed");
                response.send(data);
            }
        })
    },

    getForm: (request, response) => {
        console.log("Received GET for FORM - SINGLE");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");
        console.log(request.query.formId);

        read_latest_form().then(form => {
            response.statusCode = 200;
            response = inject_headers(response);
            response.send(form);
        }).catch(ex => {
            console.log(ex);
            response.statusCode = 500;
            response.send();
        })
    }
};


function read_latest_form() {
    return new Promise ((resolve, reject) => {
        let form = fs.readFile("api/controllers/forms/form.xml", (err, success) => {
            if (err) {
                reject (err);
            } else {
                resolve (success);
            }
        })
    })
}

function inject_headers(response) {
    let newResponse = response;
    newResponse.set('Content-Type', "text/xml");
    newResponse.set("X-OpenRosa-Version", "1.0");
    return newResponse;
}
