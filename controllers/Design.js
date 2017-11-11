var Design=require("../model/Design"),
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
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0,len=result.count; i < len; i++) {
            var bean=result.rows[i];
            if(bean.brand){
                bean.brand=bean.brand.split(",");
            }
            if(bean.work_experience){
                bean.work_experience=bean.work_experience.split(",");
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
        if(design&&design.work_experience){
            design.work_experience=design.work_experience.split(",");
        }
        if(design.area){
            design.area=design.area.split("_");
        }else{
            design.area=[];
        }
        
        // console.log("design.area",design.area);
        var areas = await City.findAll({
            where:{
                id:{
                "$in":design.area
                }
            }
            
        });
        var user = await User.findById(design.user_id);
        design.head=user&&user.head_url;

        design.areas=areas;
         var workses = await Works.findAndCountAll({
            where: {
                
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
    design=async (ctx, next) => {
        var user=ctx.session.user;
      
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        
        var designs = await Design.findAll({
            where:{
                user_id:user.id
            }
        });
        var design;
        if(designs){
            design=designs[0];
        }

        if(design&&design.work_experience)
            design.work_experience=design.work_experience.split(",");
        ctx.render('./company/add_design.html',{bean:design});
    },
    //后台添加接口
    manage_design_add=async (ctx, next) => {

        var name = ctx.request.body.name||'',
            gender = ctx.request.body.gender||'',
            age = ctx.request.body.age||'',
            status = ctx.request.body.status||'',
            major = ctx.request.body.major||'',
            exps = ctx.request.body.exps,
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';

            var user = await UserService.createUser(name,"design");
            

        //console.log("test user:",user.id);
        var design = await Design.create({
            
            user_id:user.id,
            name: name,
            gender:gender,
            age:age,
            status:status,
            major:major,
            work_experience:exps,
            area:area,
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
            age = ctx.request.body.age||'',
            status = ctx.request.body.status||'',
            major = ctx.request.body.major||'',
            exps = ctx.request.body.exps,
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';

        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        //console.log("test user:",user.id);
        var design = await Design.create({
            id:user.id,
            user_id:user.id,
            name: name,
            gender:gender,
            age:age,
            status:status,
            major:major,
            work_experience:exps,
            area:area,
            content:content
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":design.id};
    },
    api_design_update=async (ctx, next) => {
        var user=ctx.session.user;
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
         var id = ctx.request.body.id||'',
            name = ctx.request.body.name||'',
            gender = ctx.request.body.gender||'',
            age = ctx.request.body.age||'',
            status = ctx.request.body.status||'',
            major = ctx.request.body.major||'',
            exps = ctx.request.body.exps,
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';

       
        var design = await Design.findById(id);
        design.name=name;
        design.gender=gender;
        design.age=age;
        design.status=status;
        design.major=major;
        design.work_experience=exps;
        design.area=area;
        design.content=content;

        await design.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":design.id};
    },
    api_designdetail=async (ctx, next) => {
         var user=ctx.session.user;
         var id = ctx.request.body.id||'',
            types = ctx.request.body.types,
            names = ctx.request.body.names,
            acreage = ctx.request.body.acreage||'',
            type_per_month = ctx.request.body.type_per_month||'',
            count_person = ctx.request.body.count_person||'',
            count_qc = ctx.request.body.count_qc||'',
            able_per_month = ctx.request.body.able_per_month||'',
            major = ctx.request.body.major||'';

        var typearr=types.split(",");
        var namearr=names.split(",");

        await Cooperation.destroy({
          where: {
            user_id:user.id
          }
        });

        for (var i = 0; i < typearr.length; i++) {
            var type=typearr[i];
            var name=namearr[i];
           
            var cooperation = await Cooperation.create({
                user_id:user.id,
                name: name,
                type:type
            });
        }
        
        var design = await Design.findById(id);
        design.acreage=acreage;
        
        design.type_per_month=type_per_month;
        design.count_person=count_person;
        design.count_qc=count_qc;
        design.able_per_month=able_per_month;
        design.major=major;
        await design.save();
       
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
            bean.email=user.email;
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
            var user = await User.findById(bean.user_id);
            bean.head=user&&user.head_url;
        }
        ctx.render('./manage/design/list.html',{
            result:result,
            page:PageUtil.getPage(page, result.count)
        });
    },
    manage_design=async (ctx, next) => {
        var id=ctx.request.query.id;
        var bean = await Design.findById(id);
      
        if(bean&&bean.work_experience)
            bean.work_experience=bean.work_experience.split(",");
        ctx.render('./manage/design/add.html',{bean:bean});

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
    
    'POST /api/design': api_design,
    'PUT /api/design': api_design_update,
    'DELETE /api/design/:id': api_design_delete,
    'PUT /api/designdetail': api_designdetail
};
