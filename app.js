const { app } = require('./baseserver/server');
const init = require('./baseserver/init');
require("dotenv").config();

init().then(function initialized(){
    app.listen(process.env.PORT || 3000);
})