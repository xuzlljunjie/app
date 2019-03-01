/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function ($, owner) {
	
	/**
     * 同步调用获取用户信息
     */
    app.getRegistrationInfo = function (openId) {
        //成功获取后的回调函数
        var params = {openId: openId};
        var result ;
        var options = {
            url: CONFIG.basePath+ "/api/getRegistration.json",
            async: false,
            data: params,
            dataType: "json",
            type: 'post',
            success: function (res) {
                var registrationInfo = res.data;
                console.log(res);
                app.setState(registrationInfo);
                result = registrationInfo;
            },
            error: function (res) {
                console.log(res);
            }
        };
        $.ajax(options);
        return result;
    }
    
    var checkEmail = function (email) {
        email = email || '';
        return (email.length > 3 && email.indexOf('@') > -1);
    };

    owner.checkEmail = checkEmail;
    
    var checkIdCard = function (card)  {  
   		// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
   		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
   		if(reg.test(card)) {  
		    return true;  
   		}  else {
   			return false;
   		}
	}
	owner.checkIdCard = checkIdCard;
	
    var checkPhone = function (phone) {
        phone = phone || '';
        var pattern = /^1[34578]\d{9}$/;
        if (pattern.test(phone)) {
            return true;
        } else {
            return false;
        }
    };
    owner.checkPhone = checkPhone;
    var checkNumber = function (value) {
        value = value || '';
        var pattern = /^[0-9]*$/;
        if (pattern.test(value)) {
            return true;
        } else {
            return false;
        }
    };
    owner.checkNumber = checkNumber;

    /**
     * 将url中的查询参数转换成对象
     */
    owner.parseLocationQueryString = function () {
        var obj = {};
        var href = window.location.href;
        var pos = href.indexOf("?");
        if (pos == -1) {
            return obj;
        }
        var queryString = href.substring(pos + 1);
        var paramPairArr = queryString.split("&");
        for (var i = 0; i < paramPairArr.length; i++) {
            var paramPair = paramPairArr[i];
            var pos1 = paramPair.indexOf("=");
            var paramName = paramPair.substring(0, pos1);
            var paramValue = paramPair.substring(pos1 + 1);
            obj[paramName] = paramValue;
        }
        return obj;
    }
    /**
     * 默认处理json结果逻辑，成功返回数据，错误则提示错误，什么都不返回，就是undefined
     * @param res
     * @param successCallback 成功的回调函数
     */
    app.parseJsonResult = function (res, successCallback) {
    	var obj = JSON.parse(res);
        var result = obj.result;
        if (result == "0") {
            $.toast(obj.data);
            return false;
        }
        if (successCallback) {
            successCallback(obj.data);
        }
        return obj.data;
    }

    //将URL中的UTF-8字符串转成中文字符串
    var getCharFromUtf8 = function (str) {
        var cstr = "";
        var nOffset = 0;
        if (str == "")
            return "";
        str = str.toLowerCase();
        nOffset = str.indexOf("%e");
        if (nOffset == -1)
            return str;
        while (nOffset != -1) {
            cstr += str.substr(0, nOffset);
            str = str.substr(nOffset, str.length - nOffset);
            if (str == "" || str.length < 9)
                return cstr;
            cstr += utf8ToChar(str.substr(0, 9));
            str = str.substr(9, str.length - 9);
            nOffset = str.indexOf("%e");
        }
        return cstr + str;
    }
    //将编码转换成字符
    function utf8ToChar(str) {
        var iCode, iCode1, iCode2;
        iCode = parseInt("0x" + str.substr(1, 2));
        iCode1 = parseInt("0x" + str.substr(4, 2));
        iCode2 = parseInt("0x" + str.substr(7, 2));
        return String.fromCharCode(((iCode & 0x0F) << 12) | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F));
    }

    owner.getCharFromUtf8 = getCharFromUtf8;

    
    /**
     * 计算岁数
     * @param birthdate 形式如yyyy-MM-dd
     */
    app.calculateAge = function (birthdate) {
        var birthYear = birthdate.substring(0, 4);
        var thisYear = new Date().getFullYear();;
        return thisYear - birthYear;
    }
    //计算天数差的函数，通用  
    app.calculateDay = function (startDate,  endDate){    //sDate1和sDate2是2006-12-18格式  
       if(!startDate){
    	   startDate = app.formatDateFormat(new Date(),"yyyy-MM-dd");
       }
       var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
       var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
       var dates = Math.abs((startTime - endTime))/(1000*60*60*24);  
       return  dates;  
    }    
    //格式化日期
    app.formatDateFormat =  function (date,format){//格式化日期
        var paddNum = function(num){
          num += "";
          return num.replace(/^(\d)$/,"0$1");
        }
        //指定格式字符
        var cfg = {
           yyyy : date.getFullYear() //年 : 4位
          ,yy : date.getFullYear().toString().substring(2)//年 : 2位
          ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
          ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
          ,d  : date.getDate()   //日 : 如果1位的时候不补0
          ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
          ,hh : date.getHours()  //时
          ,mm : date.getMinutes() //分
          ,ss : date.getSeconds() //秒
        }
        format || (format = "yyyy-MM-dd hh:mm:ss");
        return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
      } 

    /**
     * 判断是否为空，前后会去空格，参数是string，前后去空格，参数是数组，则取第一个，再进行object和string的判断，如果是object，则取object.value再判断
     * @param
     */
    app.isBlank = function (param) {
        if (!param) {
            return true;
        }
        if ($.isArray(param)) {
            param = param[0];
        }
        if (typeof param == 'object') {
            param = param.value;
        }
        param = param.trim();
        if (param) {
            return false;
        }
        return true;
    }

    /**
     * 返回angular的$scope对象
     */
    app.getAngularScope = function (controllerName) {
        var appElement = document.querySelector('[ng-controller=' + controllerName + ']');
        var $scope = angular.element(appElement).scope();
        return $scope;
    }
    
    /*
	** randomWord 产生任意长度随机字母数字组合
	** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
	** xuanfeng 2014-08-28
	*/
	 
	app.randomWord = function (randomFlag, min, max){
	    var str = "",
	    range = min,
	    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	 
	    // 随机产生
	    if(randomFlag){
	        range = Math.round(Math.random() * (max-min)) + min;
	    }
	    for(var i=0; i<range; i++){
	        pos = Math.round(Math.random() * (arr.length-1));
	        str += arr[pos];
	    }
	    return str.toUpperCase();
	}
	
	/**
	 * 获取yyyyMMddHHmmss格式时间
	 */
	app.getFormatDate = function(){
		var time = new Date();
		var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var strDate = time.getDate();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        var milliseconds = time.getMilliseconds();
        var seperator1 = "-";
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate + seperator1 
        	+ hours + seperator1 + minutes + seperator1 + seconds + seperator1 + milliseconds;
		return currentdate.replace(/\-/g,"");
	}

    

}(mui, window.app = (window.app || {})));