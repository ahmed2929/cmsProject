const bcrypt = require("bcryptjs");
const Admin = require("../../models/admin");
const User = require("../../models/user");
const messages = require("../../messages/index")
const jwt = require("jsonwebtoken");
const {
    successResMsg,
    errorResMsg
} = require("../../utils/responseHandler");
const mail = require("../../mailerConfig");

// Admin Signup
exports.adminSignUp = async (req, res) => {
    try {
        // get user with email
        const user = await User.findOne({
            email: req.body.email
        });

        const user1 = await Admin.findOne({
            email: req.body.email
        });


        // check if user exists and return error if user already exists
        if (user || user1) {
            return errorResMsg(res, 423, "This user already exists");
        }

        // create new user if user does not exists
        const newUser = await Admin.create(req.body)

        // create user token
        const token = jwt.sign({
                id: newUser._id,
                role: newUser.role
            },
            process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );

        // create data to be returned
        const data = {
            id: newUser._id,
            role: newUser.role,
            token
        }

        const welcomeMessage = messages.welcomeMessage(newUser.fullName)

        // send mail
        const mailOptions = {
            from: '"RONZL" <admin@ronzl.com>',
            to: newUser.email,
            subject: 'Welcome Email',
            html: welcomeMessage
        }


        mail.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        });

        // return succesfull response
        return successResMsg(res, 201, data);
    } catch (err) {
        // return error response
        return errorResMsg(res, 500, err);
    }
}

// Admin Login
exports.adminlogIn = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        // check if user exists and select password
        const user = await Admin.findOne({
            email
        }).select("+password");

        // check if user exists and if the password is correct
        if (!user || !(await user.correctPassword(password, user.password))) {
            // return error message if password is wrong
            return errorResMsg(res, 401, "Incorrect email or password");
        }

        // create user token
        const token = jwt.sign({
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );

        // create data to be returned
        const data = {
            id: user._id,
            role: user.role,
            token
        }
        // return succesfull response
        return successResMsg(res, 200, data);

    } catch (err) {
        // return error response
        return errorResMsg(res, 500, err);
    }
}

// Admin Forget Password
exports.adminForgetPassword = (req, res) => {
    const {
        email,
    } = req.body

    // create email token
    const emailtoken = jwt.sign({
            email
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN_MAIL,
        }
    );

    const forgetMessage = messages.forgetMessage(email, emailtoken)

    const mailOptions = {
        from: '"RONZL" <admin@ronzl.com>',
        to: email,
        subject: 'Forgot Password',
        html: forgetMessage
    }

    mail.sendMail(mailOptions, function (err, info) {
        if (err) {
            return errorResMsg(res, 500, err);
        } else {
            return successResMsg(res, 200, info.response);
        }
    });
}

// Admin Reset Password
exports.adminResetForgetPassword = async (req, res) => {
    try {
        const {
            password,
            token
        } = req.body

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const email = decodedToken.email;

        if (!email) {
            return errorResMsg(res, 400, "Token has expired or is not valid");
        }

        const newPassword = await bcrypt.hash(password, 12);


        const user = await Admin.findOneAndUpdate({
            email
        }, {
            password: newPassword,
        }, {
            new: true,
        });

        const resetSucces = messages.resetSucess(user.fullName)

        // send mail
        const mailOptions = {
            from: '"RONZL" <admin@ronzl.com>',
            to: email,
            subject: 'Password Reset',
            html: resetSucces
        }


        mail.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        });
        return successResMsg(res, 200, user);

    } catch (err) {
        return errorResMsg(res, 500, err);
    }

}

// Admin Reset Password
exports.adminResetPassword = async (req, res) => {
    try {
        const {
            oldPassword,
            newPassword,
        } = req.body

        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;


        const user = await Admin.findOne({
            _id: id
        }).select("+password");



        if (!user || !(await user.correctPassword(oldPassword, user.password))) {
            return errorResMsg(res, 401, "Incorrect password");
        }

        const password = await bcrypt.hash(newPassword, 12);


        const updatedUser = await Admin.findByIdAndUpdate(id, {
            password,
        }, {
            new: true,
        });

        const resetSucces = messages.resetSucess(updatedUser.fullName)

        // send mail
        const mailOptions = {
            from: '"RONZL" <admin@ronzl.com>',
            to: updatedUser.email,
            subject: 'Password Reset',
            html: resetSucces
        }


        mail.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        });
        return successResMsg(res, 200, updatedUser);

    } catch (err) {
        return errorResMsg(res, 500, err);
    }

}

// Get Admin Data
exports.getAdminData = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;

        const user = await Admin.findOne({
            _id: id
        }).populate('users');

        return successResMsg(res, 200, user);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}

// Get User Data
exports.getUserData = async (req, res) => {
    try {

        const id = req.params.userId;

        const user = await User.findOne({
            _id: id,
        });

        return successResMsg(res, 200, user);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
};

// Update User Data
exports.updateUserData = async (req, res) => {
    try {
        const id = req.params.userId;

        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        return successResMsg(res, 200, updatedUser);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
};

// Get All Admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({
            role: "admin"
        })

        if (admins && admins.length > 0) {
            for (const admin of admins) {
                const usersDto = [];
                for (const user of admin.users) {
                    usersDto.push(await User.findOne({ _id: user }));
                }
                admin.users = usersDto;
            }
        }

        return successResMsg(res, 200, admins);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}