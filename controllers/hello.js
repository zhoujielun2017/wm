var Wiki=require("../model/Wiki");

var fn_hello = async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
    
};
function getPageNums(cur_page, total_page,url) {
    var result = "";
    cur_page=Number(cur_page);
    var max=cur_page + 6;
    
    for(var i = 1; i <= total_page; i++) {
    	
        if(i == 2 && cur_page - 6 > 1) {
            i = cur_page - 6;
        }else if(i == max && max < total_page) {
            i = total_page - 1;
        }else{
            if(i == cur_page){
                result += "<li  class='active'><a href='"+url+"?page="+i+"'>"+i+"</a></li>";
            }else{
                result += "<li><a href='/"+url+"?page="+i+"'>"+i+"</a></li>";
            }
            
        }
    }
    return result;
} 

module.exports = {
    'GET /hello/:name': fn_hello,
    'GET /page1': async (ctx, next) => {
        ctx.render('page1.html', {
            title: 'Welcome'
        });
    },
    'GET /listtest': async (ctx, next) => {
    	var page=ctx.request.query.page||1;
    	console.log("============",page);
    	var result = await Wiki.findAndCountAll({
		    'limit': 20,
		    'offset': 20*(page-1)
		});
		result.page=page;
		result.pageCount=Math.ceil(result.count/20);
		console.log(result);

        ctx.render('listtest.html', {result:result,page:get_hs_page(page,100)});
    }
};