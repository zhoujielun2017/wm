var Seller=require("../model/Seller"),
    User=require("../model/User"),
    City=require("../model/City"),
    Cooperation=require("../model/Cooperation"),
    PageUtil=require("../util/PageUtil");

var sellers=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Seller.findAndCountAll({
            where: {
                
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        // console.log("for out",result.count);
        for (var i = 0,len=result.count; i < len; i++) {
            // console.log("for");
            var bean=result.rows[i];
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
            bean.head=user.head_url;
        }
        ctx.render('./company/sellers.html',{
            result:result,
            nav:"sellers",
            page:PageUtil.getPage(page, result.count)
        });
    },
    seller_id=async (ctx, next) => {
        var id=ctx.params.id||1;
        var seller = await Seller.findById(id);
        if(seller&&seller.brand){
            seller.brand=seller.brand.split(",");
        }
        if(seller&&seller.area){
            seller.area=seller.area.split("_");
        }
        var areas = await City.findAll({
            id:{
                $in:seller.area
            }
        });
        seller.areas=areas;
        var user = await User.findById(seller.user_id);
        seller.head=user&&user.head_url;
        
        ctx.render('./company/seller.html',{bean:seller});
    },
    manage_sellers=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Seller.findAndCountAll({
            where: {
                
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        // console.log("for out",result.count);
        for (var i = 0,len=result.count; i < len; i++) {
            // console.log("for");
            var bean=result.rows[i];
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
            bean.head=user.head_url;
        }
        ctx.render('./manage/seller/list.html',{
            result:result,
            page:PageUtil.getPage(page, result.count)
        });
    },
    manage_seller=async (ctx, next) => {
        ctx.render('./manage/seller/add.html');
    },
    seller=async (ctx, next) => {
        var user=ctx.session.user;
        
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var seller = await Seller.findById(user.id);
        if(seller&&seller.brand){
            seller.brand=seller.brand.split(",");
        }
        ctx.render('./company/add_seller.html',{bean:seller});
    },
    api_seller=async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            contact_phone = ctx.request.body.contact_phone||'',
            
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            offical_website = ctx.request.body.offical_website||'',
            position = ctx.request.body.position||'',
            count_shop = ctx.request.body.count_shop||'',
            sale_per_year = ctx.request.body.sale_per_year||'',
            firsthand = ctx.request.body.firsthand||'',
            payment_days = ctx.request.body.payment_days||'',
            create_time = ctx.request.body.create_time||Date.now(),
            brands = ctx.request.body.brands||'',
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';

        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        
        var seller = await Seller.create({

            user_id:user.id,
            name: name,
            ename:ename,
            address:address,
            phone:phone,
            contact_phone:contact_phone,
            custom_service:custom_service,
            email:email,
            position:position,
            count_shop:count_shop,
            payment_days:payment_days,
            sale_per_year:sale_per_year,
            firsthand:firsthand,
            brand:brands,
            offical_website:offical_website,
            area:area,
            create_time:create_time
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":seller.id};
    },
    api_seller_update=async (ctx, next) => {
        var user=ctx.session.user;
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
         var id = ctx.request.body.id||'',
            name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            contact_phone = ctx.request.body.contact_phone||'',
            
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            offical_website = ctx.request.body.offical_website||'',
            position = ctx.request.body.position||'',
            count_shop = ctx.request.body.count_shop||'',
            sale_per_year = ctx.request.body.sale_per_year||'',
            firsthand = ctx.request.body.firsthand||'',
            payment_days = ctx.request.body.payment_days||'',
            create_time = ctx.request.body.create_time||Date.now(),
            brands = ctx.request.body.brands||'',
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';

       
        var seller = await Seller.findById(id);
        seller.name=name;
        seller.ename=ename;
        seller.address=address;
        seller.legal_person=legal_person;
        seller.phone=phone;
        seller.contact_phone=contact_phone;
        seller.custom_service=custom_service;
        seller.email=email;
        seller.offical_website=offical_website;
        seller.position=position;
        seller.count_shop=count_shop;
        seller.sale_per_year=sale_per_year;
        seller.firsthand=firsthand;
        seller.payment_days=payment_days;
        seller.content=content;
        seller.brand=brands;
        seller.area=area;
        seller.create_time=create_time;

        await seller.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":seller.id};
    },
    api_sellerdetail=async (ctx, next) => {
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
        
        var seller = await Seller.findById(id);
        seller.acreage=acreage;
        
        seller.type_per_month=type_per_month;
        seller.count_person=count_person;
        seller.count_qc=count_qc;
        seller.able_per_month=able_per_month;
        seller.major=major;
        await seller.save();
       
        ctx.body = {"code":"success","id":seller.id};
    },
    api_seller_delete=async (ctx, next) => {
        var id=ctx.params.id;
        await Seller.destroy({
          where: {
            id:id
          }
        });
        ctx.body = {"code":"success"};
    };

module.exports = {
    //前台列表
    'GET /sellers': sellers,
    //前台详情
    'GET /seller/:id': seller_id,
    //后台列表
    'GET /manage/sellers': manage_sellers,
    //后台添加零售商
    'GET /manage/seller':manage_seller,
    //个人中心
    'GET /seller': seller,
    
    'POST /api/seller':api_seller,
    'PUT /api/seller':api_seller_update ,
    'DELETE /api/seller/:id':api_seller_delete ,
    'PUT /api/sellerdetail': api_sellerdetail
};
