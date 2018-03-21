var Message=require("../model/Message"),
    MessageGroup=require("../model/MessageGroup"),
    User=require("../model/User"),
    UserService=require("../service/UserService"),
    PageUtil=require("../util/PageUtil");
module.exports = {
    //列表页
    'GET /messageGroups': async (ctx, next) => {
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
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
 
        var update = await MessageGroup.update({count:0},{
            'where':{
                'user_id':user.id
            }  
        });
        //console.log(update);

        var i=0,len=result.rows.length,bean;
        for (i; i < len; i++) {
            bean=result.rows[i];
            var user=await User.findById(bean.another_id);
            if(!user){
                continue;
            }
            bean.another_head=user.head_url;
            // bean.name=user.name;
            bean.another_type=user.type;
            bean.name=await UserService.getUserNameById(bean.another_id);
        }

        ctx.render('./message/list.html', {
            result:result,
            page:PageUtil.getPage(page,result.count)}
        );

    },
    //添加页
    'GET /message/:id': async (ctx, next) => {
        var user=ctx.session.user;
        
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var id=ctx.params.id;      
        var receiver=await User.findById(id);
        //console.log(receiver);
        ctx.render('./message/add.html',{bean:receiver});
    },
    //和某人的对话 id group的id
    'GET /messageGroup/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var group = await MessageGroup.findById(id);
        //查找对话内容
        var group_id;
        //谁大谁在前面
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
        var i = 0,len=list.length,bean;
        for (i; i < len; i++) {
            bean=list[i];
            
            if(one&&bean.sender_id==one.id){
                bean.sender_name=one.name;
                bean.sender_head=one.head_url;
            }
            if(two&&bean.sender_id==two.id){
                bean.sender_name=two.name;
                bean.sender_head=two.head_url;
            }
        }
        
        ctx.render('./message/detail.html',{list:list,
            receiver:two});
    },
    /**
    提交信息
    会产生两个group,一个是自己的,一个是别人的
    */
    'POST /api/message': async (ctx, next) => {

        var user=ctx.session.user;
        var receiver_id = ctx.request.body.receiver_id||'',
            content = ctx.request.body.content||'';
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        if(user.id==receiver_id){
            ctx.body = {"code":"myself"};
            return;
        }
        //接收者
        var receiver=await User.findById(receiver_id);
        if(!receiver){
            ctx.body = {"code":"receiver_null"};
            return;
        }
        //计算gourp_id
        var group_id; //userId_receiverId
        if(user.id>receiver_id){
            group_id=user.id+"_"+receiver_id;
        }else{
            group_id=receiver_id+"_"+user.id;
        }
        //创建message
        var message = await Message.create({
            group_id:group_id,
            sender_id:user.id,
            receiver_id: receiver_id,
            status:0,
            content: content
        });
        //自己的MessageGroup
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
            //自己的未读为0
            await MessageGroup.create({
                user_id:user.id,
                another_id: receiver_id,
                status:0,
                img:receiver.head_url,
                name:receiver.name,
                count:0,
                content: content
            });
        }

        //another的MessageGroup
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
            //别人的未读为1
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
    //获取未读条数
    'GET /api/messageGroup': async (ctx, next) => {
        var user=ctx.session.user;
        if(!user){
            ctx.body={code:"not_login"};
            return 
        }
        var group=await MessageGroup.findOne({
            where: {
                user_id:user.id
            }
        });
        var count=group&&group.count||0;
        ctx.body={code:"success",count:count};
    },
    'DELETE /api/messageGroup/:id': async (ctx, next) => {
        var id=ctx.params.id;
        //只删除自己的group
        await MessageGroup.destroy({
          where: {
            id:id
          }
        });

        ctx.body={code:"success"};
    }

};