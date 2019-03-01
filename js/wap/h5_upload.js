;
var demo_h5_upload_ops = {
    init:function(){
        this.eventBind();
    },
    eventBind:function(){
        var that = this;
        $("#upload").live('change',function(){
        	var reader = new FileReader();
        	reader.onload = function (e) {
        		that.compress(this.result,"img_wrap");
        	};
        	reader.readAsDataURL(this.files[0]);
        });
        $("#avartupload").live('change',function(){
            var reader = new FileReader();
            reader.onload = function (e) {
                that.compress(this.result,"img_wrap_avart");
            };
            reader.readAsDataURL(this.files[0]);
        });
    },
    compress : function (res,imgVal) {
        var that = this;
        var img = new Image(),
            maxH = 300;

        img.onload = function () {
            var cvs = document.createElement('canvas'),
                ctx = cvs.getContext('2d');

            if(img.height > maxH) {
                img.width *= maxH / img.height;
                img.height = maxH;
            }
            cvs.width = img.width;
            cvs.height = img.height;
            
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataUrl = cvs.toDataURL('image/jpeg', 1);
            $("."+imgVal).attr("src",dataUrl);
            $("."+imgVal).show();
            // 上传略
            that.upload( dataUrl,imgVal );
        };

        img.src = res;
    },
    upload:function( image_data,imgVal ){
        /*上次方法屏蔽了
        return;*/
    	var type = "avatar";
    	if(imgVal=="img_wrap"){
    		type = "idCard";
    	}
    	var url = CONFIG.basePath + "/api/wx/uploadImage.json";
        $.ajax({
            url:url,
            type:'POST',
            data:{ fileStr:image_data,type:type },
            dataType:'json',
            success:function( res ){
            	var result = res.result;
                if(result=="1"){
                	var httpUrl = res.data;
                	if(type=="idCard"){
                		document.getElementById("cardImg").value = httpUrl;
                		mui.toast("身份证照上传成功");
                	}else{
                		document.getElementById("avatar").value = httpUrl;
                        mui.toast("头像上传成功");
                	}
                }
            }
        });
    }
};


$(document).ready( function(){
    demo_h5_upload_ops.init();
} );