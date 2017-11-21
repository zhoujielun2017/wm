/* 
   $.upload({
      fileElementId:"fileElementId"
  })
*/
jQuery.extend({

    createUploadIframe: function(frameId, uri){
        //create frame
        // var frameId = id;

        if(window.ActiveXObject) {
            var io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
            if(typeof uri== 'boolean'){
                io.src = 'javascript:false';
            }
            else if(typeof uri== 'string'){
                io.src = uri;
            }
        }
        else {
            var io = document.createElement('iframe');
            io.id = frameId;
            io.name = frameId;
        }
        io.style.position = 'absolute';
        io.style.top = '-1000px';
        io.style.left = '-1000px';

        document.body.appendChild(io);

        return io
    },
    upload: function(s) {
        
        s = jQuery.extend({}, s);
        var file=$("#"+s.fileElementId);
        var form=file.parent("form");
        var frameId=form.prop("target");
        if(!$("#"+frameId).length){
            jQuery.createUploadIframe(frameId);
        }
        file.on("change",function(){
            form.submit();
        });

        function uploadCallback(){
            var responseData = this.contentDocument.body.textContent || this.contentWindow.document.body.textContent;
            var json = JSON.parse(responseData);
            s.callback&&s.callback(json)
        }
        var iframe=document.getElementById(frameId);
        console.log(iframe,frameId)
        iframe.onload=uploadCallback;
    }
})

