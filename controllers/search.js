var Agency=require("../model/Agency"),
    Seller=require("../model/Seller"),
    Factory=require("../model/Factory"),
    Design=require("../model/Design"),
    User=require("../model/User"),
    City=require("../model/City"),
    Cooperation=require("../model/Cooperation"),
    PageUtil=require("../util/PageUtil");
//select * from  factory f LEFT JOIN  user u on  f.user_id = u.id order by u.role desc,f.ename asc;
var search_facotry=async (ctx, next) => {
        var page=ctx.request.query.page||1,
            q=ctx.request.query.q;
            if(q){
                q=q.trim().toLowerCase().replace(" ","_").replace("-","_");
            }
        var result = await Factory.findAndCountAll({
            where: {
                $or: [
                    {search:{"$like":"%"+q+"%"}},
                    {name: {"$like":"%"+q+"%"}},
                    {ename: {"$like":"%"+q+"%"}}
                ]
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0; i < result.count; i++) {
            var bean=result.rows[i];
            if(!bean){
                break;
            }
            if(bean.major){
                bean.major=bean.major.split(",");
               
            }
            var cops = await Cooperation.findAll({
                where:{
                    factory_id:bean.id
                },
                order: [['create_time', 'DESC']]
            });
            bean.cops=cops;

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
       
       
        ctx.render('./search/factory.html',{
            result:result,
            q:q,
            page:PageUtil.getPage(page, result.count)
        });
    }
module.exports = {
    //搜索页
    'GET /search': async (ctx, next) => {
        var page=ctx.request.query.page||1,
            q=ctx.request.query.q,
            type=ctx.request.query.type;
       
        ctx.render('./search/search.html',{});
    },
    
    'GET /search/agency': async (ctx, next) => {
        var page=ctx.request.query.page||1,
            q=ctx.request.query.q;
        var result = await Agency.findAndCountAll({
            where: {
                $or: [
                    {name: {"$like":"%"+q+"%"}},
                    {ename: {"$like":"%"+q+"%"}}
                ]
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0,len=result.count; i < len; i++) {
            var bean=result.rows[i];
            if(bean.brand){
                bean.brand=bean.brand.split(",");
            }
            if(bean.area){
                bean.area=bean.area.split("_");
            }else{
                bean.area=[];
            }
            
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
       
        ctx.render('./search/agency.html',{
            result:result,
            q:q,
            page:PageUtil.getPage(page, result.count)
        });
    },
    'GET /search/seller': async (ctx, next) => {
        var page=ctx.request.query.page||1,
            q=ctx.request.query.q;
        var result = await Seller.findAndCountAll({
            where: {
                $or: [
                    {name: {"$like":"%"+q+"%"}},
                    {ename: {"$like":"%"+q+"%"}}
                ]
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0,len=result.count; i < len; i++) {
            var bean=result.rows[i];
            if(!bean){
                continue;
            }
            if(bean.brand){
                bean.brand=bean.brand.split(",");
            }
            if(bean.area){
                bean.area=bean.area.split("_");
            }else{
                bean.area=[];
            }
            
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
       
        ctx.render('./search/seller.html',{
            result:result,
            q:q,
            page:PageUtil.getPage(page, result.count)
        });
    },
    'GET /search/factory': search_facotry,
    
    'GET /search/design': async (ctx, next) => {
        var page=ctx.request.query.page||1,
            q=ctx.request.query.q;
        var result = await Design.findAndCountAll({
            where: {
                $or: [
                    {name: {"$like":"%"+q+"%"}},
                    {familiar: {"$like":"%"+q+"%"}}
                ]
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
            var user = await User.findById(bean.user_id);
            bean.head=user&&user.head_url;
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
       
        ctx.render('./search/design.html',{
            result:result,
            q:q,
            page:PageUtil.getPage(page, result.count)
        });
    }

};
