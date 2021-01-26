const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();


const userRoutes = require("./routes/user/index");
const adminRoutes = require("./routes/admin/index");
const adminActionRoutes = require("./routes/admin/adminActions");
const adminDocRoutes = require("./routes/admin/document");
const userDocRoutes = require("./routes/user/document");
const userAppointmentRoutes = require("./routes/user/appointment");
const adminAppointmentRoutes = require("./routes/admin/appointment");
const userRequestRoutes = require("./routes/user/request");
const adminRequestRoutes = require("./routes/admin/request");
const invoiceRoutes = require("./routes/admin/invoice");

// Port
const port = process.env.PORT || 6363;
//connection url
const DB = process.env.MONGOLAB_URI //|| `mongodb+srv://AK:1234@cluster0.wugxw.mongodb.net/cmsProject?retryWrites=true&w=majority
//`;

//HTTP headers
app.use(helmet());

//Enable cors
app.use(cors());

//Against brute attack
const rateLimiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});

//rate liniter
app.use("/api", rateLimiter);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    limit: "10mb",
    extended: false,
    parameterLimit: 10000,
  })
);

//NoSQL query injection -Data Sanitization
app.use(mongoSanitize());

//xss attack - Data Sanitization
app.use(xss());

//HTTP parament pollution
app.use(hpp());

//REGISTER ROUTES HERE
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/actions", adminActionRoutes);
app.use("/api/v1/user/document", userDocRoutes);
app.use("/api/v1/admin/document", adminDocRoutes);
app.use("/api/v1/user/appointment", userAppointmentRoutes);
app.use("/api/v1/admin/appointment", adminAppointmentRoutes)
app.use("/api/v1/user/request", userRequestRoutes);
app.use("/api/v1/admin/request", adminRequestRoutes);
app.use("/api/v1/admin/invoice", invoiceRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: `Welcome to PMS API served on port ${port}`,
  });
});

//Handling unhandle routes
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: "Error 404",
    message: `Page not found. Can't find ${req.originalUrl} on this server`,
  });
});

// Database Connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DATABASE connection successfull"))
  .catch((err) => console.log("Error connecting to database"));

//listening to port
app.listen(port, () => {
  console.log(`PMS Server is running on port ${port}`);
});
