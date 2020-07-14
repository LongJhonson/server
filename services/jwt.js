const jwt = require("jwt-simple");
const moment = require("moment");

const SERCRET_KEY = "qgDnSyvaDN";

exports.createAccessToken = function (user) {
    const payload = {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createToken: moment().unix(),
        exp: moment().add(3, "hour").unix()
    };

    return jwt.encode(payload, SERCRET_KEY);
};

exports.createRefreshToken = function (user) {
    const payload = {
        id: user._id,
        exp: moment().add(30, "days").unix()
    }

    return jwt.encode(payload, SERCRET_KEY);
};

exports.decodeToken = function (token) {
    return jwt.decode(token, SERCRET_KEY, true);
}