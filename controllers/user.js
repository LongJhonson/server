const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("../services/jwt");
const user = require("../models/user");

function signUp(req, res) {
    // console.log(req.body);

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
        } else {
            res.status(200).send({ users });
        }
    })
}

function getUsersActive(req, res) {
    // console.log(req);
    const query = req.query;
    User.find({ active: query.active }).then(users => {
        if (!users) {
            res.status(400).send({
                message: "No se ha encontrado ningun usuario"
            });
        } else {
            res.status(200).send({ users });
        }
    })
}

function uploadAvatar(req, res) {
    const params = req.params;
    user.findById({ _id: params.id }, (err, userData) => {
        if (err) {
            resizeTo.status(500).send({
                message: "error del servidor"
            })
        } else {
            if (!userData) {
                res.status(404).send({
                    message: "No se ha encontrado ningun usuario"
                })
            } else {
                let user = userData;
                if (req.files) {
                    let filePath = req.files.avatar.path;
                    // console.log(filePath);
                    let fileSplit = filePath.split("/");
                    let filename = fileSplit[2];

                    let extSplit = filename.split(".");
                    let fileExt = extSplit[1];

                    if (fileExt !== "png" && fileExt !== "jpg") {
                        res.status(400).send({
                            message: "Formato de imagen no permitida (extensiones permitidas: PNG y JPG"
                        });
                    } else {//update avatar 
                        user.avatar = filename;
                        User.findByIdAndUpdate({ _id: params.id }, user, (err, userResult) => {
                            if (err) {
                                res.status(500).send({
                                    message: "Error del servidor"
                                });
                            } else {
                                if (!userResult) {
                                    res.status(404).send({
                                        message: "No se ha encontrado ningun usuario"
                                    });
                                } else {
                                    res.status(200).send({
                                        avatarName: filename
                                    })
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}

function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/" + avatarName;
    fs.exists(filePath, exists => {
        if (!exists) {
            res.status(404).send({
                message: "El avatar que buscas noi existe"
            });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    })
}

async function hashPassword(password) {

    const saltRounds = 10;

    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    return hashedPassword;
}

async function updateUser(req, res) {
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;

    if (userData.password) {
        userData.password = await hashPassword(userData.password);
    }

    User.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
        if (err) {
            req.status(500).send({
                messahe: "Error del servidor"
            });
        } else {
            if (!userUpdate) {
                res.status(500).send({
                    message: "No se ha encontrado ningun usuario"
                });
            } else {
                console.log("user updated");
                res.status(200).send({
                    message: "Usuario actualizado correctamente"
                });
            }
        }
    })
}

async function activateUser(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    User.findByIdAndUpdate(id, { active }, (err, userStored) => {
        if (err) {
            res.status(500).send({
                message: "Error del servidor"
            });
        } else {
            if (!userStored) {
                res.status(404).send({
                    message: "No se ha encontrado el usuario"
                });
            } else {
                if (active === true) {
                    res.status(200).send({
                        message: "Usuario activado correctamente"
                    });
                } else {
                    res.status(200).send({
                        message: "Usuario desactivado correctamente"
                    });
                }
            }
        }
    })

}

function deleteUser(req, res) {
    const { id } = req.params;
    user.findByIdAndDelete(id, (err, userDeleted) => {
        if (err) {
            res.status(500).send({
                message: "Error del servidor"
            });
        } else {
            if (!userDeleted) {
                res.status(404).send({
                    message: "No se ha encontrado el usuario"
                });
            } else {
                res.status(200).send({
                    message: "Usuario eliminado correctamente"
                });
            }
        }
    })
}

async function signUpAdmin(req, res) {
    const user = new User();

    const { name, lastname, email, role, password } = req.body;
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = role;
    user.active = true;

    if (!password) {
        res.status(500).send({
            message: "La contraseña es obligatoria"
        });
    } else {

        user.password = await hashPassword(password);

        user.save((err, userStored) => {
            if (err) {
                res.status(500).send({
                    message: "Error al crear usuario"
                });
            } else {
                if (!userStored) {
                    res.status(500).send({
                        message: "Erroral crear usuario"
                    });
                } else {
                    res.status(200).send({
                        // user: userStored
                        message: "Usuario creado correctamente"
                    });
                }
            }
        })
    }
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    signUpAdmin
};
