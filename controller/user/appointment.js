
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
        const user = await User.findById(id);
        // get ms date and validate
        var StartDateD =new Date(Number(req.body.appointmentDate))
        var EndDateD =new Date(Number(req.body.EndDate))
     
        if(StartDateD.toString() ==='Invalid Date'||EndDateD.toString()==='Invalid Date'){
         
            return errorResMsg(res, 422, "invalid date");
 
    

        }

        if(StartDateD>EndDateD){
        
            return errorResMsg(res, 422, "end date cannot be less than start date");

    
           }

        //
        if (!user.accountOfficer) {
            return errorResMsg(res, 401, "User should contact support to be attached to an admin officer");
        
        }
        const checkAppointment = await Appointment.find({
            accountOfficer:user.accountOfficer,
           
        })

        var areadyToken=false

        checkAppointment.forEach(appont=>{
            if(Number(req.body.EndDate)>=Number(appont.appointmentDate)&&Number(req.body.EndDate)<=Number(appont.EndDate)){
         //       console.debug("already token will be true from frst loop")
                areadyToken=true
            }
           // console.debug("req.body.EndDate ", req.body.EndDate ,"appont.startDate",appont.appointmentDate,"req.body.EndDate",req.body.EndDate,'appont.EndDate',appont.EndDate)

            if(Number(req.body.StartDate)>=Number(appont.appointmentDate)&&Number(req.body.StartDate)<=Number(appont.EndDate)){
                areadyToken=true;
             //   console.debug("will be true from second",areadyToken)
                
            }
    
        })

        //console.debug("already token is ",areadyToken)

        if(areadyToken){
            return errorResMsg(res, 401, "this date is not avilable");

        }


        req.body.client = id
       
        req.body.accountOfficer = user.accountOfficer
        req.body.companyName=user.companyName
        req.body.email=user.email
        req.body.status=user.status
        // create new appointment
        const newAppointment = await Appointment.create(req.body);
     //   console.log(newAppointment)

        const apppoinmentMessage = messages.appointmentMessage(user.director[0].fullName)

        // send mail
        const mailOptions = {
            from: '"RONZL" <admin@ronzl.com>',
            to: user.email,
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
        console.debug(err)
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


