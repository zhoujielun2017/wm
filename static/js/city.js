(function($){

	var elements=[];
	var City=function (el,options){
		console.log("el",el.dataset.area,options);
		var areas=[];
		if(el.dataset.area){
			 //0 1  2   3
			//_234_235_237_
			areas=el.dataset.area.split("_");
		}
		//area1国家
		var defaults = {
	        nation: 0,
	        province:1,
	        city:null
	    };
	   	
	    this.settings = $.extend(defaults, {
	    	province:areas[1],
	    	city:areas[2],
	    	county:areas[3]
	    });
		console.log("settings",this.settings);
		this.initSelect(el,this.settings);
	}
	/*初始化select*/
	City.prototype.initSelect=function(el,settings){
		var that=this;
		$(el).find("select").each(function(index,element){
			console.log("eachSelect",this);
			elements.push(element);
			//设置索引
			$(element).data("index",index);
			if(index==0){
				//初始化默认值
				that.optionCreate({
					parent_id:settings.nation,
					default_id:settings.province
				},element);
			}
			if(index==1){
				that.optionCreate({
					parent_id:settings.province,
					default_id:settings.city
				},element)
			}
			if(index==2){
				that.optionCreate({
					parent_id:settings.city,
					default_id:settings.county
				},element)
			}
			
			//绑定每一个select的chagne事件
			$(element).on("change",function(){
				var $this=$(this);
				var areaId=$this.val();
				console.log("change",areaId);
				var index=$this.data("index");
				//下一个进行改变
				var element=elements[index+1];
				var $elem=$(element);
				if(!$elem){
					return;
				}
				$elem.empty();
				that.optionCreate({
					parent_id:areaId
				},element,function(){
					if(index==0){
						//第一个直接促发第二个select
						console.log("trigger");
						$elem.trigger("change");
					}
				});
				
				
				
			})		
		});
	}
	
	

	/*
	父id
	和html元素
	*/
	City.prototype.optionCreate=function(option,select,callback){
		var $select=$(select);
		$.ajax({
	        type: "GET",
	        url: "/api/city",
	        data:{parent_id:option.parent_id},
	        dataType:"json",
	        success:function(json){
	            if(json.code=='success'){
	            	console.log(json.code);
	             	var citys=json.citys;
					var html="";
					for (var i = 0; i < citys.length; i++) {
						var id=citys[i].id;
						if(option.default_id&&id==option.default_id){
							html+="<option value='"+id+"' selected>"+citys[i].name+"</option>";
						}else{
							html+="<option value='"+id+"' >"+citys[i].name+"</option>";
						}
						
					}
					$select.append(html);
					callback&&callback();
	            }else{
	              // location.reload();
	            }
	        }
	    });
		
	}


	function Plugin(option) {
	    return this.each(function () {
	      var $this = $(this)
	      new City(this,option);
	      // console.log("Plugin",this);
	    })
	  }

  

  $.fn.city             = Plugin
  $.fn.city.Constructor = City
	

})(jQuery);

