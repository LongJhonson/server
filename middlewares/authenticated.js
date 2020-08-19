const jwt = require('jwt-simple');
const moment = require('moment');

const SERCRET_KEY = "qgDnSyvaDN";

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: "La petición no tienen cabecera de autenticación."
        });
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        
        var payload = jwt.decode(token, SERCRET_KEY);
        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                message: "El token ha expirado"
            })
        }else{

        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({
            message: "Token invalido"
        })
    }

    req.user = payload;
    next();
}
