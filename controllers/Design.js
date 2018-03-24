var Design=require("../model/Design"),
    DesignExp=require("../model/DesignExp"),
    Works=require("../model/Works"),
    User=require("../model/User"),
    City=require("../model/City"),
    Cooperation=require("../model/Cooperation"),
    UserService=require("../service/UserService"),
    PageUtil=require("../util/PageUtil");

var designs=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Design.findAndCountAll({
            where: {
                
            },
            order: [['create_time', 'DESC']],
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0,len=result.count; i < len; i++) {
            var bean=result.rows[i];
            if(bean.brand){
                bean.brand=bean.brand.split(",");
            }
           

            // if(bean.area){
            //     bean.area=bean.area.split("_");
            // }else{
            //     bean.area=[];
            // }
            // console.log("bean.area",bean.area);
            // var areas = await City.findAll({
            //     where:{
            //         id:{
            //         "$in":bean.area
            //         }
            //     }
            // });
            // bean.areas=areas;
            var exps = await DesignExp.findAll({
                where:{
                    design_id:bean.id
                }
                
            });
            bean.exps=exps;
            var user = await User.findById(bean.user_id);
            bean.head=user&&user.head_url;
        }
        ctx.render('./company/designs.html',{
            result:result,
            nav:"designs",
            page:PageUtil.getPage(page, result.count)
        });
    },
    design_id=async (ctx, next) => {
        var id=ctx.params.id;
        var page=ctx.request.query.page||1;
        var design = await Design.findById(id);
        if(design&&design.brand){
            design.brand=design.brand.split(",");
        }
        
        // if(design.area){
        //     design.area=design.area.split("_");
        // }else{
        //     design.area=[];
        // }
        
        // console.log("design.area",design.area);
        // var areas = await City.findAll({
        //     where:{
        //         id:{
        //         "$in":design.area
        //         }
        //     }
            
        // });
        var exps = await DesignExp.findAll({
            where:{
                design_id:id
            }
            
        });
        design.exps=exps;

        var user = await User.findById(design.user_id);
        design.head=user&&user.head_url;

        // design.areas=areas;
         var workses = await Works.findAndCountAll({
            where: {
                user_id:design.user_id
            },
            order: [['create_time', 'DESC']],
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        ctx.render('./company/design.html',{
            bean:design,
            workses:workses,
            page:PageUtil.getPage(page, workses.count)
        });
    },
    //前台编辑页
    design=async (ctx, next) => {
        var user=ctx.session.user;
        var design = await Design.findOne({
            where:{
                user_id:user.id
            }
        });
        if(!design){
            design = await Design.create({
                user_id:user.id,
                name: "",
                gender:1,
                age:0,
                status:1,
                major:"",
                area:"",
                content:""
            });
        }
        //工作经验
        var exps= await DesignExp.findAll({
           where:{
               design_id:design.id
           },
           order: [['create_time', 'ASC']],
        });

        ctx.render('./company/add_design.html',{bean:design,exps:exps});
    },
    //后台添加接口
    manage_design_add=async (ctx, next) => {

        var name = ctx.request.body.name||'',
            gender = ctx.request.body.gender||'',
            age = ctx.request.body.age||'',
            status = ctx.request.body.status||'',
            major = ctx.request.body.major||'',
            area = ctx.request.body.area||'',
            summary = ctx.request.body.summary||'';
            content = ctx.request.body.content||'';

        var user = await UserService.createUser(name,"design");
            
        var design = await Design.create({
            user_id:user.id,
            name: name,
            gender:gender,
            age:age,
            status:status,
            major:major,
            area:area,
            summary:summary,
            content:content
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":design.id};
    },
    api_design=async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            gender = ctx.request.body.gender||'',
            email = ctx.request.body.email||'',
            phone = ctx.request.body.phone||'',
            age = ctx.request.body.age||'',
            status = ctx.request.body.status||'',
            major = ctx.request.body.major||'',
            area = ctx.request.body.area||'',
            familiar = ctx.request.body.familiar||'',
            summary = ctx.request.body.summary||'';
            content = ctx.request.body.content||'';

        var design = await Design.create({
            user_id:user.id,
            name: name,
            email:email,
            phone:phone,
            gender:gender,
            age:age,
            status:status,
            major:major,
            area:area,
            familiar:familiar,
            summary:summary,
            content:content
        });
        
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":design.id};
    },
    api_design_update=async (ctx, next) => {
        var user=ctx.session.user;
         var id = ctx.request.body.id||'',
            name = ctx.request.body.name||'',
            email = ctx.request.body.email||'',
            phone = ctx.request.body.phone||'',
            gender = ctx.request.body.gender||'',
            age = ctx.request.body.age||'',
            status = ctx.request.body.status||'',
            major = ctx.request.body.major||'',
            area = ctx.request.body.area||'',
             familiar=ctx.request.body.familiar||'',
            summary = ctx.request.body.summary||'';
            content = ctx.request.body.content||'';

       
        var design = await Design.findById(id);
         if(!design.user_id){
            var user= await UserService.createUser(name,"design");
            design.user_id=user.id;
        }

        design.name=name;
        design.gender=gender;
        design.age=age;
        design.status=status;
        design.major=major;
        design.email=email;
        design.phone=phone;
        design.area=area;
        design.summary=summary;
        design.content=content;

        await design.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":design.id};
    },
    
    api_design_delete=async (ctx, next) => {
         var id=ctx.params.id;
        await Design.destroy({
          where: {
            id:id
          }
        });
        ctx.body = {"code":"success"};
    },
    manage_designs=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Design.findAndCountAll({
            where: {
                
            },
            order: [['create_time', 'DESC']],
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0,len=result.count; i < len; i++) {
            var bean=result.rows[i];
             var user = await User.findById(bean.user_id);
            bean.email=user&&user.email;
             bean.head=user&&user.head_url;
            if(bean.brand){
                bean.brand=bean.brand.split(",");
            }
            if(bean.area){
                bean.area=bean.area.split("_");
            }else{
                bean.area=[];
            }
            // console.log("bean.area",bean.area);
            var areas = await City.findAll({
                where:{
                    id:{
                    "$in":bean.area
                    }
                }
                
            });
            bean.areas=areas;
            
           
        }
        ctx.render('./manage/design/list.html',{
            result:result,
            page:PageUtil.getPage(page, result.count)
        });
    },
    manage_design=async (ctx, next) => {
        var id=ctx.request.query.id;
        var bean = await Design.findById(id);
      
        var exps = await DesignExp.findAll({
            where:{
                design_id:id
            }
            
        });

        ctx.render('./manage/design/add.html',{bean:bean,exps:exps});

    },
    //添加工作经验
    api_designexp=async (ctx, next) => {
        var user=ctx.session.user;
        var design_id = ctx.request.body.design_id,
            experience = ctx.request.body.experience;
        var bean = await DesignExp.create({
            design_id:design_id,
            experience:experience
        });
        
       ctx.body = {"code":"success",expid:bean.id};
    },
    //更新工作经验
    api_designexp_update=async (ctx, next) => {
        var user=ctx.session.user;
        var expid = ctx.request.body.expid,
            experience = ctx.request.body.experience;
        var bean = await DesignExp.findById(expid);
        bean.experience=experience;
        await bean.save();
        ctx.body = {"code":"success",expid:expid};
    },
    //更新工作经验
    api_designexp_delete=async (ctx, next) => {
        
        var expid = ctx.request.body.expid;
        
        var bean = await DesignExp.findById(expid);
       
        await bean.destroy();
        ctx.body = {"code":"success"};
    }
module.exports = {
    //前台列表
    'GET /designs': designs,
    //前台详情
    'GET /design/:id': design_id,
    //前台编辑页面
    'GET /design': design,
    //后台列表
    'GET /manage/designs': manage_designs,
    //后台添加编辑design
    'GET /manage/design': manage_design,
    'POST /manage/design': manage_design_add,
    //添加设计师
    'POST /api/design': api_design,
    //更新设计师
    'PUT /api/design': api_design_update,
    //删除设计师
    'DELETE /api/design/:id': api_design_delete,
    //增加工作经验
    'POST /api/designexp': api_designexp,
     //增加工作经验
    'PUT /api/designexp': api_designexp_update,
     //增加工作经验
    'DELETE /api/designexp': api_designexp_delete
};
