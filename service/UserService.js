var User=require("../model/User"),
    crypto = require('crypto'),
    Setting=require("../model/Setting");

var UserService={};

async function createUser(name,type){
    
    var setting=await Setting.findById("auto_create_user");
        console.log("setting",setting);
        setting.value++
        await setting.save();
        var password=crypto.createHash('md5').update("123456").digest('hex');
        var user = await User.create({
            role:0,
            email: "auto"+setting.value+"@acclist.com",
            name:name,
            type:type,
            password:password,
            verified:0,
            status:1,
            head_url: "",
            last_login_time:0
        });
        return user;
}

UserService.createUser=createUser;
module.exports = UserService;