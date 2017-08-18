var Message=require("../model/Message");
var MessageGroup=require("../model/MessageGroup");
var User=require("../model/User");
var Util=require("../util/Util");
module.exports = {
    //列表页
    'GET /message': async (ctx, next) => {
        var user=ctx.session.user;
        var page=ctx.request.query.page||1;
        
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var result = await MessageGroup.findAndCountAll({
            where: {
                user_id: user.id
            },
             order: [['create_time', 'DESC']],
            'limit': Util.pageSize,
            'offset': Util.pageSize*(page-1)
        });
        result.page=page;
        result.pageCount=Math.ceil(result.count/Util.pageSize);
        console.log(result);

        ctx.render('./message/list.html', {
            result:result,
            page:Util.getPageNums(page,result.pageCount,"/message")}
        );

    },
    //添加页
    'GET /message/add': async (ctx, next) => {
        var user=ctx.session.user;
        console.log(user);
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var id=ctx.request.query.id;      
        ctx.render('./message/add.html',{receiver:{id:"fd5d5a86de824ab2aba8039f5d927c32"}});
    },
    'GET /message/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var group = await MessageGroup.findById(id);
        var group_id;
        if(group.user_id>group.another_id){
            group_id=group.user_id+"_"+group.another_id;
        }else{
            group_id=group.another_id+"_"+group.user_id;
        }
        var one= await User.findById(group.user_id);
        var two= await User.findById(group.another_id);
        var list =await Message.findAll({
                where:{
                    group_id:group_id
                },
                 order: [['create_time', 'ASC']]
            });
        for (var i = 0; i < list.length; i++) {
            if(list[i].sender_id==one.id){
                list[i].sender_name=one.name;
                list[i].sender_head=one.head_url;
            }
            if(list[i].sender_id==two.id){
                list[i].sender_name=two.name;
                list[i].sender_head=two.head_url;
            }
        }
        
        ctx.render('./message/detail.html',{list:list,receiver:two});
    },
    'POST /api/message': async (ctx, next) => {

        var user=ctx.session.user;
        var receiver_id = ctx.request.body.receiver_id||'',
            content = ctx.request.body.content||'';
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        var receiver=await User.findById(receiver_id);
        var group_id;
        if(user.id>receiver_id){
            group_id=user.id+"_"+receiver_id;
        }else{
            group_id=receiver_id+"_"+user.id;
        }
        var message = await Message.create({
            group_id:group_id,
            sender_id:user.id,
            receiver_id: receiver_id,
            status:0,
            content: content
        });
        //自己的
        var group=await MessageGroup.findOne({
            where: {
                user_id:user.id,
                another_id: receiver_id
            }
        });
        if(group){
            //自己的未读不增加
            group.img=receiver.head_url;
            group.content=content;
            group.name=receiver.name;
            group.save();
        }else{
            await MessageGroup.create({
                user_id:user.id,
                another_id: receiver_id,
                status:0,
                img:receiver.head_url,
                name:receiver.name,
                count:1,
                content: content
            });
        }

        //another的
        var group2=await MessageGroup.findOne({
            where: {
                user_id:receiver_id,
                another_id: user.id
            }
        });
        if(group2){
            group2.img=user.head_url;
            group2.content=content;
            group2.name=user.name;
            group2.count++;
            group2.save();
        }else{
            await MessageGroup.create({
                user_id:receiver_id,
                another_id: user.id,
                status:0,
                img:user.head_url,
                name:user.name,
                count:1,
                content: content
            });
        }
        ctx.body = {"code":"success"};
    },
    'GET /api/messageGroup': async (ctx, next) => {
        var user=ctx.session.user;
        var group=await MessageGroup.findOne({
            where: {
                user_id:user.id
            }
        });
        ctx.body={code:"success",count:group.count};
    }

};