var Company=require("../model/Company");

module.exports = {
    'GET /company': async (ctx, next) => {
        var user=ctx.session.user;
        console.log(user);
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var company = await Company.findOne({
          where: {
            user_id: user.id
          }
        });
        
        ctx.render('./company/company.html',{});
    },
    // 'GET /company/:id': async (ctx, next) => {
    //     var id=ctx.params.id;
    //     var company = await Company.findById(id)||{};
    //     var menu=await Companymenu.findOne({
    //         where:{
    //             company_id:id
    //         }
    //     });
    //     var menus =[];
    //     if(menu&&menu.root_id){
    //         menus =await Companymenu.findAll({
    //             where:{
    //                 root_id:menu.root_id
    //             },
    //              order: [['sort', 'ASC']]
    //         });
    //     }
        
    //     console.log(company);
    //     ctx.render('company.html',{siteTitle:company.title,company:company,menus:menus});
    // },
    // 'GET /manage/company': async (ctx, next) => {
    //     var list= await Company.findAll();
    //     ctx.render('./manage/company.html', {
    //         list: list
    //     });
    // },
    //  'GET /manage/company/:id': async (ctx, next) => {
    //     var id=ctx.params.id;
    //     var company = await Company.findById(id);

    //     ctx.render('./manage/company.html', {bean:company});
    // },
    'POST /api/company': async (ctx, next) => {
         var name = ctx.request.body.name,
            ename = ctx.request.body.ename,
            content = ctx.request.body.content;

        var company = await Company.create({
            visit:0,
            title: title,
            tag:"",
            content: content
        });
        
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify({"code":"success"});
    },
    'PUT /api/company': async (ctx, next) => {
         
         var id = ctx.request.body.id,
            title = ctx.request.body.title,
            content = ctx.request.body.content;

        console.log(title);
        console.log(content);
        var data={id:id,title:title,content:content};
         var company = await Company.findById(id);
        company.visit++;
        company.title=title;
        company.content=content;
        await company.save();
        console.log('updated: ' + JSON.stringify(company));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(data);
    }
    // 'GET /api/company/:id': async (ctx, next) => {
         
    //     var id = ctx.params.id;
    //     var data = await Company.findById(id);
    //     ctx.response.type = 'application/json';
    //     ctx.response.body = JSON.stringify(data);
    // }
};