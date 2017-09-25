(function(){
	var bucket = new upyun.Bucket('acclist-pic')
	function getHeaderSign(bucket, method, path) {
	  console.log("getHeaderSign",path);
	  var params = 'bucket=' + bucket.bucketName + '&method=' + method + '&path=' + path
	  return fetch('/sign?' + params)
	    .then(function(response) {
	      if (response.status !== 200) {
	        console.error('gen header sign faild!')
	        return;
	      }
	      return response.json()
	    })
	}
	var client = new upyun.Client(bucket, getHeaderSign)

	function upload(element,callback) {
	  var file = element.files[0]
	  // console.log(file.name);
	  var now=new Date();
	  var dir="/"+now.getFullYear().toString()+"/"+(now.getMonth()+1)+""+now.getDate()+'/' + now.getTime()+".jpg";
	  client.putFile(dir, file).then(function(result) {
	    console.log('put file to upyun ' + (result ? 'success' : 'failed'))
	    callback&&callback({
	    	url:"http://acclist-pic.b0.upaiyun.com"+dir,
	    	path:dir});
	  })
	}
	$.extend({
		fileupload :upload
	})
	
})()
