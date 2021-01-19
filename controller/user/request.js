const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Request = require("../../models/request");
const cloudinary = require("cloudinary").v2;
const messages = require("../../messages/index")
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

// Create Appointment
exports.createRequest = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;

        // get user
        const user = await User.find({
            _id: id
        });

        if (!user[0].accountOfficer){
            return errorResMsg(res, 400, "You need to be assigned an acccount officer by the super admin before sending a request");
        }

        req.body.client = id
        req.body.accountOfficer = user[0].accountOfficer
        cloudinary.uploader.upload(req.file.path, {
            resource_type: "raw"
        }, async (err, result) => {
            if (err) {
                return errorResMsg(res, 500, err);
            }

            let attachedFileUrl = result.secure_url;
            req.body.attachedFileUrl = attachedFileUrl;
            // create new request
            const newRequest = await Request.create(req.body);
            return successResMsg(res, 201, newRequest);
        });

    } catch (err) {
        // return error response
        return errorResMsg(res, 500, err);
    }
};

// Get  created rquest
exports.getCreatedRequest = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;

        // get booked appointment
        const createdRequest = await Request.find({
            client: id
        });
        
        return successResMsg(res, 200, createdRequest);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}

