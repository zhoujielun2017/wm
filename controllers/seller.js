var Seller=require("../model/Seller");
var User=require("../model/User");
var Cooperation=require("../model/Cooperation");

module.exports = {
    'GET /seller': async (ctx, next) => {
        var user=ctx.session.user;
        console.log(user);
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var seller = await Seller.findById(user.id);
        if(seller&&seller.brand){
            seller.brand=seller.brand.split(",");
        }
        ctx.render('./company/seller.html',{bean:seller});
    },
    
    'POST /api/seller': async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
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
            content = ctx.request.body.content||'';

        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        console.log("test user:",user.id);
        var seller = await Seller.create({
            id:user.id,
            user_id:user.id,
            name: name,
            ename:ename,
            address:address,
            phone:phone,
            custom_service:custom_service,
            email:email,
            position:position,
            count_shop:count_shop,
            payment_days:payment_days,
            sale_per_year:sale_per_year,
            firsthand:firsthand,
            brand:brands,
            offical_website:offical_website,
            create_time:create_time
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":seller.id};
    },
    'PUT /api/seller': async (ctx, next) => {
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
            content = ctx.request.body.content||'';

       
         var seller = await Seller.findById(id);
        seller.name=name;
        seller.ename=ename;
        seller.address=address;
        seller.legal_person=legal_person;
        seller.phone=phone;
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
        seller.create_time=create_time;

        await seller.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":seller.id};
    },
    'PUT /api/sellerdetail': async (ctx, next) => {
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
    }
};