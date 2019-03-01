var CONFIG = window.CONFIG || {};
var app = window.app || {};
(function (mui) {
	
    app.CACHED_REGISTRATION_INFO_KEY_NAME = "registration_info";    
    var stateText = localStorage.getItem(app.CACHED_REGISTRATION_INFO_KEY_NAME) || "{}";    
        
    CONFIG.basePath = "/examination";
   
})(mui);

(function ($) {
	var stateText = localStorage.getItem(app.CACHED_REGISTRATION_INFO_KEY_NAME) || "{}";
    var state = JSON.parse(stateText);
    app.STATE = state;
    
    
    /**
     * 获取当前缓存对象
     **/
    app.getState = function () {
        return app.STATE;
    };
    /**
     * 设置当前缓存对象
     **/
    app.setState = function (state) {
        state = state || {};
        localStorage.setItem(app.CACHED_REGISTRATION_INFO_KEY_NAME, JSON.stringify(state));
        app.STATE = state;
    };
    
    
})(mui);	

