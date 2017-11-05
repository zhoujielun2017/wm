

var YY={};
(function(){

   /**
    * YY.dialog.toast({content:"提示内容"})
    * @param {*} opt 
    */
    function Dialog(opt){
     this.setting=$.extend(opt,Dialog.default,{});
     this.init();
    }
    Dialog.prototype.init=function(){
        var that=this;
        this.smalldialog=$(this.setting.smalldialog);
        this.alertdialog=$(this.setting.alertdialog);
        //确认框的点击
        this.alertdialog.on("click",".modal-footer .btn-primary",function(){
            
            if(that.setting.callback){
                that.setting.callback(that.alertdialog);
            }
            that.alertdialog.modal('hide');
        });
        
    }
    Dialog.prototype.toast=function(){
       
        this.smalldialog.find(".modal-body").text(this.setting.content);
        this.smalldialog.modal('show');
    }
    Dialog.prototype.alert=function(){
       
        this.alertdialog.find(".modal-body").text(this.setting.content);
        this.alertdialog.modal('show');
    }
     Dialog.prototype.confirm=function(){
       
        this.alertdialog.find(".modal-body").html(this.setting.content);
        this.alertdialog.modal('show');
    }
    Dialog.default={
        smalldialog:'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'+
                    '  <div class="modal-dialog  modal-sm" role="document">'+
                    '    <div class="modal-content">'+
                    '      <div class="modal-header">'+
                    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                    '        <h4 class="modal-title" id="myModalLabel">info</h4>'+
                    '      </div>'+
                    '      <div class="modal-body">'+

                    '      </div>'+
                    // '      <div class="modal-footer">'+
                    // '        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    // '        <button type="button" class="btn btn-primary">Save changes</button>'+
                    // '      </div>'+
                    '    </div>'+
                    '  </div>'+
                    '</div>',
        alertdialog:'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'+
                    '  <div class="modal-dialog  modal-sm" role="document">'+
                    '    <div class="modal-content">'+
                    '      <div class="modal-header">'+
                    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                    '        <h4 class="modal-title" id="myModalLabel">info</h4>'+
                    '      </div>'+
                    '      <div class="modal-body">'+

                    '      </div>'+
                    '      <div class="modal-footer">'+
                    '        <button type="button" class="btn btn-primary">Save</button>'+
                    '        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '      </div>'+
                    '    </div>'+
                    '  </div>'+
                    '</div>'
    }
    YY.dialog=function(opt){
        return new Dialog(opt);
    };

    
    var editorConfig={

        extraPlugins: 'uploadimage,image2,codesnippet',
        codeSnippet_theme: 'monokai_sublime',
        height: 400,

        // Upload images to a CKFinder connector (note that the response type is set to JSON).
        uploadUrl: '/file?command=QuickUpload&type=Files&responseType=json',

        // Configure your file manager integration. This example uses CKFinder 3 for PHP.
        filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
        filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
        filebrowserUploadUrl: '/file?command=QuickUpload&type=Files',
        filebrowserImageUploadUrl: '/file?command=QuickUpload&type=Images',

        // The following options are not necessary and are used here for presentation purposes only.
        // They configure the Styles drop-down list and widgets to use classes.

        stylesSet: [
            { name: 'Narrow image', type: 'widget', widget: 'image', attributes: { 'class': 'image-narrow' } },
            { name: 'Wide image', type: 'widget', widget: 'image', attributes: { 'class': 'image-wide' } }
        ],

        // Load the default contents.css file plus customizations for this sample.
        // contentsCss: [ CKEDITOR.basePath + 'contents.css', 'http://sdk.ckeditor.com/samples/assets/css/widgetstyles.css' ],

        // Configure the Enhanced Image plugin to use classes instead of styles and to disable the
        // resizer (because image size is controlled by widget styles or the image takes maximum
        // 100% of the editor width).
        image2_alignClasses: [ 'image-align-left', 'image-align-center', 'image-align-right' ],
        image2_disableResizer: true
    }
    YY.editorConfig=editorConfig;
})(YY);

