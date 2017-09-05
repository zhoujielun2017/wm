var PageUtil={
    pageSize:20
};

function getPageNums(cur_page, total_page,url) {
    var result = "";
    cur_page=Number(cur_page);
    var max=cur_page + 6;
    url=url||"";
    for(var i = 1; i <= total_page; i++) {
    	
        if(i == 2 && cur_page - 6 > 1) {
            i = cur_page - 6;
        }else if(i == max && max < total_page) {
            i = total_page - 1;
        }else{
            if(i == cur_page){
                result += "<li  class='active'><a href='"+url+"?page="+i+"'>"+i+"</a></li>";
            }else{
                result += "<li><a href='"+url+"?page="+i+"'>"+i+"</a></li>";
            }
            
        }
    }
    return result;
} 
function getPage(cur_page, total_count,url) {
    var obj = {};
    obj.page=cur_page;
    obj.pageCount=Math.ceil(total_count/PageUtil.pageSize);
    obj.html=getPageNums(cur_page,obj.pageCount,url);
    return obj;
}

PageUtil.getPageNums=getPageNums;
PageUtil.getPage=getPage;
module.exports = PageUtil;