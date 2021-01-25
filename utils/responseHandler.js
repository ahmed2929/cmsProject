// handles error from requests
const errorResMsg = (res, code, message) => {
    return res.status(code).json({
        status: 'error',
        error: message,
    });
}

// handles successfull request
const successResMsg = (res, code, data) => {
    res.status(code).json({
        status: 'success',
        data,
    });
}


module.exports = {
    errorResMsg,
    successResMsg
}