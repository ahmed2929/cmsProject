const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;


var userSchema = new Schema({
  director: [{
    fullName: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
  }, ],
  accountType: {
    type: String,
    enum: ["Company", "Individual"],
  },
  companyName: {
    type: String,
  },
  companyAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  country: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  email: {
    type: String,
  },
  websiteUrl: {
    type: String,
    default:"null"
  },

  companyBegin: {
    type: Date,
    default:"0000"
  },
  companyRegNo: {
    type: String,
    default:"0000"
  },
  utrNo: {
    type: String,
    default:"0000"
  },
  vatSubmitType: {
    type: String,
    default:"null"
  },
  vatScheme: {
    type: String,
    default:"null"
  },
  vatRegNo: {
    type: String,
    default:"000"
  },
  vatRegDate: {
    type: Date,
    default:"0000"
  },
  insuranceNumber: {
    type: String,
    default:"0000"
  },
  payeeRefNo: {
    type: String,
    default:"0000"
  },
  password: {
    type: String,
    minlength: 2,
    trim: true,
    select: false,
  },

  accountOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  profilePics: {
    type: String,
  },
  aboutMe: {
    type: String,
  },
  accountStatus: {
    type: String,
    default:'prospect'
  },

  subscriptionBegin: {
    type: Date,
  },
  subscriptionEnd: {
    type: Date,
  },

  companyContactPerson: {
    type: String,
  },
  companyContactPosition: {
    type: String,
  },
  created_dt: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    default:"user"
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;