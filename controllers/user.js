const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("../services/jwt");

function signUp(req, res) {
    console.log(req.body);

    const user = new User();

    const { name, lastname, email, password, repeatPassword } = req.body;

    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = "admin";
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({ message: "Las constraseñas son obligatorias" });
    } else {
        if (password !== repeatPassword) {
            res.status(404).send({ message: "Las contraseñas no coinciden." });
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log(err);
                }
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);

                        res.status(500).send({ message: "Error al encirptar la contraseña" });
                    } else {
                        user.password = hash;
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({ message: "El usuario ya existe." });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({ message: "Error al crear el usuario" });
                                } else {
                                    res.status(200).send({ user: userStored });
                                }
                            }
                        });
                    }
                });
            });
        }

    }

    user.password = password;
}

function signIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({ email }, (err, userStored) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor" });
        } else {
            if (!userStored) {
                res.status(404).send({ message: "Usuario no encontrado" });
            } else {
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if (err) {
                        res.status(404).send({ message: "Error del servidor" });
                    } else if (!check) {
                        res.status(404).send({ message: "Contraseña incorrecta" });
                    } else {
                        if (!userStored.active) {
                            res.status(200).send({ message: "Usuario inactivo" });
                        } else {
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refresh: jwt.createRefreshToken(userStored)
                            });
                        }
                    }
                });

            }
        }
    })
}

function getUsers(req, res) {
    User.find().then(users => {
        if (!users) {
            res.status(400).send({
                message: "No se ha encontrado ningun usuario"
            });
        }else{
            res.status(200).send({users});
        }
    })
}

function getUsersActive(req, res) {
    console.log(req);
    const query =  req.query;
    User.find({active: query.active}).then(users => {
        if (!users) {
            res.status(400).send({
                message: "No se ha encontrado ningun usuario"
            });
        }else{
            res.status(200).send({users});
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive
};
