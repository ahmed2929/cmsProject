const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const Document = require("../../models/document");
const jwt = require("jsonwebtoken");
const fs =require("fs")
const cloudinary = require("cloudinary").v2;
const messages = require("../../messages/index");
const {
    successResMsg,
    errorResMsg
} = require("../../utils/responseHandler");
const mail = require("../../mailerConfig");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});



// upload document to assigned admin
exports.uploadDocToAdmin = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;

        let admin_id = req.params.admin_id

        req.body.sender = id
        req.body.receiver = admin_id
        cloudinary.uploader.upload(req.file.path, {
            resource_type: "raw"
        }, async (err, result) => {
            if (err) {
                return errorResMsg(res, 500, err);
            }

            let docContentUrl = result.secure_url;
            req.body.docContentUrl = docContentUrl;
            const newDoc = await Document.create(req.body);
            fs.unlinkSync(req.file.path);
            return successResMsg(res, 201, newDoc);
        });
    } catch (err) {
        return errorResMsg(res, 500, err);
    }

}

exports.getClientDoc = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const sender = decodedToken.id;

        // get clients document
        const clientDoc = await Document.find({
            sender
        });
        
        return successResMsg(res, 200, clientDoc);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}

exports.getAdminIncomingDoc = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const receiver = decodedToken.id;


        // get incoming document from admin
        const adminIncomingDoc = await Document.find({
            receiver
        });
        return successResMsg(res, 200, adminIncomingDoc);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}