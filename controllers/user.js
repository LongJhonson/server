const bcrypt = require("bcrypt");
const User = require("../models/user");

function signUp(req, res) {
    console.log(req.body);

    const user = new User();

    const { name, lastname, email, password, repeatPassword } = req.body;

    user.name = name;
    user.lastname = lastname;
    user.email = email;
    user.role = "admin";
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({ message: "Las constraseñas son obligatorias" });
    } else {
        if (password !== repeatPassword) {
            res.status(404).send({ message: "Las contraseñas no coinciden." });
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if(err){
                    console.log(err);                    
                }
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);

                        res.status(500).send({ message: "Error al encirptar la contraseña" });
                    } else {
                        user.password = hash;
                        user.save((err, userStored) =>{
                            if(err){
                                res.status(500).send({message: "El usuario ya existe."});
                            }else{
                                if(!userStored){
                                    res.status(404).send({message: "Error al crear el usuario"});
                                }else{
                                    res.status(200).send({user: userStored});
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

module.exports = {
    signUp
};