/*
*= require jquery_cookie.js
*= require_self
*/

$(function(){ 
	if(!$.cookie("visits")){
		$.cookie('visits', 0, { expires: 365, path: '/' });
	} else {
		var visits = parseInt($.cookie("visits"));
		$.cookie('visits', (visits + 1), { expires: 365, path: '/' });
		if( visits == 5 && "social_share" in window){
			social_share(true);
		} else if (visits > 5 && (visits % 10) == 0 && "social_share" in window){
			social_share(true);
		}
	}
});