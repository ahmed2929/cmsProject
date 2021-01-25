const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
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

// Signup
exports.signUp = async (req, res) => {
  console.debug("inside user signup req,body is : ",req.body)
  try {
    // get user with email
    console.debug("entered the controller")
    const user = await User.findOne({
      email: req.body.email,
    });

    // get user with email
    const adminUser = await Admin.findOne({
      email: req.body.email,
    });

    // check if user exists and return error if user already exists
    if (user || adminUser) {
      return errorResMsg(res, 423, "This user already exists");
    }

    // create new user if user does not exists
    req.body.role = "user";
    req.body.accountStatus = 'prospect'

   
    const newUser = await User.create(req.body);

    // create user token
    const token = jwt.sign({
      id: newUser._id,
      role: newUser.role,
    },
      process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
    );

    // create data to be returned
    const data = {
      id: newUser._id,
      role: newUser.role,
      status: newUser.accountStatus,
      token,
    };

    const welcomeMessage = messages.welcomeMessage(newUser.director[0].fullName)

    // send mail
    const mailOptions = {
      from: '"RONZL" <admin@ronzl.com>',
      to: newUser.email,
      subject: "Welcome To RONZL!",
      html: welcomeMessage,
    };

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
    console.debug("error is " ,err)
    // return error response
    return errorResMsg(res, 500, err);
  }
};

// Login
exports.logIn = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    // check if user exists and select password
    const user = await User.findOne({
      email,
    }).select("+password");

    // check if user exists and if the password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      // return error message if password is wrong
      return errorResMsg(res, 401, "Incorrect email or password");
    }

    // create user token
    const token = jwt.sign({
      id: user._id,
      role: user.role,
    },
      process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
    );

    // create data to be returned
    const data = {
      id: user._id,
      role: user.role,
      status: user.accountStatus,
      token,
    };
    // return succesfull response
    return successResMsg(res, 200, data);
  } catch (err) {
    // return error response
    return errorResMsg(res, 500, err);
  }
};

// forget Password
exports.forgetPassword = (req, res) => {
  console.debug("forget pass run")
  const {
    email
  } = req.body;

  // create email token
  const emailtoken = jwt.sign({
    email,
  },
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_MAIL,
  }
  );

  const forgetMessage = messages.forgetMessage(email, emailtoken)

  const mailOptions = {
    from: '"RONZL" <admin@ronzl.com>',
    to: email,
    subject: "Reset Your RONZL Password",
    html: forgetMessage,
  };

  mail.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.debug(err)
      return errorResMsg(res, 500, err);
    } else {
      return successResMsg(res, 200, info.response);
    }
  });
};

// Reset Forget Password
exports.resetForgetPassword = async (req, res) => {
  try {
    const {
      password,
      token
    } = req.body;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const email = decodedToken.email;

    if (!email) {
      return errorResMsg(res, 400, "Token has expired or is not valid");
    }

    const newPassword = await bcrypt.hash(password, 12);

    const user = await User.findOneAndUpdate({
      email,
    }, {
      password: newPassword,
    }, {
      new: true,
    });

    const resetSucces = messages.resetSucess(user.director[0].fullName)

    // send mail
    const mailOptions = {
      from: '"RONZL" <admin@ronzl.com>',
      to: email,
      subject: "Your account password has changed",
      html: resetSucces,
    };

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
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const {
      oldPassword,
      newPassword
    } = req.body;

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.id;

    const user = await User.findOne({
      _id: id,
    }).select("+password");

    if (!user || !(await user.correctPassword(oldPassword, user.password))) {
      return errorResMsg(res, 401, "Incorrect password");
    }

    const password = await bcrypt.hash(newPassword, 12);

    const updatedUser = await User.findByIdAndUpdate(
      id, {
      password,
    }, {
      new: true,
    }
    );

    const resetSucces = messages.resetSucess(updatedUser.director[0].fullName)

    // send mail
    const mailOptions = {
      from: '"RONZL" <admin@ronzl.com>',
      to: updatedUser.email,
      subject: "Password Reset",
      html: resetSucces,
    };

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
};

// Get User Data
exports.getUserData = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.id;
    const user = await User.findOne({
      _id: id,
    });
    if (user && user.accountOfficer) {
      const accountOfficer = await Admin.findOne({
        _id: user.accountOfficer
      });
      user.accountOfficer = accountOfficer;
    }
    return successResMsg(res, 200, user);
  } catch (err) {
    return errorResMsg(res, 500, err);
  }
};

// Update User Data
exports.updateUserData = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.id;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return successResMsg(res, 200, updatedUser);
  } catch (err) {
    return errorResMsg(res, 500, err);
  }
};

exports.uploadPicture = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.id;

    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) {
        return errorResMsg(res, 500, err);
      }

      let profilePics = result.secure_url;
      req.body.profilePics = profilePics;
      const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return successResMsg(res, 200, user);
    });
  } catch (err) {
    return errorResMsg(res, 500, err);
  }
};