var User=require("../model/User"),
    crypto = require('crypto'),
    Setting=require("../model/Setting"),
    Factory=require("../model/Factory"),
    Agency=require("../model/Agency"),
    Seller=require("../model/Seller"),
    Design=require("../model/Design");

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

async function getUserNameById(id){
    
    
    var user = await User.findById(id);
    if(user.type=='factory'){
        var factory = await Factory.findOne({
            where:{
                user_id:id
            }
        });
        if(!factory){
            return user.name;
        }
        return factory.name||factory.ename;
    }
    if(user.type=='seller'){
        var seller = await Seller.findOne({
            where:{
                user_id:id
            }
        });
        if(!seller){
            return user.name;
        }
        return seller.name||seller.ename;
    }
    if(user.type=='agency'){
        var agency = await Agency.findOne({
            where:{
                user_id:id
            }
        });
        if(!agency){
            return user.name;
        }
        return agency.name||agency.ename;
    }
    if(user.type=='design'){
        var design = await Design.findOne({
            where:{
                user_id:id
            }
        });
        if(!design){
            return user.name;
        }
        return design.name;
    }
    return user.name;
}

//获取英文名称
async function getUserEnNameById(id){
    
    
    var user = await User.findById(id);
    if(user.type=='factory'){
        var factory = await Factory.findOne({
            where:{
                user_id:id
            }
        });
        if(!factory){
            return user.name;
        }
        return factory.ename||factory.name;
    }
    if(user.type=='seller'){
        var seller = await Seller.findOne({
            where:{
                user_id:id
            }
        });
        if(!seller){
            return user.name;
        }
        return seller.ename||seller.name;
    }
    if(user.type=='agency'){
        var agency = await Agency.findOne({
            where:{
                user_id:id
            }
        });
        if(!agency){
            return user.name;
        }
        return agency.ename||agency.name;
    }
    if(user.type=='design'){
        var design = await Design.findOne({
            where:{
                user_id:id
            }
        });
        if(!design){
            return user.name;
        }
        return design.name;
    }
    return user.name;
}

UserService.createUser=createUser;
UserService.getUserNameById=getUserNameById;
UserService.getUserEnNameById=getUserEnNameById;
module.exports = UserService;
