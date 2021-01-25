const Document = require("../../models/document");
const Admin = require("../../models/admin");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const cloudinary = require("cloudinary").v2;
const {
    successResMsg,
    errorResMsg
} = require("../../utils/responseHandler");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


// upload document to user under admin
exports.uploadDocToUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;

        let user_id = req.params.user_id

        req.body.sender = id
        req.body.receiver = user_id


        cloudinary.uploader.upload(req.file.path, {
            resource_type: "raw"
        }, async (err, result) => {
            if (err) {
                return errorResMsg(res, 500, err);
            }

            let docContentUrl = result.secure_url;
            req.body.docContentUrl = docContentUrl;
            const newDoc = await Document.create(req.body);
            return successResMsg(res, 201, newDoc);
        });
    } catch (err) {
        return errorResMsg(res, 500, err);
    }

}

// get all documents sent by the admin
exports.getAdminDoc = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const sender = decodedToken.id;

        // get clients document
        const adminDoc = await Document.find({ sender }).sort({ created_dt: 'asc' });
        const result = [];
        if (adminDoc && adminDoc.length > 0) {
            for (let index = 0; index < adminDoc.length; index++) {
                const doc = adminDoc[index];
                const item = { docName: doc.docName, docContentUrl: doc.docContentUrl, created_dt: doc.created_dt };

                if (doc.receiver && doc.receiver !== "undefined") {
                    item.receiver = await User.findOne({ _id: doc.receiver });
                }

                if (doc.sender && doc.sender !== "undefined") {
                    item.sender = await Admin.findOne({ _id: doc.sender });
                }
                result.push(item);
            }
        }
        return successResMsg(res, 200, result);
    } catch (err) {
        console.log(err);
        return errorResMsg(res, 500, err);
    }
}

// get all user document sent to admin
exports.getUserIncomingDoc = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const receiver = decodedToken.id;

        const admin = await Admin.findOne({ _id: receiver });
        // console.log(admin);
        let userIncomingDoc = [];
        if (admin && admin.role === "admin") {
            userIncomingDoc = await Document.find({ receiver }).sort({ created_dt: 'asc' });
        }
        if (admin && admin.role === "superadmin") {
            userIncomingDoc = await Document.find({}).sort({ created_dt: 'asc' });
        }

        const result = [];
        if (userIncomingDoc && userIncomingDoc.length > 0) {
            for (let index = 0; index < userIncomingDoc.length; index++) {
                const doc = userIncomingDoc[index];
                const item = { docName: doc.docName, docContentUrl: doc.docContentUrl, created_dt: doc.created_dt };

                if (doc.sender && doc.sender !== "undefined") {
                    item.sender = await User.findOne({ _id: doc.sender });
                }

                if (doc.receiver && doc.receiver !== "undefined") {
                    item.receiver = await Admin.findOne({ _id: doc.receiver });
                }
                result.push(item);
            }
        }

        return successResMsg(res, 200, result);
    } catch (err) {
        console.log(err);
        return errorResMsg(res, 500, err);
    }
}