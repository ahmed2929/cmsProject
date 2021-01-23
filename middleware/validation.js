const {
    body,
    param,
    validationResult
} = require('express-validator');

exports.signUpValidationRules = () => {
    return [
        body("director").notEmpty().withMessage("Director field must not be empty"),
        body("accountType").notEmpty().isIn(["Company", "Individual"]).withMessage("Account Type should be Company or Individual"),
        body("companyName").notEmpty().isAlpha().trim().escape().withMessage("Company Name must not be empty"),
        body("companyAddress").notEmpty().withMessage("Company Address must not be empty"),
        body("city").notEmpty().isAlpha().trim().escape().withMessage("City must not be empty"),
        body("postalCode").notEmpty().withMessage("Postal code must not be empty"),
        body("phoneNumber").notEmpty().withMessage("Phone number must not be empty"),
        body("websiteUrl").notEmpty().withMessage("Website url must not be empty"),
        body("companyRegNo").notEmpty().withMessage("Company Reg No must not be empty"),
        body("utrNo").notEmpty().withMessage("UTR no must not be empty"),
        body("vatSubmitType").notEmpty().withMessage("Vat Submit Type must not be empty"),
        body("vatScheme").notEmpty().isAlpha().trim().escape().withMessage("Vat Scheme must not be empty"),
        body("vatRegNo").notEmpty().withMessage("Vat Reg No must not be empty"),
        body("vatRegDate").notEmpty().withMessage("Vat Reg Date must not be empty"),
        body("insuranceNumber").notEmpty().withMessage("Insurance Number must not be empty"),
        body("payeeRefNo").notEmpty().withMessage("Payee Ref No must not be empty"),
        body("companyBegin").notEmpty().withMessage("Company Start Date must not be empty"),
        body("email").notEmpty().isEmail().normalizeEmail().withMessage("Email is required"),
        body("password").notEmpty().isLength({
            min: 5
        }).withMessage("Password must have at least 5 characters"),
    ]
}


exports.adminSignUpValidationRules = () => {
    return [
        body("fullName").notEmpty().trim().escape().withMessage("Full Name must not be empty"),
        body("phoneNumber").notEmpty().withMessage("Phone number must not be empty"),
        body("email").notEmpty().isEmail().normalizeEmail().withMessage("Email is required"),
        body("role").notEmpty().isIn(["admin", "superadmin"]).withMessage("Role should be admin or superadmin"),
        body("password").notEmpty().isLength({
            min: 5
        }).withMessage("Password must have at least 5 characters"),
    ]
}




exports.loginValidationRules = () => {
    return [
        body("email").notEmpty().isEmail().normalizeEmail().withMessage("Email is required"),
        body("password").notEmpty().withMessage("Password is Required")
    ]
}

exports.categoryPostValidationRules = () => {
    return [
        body("name").notEmpty().withMessage("Name is required"),
        body("description").notEmpty().withMessage("Description is Required")
    ]
}

exports.subjectPostValidationRules = () => {
    return [
        param("category_name").notEmpty().isIn(["primary", "JSS", "SSS"]).withMessage("Category Name should be 'primary' or 'JSS' or 'SSS' "),
        body("name").notEmpty().withMessage("Name is required"),
        body("description").notEmpty().withMessage("Description is Required")
    ]
}

exports.categoryRules = () => {
    return [
        param("category_name").notEmpty().isIn(["primary", "JSS", "SSS"]).withMessage("Category Name should be 'primary' or 'JSS' or 'SSS' "),
    ]
}

exports.bookPostValidationRules = () => {
    return [
        body("name").notEmpty().withMessage("Name is required"),
        body("description").notEmpty().withMessage("Description is Required")
    ]
}

exports.validate = (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({
            [err.param]: err.msg
        }))

        return res.status(422).json({
            errors: extractedErrors,
        })

    } catch {
        res.status(401).json({
            error: "Unauthorized",
            status: "error"
        })
    }
}