const User = require('../models/user');
const { Role } = require('../helpers')
require('dotenv').config();

module.exports = function() {
    return new Promise(function(resolve){
        const email = process.env.SUPER_ADMIN_EMAIL,
              password = process.env.SUPER_ADMIN_PASS,
              name = process.env.SUPER_ADMIN_NAME,
              role = Role.SuperAdmin;
        User.findOne({email}, function(err, user){
            if(err) throw err;
            if(!user){
                var superAdmin = new User({
                    email,
                    password,
                    name,
                    role,
                });
                superAdmin.save(function(err){
                    if(err) throw err;
                    resolve();
                })
            }else{
                resolve();
            }
        })
    })
};