const mongoose = require("mongoose");
const app = require("./app");
const PORT_SERVER = process.env.port || 3977;
const {
    API_VERSION,
    IP_SERVER,
    PORT_DB,
    DB_NAME
} = require("./config");

mongoose.set("useFindAndModify", false);

mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/${DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log("La conxion con la base de datos es correxta");

            app.listen(PORT_SERVER, () => {
                console.log("########################");
                console.log("####### API REST #######");
                console.log("########################");
                console.log(`http://${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}`);
            })
        }
    });