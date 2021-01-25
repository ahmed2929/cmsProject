const Appointment = require("../../models/appointment");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const messages = require("../../messages/index")
const {
    successResMsg,
    errorResMsg
} = require("../../utils/responseHandler");
const mail = require("../../mailerConfig");


// Confirm Appointment
exports.confirmAppointment = async (req, res) => {
    try {
        let appointment_id = req.params.appointment_id
        // get appointment
        const appointment = await Appointment.find({
            _id: appointment_id
        })

        const user = await User.find({
            _id: appointment[0].client
        })

        const updatedAppointment = await Appointment.findOneAndUpdate({
            _id: appointment_id
        }, {
            status: "confirmed",
        }, {
            new: true,
        });

        const apppoinmentMessage = messages.appointmentConfirmed(user[0].director[0].fullName)
        // send mail
        const mailOptions = {
            from: '"RONZL" <admin@ronzl.com>',
            to: user[0].email,
            subject: "Appointment Confirmed!",
            html: apppoinmentMessage,
        };

        mail.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        });

        return successResMsg(res, 200, updatedAppointment);

    } catch (err) {
        console.log(err);
        return errorResMsg(res, 500, err);
    }

}


exports.getAppointments = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;
        const admin = await Admin.findOne({ _id: id }).populate('users');
        let appointments = [];
        if (admin && admin.role === "admin" && admin.users) {
            for (const user of admin.users) {
                const userAppointments = await Appointment.find({ client: user._id }).populate('client');
                appointments = appointments.concat(userAppointments);
            }
        }
        if (admin && admin.role === "superadmin") {
            console.log(admin);
            appointments = await Appointment.find({}).populate('client');
        }
        return successResMsg(res, 200, appointments);

    } catch (err) {
        console.log(err);
        return errorResMsg(res, 500, err);
    }
}

// Reject Appointment
exports.rejectAppointment = async (req, res) => {
    try {
        let appointment_id = req.params.appointment_id
        // get appointment
        const appointment = await Appointment.find({
            _id: appointment_id
        })

        const user = await User.find({
            _id: appointment[0].client
        })

        const updatedAppointment = await Appointment.findOneAndUpdate({
            _id: appointment_id
        }, {
            status: "rejected",
        }, {
            new: true,
        });

        const apppoinmentMessage = messages.rejectAppointmentMessage(user[0].director[0].fullName)
        // send mail
        const mailOptions = {
            from: '"RONZL" <admin@ronzl.com>',
            to: user[0].email,
            subject: "Appointment Confirmed!",
            html: apppoinmentMessage,
        };

        mail.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        });

        return successResMsg(res, 200, updatedAppointment);

    } catch (err) {
        return errorResMsg(res, 500, err);
    }

}