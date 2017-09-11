(function($){

	function getAreas(parent_id,success){
		$.ajax({
	        type: "GET",
	        url: "/api/city",
	        data:{parent_id:parent_id},
	        dataType:"json",
	        success:function(json){
	            if(json.code=='success'){
	             success(json);
	            }else{
	              // location.reload();
	            }
	        }
	    });
	}

	/*
	父id
	和html元素
	*/
	function optionCreate(parent_id,select,callback){

		
		getAreas(parent_id,function(json){
			// console.log(json);
			var citys=json.citys;
			
			var $select=$(select);
			for (var i = 0; i < citys.length; i++) {

				$select.append($("<option>").text(citys[i].name).val(citys[i].id));
			}
			// console.log(typeof callback)
			if(typeof callback=="function"){
				callback();	
			}
			
			
		})
		
	}

	$.fn.city = function(options) {
	    var defaults = {
	        area1: 0,
	        area2:1
	        
	    };
	    var elements=[];
	    var settings = $.extend(defaults, options);
	   
	    this.find("select").each(function(index,element){
			// console.log(index,element);
			// console.log(element.val());
			elements.push(element);
			$(element).data("index",index);
			if(index==0){
				// $(element).append("<option>111</option>");
				optionCreate(settings.area1,element);
			}
			if(index==1){
				
				optionCreate(settings.area2,element)
			}
			
			$(element).on("change",function(){
				var that=$(this);
				var areaId=that.val();
				console.log("change",areaId);
				var index=that.data("index");
				var element=elements[index+1];
				var $elem=$(element);
				if(!$elem){
					return;
				}
				$elem.empty();
				optionCreate(areaId,element,function(){
					if(index==0){
						console.log("trigger");
						$elem.trigger("change");
					}
				});
				
				
				
			})			
	    });
	    // var city=this.find("select")[1];
	    // var area=this.find("select")[2];
	    // console.log("province",province.val());
	    // console.log("city",city);
	    // console.log("area",area);
	    return this.css({
	        'color': settings.color,
	        'fontSize': settings.fontSize
	    });
	}

	

})(jQuery);

