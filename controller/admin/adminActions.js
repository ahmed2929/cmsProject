const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const Document = require("../../models/document");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const messages = require("../../messages/index");
const fs=require("fs")
//const xlsx = require('node-xlsx').default;
const xlsx = require("xlsx");
//const excelToJson = require('convert-excel-to-json');
const _ = require('lodash');
const {
    successResMsg,
    errorResMsg
} = require("../../utils/responseHandler");
const mail = require("../../mailerConfig");
const { json } = require("body-parser");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Set user subscription start and end date upon payment
exports.setSubDate = async (req, res) => {
    try {

        let user_id = req.params.user_id
        // set user account status
        req.body.accountStatus = 'active'

        const updatedUser = await User.findByIdAndUpdate(user_id, req.body, {
            new: true,
        });


        const premiumMessage = messages.premiumMessage(updatedUser.director[0].fullName)


        // send mail
        const mailOptions = {
            from: '"RONZL" <admin@ronzl.com>',
            to: updatedUser.email,
            subject: 'Welcome to RONZL Premium',
            html: premiumMessage,
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
};

// get all users - superadmin
exports.getAllUsers = async (req, res) => {
    try {
        // get users from database
        const allUsers = await User.find({}).populate('accountOfficer');
        return successResMsg(res, 200, allUsers);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
};

// get users - admin
exports.getUsers = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.id;
        // get users from database
        const allUsers = await User.find({ accountOfficer: id })
        return successResMsg(res, 200, allUsers);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }
}

// assign users to admin
exports.assignUserToAdmin = async (req, res) => {
    try {
        let admin_id = req.params.admin_id
        let user_id = req.params.user_id

        const checkUser = await User.findOne({
            accountOfficer: admin_id
        });

        if (checkUser) {
            return errorResMsg(res, 423, "This user has already been assigned to an admin");
        }

        const update = {
            users: user_id
        };
        const userUpdate = {
            accountOfficer: admin_id
        }
        const updatedAdmin = await Admin.findByIdAndUpdate(admin_id, {
            $push: update
        }, {
            new: true,
        });

        const updatedUser = await User.findByIdAndUpdate(user_id, userUpdate, {
            new: true,
        });

        return successResMsg(res, 200, updatedAdmin);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }



}

// reassign user to another admin
exports.assignUserToAdmin = async (req, res) => {
    try {
        let admin_id = req.params.admin_id
        let user_id = req.params.user_id

        const checkUser = await User.findOne({
            accountOfficer: admin_id
        });

        if (checkUser) {
            return errorResMsg(res, 423, "This user has already been assigned to an admin");
        }

        const update = {
            users: user_id
        };
        const userUpdate = {
            accountOfficer: admin_id
        }
        const updatedAdmin = await Admin.findByIdAndUpdate(admin_id, {
            $push: update
        }, {
            new: true,
        });

        const updatedUser = await User.findByIdAndUpdate(user_id, userUpdate, {
            new: true,
        });

        return successResMsg(res, 200, updatedAdmin);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }



}

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

exports.bulkUser = async (req, res) => {
    try {
        console.debug("add user bulk is runing ")
        const file = xlsx.readFile(req.file.path,{
            cellDates:true
        });
      
        const ws = file.Sheets["Sheet1"]
      
         const userJsonObject=xlsx.utils.sheet_to_json(ws)
         console.debug(userJsonObject[1])
         var hashedEmilObject={}
         const users=await User.find()
         users.forEach(user=>{
             hashedEmilObject[user.email]=true
         })
        for(let user of userJsonObject){
              if(user.ID){
                  if(hashedEmilObject[user.email]){
                      console.debug("email found will contnue user ",user)
                      continue;
                  }
                  console.log("email not fount will create",user)
                  var newUserObj={

                    director:{
                        fullName:user.Director,
                        dateOfBirth:user.__EMPTY
                    },
                    
                          
                            accountType:user.accountType,
                             companyName:user.CompanyName ,
                             companyAddress:user.CompanyAddress ,
                             city:user.City,
                             postalCode:user.PostalCode,
                             country:user.Country,                             
                             phoneNumber :user.PhoneNumber,
                             email :user.email,
                             websiteUrl :user.Website,
                             companyBegin:user.CompanyBegin,
                             subscriptionegin :user.subscriptionegin,
                             subscriptionnd :user.subscriptionnd,
                             companyRegNo :user.CompanyRegNo,
                             utrNo :user.UTRNo,
                             vatSubmitType:user.VATSubmitType,
                             vatScheme :user.VATScheme,
                             vatRegNo :user.VATRegNo,
                             vatRegDate :user.VATRegDate,
                             insuranceNumber : user.InsuranceNumber,
                             payeeRefNo :user.PayeeRefNo,
                             accountOfficer :user.accountOfficer,
                            password : "password",
                            role : "user"
                 
             
             
             
             
             
                        }


              const newUser = await (await User.create(newUserObj)).save()
                        console.debug("userCreated ",newUser)
            }
          }
        // file[0].data.map(async (item) => {
        //   //  console.debug("file[0].data is ",file[0].data)
        //     if (item[0] === "Client Name") {
        //         console.log("do nothing")
        //     } else {
        //         let director = {}
        //         req.body.director = director
        //         req.body.director.fullName = item[0]
        //         req.body.accountType = item[1]
        //         req.body.companyName = item[2]
        //         req.body.companyAddress = item[3]
        //         req.body.city = item[4]
        //         req.body.postalCode = item[5]
        //         req.body.country = item[6]
        //         req.body.phoneNumber = item[7]
        //         req.body.email = item[8]
        //         req.body.websiteUrl = item[9]
        //         req.body.companyBegin = item[10]
        //         req.body.subscriptionBegin = item[25]
        //         req.body.subscriptionEnd = item[26]
        //         req.body.companyRegNo = item[13]
        //         req.body.utrNo = item[14]
        //         req.body.vatSubmitType = item[15]
        //         req.body.vatScheme = item[16]
        //         req.body.vatRegNo = item[17]
        //         req.body.vatRegDate = item[18]
        //         req.body.director.dateOfBirth = item[19]
        //         req.body.insuranceNumber = item[20]
        //         req.body.payeeRefNo = item[21]
        //         req.body.accountOfficer = item[22]
        //         req.body.accountStatus = item[24]
        //         req.body.created_dt = 27
        //         req.body.password = "password"
        //         req.body.role = "user";

        //         console.debug("req.body is ",req.body)
        //        // const newUser = await User.create(req.body)

        //     }

        // })
        fs.unlinkSync(req.file.path);
        return successResMsg(res, 201, "All users added sucessfully");
    } catch (err) {
        console.debug(err)
        return errorResMsg(res, 500, err);
    }
}

// assign users to admin
exports.assignUsersToAdmin = async (req, res) => {
    try {
        let admin_id = req.params.admin_id;
        let users = req.body.users;
        // console.log(admin_id);
        // console.log(users);
        const admin = await Admin.findOne({
            _id: admin_id
        })
        //console.log(admin);
        if (admin && users && users.length > 0) {
            // return errorResMsg(res, 423, "This user has already been assigned to an admin");
            if (admin.users && admin.users.length > 0) {
                for (const user of admin.users) {
                    const found = _.find(users, (u) => u === user.toString());
                    if (found) {
                        _.remove(users, (u) => u === user.toString());
                    }
                }
            }

            if (users && users.length > 0) {
                const updatedAdmin = await Admin.findByIdAndUpdate(admin_id, { $push: { users: users } }, { new: true });
                // console.log('-- updatedAdmin ---');
                // console.log(updatedAdmin);
                for (const user of users) {
                    const updatedUser = await User.findByIdAndUpdate(user, { accountOfficer: admin_id }, { new: true, });
                    // console.log('-- updatedUser ---');
                    // console.log(updatedUser);
                }
                return successResMsg(res, 200, updatedAdmin);
            }
        }
        // console.log(users);
        return successResMsg(res, 200, admin);
    } catch (err) {
        return errorResMsg(res, 500, err);
    }



}

exports.updateUserInfo = async (req, res) => {
    try {
    
      const id = req.body.ID;
  
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
  
      return successResMsg(res, 200, updatedUser);
    } catch (err) {
      return errorResMsg(res, 500, err);
    }
  };

  exports.deletUser = async (req, res) => {
    try {
    
      const id = req.body.ID;
  
      const deleteddUser = await User.findByIdAndDelete(id)
  
      return successResMsg(res, 200, deleteddUser);
    } catch (err) {
      return errorResMsg(res, 500, err);
    }
  };
    