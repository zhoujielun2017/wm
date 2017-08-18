var Util={};
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
Util.getPageNums=getPageNums;
Util.pageSize=20;
module.exports = Util;