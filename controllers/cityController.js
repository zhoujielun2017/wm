var City=require("../model/City");

module.exports = {
    'GET /api/city': async (ctx, next) => {

        var parent_id = ctx.request.query.parent_id||'0';

        var citys = await City.findAll({
            where: {
                parent_id:parent_id
            }
        });
        
        ctx.body = {"code":"success","citys":citys};
    }
};