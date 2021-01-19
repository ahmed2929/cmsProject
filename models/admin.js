const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const adminSchema = new Schema({
    fullName: {
        type: String,
    },
    phoneNumber: {
        type: Number,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["admin", "superadmin"],
    },
    password: {
        type: String,
        minlength: 2,
        trim: true,
        select: false,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    created_dt: {
        type: Date,
        default: Date.now(),
    },
});

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

adminSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;