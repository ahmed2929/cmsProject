const Request = require("../../models/request");
const Admin = require("../../models/admin");
const User = require("../../models/user");

const jwt = require("jsonwebtoken");
const {
    successResMsg,
    errorResMsg
} = require("../../utils/responseHandler");




// get all request sent by client
exports.getRequest = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;

        const admin = await Admin.findOne({
            _id: id
        });

        let request = {};

        if (admin && admin.role === "admin") {
            request = await Request.find({ accountOfficer: id }).populate('client').sort({ created_dt: 'asc' });
        }

        if (admin && admin.role === "superadmin") {
            request = await Request.find({}).populate('client').sort({ created_dt: 'asc' });
        }
        return successResMsg(res, 200, request);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}


exports.getUsersRequests = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;
        const admin = await Admin.findOne({ _id: id });
        let requests = [];

        if (admin && admin.role === "admin") {
            const users = await User.find({
                accountOfficer: id,
            });

            console.log('------------------ USERS ------------------');
            console.log(users);

            if (users && users.length > 0) {
                for (const user of users) {
                    const userRequest = await Request.find({ client: user._id }); // .sort({ created_dt: 'asc' });

                    console.log('------------------ USERREQUEST ------------------');
                    console.log(userRequest);

                    requests = requests.concat(userRequest);
                }
            }
        }

        console.log('------------------ REQUESTS ------------------');
        console.log(requests);

        return successResMsg(res, 200, requests);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}
