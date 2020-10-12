const Menu = require('../models/menu');
const menu = require('../models/menu');

function addMenu(req, res) {
    const { title, order, url, active } = req.body;
    const menu = new Menu();
    menu.title = title;
    menu.order = order;
    menu.url = url;
    menu.active = active;

    menu.save((err, createdMenu) => {
        if (err) {
            res.status(500).send({
                message: "Error del servidor"
            });
        } else {
            if (!createdMenu) {
                res.status(404).send({
                    message: "Error al crear el menu"
                });
            } else {
                res.status(200).send({
                    message: "Menu creado correctamente"
                });
            }
        }
    })
}

function getMenus(req, res) {
    Menu.find()
        .sort({ order: "asc" })
        .then(menu => {
            if (!menu) {
                res.status(400).send({
                    message: "No se ha encontrado ningun usuario"
                });
            } else {
                res.status(200).send({ menu });
            }
        }).catch(err => {
            res.status(500).send({
                message: "Error del servidor"
            });
        })
}

function updateMenu(req, res) {
    let menuData = req.body;
    const params = req.params;

    Menu.findByIdAndUpdate(params.id, menuData, (err, menuUpdate) => {
        if (err) {
            res.status(500).send({
                message: "Error del servidor"
            });
        } else {
            if (!menuUpdate) {
                res.status(404).send({
                    message: "No se ha encontrado ningun menu"
                });
            } else {
                res.status(200).send({
                    message: "Menu actualizado correctamente"
                });
            }
        }
    })
}

function activateMenu(req, res) {
    const { id } = req.params;
    const { active } = req.body;
    Menu.findByIdAndUpdate(id, {active},(err, menuActivated)=>{
        if(err){
            res.status(500).send({
                message: "Error del servidor"
            });
        }else{
            if(!menuActivated){
                res.status(404).send({
                    message: "No se ha encontrado el menu"
                });
            }else{
                if(active){
                    res.status(200).send({
                        message: "Menu activado correctamente"
                    });
                }else{
                    res.status(200).send({
                        message: "Menu desactivado correctamente"
                    });
                }
            }
        }
    })
}

function deleteMenu(req, res){
    const {id} = req.params;
    menu.findByIdAndRemove(id, (err, menuDeleted) => {
        if(err){
            res.status(500).send({
                message: "Error del servidor"
            })
        }else{
            if(!menuDeleted){
                res.status(404).send({
                    message: "Menu no encontrado"
                })
            }else{
                res.status(200).send({
                    message: "Menu eliminado correctamente"
                })
            }
        }
    });
}

module.exports = {
    addMenu,
    getMenus,
    updateMenu,
    activateMenu,
    deleteMenu
}