// var Common={
// 	editorConfig:{

//         extraPlugins: 'uploadimage,image2,codesnippet',
//         codeSnippet_theme: 'monokai_sublime',
//         height: 300,

//         // Upload images to a CKFinder connector (note that the response type is set to JSON).
//         uploadUrl: '/img?command=QuickUpload&type=Files&responseType=json',

//         // Configure your file manager integration. This example uses CKFinder 3 for PHP.
//         filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
//         filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
//         filebrowserUploadUrl: '/file?command=QuickUpload&type=Files',
//         filebrowserImageUploadUrl: '/img?command=QuickUpload&type=Images',

//         // The following options are not necessary and are used here for presentation purposes only.
//         // They configure the Styles drop-down list and widgets to use classes.

//         stylesSet: [
//             { name: 'Narrow image', type: 'widget', widget: 'image', attributes: { 'class': 'image-narrow' } },
//             { name: 'Wide image', type: 'widget', widget: 'image', attributes: { 'class': 'image-wide' } }
//         ],

//         // Load the default contents.css file plus customizations for this sample.
//         contentsCss: [ CKEDITOR.basePath + 'contents.css', 'http://sdk.ckeditor.com/samples/assets/css/widgetstyles.css' ],

//         // Configure the Enhanced Image plugin to use classes instead of styles and to disable the
//         // resizer (because image size is controlled by widget styles or the image takes maximum
//         // 100% of the editor width).
//         image2_alignClasses: [ 'image-align-left', 'image-align-center', 'image-align-right' ],
//         image2_disableResizer: true
//     }
// }


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
        
        this.smalldialog=$(this.setting.smalldialog);
        
    }
    Dialog.prototype.toast=function(opt){
       
        this.smalldialog.find(".modal-body").text(opt.content);
        this.smalldialog.modal('show');
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
                    '</div>'
    }
    YY.dialog=new Dialog();
})(YY);

