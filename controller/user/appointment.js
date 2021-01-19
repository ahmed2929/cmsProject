
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Appointment = require("../../models/appointment");
const messages = require("../../messages/index")
const {
    successResMsg,
    errorResMsg
} = require("../../utils/responseHandler");
const mail = require("../../mailerConfig");


// Create Appointment
exports.createAppointment = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;

        // get user
        const user = await User.find({
            _id: id
        });

        const checkAppointment = await Appointment.find({
            appointmentDate: {
                $gte: req.body.appointmentDate
            }
        })

        if (checkAppointment.length > 1){
            return errorResMsg(res, 401, "Please select another appointment, current date and time has been choosing.");
        }
        req.body.client = id
        if (!user[0].accountOfficer) {
            return errorResMsg(res, 401, "User should contact support to be attached to an admin officer");
        }
        req.body.accountOfficer = user[0].accountOfficer
        // create new appointment
        const newAppointment = await Appointment.create(req.body);
        console.log(newAppointment)

        const apppoinmentMessage = messages.appointmentMessage(user[0].director[0].fullName)

        // send mail
        const mailOptions = {
            from: '"RONZL" <admin@ronzl.com>',
            to: user[0].email,
            subject: "Appointment Scheduled!",
            html:apppoinmentMessage,
        };

        mail.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        });

        // return succesfull response
        return successResMsg(res, 201, newAppointment);
    } catch (err) {
        // return error response
        return errorResMsg(res, 500, err);
    }
};

// Get booked appointment
exports.getBookedAppointemnt = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;

        // get booked appointment
        const bookedAppointment = await Appointment.find({
            client: id
        });
        
        return successResMsg(res, 200, bookedAppointment);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}


