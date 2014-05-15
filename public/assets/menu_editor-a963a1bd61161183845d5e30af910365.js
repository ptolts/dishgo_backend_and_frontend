/**
 * jquery.Jcrop.min.js v0.9.12 (build:20130202)
 * jQuery Image Cropping Plugin - released under MIT License
 * Copyright (c) 2008-2013 Tapmodo Interactive LLC
 * https://github.com/tapmodo/Jcrop
 */

(function(a){a.Jcrop=function(b,c){function i(a){return Math.round(a)+"px"}function j(a){return d.baseClass+"-"+a}function k(){return a.fx.step.hasOwnProperty("backgroundColor")}function l(b){var c=a(b).offset();return[c.left,c.top]}function m(a){return[a.pageX-e[0],a.pageY-e[1]]}function n(b){typeof b!="object"&&(b={}),d=a.extend(d,b),a.each(["onChange","onSelect","onRelease","onDblClick"],function(a,b){typeof d[b]!="function"&&(d[b]=function(){})})}function o(a,b,c){e=l(D),bc.setCursor(a==="move"?a:a+"-resize");if(a==="move")return bc.activateHandlers(q(b),v,c);var d=_.getFixed(),f=r(a),g=_.getCorner(r(f));_.setPressed(_.getCorner(f)),_.setCurrent(g),bc.activateHandlers(p(a,d),v,c)}function p(a,b){return function(c){if(!d.aspectRatio)switch(a){case"e":c[1]=b.y2;break;case"w":c[1]=b.y2;break;case"n":c[0]=b.x2;break;case"s":c[0]=b.x2}else switch(a){case"e":c[1]=b.y+1;break;case"w":c[1]=b.y+1;break;case"n":c[0]=b.x+1;break;case"s":c[0]=b.x+1}_.setCurrent(c),bb.update()}}function q(a){var b=a;return bd.watchKeys
(),function(a){_.moveOffset([a[0]-b[0],a[1]-b[1]]),b=a,bb.update()}}function r(a){switch(a){case"n":return"sw";case"s":return"nw";case"e":return"nw";case"w":return"ne";case"ne":return"sw";case"nw":return"se";case"se":return"nw";case"sw":return"ne"}}function s(a){return function(b){return d.disabled?!1:a==="move"&&!d.allowMove?!1:(e=l(D),W=!0,o(a,m(b)),b.stopPropagation(),b.preventDefault(),!1)}}function t(a,b,c){var d=a.width(),e=a.height();d>b&&b>0&&(d=b,e=b/a.width()*a.height()),e>c&&c>0&&(e=c,d=c/a.height()*a.width()),T=a.width()/d,U=a.height()/e,a.width(d).height(e)}function u(a){return{x:a.x*T,y:a.y*U,x2:a.x2*T,y2:a.y2*U,w:a.w*T,h:a.h*U}}function v(a){var b=_.getFixed();b.w>d.minSelect[0]&&b.h>d.minSelect[1]?(bb.enableHandles(),bb.done()):bb.release(),bc.setCursor(d.allowSelect?"crosshair":"default")}function w(a){if(d.disabled)return!1;if(!d.allowSelect)return!1;W=!0,e=l(D),bb.disableHandles(),bc.setCursor("crosshair");var b=m(a);return _.setPressed(b),bb.update(),bc.activateHandlers(x,v,a.type.substring
(0,5)==="touch"),bd.watchKeys(),a.stopPropagation(),a.preventDefault(),!1}function x(a){_.setCurrent(a),bb.update()}function y(){var b=a("<div></div>").addClass(j("tracker"));return g&&b.css({opacity:0,backgroundColor:"white"}),b}function be(a){G.removeClass().addClass(j("holder")).addClass(a)}function bf(a,b){function t(){window.setTimeout(u,l)}var c=a[0]/T,e=a[1]/U,f=a[2]/T,g=a[3]/U;if(X)return;var h=_.flipCoords(c,e,f,g),i=_.getFixed(),j=[i.x,i.y,i.x2,i.y2],k=j,l=d.animationDelay,m=h[0]-j[0],n=h[1]-j[1],o=h[2]-j[2],p=h[3]-j[3],q=0,r=d.swingSpeed;c=k[0],e=k[1],f=k[2],g=k[3],bb.animMode(!0);var s,u=function(){return function(){q+=(100-q)/r,k[0]=Math.round(c+q/100*m),k[1]=Math.round(e+q/100*n),k[2]=Math.round(f+q/100*o),k[3]=Math.round(g+q/100*p),q>=99.8&&(q=100),q<100?(bh(k),t()):(bb.done(),bb.animMode(!1),typeof b=="function"&&b.call(bs))}}();t()}function bg(a){bh([a[0]/T,a[1]/U,a[2]/T,a[3]/U]),d.onSelect.call(bs,u(_.getFixed())),bb.enableHandles()}function bh(a){_.setPressed([a[0],a[1]]),_.setCurrent([a[2],
a[3]]),bb.update()}function bi(){return u(_.getFixed())}function bj(){return _.getFixed()}function bk(a){n(a),br()}function bl(){d.disabled=!0,bb.disableHandles(),bb.setCursor("default"),bc.setCursor("default")}function bm(){d.disabled=!1,br()}function bn(){bb.done(),bc.activateHandlers(null,null)}function bo(){G.remove(),A.show(),A.css("visibility","visible"),a(b).removeData("Jcrop")}function bp(a,b){bb.release(),bl();var c=new Image;c.onload=function(){var e=c.width,f=c.height,g=d.boxWidth,h=d.boxHeight;D.width(e).height(f),D.attr("src",a),H.attr("src",a),t(D,g,h),E=D.width(),F=D.height(),H.width(E).height(F),M.width(E+L*2).height(F+L*2),G.width(E).height(F),ba.resize(E,F),bm(),typeof b=="function"&&b.call(bs)},c.src=a}function bq(a,b,c){var e=b||d.bgColor;d.bgFade&&k()&&d.fadeTime&&!c?a.animate({backgroundColor:e},{queue:!1,duration:d.fadeTime}):a.css("backgroundColor",e)}function br(a){d.allowResize?a?bb.enableOnly():bb.enableHandles():bb.disableHandles(),bc.setCursor(d.allowSelect?"crosshair":"default"),bb
.setCursor(d.allowMove?"move":"default"),d.hasOwnProperty("trueSize")&&(T=d.trueSize[0]/E,U=d.trueSize[1]/F),d.hasOwnProperty("setSelect")&&(bg(d.setSelect),bb.done(),delete d.setSelect),ba.refresh(),d.bgColor!=N&&(bq(d.shade?ba.getShades():G,d.shade?d.shadeColor||d.bgColor:d.bgColor),N=d.bgColor),O!=d.bgOpacity&&(O=d.bgOpacity,d.shade?ba.refresh():bb.setBgOpacity(O)),P=d.maxSize[0]||0,Q=d.maxSize[1]||0,R=d.minSize[0]||0,S=d.minSize[1]||0,d.hasOwnProperty("outerImage")&&(D.attr("src",d.outerImage),delete d.outerImage),bb.refresh()}var d=a.extend({},a.Jcrop.defaults),e,f=navigator.userAgent.toLowerCase(),g=/msie/.test(f),h=/msie [1-6]\./.test(f);typeof b!="object"&&(b=a(b)[0]),typeof c!="object"&&(c={}),n(c);var z={border:"none",visibility:"visible",margin:0,padding:0,position:"absolute",top:0,left:0},A=a(b),B=!0;if(b.tagName=="IMG"){if(A[0].width!=0&&A[0].height!=0)A.width(A[0].width),A.height(A[0].height);else{var C=new Image;C.src=A[0].src,A.width(C.width),A.height(C.height)}var D=A.clone().removeAttr("id").
css(z).show();D.width(A.width()),D.height(A.height()),A.after(D).hide()}else D=A.css(z).show(),B=!1,d.shade===null&&(d.shade=!0);t(D,d.boxWidth,d.boxHeight);var E=D.width(),F=D.height(),G=a("<div />").width(E).height(F).addClass(j("holder")).css({position:"relative",backgroundColor:d.bgColor}).insertAfter(A).append(D);d.addClass&&G.addClass(d.addClass);var H=a("<div />"),I=a("<div />").width("100%").height("100%").css({zIndex:310,position:"absolute",overflow:"hidden"}),J=a("<div />").width("100%").height("100%").css("zIndex",320),K=a("<div />").css({position:"absolute",zIndex:600}).dblclick(function(){var a=_.getFixed();d.onDblClick.call(bs,a)}).insertBefore(D).append(I,J);B&&(H=a("<img />").attr("src",D.attr("src")).css(z).width(E).height(F),I.append(H)),h&&K.css({overflowY:"hidden"});var L=d.boundary,M=y().width(E+L*2).height(F+L*2).css({position:"absolute",top:i(-L),left:i(-L),zIndex:290}).mousedown(w),N=d.bgColor,O=d.bgOpacity,P,Q,R,S,T,U,V=!0,W,X,Y;e=l(D);var Z=function(){function a(){var a={},b=["touchstart"
,"touchmove","touchend"],c=document.createElement("div"),d;try{for(d=0;d<b.length;d++){var e=b[d];e="on"+e;var f=e in c;f||(c.setAttribute(e,"return;"),f=typeof c[e]=="function"),a[b[d]]=f}return a.touchstart&&a.touchend&&a.touchmove}catch(g){return!1}}function b(){return d.touchSupport===!0||d.touchSupport===!1?d.touchSupport:a()}return{createDragger:function(a){return function(b){return d.disabled?!1:a==="move"&&!d.allowMove?!1:(e=l(D),W=!0,o(a,m(Z.cfilter(b)),!0),b.stopPropagation(),b.preventDefault(),!1)}},newSelection:function(a){return w(Z.cfilter(a))},cfilter:function(a){return a.pageX=a.originalEvent.changedTouches[0].pageX,a.pageY=a.originalEvent.changedTouches[0].pageY,a},isSupported:a,support:b()}}(),_=function(){function h(d){d=n(d),c=a=d[0],e=b=d[1]}function i(a){a=n(a),f=a[0]-c,g=a[1]-e,c=a[0],e=a[1]}function j(){return[f,g]}function k(d){var f=d[0],g=d[1];0>a+f&&(f-=f+a),0>b+g&&(g-=g+b),F<e+g&&(g+=F-(e+g)),E<c+f&&(f+=E-(c+f)),a+=f,c+=f,b+=g,e+=g}function l(a){var b=m();switch(a){case"ne":return[
b.x2,b.y];case"nw":return[b.x,b.y];case"se":return[b.x2,b.y2];case"sw":return[b.x,b.y2]}}function m(){if(!d.aspectRatio)return p();var f=d.aspectRatio,g=d.minSize[0]/T,h=d.maxSize[0]/T,i=d.maxSize[1]/U,j=c-a,k=e-b,l=Math.abs(j),m=Math.abs(k),n=l/m,r,s,t,u;return h===0&&(h=E*10),i===0&&(i=F*10),n<f?(s=e,t=m*f,r=j<0?a-t:t+a,r<0?(r=0,u=Math.abs((r-a)/f),s=k<0?b-u:u+b):r>E&&(r=E,u=Math.abs((r-a)/f),s=k<0?b-u:u+b)):(r=c,u=l/f,s=k<0?b-u:b+u,s<0?(s=0,t=Math.abs((s-b)*f),r=j<0?a-t:t+a):s>F&&(s=F,t=Math.abs(s-b)*f,r=j<0?a-t:t+a)),r>a?(r-a<g?r=a+g:r-a>h&&(r=a+h),s>b?s=b+(r-a)/f:s=b-(r-a)/f):r<a&&(a-r<g?r=a-g:a-r>h&&(r=a-h),s>b?s=b+(a-r)/f:s=b-(a-r)/f),r<0?(a-=r,r=0):r>E&&(a-=r-E,r=E),s<0?(b-=s,s=0):s>F&&(b-=s-F,s=F),q(o(a,b,r,s))}function n(a){return a[0]<0&&(a[0]=0),a[1]<0&&(a[1]=0),a[0]>E&&(a[0]=E),a[1]>F&&(a[1]=F),[Math.round(a[0]),Math.round(a[1])]}function o(a,b,c,d){var e=a,f=c,g=b,h=d;return c<a&&(e=c,f=a),d<b&&(g=d,h=b),[e,g,f,h]}function p(){var d=c-a,f=e-b,g;return P&&Math.abs(d)>P&&(c=d>0?a+P:a-P),Q&&Math.abs
(f)>Q&&(e=f>0?b+Q:b-Q),S/U&&Math.abs(f)<S/U&&(e=f>0?b+S/U:b-S/U),R/T&&Math.abs(d)<R/T&&(c=d>0?a+R/T:a-R/T),a<0&&(c-=a,a-=a),b<0&&(e-=b,b-=b),c<0&&(a-=c,c-=c),e<0&&(b-=e,e-=e),c>E&&(g=c-E,a-=g,c-=g),e>F&&(g=e-F,b-=g,e-=g),a>E&&(g=a-F,e-=g,b-=g),b>F&&(g=b-F,e-=g,b-=g),q(o(a,b,c,e))}function q(a){return{x:a[0],y:a[1],x2:a[2],y2:a[3],w:a[2]-a[0],h:a[3]-a[1]}}var a=0,b=0,c=0,e=0,f,g;return{flipCoords:o,setPressed:h,setCurrent:i,getOffset:j,moveOffset:k,getCorner:l,getFixed:m}}(),ba=function(){function f(a,b){e.left.css({height:i(b)}),e.right.css({height:i(b)})}function g(){return h(_.getFixed())}function h(a){e.top.css({left:i(a.x),width:i(a.w),height:i(a.y)}),e.bottom.css({top:i(a.y2),left:i(a.x),width:i(a.w),height:i(F-a.y2)}),e.right.css({left:i(a.x2),width:i(E-a.x2)}),e.left.css({width:i(a.x)})}function j(){return a("<div />").css({position:"absolute",backgroundColor:d.shadeColor||d.bgColor}).appendTo(c)}function k(){b||(b=!0,c.insertBefore(D),g(),bb.setBgOpacity(1,0,1),H.hide(),l(d.shadeColor||d.bgColor,1),bb.
isAwake()?n(d.bgOpacity,1):n(1,1))}function l(a,b){bq(p(),a,b)}function m(){b&&(c.remove(),H.show(),b=!1,bb.isAwake()?bb.setBgOpacity(d.bgOpacity,1,1):(bb.setBgOpacity(1,1,1),bb.disableHandles()),bq(G,0,1))}function n(a,e){b&&(d.bgFade&&!e?c.animate({opacity:1-a},{queue:!1,duration:d.fadeTime}):c.css({opacity:1-a}))}function o(){d.shade?k():m(),bb.isAwake()&&n(d.bgOpacity)}function p(){return c.children()}var b=!1,c=a("<div />").css({position:"absolute",zIndex:240,opacity:0}),e={top:j(),left:j().height(F),right:j().height(F),bottom:j()};return{update:g,updateRaw:h,getShades:p,setBgColor:l,enable:k,disable:m,resize:f,refresh:o,opacity:n}}(),bb=function(){function k(b){var c=a("<div />").css({position:"absolute",opacity:d.borderOpacity}).addClass(j(b));return I.append(c),c}function l(b,c){var d=a("<div />").mousedown(s(b)).css({cursor:b+"-resize",position:"absolute",zIndex:c}).addClass("ord-"+b);return Z.support&&d.bind("touchstart.jcrop",Z.createDragger(b)),J.append(d),d}function m(a){var b=d.handleSize,e=l(a,c++
).css({opacity:d.handleOpacity}).addClass(j("handle"));return b&&e.width(b).height(b),e}function n(a){return l(a,c++).addClass("jcrop-dragbar")}function o(a){var b;for(b=0;b<a.length;b++)g[a[b]]=n(a[b])}function p(a){var b,c;for(c=0;c<a.length;c++){switch(a[c]){case"n":b="hline";break;case"s":b="hline bottom";break;case"e":b="vline right";break;case"w":b="vline"}e[a[c]]=k(b)}}function q(a){var b;for(b=0;b<a.length;b++)f[a[b]]=m(a[b])}function r(a,b){d.shade||H.css({top:i(-b),left:i(-a)}),K.css({top:i(b),left:i(a)})}function t(a,b){K.width(Math.round(a)).height(Math.round(b))}function v(){var a=_.getFixed();_.setPressed([a.x,a.y]),_.setCurrent([a.x2,a.y2]),w()}function w(a){if(b)return x(a)}function x(a){var c=_.getFixed();t(c.w,c.h),r(c.x,c.y),d.shade&&ba.updateRaw(c),b||A(),a?d.onSelect.call(bs,u(c)):d.onChange.call(bs,u(c))}function z(a,c,e){if(!b&&!c)return;d.bgFade&&!e?D.animate({opacity:a},{queue:!1,duration:d.fadeTime}):D.css("opacity",a)}function A(){K.show(),d.shade?ba.opacity(O):z(O,!0),b=!0}function B
(){F(),K.hide(),d.shade?ba.opacity(1):z(1),b=!1,d.onRelease.call(bs)}function C(){h&&J.show()}function E(){h=!0;if(d.allowResize)return J.show(),!0}function F(){h=!1,J.hide()}function G(a){a?(X=!0,F()):(X=!1,E())}function L(){G(!1),v()}var b,c=370,e={},f={},g={},h=!1;d.dragEdges&&a.isArray(d.createDragbars)&&o(d.createDragbars),a.isArray(d.createHandles)&&q(d.createHandles),d.drawBorders&&a.isArray(d.createBorders)&&p(d.createBorders),a(document).bind("touchstart.jcrop-ios",function(b){a(b.currentTarget).hasClass("jcrop-tracker")&&b.stopPropagation()});var M=y().mousedown(s("move")).css({cursor:"move",position:"absolute",zIndex:360});return Z.support&&M.bind("touchstart.jcrop",Z.createDragger("move")),I.append(M),F(),{updateVisible:w,update:x,release:B,refresh:v,isAwake:function(){return b},setCursor:function(a){M.css("cursor",a)},enableHandles:E,enableOnly:function(){h=!0},showHandles:C,disableHandles:F,animMode:G,setBgOpacity:z,done:L}}(),bc=function(){function f(b){M.css({zIndex:450}),b?a(document).bind("touchmove.jcrop"
,k).bind("touchend.jcrop",l):e&&a(document).bind("mousemove.jcrop",h).bind("mouseup.jcrop",i)}function g(){M.css({zIndex:290}),a(document).unbind(".jcrop")}function h(a){return b(m(a)),!1}function i(a){return a.preventDefault(),a.stopPropagation(),W&&(W=!1,c(m(a)),bb.isAwake()&&d.onSelect.call(bs,u(_.getFixed())),g(),b=function(){},c=function(){}),!1}function j(a,d,e){return W=!0,b=a,c=d,f(e),!1}function k(a){return b(m(Z.cfilter(a))),!1}function l(a){return i(Z.cfilter(a))}function n(a){M.css("cursor",a)}var b=function(){},c=function(){},e=d.trackDocument;return e||M.mousemove(h).mouseup(i).mouseout(i),D.before(M),{activateHandlers:j,setCursor:n}}(),bd=function(){function e(){d.keySupport&&(b.show(),b.focus())}function f(a){b.hide()}function g(a,b,c){d.allowMove&&(_.moveOffset([b,c]),bb.updateVisible(!0)),a.preventDefault(),a.stopPropagation()}function i(a){if(a.ctrlKey||a.metaKey)return!0;Y=a.shiftKey?!0:!1;var b=Y?10:1;switch(a.keyCode){case 37:g(a,-b,0);break;case 39:g(a,b,0);break;case 38:g(a,0,-b);break;
case 40:g(a,0,b);break;case 27:d.allowSelect&&bb.release();break;case 9:return!0}return!1}var b=a('<input type="radio" />').css({position:"fixed",left:"-120px",width:"12px"}).addClass("jcrop-keymgr"),c=a("<div />").css({position:"absolute",overflow:"hidden"}).append(b);return d.keySupport&&(b.keydown(i).blur(f),h||!d.fixedSupport?(b.css({position:"absolute",left:"-20px"}),c.append(b).insertBefore(D)):b.insertBefore(D)),{watchKeys:e}}();Z.support&&M.bind("touchstart.jcrop",Z.newSelection),J.hide(),br(!0);var bs={setImage:bp,animateTo:bf,setSelect:bg,setOptions:bk,tellSelect:bi,tellScaled:bj,setClass:be,disable:bl,enable:bm,cancel:bn,release:bb.release,destroy:bo,focus:bd.watchKeys,getBounds:function(){return[E*T,F*U]},getWidgetSize:function(){return[E,F]},getScaleFactor:function(){return[T,U]},getOptions:function(){return d},ui:{holder:G,selection:K}};return g&&G.bind("selectstart",function(){return!1}),A.data("Jcrop",bs),bs},a.fn.Jcrop=function(b,c){var d;return this.each(function(){if(a(this).data("Jcrop")){if(
b==="api")return a(this).data("Jcrop");a(this).data("Jcrop").setOptions(b)}else this.tagName=="IMG"?a.Jcrop.Loader(this,function(){a(this).css({display:"block",visibility:"hidden"}),d=a.Jcrop(this,b),a.isFunction(c)&&c.call(d)}):(a(this).css({display:"block",visibility:"hidden"}),d=a.Jcrop(this,b),a.isFunction(c)&&c.call(d))}),this},a.Jcrop.Loader=function(b,c,d){function g(){f.complete?(e.unbind(".jcloader"),a.isFunction(c)&&c.call(f)):window.setTimeout(g,50)}var e=a(b),f=e[0];e.bind("load.jcloader",g).bind("error.jcloader",function(b){e.unbind(".jcloader"),a.isFunction(d)&&d.call(f)}),f.complete&&a.isFunction(c)&&(e.unbind(".jcloader"),c.call(f))},a.Jcrop.defaults={allowSelect:!0,allowMove:!0,allowResize:!0,trackDocument:!0,baseClass:"jcrop",addClass:null,bgColor:"black",bgOpacity:.6,bgFade:!1,borderOpacity:.4,handleOpacity:.5,handleSize:null,aspectRatio:0,keySupport:!0,createHandles:["n","s","e","w","nw","ne","se","sw"],createDragbars:["n","s","e","w"],createBorders:["n","s","e","w"],drawBorders:!0,dragEdges
:!0,fixedSupport:!0,touchSupport:null,shade:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onDblClick:function(){},onRelease:function(){}}})(jQuery);
/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: mb.bgndGallery.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 01/02/14 14.41
 *  *****************************************************************************
 */

/*Browser detection patch*/

if (!jQuery.browser) {
	jQuery.browser = {}, jQuery.browser.mozilla = !1, jQuery.browser.webkit = !1, jQuery.browser.opera = !1, jQuery.browser.safari = !1, jQuery.browser.chrome = !1, jQuery.browser.msie = !1;
	var nAgt = navigator.userAgent;
	jQuery.browser.ua = nAgt, jQuery.browser.name = navigator.appName, jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;
	if (-1 != (verOffset = nAgt.indexOf("Opera")))jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 6), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)); else if (-1 != (verOffset = nAgt.indexOf("MSIE")))jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer", jQuery.browser.fullVersion = nAgt.substring(verOffset + 5); else if (-1 != nAgt.indexOf("Trident")) {
		jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer";
		var start = nAgt.indexOf("rv:") + 3, end = start + 4;
		jQuery.browser.fullVersion = nAgt.substring(start, end)
	} else-1 != (verOffset = nAgt.indexOf("Chrome")) ? (jQuery.browser.webkit = !0, jQuery.browser.chrome = !0, jQuery.browser.name = "Chrome", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 != (verOffset = nAgt.indexOf("Safari")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("AppleWebkit")) ? (jQuery.browser.webkit = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("Firefox")) ? (jQuery.browser.mozilla = !0, jQuery.browser.name = "Firefox", jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)) : (nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")) && (jQuery.browser.name = nAgt.substring(nameOffset, verOffset), jQuery.browser.fullVersion = nAgt.substring(verOffset + 1), jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() && (jQuery.browser.name = navigator.appName));
	-1 != (ix = jQuery.browser.fullVersion.indexOf(";")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)), -1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)), jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10), isNaN(jQuery.browser.majorVersion) && (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10)), jQuery.browser.version = jQuery.browser.majorVersion
}

/*
 *   jquery.mb.components
 *  file: jquery.mb.CSSAnimate.js
 */

/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.CSSAnimate.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 09/06/13 17.08
 *  *****************************************************************************
 */

/*
 * version: 1.6.1
 *  params:

 @opt        -> the CSS object (ex: {top:300, left:400, ...})
 @duration   -> an int for the animation duration in milliseconds
 @delay      -> an int for the animation delay in milliseconds
 @ease       -> ease  ||  linear || ease-in || ease-out || ease-in-out  ||  cubic-bezier(<number>, <number>,  <number>,  <number>)
 @callback   -> a callback function called once the transition end

 example:

 jQuery(this).CSSAnimate({top:t, left:l, width:w, height:h, transform: 'rotate(50deg) scale(.8)'}, 2000, 100, "ease-out", callback;})
 */
jQuery.fn.CSSAnimate=function(a,f,k,m,e){return this.each(function(){var b=jQuery(this);this.id=this.id||"CSSA_"+(new Date).getTime();if(0!==b.length&&a){"function"==typeof f&&(e=f,f=jQuery.fx.speeds._default);"function"==typeof k&&(e=k,k=0);"function"==typeof m&&(e=m,m="cubic-bezier(0.65,0.03,0.36,0.72)");if("string"==typeof f)for(var l in jQuery.fx.speeds)if(f==l){f=jQuery.fx.speeds[l];break}else f=null;if(jQuery.support.transition){var d="",j="transitionEnd";jQuery.browser.webkit?(d="-webkit-", j="webkitTransitionEnd"):jQuery.browser.mozilla?(d="-moz-",j="transitionend"):jQuery.browser.opera?(d="-o-",j="otransitionend"):jQuery.browser.msie&&(d="-ms-",j="msTransitionEnd");l=[];for(c in a){var g=c;"transform"===g&&(g=d+"transform",a[g]=a[c],delete a[c]);"filter"===g&&(g=d+"filter",a[g]=a[c],delete a[c]);"transform-origin"===g&&(g=d+"transform-origin",a[g]=a[c],delete a[c]);l.push(g)}var c=l.join(","),n=function(){b.off(j+"."+b.get(0).id);clearTimeout(b.get(0).timeout);b.css(d+"transition", "");"function"==typeof e&&(b.called=!0,e(b))},h={};$.extend(h,a);h[d+"transition-property"]=c;h[d+"transition-duration"]=f+"ms";h[d+"transition-delay"]=k+"ms";h[d+"transition-timing-function"]=m;h[d+"backface-visibility"]="hidden";setTimeout(function(){b.css(h);b.one(j+"."+b.get(0).id,n)},1);b.get(0).timeout=setTimeout(function(){b.called||!e?b.called=!1:(b.css(d+"transition",""),e(b))},f+k+100)}else{for(var c in a)"transform"===c&&delete a[c],"transform-origin"===c&&delete a[c],"auto"===a[c]&&delete a[c]; if(!e||"string"===typeof e)e="linear";b.animate(a,f,e)}}})};jQuery.support.transition=function(){var a=(document.body||document.documentElement).style;return void 0!==a.transition||void 0!==a.WebkitTransition||void 0!==a.MozTransition||void 0!==a.MsTransition||void 0!==a.OTransition}();

(function($){

	$.mbBgndGallery ={
		name:"mb.bgndGallery",
		author:"Matteo Bicocchi",
		version:"1.8.7",
		defaults:{
			containment:"body",
			images:[],
			shuffle:false,
			controls:null,
			effect:"fade",
			timer:4000,
			effTimer:3000,
			raster:false, //"inc/raster.png"
			folderPath:false,
			autoStart:true,
			grayScale:false,
			activateKeyboard:true,
			preserveTop:false,
			preserveWidth:false,
			placeHolder:"",

			//Path to the folder containing the thumbnails and ID of the DOM element that should contains them.
			// Thumbnail should have the same name of the corresponding image
			thumbs:{folderPath:"", placeholder:""},

			onStart:function(){},
			onChange:function(opt,idx){},
			onPause:function(opt){},
			onPlay:function(opt){},
			onNext:function(opt){},
			onPrev:function(opt){}
			// idx = the zero based index of the displayed photo
			// opt=the options relatives to this component instance you can manipulate on the specific event

			// for example, if you want to reverse the enter/exit effect once the previous button is clicked:
			// you can change the opt.effect onPrev event : opt.effect = "slideRight"
			// onNext:function(opt){opt.effect = "slideLeft"}
			// onPrev:function(opt){opt.effect = "slideRight"}

		},
		clear:false,

		buildGallery:function(options){
			var opt = {};
			$.extend(opt, $.mbBgndGallery.defaults,options);
			opt.galleryID= new Date().getTime();
			var el= $(opt.containment).get(0);
			el.opt= opt;
			$.mbBgndGallery.el = el;
			if(el.opt.onStart)
				el.opt.onStart();

			el.opt.gallery= $("<div/>").attr({id:"bgndGallery_"+el.opt.galleryID}).addClass("mbBgndGallery");
			var pos= el.opt.containment=="body"?"fixed":"absolute";
			el.opt.gallery.css({
				position: pos,
				top: 0, left: 0,
				'z-index': -10,
				width: "100%",
				height: "100%",
				overflow: "hidden",
				backfaceVisibility:"hidden",
				webkitBackfaceVisibility:"hidden",
				mozBackfaceVisibility:"hidden",
				msBackfaceVisibility:"hidden"
			});

			var containment = el.opt.containment;

			if(containment !="body" && $(containment).text().trim()!=""){
				var wrapper=$("<div/>").css({"position":"absolute",minHeight:"100%", minWidth:"100%", zIndex:3});
				$(containment).wrapInner(wrapper);
				if($(containment).css("position")=="static")
					$(containment).css("position","relative");
			}
			if(opt.raster){
				var raster=$("<div/>").css({position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"url("+opt.raster+")",zIndex:1});
				opt.gallery.append(raster);
			}

			$(containment).prepend(opt.gallery);

			if(el.opt.folderPath && el.opt.images.length==0)
				el.opt.images = jQuery.loadFromSystem(el.opt.folderPath);


			if(el.opt.shuffle)
				el.opt.images= $.shuffle(el.opt.images);

			var totImg= el.opt.images.length;

			var loadCounter=0;

			$.mbBgndGallery.preload(el.opt.images[0],el);
			el.opt.gallery.on("imageLoaded."+el.opt.galleryID,function(){
				loadCounter++;
				if(loadCounter==totImg){
					el.opt.gallery.off("imageLoaded."+el.opt.galleryID);
					return;
				}
				$.mbBgndGallery.preload(el.opt.images[loadCounter],el);
			});

			el.opt.imageCounter=0;

			$.mbBgndGallery.changePhoto(el.opt.images[el.opt.imageCounter],el);

			if (!opt.autoStart){
				el.opt.paused=true;
				$(el.opt.gallery).trigger("paused");
			}

			el.opt.gallery.on("imageReady."+el.opt.galleryID,function(){

				if(el.opt.paused)
					return;

				clearTimeout(el.opt.changing);

				$.mbBgndGallery.play(el);
			});

			$(window).on("resize",function(){
				var image=$("img",el.opt.gallery);
				$.mbBgndGallery.checkSize(image,el);
			});

			var controls = el.opt.controls;
			if(controls){
				var counter=$(el.opt.controls).find(".counter");
				counter.html(el.opt.imageCounter+1+" / "+el.opt.images.length);

				$.mbBgndGallery.buildControls(controls,el);
				$(el.opt.containment).on("paused",function(){
					$(el.opt.controls).find(".play").show();
					$(el.opt.controls).find(".pause").hide();
				});
				$(el.opt.containment).on("play",function(){
					$(el.opt.controls).find(".play").hide();
					$(el.opt.controls).find(".pause").show();
				});
			}

			//	if(el.opt.thumbs.folderPath.trim().length > 0 && el.opt.thumbs.placeholder.trim().length > 0)
			$.mbBgndGallery.buildThumbs(el);

			return $(el);

		},

		normalizeCss:function(opt){
			var newOpt = jQuery.extend(true, {}, opt);
			var sfx = "";
			var transitionEnd = "transitionEnd";
			if ($.browser.webkit) {
				sfx = "-webkit-";
				transitionEnd = "webkitTransitionEnd";
			} else if ($.browser.mozilla) {
				sfx = "-moz-";
				transitionEnd = "transitionend";
			} else if ($.browser.opera) {
				sfx = "-o-";
				transitionEnd = "oTransitionEnd";
			} else if ($.browser.msie) {
				sfx = "-ms-";
				transitionEnd = "msTransitionEnd";
			}

			for(var o in newOpt){
				if (o==="transform"){
					newOpt[sfx+"transform"]=newOpt[o];
					delete newOpt[o];
				}

				if (o==="transform-origin"){
					newOpt[sfx+"transform-origin"]=opt[o];
					delete newOpt[o];
				}

				if (o==="filter"){
					newOpt[sfx+"filter"]=opt[o];
					delete newOpt[o];
				}
			}
			return newOpt;
		},

		preload:function(url,el){
			if($.mbBgndGallery.clear){
				el.opt.gallery.remove();
				return;
			}

			var img= $("<img/>").load(function(){
				el.opt.gallery.trigger("imageLoaded."+el.opt.galleryID);
			}).attr("src",url);
		},

		checkSize:function(image,el){
			if(!image)
				return;

			if($.mbBgndGallery.changing)
				return;

			if($.mbBgndGallery.clear){
				el.opt.gallery.remove();
				return;
			}

			return image.each(function(){
				var image=$(this);
				var w= image.attr("w");
				var h= image.attr("h");

				var containment = el.opt.containment == "body"? window : el.opt.containment;
				var aspectRatio= w/h;
				var wAspectRatio=$(containment).width()/$(containment).height();
				if(aspectRatio>=wAspectRatio){
					image.css("height","100%");
					image.css("width","auto");
				} else{
					image.css("width","100%");
					image.css("height","auto");
				}
				image.css("margin-left",(($(containment).width()-image.width())/2));

				if(!el.opt.preserveTop)
					image.css("margin-top",(($(containment).height()-image.height())/2));

				if(el.opt.preserveWidth){
					image.css({width:"100%", height:"auto", left:0, marginLeft:0});
				}
			});
		},

		changePhoto:function(url,el){

			if($.mbBgndGallery.clear){
				el.opt.gallery.remove();
				return;
			}

			$.mbBgndGallery.buildThumbs(el);

			if(el.opt.thumbs.folderPath.trim().length > 0 && el.opt.thumbs.placeholder.trim().length > 0){
				$(".sel", $(el.opt.thumbs.placeholder)).removeClass("sel");
				$("#mbBgImg_"+el.opt.imageCounter).addClass("sel");
			}

			$.mbBgndGallery.changing=true;

			if(el.opt.onChange)
				el.opt.onChange(el.opt, el.opt.imageCounter);

			var image=$("<img/>").hide().load(function(){
				var image=$(this);

				var tmp=$("<div/>").css({position:"absolute",top:-5000});
				tmp.append(image);
				$("body").append(tmp);
				image.attr("w", image.width());
				image.attr("h", image.height());
				tmp.remove();

				el.opt.effect = typeof el.opt.effect == "object" ? el.opt.effect : $.mbBgndGallery.effects[el.opt.effect];

				$("img", el.opt.gallery).CSSAnimate(el.opt.effect.exit,el.opt.effTimer,0,el.opt.effect.exitTiming,function(el){
					if(el.length)
						el.remove();
				});
				image.css({position:"absolute"});
				el.opt.gallery.append(image);

				//todo: add a property to let height for vertical images
				$.mbBgndGallery.changing=false;
				$.mbBgndGallery.checkSize(image, el);

				var displayProperties = {top: 0, left: 0, opacity: 1, transform: "scale(1) rotate(0deg)", filter: " blur(0)"};
				displayProperties = $.mbBgndGallery.normalizeCss(displayProperties);

				image.css($.mbBgndGallery.normalizeCss(el.opt.effect.enter)).show().CSSAnimate(displayProperties,el.opt.effTimer,0,el.opt.effect.enterTiming,function(){
					el.opt.gallery.trigger("imageReady."+el.opt.galleryID);
				});
			}).attr("src",url);

			image.error(function(){
				var image=$(this);
				image.attr("src", el.opt.placeHolder);
			})

			// if(el.opt.grayScale){
			// 	image.greyScale(el);

			// }

			var counter=$(el.opt.controls).find(".counter");
			counter.html(el.opt.imageCounter+1+" / "+el.opt.images.length);

		},

		play:function(el){

			clearTimeout(el.opt.changing);

			var imgToRemove = $("img", el.opt.gallery).not(":last");
			imgToRemove.remove();


			if($.mbBgndGallery.clear){
				el.opt.gallery.remove();
				return;
			}

			if(el.opt.onPlay)
				el.opt.onPlay(el.opt);

			el.opt.changing=setTimeout(function(){
				if(el.opt.paused)
					return;

				if(el.opt.onNext)
					el.opt.onNext(el.opt);

				if (el.opt.imageCounter>=el.opt.images.length-1)
					el.opt.imageCounter=-1;

				el.opt.imageCounter++;

				$.mbBgndGallery.changePhoto(el.opt.images[el.opt.imageCounter],$(el.opt.containment).get(0));
			},el.opt.paused?0:el.opt.timer);

			el.opt.gallery.trigger("play");

		},

		pause:function(el){
			if($.mbBgndGallery.clear){
				el.opt.gallery.remove();
				return;
			}

			clearTimeout(el.opt.changing);
			el.opt.paused=true;
			el.opt.gallery.trigger("paused");

			if(el.opt.onPause)
				el.opt.onPause(el.opt);
		},

		next:function(el){
			if($.mbBgndGallery.clear){
				el.opt.gallery.remove();
				return;
			}

			if(el.opt.onNext)
				el.opt.onNext(el.opt);

			$.mbBgndGallery.pause(el);
			if (el.opt.imageCounter==el.opt.images.length-1)
				el.opt.imageCounter=-1;

			el.opt.imageCounter++;

			$.mbBgndGallery.changePhoto(el.opt.images[el.opt.imageCounter],el);
			clearTimeout(el.opt.changing);
		},

		prev:function(el){
			if($.mbBgndGallery.clear){
				el.opt.gallery.remove();
				return;
			}

			if(el.opt.onPrev)
				el.opt.onPrev(el.opt);

			$.mbBgndGallery.pause(el);

			clearTimeout(el.opt.changing);
			if (el.opt.imageCounter==0)
				el.opt.imageCounter=el.opt.images.length;

			el.opt.imageCounter--;

			$.mbBgndGallery.changePhoto(el.opt.images[el.opt.imageCounter],el);
		},

		loader:{
			show:function(){},
			hide:function(){}
		},

		keyboard:function(el){
			$(document).on("keydown.bgndGallery",function(e){
				switch(e.keyCode){
					case 32:
						if(el.opt.paused){
							$.mbBgndGallery.play(el);
							el.opt.paused=false;
						}else{
							el.opt.paused=true;
							$.mbBgndGallery.pause(el);
						}
						e.preventDefault();
						break;
					case 39:
						$.mbBgndGallery.next(el);
						e.preventDefault();

						break;
					case 37:
						$.mbBgndGallery.prev(el);
						e.preventDefault();

						break;
				}
			})
		},

		buildControls:function(controls,el){
			var pause=$(controls).find(".pause");
			var play=$(controls).find(".play");
			var next=$(controls).find(".next");
			var prev=$(controls).find(".prev");
			var fullScreen =  $(controls).find(".fullscreen");

			if(($.browser.msie || $.browser.opera || 'ontouchstart' in window)){
				fullScreen.remove();
			}

			if(el.opt.autoStart)
				play.hide();

			pause.on("click",function(){
				$.mbBgndGallery.pause(el);
				$(this).hide();
				play.show();
			});

			play.on("click",function(){
				if(!el.opt.paused) return;
				clearTimeout(el.opt.changing);
				$.mbBgndGallery.play(el);
				el.opt.paused=false;
			});

			next.on("click",function(){
				$.mbBgndGallery.next(el);
				pause.hide();
				play.show();

			});

			prev.on("click",function(){
				$.mbBgndGallery.prev(el);
				pause.hide();
				play.show();
			});

			fullScreen.on("click",function(){
				$.mbBgndGallery.runFullscreen(el);
			});

			if(el.opt.activateKeyboard)
				$.mbBgndGallery.keyboard(el);
		},

		changeGallery:function(el,array){

			el.opt.gallery.fadeOut();

			$.mbBgndGallery.pause(el);

			el.opt.images=array;
			var images= el.opt.images;
			var totImg= images.length;
			var loadCounter=0;

			$.mbBgndGallery.preload(images[0],el);
			el.opt.gallery.on("imageLoaded."+el.opt.galleryID,function(){
				loadCounter++;
				if(loadCounter==totImg){
					el.opt.gallery.off("imageLoaded."+el.opt.galleryID);
					el.opt.gallery.fadeIn();
					$.mbBgndGallery.play(el);
					el.opt.paused=false;
					return;
				}
				$.mbBgndGallery.preload(images[loadCounter],el);
			});
			el.opt.imageCounter=0;

			//if(el.opt.thumbs.folderPath.trim().length > 0 && el.opt.thumbs.placeholder.trim().length > 0)
			$.mbBgndGallery.buildThumbs(el);

		},

		changeEffect:function(effect){
			$.mbBgndGallery.el.opt.effect = effect;
		},

		runFullscreen: function(el){
			var fullscreenchange = jQuery.browser.mozilla ? "mozfullscreenchange" : jQuery.browser.webkit ? "webkitfullscreenchange" : "fullscreenchange";
			jQuery(document).off(fullscreenchange);
			jQuery(document).on(fullscreenchange, function() {
				var isFullScreen = RunPrefixMethod(document, "IsFullScreen") || RunPrefixMethod(document, "FullScreen");

				if (!isFullScreen) {

					el.isFullscreen = false;

					$(".fullScreen_controls").remove();
					if(!$(el.opt.containment).is("body"))
						$(el.opt.containment).css({
							width: el.width,
							height: el.height,
							top: el.top,
							left: el.left,
							position: el.position
						});
					el.opt.gallery.css({background:"transparent"})
					var image=$("#bgndGallery_"+el.opt.galleryID+" img:first");

				}
				$.mbBgndGallery.checkSize(image,el);

			});

			if(el.isFullscreen){
				cancelFullscreen();
			}else{
				el.isFullscreen = true;

				if(!$(el.opt.containment).is("body")){
					el.width = $(el.opt.containment).css("width");
					el.height = $(el.opt.containment).css("height");
					el.top = $(el.opt.containment).css("top");
					el.left = $(el.opt.containment).css("left");
					el.position = $(el.opt.containment).css("position");
				}

				var controls = $(el.opt.controls).clone(true).addClass("fullScreen_controls").css({position:"absolute", zIndex:1000, bottom: 20, right:20});
				controls.find(".fullscreen").html("exit");
				el.opt.gallery.append(controls).css({background:"#000"});
				$(el.opt.containment).CSSAnimate({
					width:"100%",
					height: "100%",
					top:0,
					left:0,
					position:"absolute"
				});

				launchFullscreen(el.opt.gallery.get(0));

			}

			function RunPrefixMethod(obj, method) {
				var pfx = ["webkit", "moz", "ms", "o", ""];
				var p = 0, m, t;
				while (p < pfx.length && !obj[m]) {
					m = method;
					if (pfx[p] == "") {
						m = m.substr(0,1).toLowerCase() + m.substr(1);
					}
					m = pfx[p] + m;
					t = typeof obj[m];
					if (t != "undefined") {
						pfx = [pfx[p]];
						return (t == "function" ? obj[m]() : obj[m]);
					}
					p++;
				}
			}

			function launchFullscreen(element) {
				RunPrefixMethod(element, "RequestFullScreen");
			}

			function cancelFullscreen() {
				if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
					RunPrefixMethod(document, "CancelFullScreen");
				}
			}
		},

		buildThumbs: function(el){

			if(el.opt.thumbs.folderPath.trim().length == 0 && el.opt.thumbs.placeholder.trim().length == 0)
				return;

			function getImageName(path){
				return path.split("/").pop();
			}

			var thumbNumber = $(el.opt.thumbs.placeholder).children().length || 0;


			if(thumbNumber != el.opt.images.length){

				$(el.opt.thumbs.placeholder).empty()
				for (var i = 0; i < el.opt.images.length; i++){

					var imgSrc = el.opt.thumbs.folderPath + getImageName(el.opt.images[i]);

					var img=$("<img/>").attr({"src":imgSrc, id: "mbBgImg_"+i}).click(function(){
						el.opt.imageCounter = $(this).attr("i")-1;
						$.mbBgndGallery.next(el);
						el.opt.paused=true;
					}).attr("i",i);

					$(el.opt.thumbs.placeholder).append(img);
				}

				if(el.opt.thumbs.folderPath.trim().length > 0 && el.opt.thumbs.placeholder.trim().length > 0){
					$(".sel", $(el.opt.thumbs.placeholder)).removeClass("sel");
					$("#mbBgImg_"+el.opt.imageCounter).addClass("sel");
				}
			}
		},

		addImages: function(images){

			var el = this.get(0);
			for (var i in arguments){
				el.opt.images.push(arguments[i]);
			}
			$.mbBgndGallery.buildThumbs(el);
		}
	};

	$.fn.addImages = $.mbBgndGallery.addImages;

	jQuery.loadFromSystem=function(folderPath, type){

		// if directory listing is enabled on the remote server.
		// if you run the page locally you need to run it under a local web server (Ex: http://localhost/yourPage)
		// otherwise the directory listing is unavailable.

		if(!folderPath)
			return;
		if(!type)
			type= ["jpg","jpeg","png"];
		var arr=[];
		$.ajax({
			url:folderPath,
			async:false,
			success:function(response){
				var tmp=$(response);
				var els= tmp.find("[href]");

				els.each(function(){
					for (var i in type){
						if ($(this).attr("href").indexOf(type[i])>=0)
							arr.push(folderPath+$(this).attr("href"));
						arr = $.unique(arr);
					}
				});
				tmp.remove();
			}
		});
		return arr;
	};

	// $.fn.greyScale = function(el) {
	// 	return this.each(function() {
	// 		if ($.browser.msie && $.browser.version<9) {
	// 			this.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(grayScale=1)";
	// 		} else if($.browser.webkit){
	// 			el.opt.gallery.css("-webkit-filter", "grayscale(1) sepia(.4)");
	// 		} else {
	// 			this.src = grayScaleImage(this);
	// 		}

	// 	})
	// };

	$.shuffle = function(arr) {
		var newArray = arr.slice();
		var len = newArray.length;
		var i = len;
		while (i--) {
			var p = parseInt(Math.random()*len);
			var t = newArray[i];
			newArray[i] = newArray[p];
			newArray[p] = t;
		}
		return newArray;
	};

	// function grayScaleImage(imgObj){
	// 	var canvas = document.createElement('canvas');
	// 	var canvasContext = canvas.getContext('2d');

	// 	var imgW = imgObj.width;
	// 	var imgH = imgObj.height;
	// 	canvas.width = imgW;
	// 	canvas.height = imgH;

	// 	canvasContext.drawImage(imgObj, 0, 0);
	// 	var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

	// 	for(var y = 0; y < imgPixels.height; y++){
	// 		for(var x = 0; x < imgPixels.width; x++){
	// 			var i = (y * 4) * imgPixels.width + x * 4;
	// 			var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
	// 			imgPixels.data[i] = avg;
	// 			imgPixels.data[i + 1] = avg;
	// 			imgPixels.data[i + 2] = avg;
	// 		}
	// 	}
	// 	canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
	// 	return canvas.toDataURL();
	// }



})(jQuery);

function mbBgndGallery(opt){
	return $.mbBgndGallery.buildGallery(opt);
}
;
/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: mb.bgndGallery.effects.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 07/01/14 22.50
 *  *****************************************************************************
 */

/*******************************************************************************
 *
 * mb.bgndGallery.effects
 * Author: pupunzi
 * Creation date: 26/06/13
 *
 ******************************************************************************/



// ENTER/EXIT EFFECTS

$.mbBgndGallery.effects={
	fade:{
		enter:{left:0,opacity:0},
		exit:{left:0,opacity:0},
		enterTiming:"ease-in",
		exitTiming:"ease-in"
	},
	slideUp:{
		enter:{top:"100%",opacity:1},
		exit:{top:0,opacity:0},
		enterTiming:"ease-in",
		exitTiming:"ease-in"
	},
	slideDown:{
		enter:{top:"-100%",opacity:1},
		exit:{top:0,opacity:0},
		enterTiming:"ease-in",
		exitTiming:"ease-in"
	},
	slideLeft:{
		enter:{left:"100%",opacity:1},
		exit:{left:"-100%",opacity:0}
	},
	slideRight:{
		enter:{left:"-100%",opacity:1},
		exit:{left:"100%",opacity:0}
	},
	zoom:{
		enter:{transform:"scale("+(1+ Math.random()*5)+")",opacity:0},
		exit:{transform:"scale("+(1 + Math.random()*5)+")",opacity:0},
		enterTiming:"cubic-bezier(0.19, 1, 0.22, 1)",
		exitTiming:"cubic-bezier(0.19, 1, 0.22, 1)"
	},

	zoomBlur:{ //the blur effect only works on webkit browsers.
		enter:{opacity:0, filter:"blur(30px)", transform: "scale(2)"},
		exit:{opacity:0, filter:"blur(30px)", transform: "scale(2)"},
		enterTiming:"cubic-bezier(0.19, 1, 0.22, 1)",
		exitTiming:"cubic-bezier(0.19, 1, 0.22, 1)"
	},

	blur:{ //the blur effect only works on webkit browsers.
		enter:{opacity:0, filter:"blur(30px)"},
		exit:{opacity:0, filter:"blur(30px)"},
		enterTiming:"cubic-bezier(0.19, 1, 0.22, 1)",
		exitTiming:"cubic-bezier(0.19, 1, 0.22, 1)"
	}
}
;
/*
 *  jQuery Hashchange - v1.0.0
 *  A plugin which allows to bind callbacks to custom window.location.hash (uri fragment id) values.
 *  https://github.com/apopelo/jquery-hashchange
 *
 *  Made by Andrey Popelo
 *  Under MIT License
 */

!function(a){var b={init:function(b){var c=a.extend({hash:"",onSet:function(){},onRemove:function(){}},b);return c.hash?(a.hashchange||(a.hashchange={},a.hashchange.onSet={},a.hashchange.onRemove={},a.hashchange.prevHash="",a.hashchange.listener=function(){if(window.location.hash!==a.hashchange.prevHash){var b=a.hashchange.onRemove[a.hashchange.prevHash],c=a.hashchange.onSet[window.location.hash];b&&b(),c&&c(),a.hashchange.prevHash=window.location.hash}},this.bind("hashchange",a.hashchange.listener)),a.hashchange.onSet[c.hash]=c.onSet,a.hashchange.onRemove[c.hash]=c.onRemove,window.location.hash===c.hash&&window.location.hash!==a.hashchange.prevHash&&a.hashchange.listener(),this):this}};a.fn.hashchange=function(a){if("[object Array]"===Object.prototype.toString.call(a)){for(var c=a.length-1;c>=0;c--)b.init.apply(this,[a[c]]);return this}return b.init.apply(this,arguments)}}(jQuery);
// knockout-sortable 0.8.6 | (c) 2014 Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license
;(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD anonymous module
        define(["knockout", "jquery", "jquery.ui.sortable"], factory);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.ko, jQuery);
    }
})(function(ko, $) {
    var ITEMKEY = "ko_sortItem",
        INDEXKEY = "ko_sourceIndex",
        LISTKEY = "ko_sortList",
        PARENTKEY = "ko_parentList",
        DRAGKEY = "ko_dragItem",
        unwrap = ko.utils.unwrapObservable,
        dataGet = ko.utils.domData.get,
        dataSet = ko.utils.domData.set;

    //internal afterRender that adds meta-data to children
    var addMetaDataAfterRender = function(elements, data) {
        ko.utils.arrayForEach(elements, function(element) {
            if (element.nodeType === 1) {
                dataSet(element, ITEMKEY, data);
                dataSet(element, PARENTKEY, dataGet(element.parentNode, LISTKEY));
            }
        });
    };

    //prepare the proper options for the template binding
    var prepareTemplateOptions = function(valueAccessor, dataName) {
        var result = {},
            options = unwrap(valueAccessor()) || {},
            actualAfterRender;

        //build our options to pass to the template engine
        if (options.data) {
            result[dataName] = options.data;
            result.name = options.template;
        } else {
            result[dataName] = valueAccessor();
        }

        ko.utils.arrayForEach(["afterAdd", "afterRender", "as", "beforeRemove", "includeDestroyed", "templateEngine", "templateOptions"], function (option) {
            result[option] = options[option] || ko.bindingHandlers.sortable[option];
        });

        //use an afterRender function to add meta-data
        if (dataName === "foreach") {
            if (result.afterRender) {
                //wrap the existing function, if it was passed
                actualAfterRender = result.afterRender;
                result.afterRender = function(element, data) {
                    addMetaDataAfterRender.call(data, element, data);
                    actualAfterRender.call(data, element, data);
                };
            } else {
                result.afterRender = addMetaDataAfterRender;
            }
        }

        //return options to pass to the template binding
        return result;
    };

    var updateIndexFromDestroyedItems = function(index, items) {
        var unwrapped = unwrap(items);

        if (unwrapped) {
            for (var i = 0; i < index; i++) {
                //add one for every destroyed item we find before the targetIndex in the target array
                if (unwrapped[i] && unwrap(unwrapped[i]._destroy)) {
                    index++;
                }
            }
        }

        return index;
    };

    //connect items with observableArrays
    ko.bindingHandlers.sortable = {
        init: function(element, valueAccessor, allBindingsAccessor, data, context) {
            var $element = $(element),
                value = unwrap(valueAccessor()) || {},
                templateOptions = prepareTemplateOptions(valueAccessor, "foreach"),
                sortable = {},
                startActual, updateActual;

            //remove leading/trailing non-elements from anonymous templates
            $element.contents().each(function() {
                if (this && this.nodeType !== 1) {
                    element.removeChild(this);
                }
            });

            //build a new object that has the global options with overrides from the binding
            $.extend(true, sortable, ko.bindingHandlers.sortable);
            if (value.options && sortable.options) {
                ko.utils.extend(sortable.options, value.options);
                delete value.options;
            }
            ko.utils.extend(sortable, value);

            //if allowDrop is an observable or a function, then execute it in a computed observable
            if (sortable.connectClass && (ko.isObservable(sortable.allowDrop) || typeof sortable.allowDrop == "function")) {
                ko.computed({
                    read: function() {
                        var value = unwrap(sortable.allowDrop),
                            shouldAdd = typeof value == "function" ? value.call(this, templateOptions.foreach) : value;
                        ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, shouldAdd);
                    },
                    disposeWhenNodeIsRemoved: element
                }, this);
            } else {
                ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, sortable.allowDrop);
            }

            //wrap the template binding
            ko.bindingHandlers.template.init(element, function() { return templateOptions; }, allBindingsAccessor, data, context);

            //keep a reference to start/update functions that might have been passed in
            startActual = sortable.options.start;
            updateActual = sortable.options.update;

            //initialize sortable binding after template binding has rendered in update function
            var createTimeout = setTimeout(function() {
                var dragItem;
                $element.sortable(ko.utils.extend(sortable.options, {
                    start: function(event, ui) {
                        //track original index
                        var el = ui.item[0];
                        dataSet(el, INDEXKEY, ko.utils.arrayIndexOf(ui.item.parent().children(), el));

                        //make sure that fields have a chance to update model
                        ui.item.find("input:focus").change();
                        if (startActual) {
                            startActual.apply(this, arguments);
                        }
                    },
                    receive: function(event, ui) {
                        dragItem = dataGet(ui.item[0], DRAGKEY);
                        if (dragItem) {
                            //copy the model item, if a clone option is provided
                            if (dragItem.clone) {
                                dragItem = dragItem.clone();
                            }

                            //configure a handler to potentially manipulate item before drop
                            if (sortable.dragged) {
                                dragItem = sortable.dragged.call(this, dragItem, event, ui) || dragItem;
                            }
                        }
                    },
                    update: function(event, ui) {
                        var sourceParent, targetParent, sourceIndex, targetIndex, arg,
                            el = ui.item[0],
                            parentEl = ui.item.parent()[0],
                            item = dataGet(el, ITEMKEY) || dragItem;

                        dragItem = null;

                        //make sure that moves only run once, as update fires on multiple containers
                        if (item && (this === parentEl || $.contains(this, parentEl))) {
                            //identify parents
                            sourceParent = dataGet(el, PARENTKEY);
                            sourceIndex = dataGet(el, INDEXKEY);
                            targetParent = dataGet(el.parentNode, LISTKEY);
                            targetIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), el);

                            //take destroyed items into consideration
                            if (!templateOptions.includeDestroyed) {
                                sourceIndex = updateIndexFromDestroyedItems(sourceIndex, sourceParent);
                                targetIndex = updateIndexFromDestroyedItems(targetIndex, targetParent);
                            }

                            if (sortable.beforeMove || sortable.afterMove) {
                                arg = {
                                    item: item,
                                    sourceParent: sourceParent,
                                    sourceParentNode: sourceParent && ui.sender || el.parentNode,
                                    sourceIndex: sourceIndex,
                                    targetParent: targetParent,
                                    targetIndex: targetIndex,
                                    cancelDrop: false
                                };
                            }

                            if (sortable.beforeMove) {
                                sortable.beforeMove.call(this, arg, event, ui);
                                if (arg.cancelDrop) {
                                    //call cancel on the correct list
                                    if (arg.sourceParent) {
                                        $(arg.sourceParent === arg.targetParent ? this : ui.sender).sortable('cancel');
                                    }
                                    //for a draggable item just remove the element
                                    else {
                                        $(el).remove();
                                    }

                                    return;
                                }
                            }

                            if (targetIndex >= 0) {
                                if (sourceParent) {
                                    sourceParent.splice(sourceIndex, 1);

                                    //if using deferred updates plugin, force updates
                                    if (ko.processAllDeferredBindingUpdates) {
                                        ko.processAllDeferredBindingUpdates();
                                    }
                                }

                                targetParent.splice(targetIndex, 0, item);
                            }

                            //rendering is handled by manipulating the observableArray; ignore dropped element
                            dataSet(el, ITEMKEY, null);
                            ui.item.remove();

                            //if using deferred updates plugin, force updates
                            if (ko.processAllDeferredBindingUpdates) {
                                ko.processAllDeferredBindingUpdates();
                            }

                            //allow binding to accept a function to execute after moving the item
                            if (sortable.afterMove) {
                                sortable.afterMove.call(this, arg, event, ui);
                            }
                        }

                        if (updateActual) {
                            updateActual.apply(this, arguments);
                        }
                    },
                    connectWith: sortable.connectClass ? "." + sortable.connectClass : false
                }));

                //handle enabling/disabling sorting
                if (sortable.isEnabled !== undefined) {
                    ko.computed({
                        read: function() {
                            $element.sortable(unwrap(sortable.isEnabled) ? "enable" : "disable");
                        },
                        disposeWhenNodeIsRemoved: element
                    });
                }
            }, 0);

            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                //only call destroy if sortable has been created
                if ($element.data("ui-sortable") || $element.data("sortable")) {
                    $element.sortable("destroy");
                }

                //do not create the sortable if the element has been removed from DOM
                clearTimeout(createTimeout);
            });

            return { 'controlsDescendantBindings': true };
        },
        update: function(element, valueAccessor, allBindingsAccessor, data, context) {
            var templateOptions = prepareTemplateOptions(valueAccessor, "foreach");

            //attach meta-data
            dataSet(element, LISTKEY, templateOptions.foreach);

            //call template binding's update with correct options
            ko.bindingHandlers.template.update(element, function() { return templateOptions; }, allBindingsAccessor, data, context);
        },
        connectClass: 'ko_container',
        allowDrop: true,
        afterMove: null,
        beforeMove: null,
        options: {}
    };

    //create a draggable that is appropriate for dropping into a sortable
    ko.bindingHandlers.draggable = {
        init: function(element, valueAccessor, allBindingsAccessor, data, context) {
            var value = unwrap(valueAccessor()) || {},
                options = value.options || {},
                draggableOptions = ko.utils.extend({}, ko.bindingHandlers.draggable.options),
                templateOptions = prepareTemplateOptions(valueAccessor, "data"),
                connectClass = value.connectClass || ko.bindingHandlers.draggable.connectClass,
                isEnabled = value.isEnabled !== undefined ? value.isEnabled : ko.bindingHandlers.draggable.isEnabled;

            value = value.data || value;

            //set meta-data
            dataSet(element, DRAGKEY, value);

            //override global options with override options passed in
            ko.utils.extend(draggableOptions, options);

            //setup connection to a sortable
            draggableOptions.connectToSortable = connectClass ? "." + connectClass : false;

            //initialize draggable
            $(element).draggable(draggableOptions);

            //handle enabling/disabling sorting
            if (isEnabled !== undefined) {
                ko.computed({
                    read: function() {
                        $(element).draggable(unwrap(isEnabled) ? "enable" : "disable");
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }

            return ko.bindingHandlers.template.init(element, function() { return templateOptions; }, allBindingsAccessor, data, context);
        },
        update: function(element, valueAccessor, allBindingsAccessor, data, context) {
            var templateOptions = prepareTemplateOptions(valueAccessor, "data");

            return ko.bindingHandlers.template.update(element, function() { return templateOptions; }, allBindingsAccessor, data, context);
        },
        connectClass: ko.bindingHandlers.sortable.connectClass,
        options: {
            helper: "clone"
        }
    };

});
// $(function(){ 
//     window.onerror = function (errorMsg, url, lineNumber) {
//         console.log('[error] ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
//     }
//     ko.global_log_file = [];
//     var console = window.console
//     if (!console) return
//     function intercept(method){
//         var original = console[method]
//         console[method] = function(){
//             // do sneaky stuff
//             ko.global_log_file.push("[" + method + "] " + _.map(arguments,function(e){return JSON.stringify(e)}).join("\n\r"));
//             if (original.apply){
//                 // Do this for normal browsers
//                 original.apply(console, arguments)
//             }else{
//                 // Do this for IE
//                 var message = Array.prototype.slice.apply(arguments).join(' ')
//                 original(message)
//             }
//         }
//     }
//     var methods = ['log', 'warn', 'error']
//     for (var i = 0; i < methods.length; i++)
//         intercept(methods[i])
// });
/*!
 * Masonry PACKAGED v3.1.5
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */


!function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}return this.each(function(){var d=a.data(this,b);d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d))})}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],c):c(a.jQuery)}(window),function(a){function b(b){var c=a.event;return c.target=c.target||c.srcElement||b,c}var c=document.documentElement,d=function(){};c.addEventListener?d=function(a,b,c){a.addEventListener(b,c,!1)}:c.attachEvent&&(d=function(a,c,d){a[c+d]=d.handleEvent?function(){var c=b(a);d.handleEvent.call(d,c)}:function(){var c=b(a);d.call(a,c)},a.attachEvent("on"+c,a[c+d])});var e=function(){};c.removeEventListener?e=function(a,b,c){a.removeEventListener(b,c,!1)}:c.detachEvent&&(e=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var f={bind:d,unbind:e};"function"==typeof define&&define.amd?define("eventie/eventie",f):"object"==typeof exports?module.exports=f:a.eventie=f}(this),function(a){function b(a){"function"==typeof a&&(b.isReady?a():f.push(a))}function c(a){var c="readystatechange"===a.type&&"complete"!==e.readyState;if(!b.isReady&&!c){b.isReady=!0;for(var d=0,g=f.length;g>d;d++){var h=f[d];h()}}}function d(d){return d.bind(e,"DOMContentLoaded",c),d.bind(e,"readystatechange",c),d.bind(a,"load",c),b}var e=a.document,f=[];b.isReady=!1,"function"==typeof define&&define.amd?(b.isReady="function"==typeof requirejs,define("doc-ready/doc-ready",["eventie/eventie"],d)):a.docReady=d(a.eventie)}(this),function(){function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if(a instanceof RegExp){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if(a instanceof RegExp)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return a}):"object"==typeof module&&module.exports?module.exports=a:this.EventEmitter=a}.call(this),function(a){function b(a){if(a){if("string"==typeof d[a])return a;a=a.charAt(0).toUpperCase()+a.slice(1);for(var b,e=0,f=c.length;f>e;e++)if(b=c[e]+a,"string"==typeof d[b])return b}}var c="Webkit Moz ms Ms O".split(" "),d=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return b}):"object"==typeof exports?module.exports=b:a.getStyleProperty=b}(window),function(a){function b(a){var b=parseFloat(a),c=-1===a.indexOf("%")&&!isNaN(b);return c&&b}function c(){for(var a={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},b=0,c=g.length;c>b;b++){var d=g[b];a[d]=0}return a}function d(a){function d(a){if("string"==typeof a&&(a=document.querySelector(a)),a&&"object"==typeof a&&a.nodeType){var d=f(a);if("none"===d.display)return c();var e={};e.width=a.offsetWidth,e.height=a.offsetHeight;for(var k=e.isBorderBox=!(!j||!d[j]||"border-box"!==d[j]),l=0,m=g.length;m>l;l++){var n=g[l],o=d[n];o=h(a,o);var p=parseFloat(o);e[n]=isNaN(p)?0:p}var q=e.paddingLeft+e.paddingRight,r=e.paddingTop+e.paddingBottom,s=e.marginLeft+e.marginRight,t=e.marginTop+e.marginBottom,u=e.borderLeftWidth+e.borderRightWidth,v=e.borderTopWidth+e.borderBottomWidth,w=k&&i,x=b(d.width);x!==!1&&(e.width=x+(w?0:q+u));var y=b(d.height);return y!==!1&&(e.height=y+(w?0:r+v)),e.innerWidth=e.width-(q+u),e.innerHeight=e.height-(r+v),e.outerWidth=e.width+s,e.outerHeight=e.height+t,e}}function h(a,b){if(e||-1===b.indexOf("%"))return b;var c=a.style,d=c.left,f=a.runtimeStyle,g=f&&f.left;return g&&(f.left=a.currentStyle.left),c.left=b,b=c.pixelLeft,c.left=d,g&&(f.left=g),b}var i,j=a("boxSizing");return function(){if(j){var a=document.createElement("div");a.style.width="200px",a.style.padding="1px 2px 3px 4px",a.style.borderStyle="solid",a.style.borderWidth="1px 2px 3px 4px",a.style[j]="border-box";var c=document.body||document.documentElement;c.appendChild(a);var d=f(a);i=200===b(d.width),c.removeChild(a)}}(),d}var e=a.getComputedStyle,f=e?function(a){return e(a,null)}:function(a){return a.currentStyle},g=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],d):"object"==typeof exports?module.exports=d(require("get-style-property")):a.getSize=d(a.getStyleProperty)}(window),function(a,b){function c(a,b){return a[h](b)}function d(a){if(!a.parentNode){var b=document.createDocumentFragment();b.appendChild(a)}}function e(a,b){d(a);for(var c=a.parentNode.querySelectorAll(b),e=0,f=c.length;f>e;e++)if(c[e]===a)return!0;return!1}function f(a,b){return d(a),c(a,b)}var g,h=function(){if(b.matchesSelector)return"matchesSelector";for(var a=["webkit","moz","ms","o"],c=0,d=a.length;d>c;c++){var e=a[c],f=e+"MatchesSelector";if(b[f])return f}}();if(h){var i=document.createElement("div"),j=c(i,"div");g=j?c:f}else g=e;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return g}):window.matchesSelector=g}(this,Element.prototype),function(a){function b(a,b){for(var c in b)a[c]=b[c];return a}function c(a){for(var b in a)return!1;return b=null,!0}function d(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function e(a,e,f){function h(a,b){a&&(this.element=a,this.layout=b,this.position={x:0,y:0},this._create())}var i=f("transition"),j=f("transform"),k=i&&j,l=!!f("perspective"),m={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[i],n=["transform","transition","transitionDuration","transitionProperty"],o=function(){for(var a={},b=0,c=n.length;c>b;b++){var d=n[b],e=f(d);e&&e!==d&&(a[d]=e)}return a}();b(h.prototype,a.prototype),h.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},h.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},h.prototype.getSize=function(){this.size=e(this.element)},h.prototype.css=function(a){var b=this.element.style;for(var c in a){var d=o[c]||c;b[d]=a[c]}},h.prototype.getPosition=function(){var a=g(this.element),b=this.layout.options,c=b.isOriginLeft,d=b.isOriginTop,e=parseInt(a[c?"left":"right"],10),f=parseInt(a[d?"top":"bottom"],10);e=isNaN(e)?0:e,f=isNaN(f)?0:f;var h=this.layout.size;e-=c?h.paddingLeft:h.paddingRight,f-=d?h.paddingTop:h.paddingBottom,this.position.x=e,this.position.y=f},h.prototype.layoutPosition=function(){var a=this.layout.size,b=this.layout.options,c={};b.isOriginLeft?(c.left=this.position.x+a.paddingLeft+"px",c.right=""):(c.right=this.position.x+a.paddingRight+"px",c.left=""),b.isOriginTop?(c.top=this.position.y+a.paddingTop+"px",c.bottom=""):(c.bottom=this.position.y+a.paddingBottom+"px",c.top=""),this.css(c),this.emitEvent("layout",[this])};var p=l?function(a,b){return"translate3d("+a+"px, "+b+"px, 0)"}:function(a,b){return"translate("+a+"px, "+b+"px)"};h.prototype._transitionTo=function(a,b){this.getPosition();var c=this.position.x,d=this.position.y,e=parseInt(a,10),f=parseInt(b,10),g=e===this.position.x&&f===this.position.y;if(this.setPosition(a,b),g&&!this.isTransitioning)return void this.layoutPosition();var h=a-c,i=b-d,j={},k=this.layout.options;h=k.isOriginLeft?h:-h,i=k.isOriginTop?i:-i,j.transform=p(h,i),this.transition({to:j,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},h.prototype.goTo=function(a,b){this.setPosition(a,b),this.layoutPosition()},h.prototype.moveTo=k?h.prototype._transitionTo:h.prototype.goTo,h.prototype.setPosition=function(a,b){this.position.x=parseInt(a,10),this.position.y=parseInt(b,10)},h.prototype._nonTransition=function(a){this.css(a.to),a.isCleaning&&this._removeStyles(a.to);for(var b in a.onTransitionEnd)a.onTransitionEnd[b].call(this)},h.prototype._transition=function(a){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(a);var b=this._transn;for(var c in a.onTransitionEnd)b.onEnd[c]=a.onTransitionEnd[c];for(c in a.to)b.ingProperties[c]=!0,a.isCleaning&&(b.clean[c]=!0);if(a.from){this.css(a.from);var d=this.element.offsetHeight;d=null}this.enableTransition(a.to),this.css(a.to),this.isTransitioning=!0};var q=j&&d(j)+",opacity";h.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:q,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(m,this,!1))},h.prototype.transition=h.prototype[i?"_transition":"_nonTransition"],h.prototype.onwebkitTransitionEnd=function(a){this.ontransitionend(a)},h.prototype.onotransitionend=function(a){this.ontransitionend(a)};var r={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};h.prototype.ontransitionend=function(a){if(a.target===this.element){var b=this._transn,d=r[a.propertyName]||a.propertyName;if(delete b.ingProperties[d],c(b.ingProperties)&&this.disableTransition(),d in b.clean&&(this.element.style[a.propertyName]="",delete b.clean[d]),d in b.onEnd){var e=b.onEnd[d];e.call(this),delete b.onEnd[d]}this.emitEvent("transitionEnd",[this])}},h.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(m,this,!1),this.isTransitioning=!1},h.prototype._removeStyles=function(a){var b={};for(var c in a)b[c]="";this.css(b)};var s={transitionProperty:"",transitionDuration:""};return h.prototype.removeTransitionStyles=function(){this.css(s)},h.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.emitEvent("remove",[this])},h.prototype.remove=function(){if(!i||!parseFloat(this.layout.options.transitionDuration))return void this.removeElem();var a=this;this.on("transitionEnd",function(){return a.removeElem(),!0}),this.hide()},h.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var a=this.layout.options;this.transition({from:a.hiddenStyle,to:a.visibleStyle,isCleaning:!0})},h.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var a=this.layout.options;this.transition({from:a.visibleStyle,to:a.hiddenStyle,isCleaning:!0,onTransitionEnd:{opacity:function(){this.isHidden&&this.css({display:"none"})}}})},h.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},h}var f=a.getComputedStyle,g=f?function(a){return f(a,null)}:function(a){return a.currentStyle};"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property"],e):(a.Outlayer={},a.Outlayer.Item=e(a.EventEmitter,a.getSize,a.getStyleProperty))}(window),function(a){function b(a,b){for(var c in b)a[c]=b[c];return a}function c(a){return"[object Array]"===l.call(a)}function d(a){var b=[];if(c(a))b=a;else if(a&&"number"==typeof a.length)for(var d=0,e=a.length;e>d;d++)b.push(a[d]);else b.push(a);return b}function e(a,b){var c=n(b,a);-1!==c&&b.splice(c,1)}function f(a){return a.replace(/(.)([A-Z])/g,function(a,b,c){return b+"-"+c}).toLowerCase()}function g(c,g,l,n,o,p){function q(a,c){if("string"==typeof a&&(a=h.querySelector(a)),!a||!m(a))return void(i&&i.error("Bad "+this.constructor.namespace+" element: "+a));this.element=a,this.options=b({},this.constructor.defaults),this.option(c);var d=++r;this.element.outlayerGUID=d,s[d]=this,this._create(),this.options.isInitLayout&&this.layout()}var r=0,s={};return q.namespace="outlayer",q.Item=p,q.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},b(q.prototype,l.prototype),q.prototype.option=function(a){b(this.options,a)},q.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),b(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},q.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},q.prototype._itemize=function(a){for(var b=this._filterFindItemElements(a),c=this.constructor.Item,d=[],e=0,f=b.length;f>e;e++){var g=b[e],h=new c(g,this);d.push(h)}return d},q.prototype._filterFindItemElements=function(a){a=d(a);for(var b=this.options.itemSelector,c=[],e=0,f=a.length;f>e;e++){var g=a[e];if(m(g))if(b){o(g,b)&&c.push(g);for(var h=g.querySelectorAll(b),i=0,j=h.length;j>i;i++)c.push(h[i])}else c.push(g)}return c},q.prototype.getItemElements=function(){for(var a=[],b=0,c=this.items.length;c>b;b++)a.push(this.items[b].element);return a},q.prototype.layout=function(){this._resetLayout(),this._manageStamps();var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,a),this._isLayoutInited=!0},q.prototype._init=q.prototype.layout,q.prototype._resetLayout=function(){this.getSize()},q.prototype.getSize=function(){this.size=n(this.element)},q.prototype._getMeasurement=function(a,b){var c,d=this.options[a];d?("string"==typeof d?c=this.element.querySelector(d):m(d)&&(c=d),this[a]=c?n(c)[b]:d):this[a]=0},q.prototype.layoutItems=function(a,b){a=this._getItemsForLayout(a),this._layoutItems(a,b),this._postLayout()},q.prototype._getItemsForLayout=function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];e.isIgnored||b.push(e)}return b},q.prototype._layoutItems=function(a,b){function c(){d.emitEvent("layoutComplete",[d,a])}var d=this;if(!a||!a.length)return void c();this._itemsOn(a,"layout",c);for(var e=[],f=0,g=a.length;g>f;f++){var h=a[f],i=this._getItemLayoutPosition(h);i.item=h,i.isInstant=b||h.isLayoutInstant,e.push(i)}this._processLayoutQueue(e)},q.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},q.prototype._processLayoutQueue=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];this._positionItem(d.item,d.x,d.y,d.isInstant)}},q.prototype._positionItem=function(a,b,c,d){d?a.goTo(b,c):a.moveTo(b,c)},q.prototype._postLayout=function(){this.resizeContainer()},q.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var a=this._getContainerSize();a&&(this._setContainerMeasure(a.width,!0),this._setContainerMeasure(a.height,!1))}},q.prototype._getContainerSize=k,q.prototype._setContainerMeasure=function(a,b){if(void 0!==a){var c=this.size;c.isBorderBox&&(a+=b?c.paddingLeft+c.paddingRight+c.borderLeftWidth+c.borderRightWidth:c.paddingBottom+c.paddingTop+c.borderTopWidth+c.borderBottomWidth),a=Math.max(a,0),this.element.style[b?"width":"height"]=a+"px"}},q.prototype._itemsOn=function(a,b,c){function d(){return e++,e===f&&c.call(g),!0}for(var e=0,f=a.length,g=this,h=0,i=a.length;i>h;h++){var j=a[h];j.on(b,d)}},q.prototype.ignore=function(a){var b=this.getItem(a);b&&(b.isIgnored=!0)},q.prototype.unignore=function(a){var b=this.getItem(a);b&&delete b.isIgnored},q.prototype.stamp=function(a){if(a=this._find(a)){this.stamps=this.stamps.concat(a);for(var b=0,c=a.length;c>b;b++){var d=a[b];this.ignore(d)}}},q.prototype.unstamp=function(a){if(a=this._find(a))for(var b=0,c=a.length;c>b;b++){var d=a[b];e(d,this.stamps),this.unignore(d)}},q.prototype._find=function(a){return a?("string"==typeof a&&(a=this.element.querySelectorAll(a)),a=d(a)):void 0},q.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var a=0,b=this.stamps.length;b>a;a++){var c=this.stamps[a];this._manageStamp(c)}}},q.prototype._getBoundingRect=function(){var a=this.element.getBoundingClientRect(),b=this.size;this._boundingRect={left:a.left+b.paddingLeft+b.borderLeftWidth,top:a.top+b.paddingTop+b.borderTopWidth,right:a.right-(b.paddingRight+b.borderRightWidth),bottom:a.bottom-(b.paddingBottom+b.borderBottomWidth)}},q.prototype._manageStamp=k,q.prototype._getElementOffset=function(a){var b=a.getBoundingClientRect(),c=this._boundingRect,d=n(a),e={left:b.left-c.left-d.marginLeft,top:b.top-c.top-d.marginTop,right:c.right-b.right-d.marginRight,bottom:c.bottom-b.bottom-d.marginBottom};return e},q.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},q.prototype.bindResize=function(){this.isResizeBound||(c.bind(a,"resize",this),this.isResizeBound=!0)},q.prototype.unbindResize=function(){this.isResizeBound&&c.unbind(a,"resize",this),this.isResizeBound=!1},q.prototype.onresize=function(){function a(){b.resize(),delete b.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var b=this;this.resizeTimeout=setTimeout(a,100)},q.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},q.prototype.needsResizeLayout=function(){var a=n(this.element),b=this.size&&a;return b&&a.innerWidth!==this.size.innerWidth},q.prototype.addItems=function(a){var b=this._itemize(a);return b.length&&(this.items=this.items.concat(b)),b},q.prototype.appended=function(a){var b=this.addItems(a);b.length&&(this.layoutItems(b,!0),this.reveal(b))},q.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){var c=this.items.slice(0);this.items=b.concat(c),this._resetLayout(),this._manageStamps(),this.layoutItems(b,!0),this.reveal(b),this.layoutItems(c)}},q.prototype.reveal=function(a){var b=a&&a.length;if(b)for(var c=0;b>c;c++){var d=a[c];d.reveal()}},q.prototype.hide=function(a){var b=a&&a.length;if(b)for(var c=0;b>c;c++){var d=a[c];d.hide()}},q.prototype.getItem=function(a){for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];if(d.element===a)return d}},q.prototype.getItems=function(a){if(a&&a.length){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c],f=this.getItem(e);f&&b.push(f)}return b}},q.prototype.remove=function(a){a=d(a);var b=this.getItems(a);if(b&&b.length){this._itemsOn(b,"remove",function(){this.emitEvent("removeComplete",[this,b])});for(var c=0,f=b.length;f>c;c++){var g=b[c];g.remove(),e(g,this.items)}}},q.prototype.destroy=function(){var a=this.element.style;a.height="",a.position="",a.width="";for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];d.destroy()}this.unbindResize(),delete this.element.outlayerGUID,j&&j.removeData(this.element,this.constructor.namespace)},q.data=function(a){var b=a&&a.outlayerGUID;return b&&s[b]},q.create=function(a,c){function d(){q.apply(this,arguments)}return Object.create?d.prototype=Object.create(q.prototype):b(d.prototype,q.prototype),d.prototype.constructor=d,d.defaults=b({},q.defaults),b(d.defaults,c),d.prototype.settings={},d.namespace=a,d.data=q.data,d.Item=function(){p.apply(this,arguments)},d.Item.prototype=new p,g(function(){for(var b=f(a),c=h.querySelectorAll(".js-"+b),e="data-"+b+"-options",g=0,k=c.length;k>g;g++){var l,m=c[g],n=m.getAttribute(e);try{l=n&&JSON.parse(n)}catch(o){i&&i.error("Error parsing "+e+" on "+m.nodeName.toLowerCase()+(m.id?"#"+m.id:"")+": "+o);continue}var p=new d(m,l);j&&j.data(m,a,p)}}),j&&j.bridget&&j.bridget(a,d),d},q.Item=p,q}var h=a.document,i=a.console,j=a.jQuery,k=function(){},l=Object.prototype.toString,m="object"==typeof HTMLElement?function(a){return a instanceof HTMLElement}:function(a){return a&&"object"==typeof a&&1===a.nodeType&&"string"==typeof a.nodeName},n=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1};"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","doc-ready/doc-ready","eventEmitter/EventEmitter","get-size/get-size","matches-selector/matches-selector","./item"],g):a.Outlayer=g(a.eventie,a.docReady,a.EventEmitter,a.getSize,a.matchesSelector,a.Outlayer.Item)}(window),function(a){function b(a,b){var d=a.create("masonry");return d.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var a=this.cols;for(this.colYs=[];a--;)this.colYs.push(0);this.maxY=0},d.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var a=this.items[0],c=a&&a.element;this.columnWidth=c&&b(c).outerWidth||this.containerWidth}this.columnWidth+=this.gutter,this.cols=Math.floor((this.containerWidth+this.gutter)/this.columnWidth),this.cols=Math.max(this.cols,1)},d.prototype.getContainerWidth=function(){var a=this.options.isFitWidth?this.element.parentNode:this.element,c=b(a);this.containerWidth=c&&c.innerWidth},d.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth%this.columnWidth,d=b&&1>b?"round":"ceil",e=Math[d](a.size.outerWidth/this.columnWidth);e=Math.min(e,this.cols);for(var f=this._getColGroup(e),g=Math.min.apply(Math,f),h=c(f,g),i={x:this.columnWidth*h,y:g},j=g+a.size.outerHeight,k=this.cols+1-f.length,l=0;k>l;l++)this.colYs[h+l]=j;return i},d.prototype._getColGroup=function(a){if(2>a)return this.colYs;for(var b=[],c=this.cols+1-a,d=0;c>d;d++){var e=this.colYs.slice(d,d+a);b[d]=Math.max.apply(Math,e)}return b},d.prototype._manageStamp=function(a){var c=b(a),d=this._getElementOffset(a),e=this.options.isOriginLeft?d.left:d.right,f=e+c.outerWidth,g=Math.floor(e/this.columnWidth);g=Math.max(0,g);var h=Math.floor(f/this.columnWidth);h-=f%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var i=(this.options.isOriginTop?d.top:d.bottom)+c.outerHeight,j=g;h>=j;j++)this.colYs[j]=Math.max(i,this.colYs[j])},d.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var a={height:this.maxY};return this.options.isFitWidth&&(a.width=this._getContainerFitWidth()),a},d.prototype._getContainerFitWidth=function(){for(var a=0,b=this.cols;--b&&0===this.colYs[b];)a++;return(this.cols-a)*this.columnWidth-this.gutter},d.prototype.needsResizeLayout=function(){var a=this.containerWidth;return this.getContainerWidth(),a!==this.containerWidth},d}var c=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++){var e=a[c];if(e===b)return c}return-1};"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],b):a.Masonry=b(a.Outlayer,a.getSize)}(window);

        function EasyImage(data) {
            var self = this;
            self.name = ko.observable(data[0] || "");
            self.url = ko.observable(data[1] || "");
        }

        function Design(data) {
            var self = this;
            self.id = ko.observable(data._id ? data._id : "");
            self.name = ko.observable(data.name ? data.name : "New Design");
            self.css = ko.observable(data.css ? data.css : "");
            self.menu_css = ko.observable(data.menu_css ? data.menu_css : "");
            self.template_location = ko.observable(data.template_location ? data.template_location : "");
            self.fonts = ko.observable(data.fonts ? data.fonts : "");
            self.global_images = ko.observableArray([]);
            self.carousel = ko.observableArray([]);
            self.example_image = ko.observable();


    		self.imgs = {};
	        _.each(data.global_images,function(e){
        		var new_images = new GlobalImage(e);
        		new_images.design_id(self.id());
        		if(e.carousel){
        			self.carousel.push(new_images);
        		} else {
        			self.global_images.push(new_images);
        			new_images.addImage();      			
        		}
	        	if(self.imgs[new_images.name()] === undefined && new_images.name() != ""){
	        		self.imgs[new_images.name()] = new_images.url;
	        	}        		
	        }); 

            self.new_design = ko.computed(function(){
            	return self.id() != "";
            });

            self.addImage = function(){
            	var img = new GlobalImage({design_id:self.id(),parent:self,parent_id:self.id});
            	self.global_images.push(img);
            	img.get_id();
            }

            self.addExampleImage = function(example_image){
            	if(example_image){
            		var img = new GlobalImage(example_image);
        			img.design_id(self.id());            		
            	} else {
            		var img = new GlobalImage({design_id:self.id(),parent:self,parent_id:self.id,example_image:true});
            		// img.get_id();
            	}
            	self.example_image(img);
            }   
            self.addExampleImage(data.example_image);


            self.addCarousel = function(){
            	var img = new GlobalImage({design_id:self.id(),carousel:true,parent:self,parent_id:self.id});
            	self.carousel.push(img);
            } 

		    self.destroyImage = function(item){
		        bootbox.dialog({
		          message: "Are you sure you want to remove this image \"" + item.name() + "\"?",
		          title: "Remove Image",
		          buttons: {
		            success: {
		              label: "No",
		              className: "btn-default pull-left col-xs-3",
		              callback: function() {

		              }
		            },
		            danger: {
		              label: "Yes",
		              className: "btn-danger col-xs-3 pull-right",
		              callback: function() {
			            $.ajax({
			              type: "POST",
			              url: "/app/design/destroy_image",
			              data: {
			                image_id:item.id(),
			              },
			              success: function(data, textStatus, jqXHR){
			              	console.log("image destroyed");
			              	self.global_images.remove(item);
			              	self.carousel.remove(item);
			              },
			              dataType: "json"
			            });
		              }
		            },
		          }
		        }); 		    	
		    }	            

            self.initialized = false;
	        if(self.initialized == false){
	        	self.addCarousel();
	        	self.initialized = true;
	        }                                 

        }

	GlobalImage.prototype.toJSON = function() {
	    var copy = ko.toJS(this); //easy way to get a clean copy
	    delete copy.parent;
	    // delete copy.parent_id;
	    return copy; //return the copy to be serialized
	};  


	function GlobalImage(data) {
	    var self = this;
	    self.progressValue = ko.observable(1);
	    self.id = ko.observable("");
	    self.name = ko.observable(data.name || "");
	    self.css = ko.observable(data.css || "");
	    self.description = ko.observable("");
	    self.url = ko.observable("/loader.gif");
	    self.custom = ko.observable(false);
	    self.fresh = ko.observable(true);
	    self.customizable = ko.observable();
	    self.css = ko.observable(data.css ? data.css : "");
        self.template_location = ko.observable(data.template_location ? data.template_location : "");
        self.example_image = ko.observable(data.example_image ? data.example_image : "");
	    self.failed = ko.observable(false);
	    self.design_id = ko.observable(data.design_id);
        self.completed = ko.observable(false);
        self.default_image = ko.observable(data.default_image ? data.default_image : false);
        self.defaultImage = ko.observable();
        self.selectedImage = ko.observable(false);
        self.parent_id = data.parent_id;
        self.parent = data.parent;
        self.carousel = ko.observable(data.carousel ? data.carousel : "");
        self.global_images = ko.observableArray([]);

		self.dropdowning = ko.observable(false);  
	    self.drop = function() { self.dropdowning(true) }

	    if(data){
            self.id(data._id);
            self.name(data.name);
            self.css(data.css);
            self.description(data.description);
            self.customizable(data.customizable);

            if(data.custom){
	            self.custom(data.custom);
            }

            if(data.url){
	            self.completed(true);
	            self.default_image(data.default_image);
	            self.url = ko.observable(data.url);
	            self.fresh(false);  
            }               

	        _.each(data.global_images,function(e){
        		var new_images = new GlobalImage(e);
        		console.log("new global image: "+new_images.id());
        		new_images.design_id(self.design_id());
        		new_images.parent = self;
        		new_images.parent_id = self.id;
        		if(new_images.default_image()){
        			self.defaultImage(new_images);
        			self.url(new_images.url());
        			self.css(new_images.css());
        		}
        		self.global_images.push(new_images);       		
	        }); 
      
	    }  

	    self.background = ko.computed(function(){
	    	return "url(" + self.url() + ")";
	    })

	    self.setDefault = function(data){
	    	self.dropdowning(false);
	    	self.url(data.url());
	    	self.defaultImage(data);
	    }

	    self.update_info = function(item){
	        self.url(item.url);
	        self.completed(true);
	        self.custom(item.custom);
	        if(item.image_id){
	        	self.id(item.image_id);
	        } else {
	        	self.id(item.id);
	        }
	    }

	    self.destroyImage = function(item){
	        bootbox.dialog({
	          message: "Are you sure you want to remove this image \"" + item.name() + "\"?",
	          title: "Remove Image",
	          buttons: {
	            success: {
	              label: "No",
	              className: "btn-default pull-left col-xs-3",
	              callback: function() {

	              }
	            },
	            danger: {
	              label: "Yes",
	              className: "btn-danger col-xs-3 pull-right",
	              callback: function() {
		            $.ajax({
		              type: "POST",
		              url: "/app/design/destroy_sub_image",
		              data: {
		                image_id:item.id(),
		              },
		              success: function(data, textStatus, jqXHR){
		              	console.log("image destroyed");
		              	self.global_images.remove(item);
		              },
		              dataType: "json"
		            });
	              }
	            },
	          }
	        }); 		    	
	    }	    

	    self.get_id = function(){
            $.ajax({
              type: "POST",
              url: "/app/design/create_image",
              data: {
                design_id:self.design_id(),
              },
              success: function(data, textStatus, jqXHR){
              		self.update_info(data);
              		self.addImage();
                },
              dataType: "json"
            });
	    }     

        self.addImage = function(){
        	var img = new GlobalImage({parent_id:self.id,name:self.name(),design_id:self.design_id(),parent:self});
        	if(self.global_images().length == 0){
        		img.default_image = true;
        	}
        	self.global_images.push(img);
        }         

      	self.apply = function(){}

      	self.computedImageUpload = ko.computed(function(){
      		if(self.url() != "/loader.gif"){
      			return "Replace Image";
      		} else {
      			return "Upload Image";
      		}
      	})
	}   

	ko.bindingHandlers.file_upload_global = {
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	        var self = this;
	        $(element).fileupload({
	            dropZone: $(element),
	            formData: {
	            	carousel: viewModel.carousel(),
	            	design_id: viewModel.design_id(), 
	            	name: viewModel.name(),
	            	parent_id: viewModel.parent_id(),
	            	data: ko.toJSON(viewModel)
	            },           
	            url: "/app/design/upload_image",
	            dataType: 'json',
	            progressInterval: 50,
	            submit: function(e, data){
	            	console.log(data);
	            },
	            send: function (e, data) {
              		viewModel.fresh(false);
	            },
	            done: function (e, data) {
	                var file = data.result.files[0];
	                if(viewModel.carousel()){
		                viewModel.parent.addCarousel();
	                }  else {
	                	viewModel.parent.addImage();
	                }		                
	                viewModel.update_info(file);                                               
	            },
	            progressall: function (e, data) {
	                var progress = parseInt(data.loaded / data.total * 100, 10);
	                viewModel.progressValue(progress);
	            },
	            fail: function (e, data) {
	                viewModel.failed(true);
	            },                       
	        });
	    }
	};	

	ko.bindingHandlers.file_upload_logo = {
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	        var self = this;
	        viewModel.imageModel;
	        $(element).fileupload({
	            dropZone: $(element),
	            formData: {
	            	data: ko.toJSON(viewModel),
	            	restaurant_id: restaurant_id,
	            	name: viewModel.name(),
	            	id: viewModel.id()
	            },
	            url: "/app/website/upload_logo",
	            dataType: 'json',
	            progressInterval: 50,
	            send: function (e, data) {
              		viewModel.fresh(false);
	            },
	            done: function (e, data) {
	                var file = data.result.files[0];
	                viewModel.update_info(file);
	                if(viewModel.carousel()){
		                viewModel.parent.addCarousel();                             	                	
	                }	
	            },
	            progressall: function (e, data) {
	                var progress = parseInt(data.loaded / data.total * 100, 10);
	                viewModel.progressValue(progress);
	            },
	            fail: function (e, data) {
	                viewModel.failed(true);
	            },                       
	        });
	    }
	};	     

	ko.bindingHandlers.file_upload_global_customize = {
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	        var self = this;
	        viewModel.imageModel;
	        $(element).fileupload({
	            dropZone: $(element),
	            formData: {
	            	data: ko.toJSON(viewModel),
	            	design_id: viewModel.design_id(), 
	            	restaurant_id: restaurant_id,
	            	name: viewModel.name(),
	            	id: viewModel.id()
	            },
	            url: "/app/website/upload_image",
	            dataType: 'json',
	            progressInterval: 50,
	            send: function (e, data) {
              		viewModel.fresh(false);
	            },
	            done: function (e, data) {
	                var file = data.result.files[0];
	                viewModel.update_info(file);
	                if(viewModel.carousel()){
		                viewModel.parent.addCarousel();                             	                	
	                }	
	            },
	            progressall: function (e, data) {
	                var progress = parseInt(data.loaded / data.total * 100, 10);
	                viewModel.progressValue(progress);
	            },
	            fail: function (e, data) {
	                viewModel.failed(true);
	            },                       
	        });
	    }
	};	 
    

        Day.prototype.toJSON = function() {
            var copy = ko.toJS(this); //easy way to get a clean copy
            delete copy.times;
            delete copy.buttonText;
            return copy; //return the copy to be serialized
        };  

        function Page(data){
            data ? null : data = {}
            var self = this;
            self.id = data.id;
            self.html = ko.observable(data.html ? data.html : copyDefaultHash(default_web_language_hash));
            self.name = ko.observable(data.name ? data.name : copyDefaultHash(default_page_language_hash));

            self.remove = function(resto){
                bootbox.dialog({
                  message: "Remove page?",
                  title: "Remove Page",
                  buttons: {
                    success: {
                      label: "No",
                      className: "btn-default pull-left col-xs-3",
                      callback: function() {

                      }
                    },
                    danger: {
                      label: "Yes",
                      className: "btn-danger col-xs-3 pull-right",
                      callback: function() {
                        resto.pages.remove(self);
                      }
                    },
                  }
                });                  
            }
        }        

        function LogoSettings(data){
            data ? null : data = {}
            var self = this;
            self.logo_as_image = ko.observable(data.logo_as_image ? data.logo_as_image : false);
            self.image_height = ko.observable(data.image_height != null  ? data.image_height : 50);
            self.border_color = ko.observable(data.border_color ? data.border_color : "000000");
            self.border_radius = ko.observable(data.border_radius != null  ? data.border_radius : 3);
            self.border_size = ko.observable(data.border_size != null ? data.border_size : 2);

            self.showLogo = ko.computed({
                read: function(){
                    if(!self.logo_as_image()){
                        return false;
                    } else {
                        if($(window).width() < 600){
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                deferEvaluation: true,
            })
        }

        function Day(name,data){
            var self = this;
            self.name = name;
            self.closed = ko.observable(true);
            self.open_1 = ko.observable(data.open_1);
            self.close_1 = ko.observable(data.close_1);
            self.open_2 = ko.observable(data.open_2);
            self.close_2 = ko.observable(data.close_2);

            self.lName = ko.computed({
                read: function() {
                    if(viewmodel.lang){
                        return days_tr[self.name][viewmodel.lang()];
                    } else {
                        return "";
                    }
                },
                deferEvaluation: true                
            });

            self.times = ["00:00", "00:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];


            if(data.closed == false){
                self.closed(data.closed);
            }

            self.toggleClosed = function(){
                self.closed(!self.closed());
            }
            
            self.labelText = ko.computed({
                read: function() {
                    if(viewmodel.lang){
                        if(!self.closed()){
                            return opened_tr["open"][viewmodel.lang()];
                        } else {
                            return opened_tr["closed"][viewmodel.lang()];
                        }
                    } else {
                        return self.buttonText();
                    }                 
                },
                deferEvaluation: true                 
            });

            self.buttonText = ko.computed(function(){
                if(!self.closed()){
                    return "Open";
                } else {
                    return "Closed";
                }
            });            

            self.validateOpen_1 = ko.observable(true);
            self.open_1.subscribe(function(newvalue){
                if(newvalue == null){
                    self.validateOpen_1(true);
                } else {
                    self.validateOpen_1(false);
                }
            });

            self.validateClose_1 = ko.observable(true);
            self.close_1.subscribe(function(newvalue){
                if(newvalue == null){
                    self.validateClose_1(true);
                } else {
                    self.validateClose_1(false);
                }
            }); 

            self.open_1.valueHasMutated();           
            self.close_1.valueHasMutated();           

        }

        Restaurant.prototype.toJSON = function() {
            var copy = ko.toJS(this); //easy way to get a clean copy
            delete copy.areWeOpened;
            delete copy.areWeOpenedText;
            delete copy.socialVisible;
            return copy; //return the copy to be serialized
        };          

        function Restaurant(data) {
            console.log("New Restaurant: " + data.name);
            var self = this;
            self.languages = ko.observableArray(data.languages ? data.languages : ['en']);
            self.available_languages = ko.observableArray(_.map(_.pairs(fullLanguageName),function(lang){ return new Language(lang[1],lang[0]) }));
            self.name = ko.observable(data.name ? data.name : "");
            self.lat = ko.observable(data.lat ? data.lat : "");
            self.lon = ko.observable(data.lon ? data.lon : "");
            self.website = ko.observable(data.website ? data.website : "");
            self.email = ko.observable(data.email ? data.email : "");
            self.subdomain = ko.observable(data.subdomain ? data.subdomain : "");
            self.facebook = ko.observable(data.facebook ? data.facebook : "");
            self.foursquare = ko.observable(data.foursquare ? data.foursquare : "");
            self.instagram = ko.observable(data.instagram ? data.instagram : "");
            self.twitter = ko.observable(data.twitter ? data.twitter : "");
            self.phone = ko.observable(data.phone ? data.phone : "");
            self.address_line_1 = ko.observable(data.address_line_1 ? data.address_line_1 : "");
            self.address_line_2 = ko.observable(data.address_line_2 ? data.address_line_2 : "");
            self.city = ko.observable(data.city ? data.city : "");
            self.province = ko.observable(data.province ? data.province : "");
            self.postal_code = ko.observable(data.postal_code ? data.postal_code : "");
            self.design = ko.observable(data.design === undefined ? null : new Design(data.design));
            self.id = data._id;
            self.font_id = data.font_id ? data.font_id : "";
            self.user_id = data.user_id ? data.user_id : "";

            self.logo = ko.observable(data.logo ? new GlobalImage(data.logo) : new GlobalImage({}));
            self.logo_settings = ko.observable(data.logo_settings ? new LogoSettings(data.logo_settings) : new LogoSettings());

            self.about_text = ko.observable(data.about_text ? data.about_text : copyDefaultHash(default_web_language_hash));

            self.pages = ko.observableArray([]);

            if(data.pages){
                self.pages(_.map(data.pages,function(page){ return new Page(page) }));
            }

            self.hours = ko.observableArray([]);

            var hours_list = {
                monday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },
                tuesday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },
                wednesday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },   
                thusrday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },   
                friday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },   
                saturday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },    
                sunday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },                                               
            }

            if(data.hours){
                hours_list = data.hours;
            }

            self.available_hours = ko.observable(false);
            // if(_.find(_.pairs(hours_list), function(day){ return day[1].closed == false })){
            //     self.available_hours(true);
            // }

            _.each(_.pairs(hours_list), function(day){
                if(day[1].closed == false) {
                    self.available_hours(true);
                }
                var day = new Day(day[0],day[1]);
                self.hours.push(day);
            });

            var convert_day = {
                0:6,
                1:0,
                2:1,
                3:2,
                4:3,
                5:4,
                6:5,
            }

            self.areWeOpened = ko.computed(function(){
                var d = convert_day[(new Date()).getDay()];
                var current_day = self.hours()[d];
                if(current_day.closed() || current_day.open_1() === undefined){
                    return false;
                }
                var start = current_day.open_1();
                if(start == null){
                    return false;
                }                
                start = start.split(":");
                start = new Date(2012,6,1,start[0],start[1]).getTime();
                console.log(start);                
                var now = new Date(2012,6,1,new Date().getHours(),new Date().getMinutes()).getTime();
                var end = current_day.close_1();
                if(end == null){
                    return false;
                }
                end = end.split(":");
                end = new Date(2012,6,1,end[0],end[1]).getTime();
                console.log(end);

                if(start > end){
                    var midnight = new Date(2012,6,1,"23","59").getTime();
                    var one_second_after_midnight = new Date(2012,6,1,"00","01").getTime();
                    if((now > start && now < midnight) || (now > one_second_after_midnight && now < end)) {
                        return true;
                        console.log("opened");
                    }
                    else {
                        return false;
                        console.log("closed");
                    }                     
                } else {
                    if( (start < now ) && (now < end )) {
                        return true;
                        console.log("opened");
                    }
                    else {
                        return false;
                        console.log("closed");
                    }                      
                }
              
            });  

            self.areWeOpenedText = ko.computed(function(){ return self.areWeOpened() ? 'open' : 'closed'});        

            self.socialVisible = function(type){
                return ko.computed(function(){
                    if(self[type]() != null && self[type]() != ""){
                        return true;
                    } else {
                        return false;
                    }
                })                
            }  

            self.createNewPageText = ko.computed(function(){
                if(self.pages().length < 3){
                    return "Create New Page";
                } else {
                    return "Max Pages Reached";
                }
            });        

            self.save = function(callback_done){
                self.subdomain.valueHasMutated();
                if(!self.validateSubdomain()){
                    bootbox.dialog({
                      message: "The subdomain you've chosen is either invalid or unavailable.",
                      title: "Invalid Subdomain",
                      buttons: {
                        success: {
                          label: "Ok",
                          className: "btn-primary pull-right col-xs-3",
                        },
                      }
                    }); 
                    return;                    
                }
                if(!self.validateAddress()){
                    bootbox.dialog({
                      message: "Please enter your restaurant address so that your users can find you.",
                      title: "Blank Address",
                      buttons: {
                        success: {
                          label: "Ok",
                          className: "btn-primary pull-right col-xs-3",
                        },
                      }
                    }); 
                    return;                    
                }
                if(!self.validatePhone()){
                    bootbox.dialog({
                      message: "You havent entered a phone number. Please do so that your customers can get in touch with you.",
                      title: "Blank Phone",
                      buttons: {
                        success: {
                          label: "Ok",
                          className: "btn-primary pull-right col-xs-3",
                        },
                      }
                    }); 
                    return;                    
                }                                

                var validate_hours = _.every(self.hours(),function(e){ 
                    if(e.closed()){
                        return true;
                    }
                    return (!e.closed() && !e.validateOpen_1() && !e.validateClose_1());
                });

                if(!validate_hours){
                    bootbox.dialog({
                      message: "The hours you entered are incorrect or missing. Look for the one highlighted red.",
                      title: "Invalid Hours",
                      buttons: {
                        success: {
                          label: "Ok",
                          className: "btn-primary pull-right col-xs-3",
                        },
                      }
                    }); 
                    return;                    
                }    

                $.ajax({
                  type: "POST",
                  url: "/app/administration/update_restaurant",
                  data: {
                    restaurant_id: self.id,
                    params:ko.toJSON(self),
                  },
                  success: function(data, textStatus, jqXHR){
                        bootbox.dialog({
                          message: "Your information was saved",
                          title: "Saved!",
                          buttons: {
                            success: {
                                label: "Ok",
                                className: "btn-primary pull-right col-xs-3",
                                callback: function(){
                                    self.dirty(false);
                                    if(typeof(callback_done) == 'function'){
                                        callback_done();
                                    }
                                }                              
                            },                            
                          },
                        });      
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        console.log("There was an error saving the section " + errorThrown);
                    },
                    dataType: "json"
                });                
            }

            self.subdomain.extend({ rateLimit: 700 });
            self.validateSubdomain = ko.observable(true);
            if(self.subdomain() == ""){
                self.validateSubdomain(false);
            }

            self.validateAddress = ko.computed(function(){
                if(self.address_line_1().length == 0){
                    return false;
                } else {
                    return true;
                }
            })

            self.validatePhone = ko.computed(function(){
                if(self.phone().length == 0){
                    return false;
                } else {
                    return true;
                }
            })            

            self.subdomain.subscribe(function(newvalue){
                if(newvalue == ""){
                    self.validateSubdomain(false);
                }
                $.ajax({
                  type: "POST",
                  url: "/app/administration/validate_subdomain",
                  data: {
                    restaurant_id: self.id,
                    subdomain: newvalue,
                  },
                  success: function(data, textStatus, jqXHR){
                        if(data.valid){
                            self.validateSubdomain(true);
                        } else {
                            self.validateSubdomain(false);
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        console.log("There was an error saving the section " + errorThrown);
                        self.validateSubdomain(false);
                    },
                    dataType: "json"
                });
            });

            self.quick_save = function(callback_done){  
                $.ajax({
                  type: "POST",
                  url: "/app/administration/update_restaurant",
                  data: {
                    restaurant_id: self.id,
                    params:ko.toJSON(self),
                  },
                  success: function(data, textStatus, jqXHR){
                        bootbox.dialog({
                          message: "Saved!",
                          title: "Saved!",
                          buttons: {
                            success: {
                                label: "Ok",
                                className: "btn-primary pull-right col-xs-3",
                                callback: function(){
                                    if(typeof(callback_done) == 'function'){
                                        callback_done();
                                    }
                                }                              
                            },                            
                          },
                        });      
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        console.log("There was an error saving the section " + errorThrown);
                    },
                    dataType: "json"
                });                
            }

            self.dirty = ko.observable(false);
            self.dirtyTrack = ko.computed(function(){
                self.name();
                self.subdomain();
                self.address_line_1();
                self.phone();
                self.city();
                self.postal_code();
                self.province();
                self.email();
                self.dirty(true);
            });
            self.dirty(false);

            self.newPage = function(){
                var new_page = new Page();
                self.pages.push(new_page);
                return new_page;
            }

        }

        ko.bindingHandlers.fixSubdomain = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel)
            {
                var value = ko.utils.unwrapObservable(valueAccessor());
                if(value === undefined){
                    value == "";
                }
                viewModel.subdomain(value.replace(/[^0-9a-zA-Z]/g, ''));
            }
        };         


        ko.bindingHandlers.slider = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel)
            {
                var value = valueAccessor();
                var min = value[1];
                var max = value[2];
                value = value[0];

                $( element ).slider({
                  slide: function( event, ui ) {
                    value(ui.value);
                  },
                  max: max,
                  min: min,
                  step: 1,
                  value: value(),
                });
            }
        };

        ko.bindingHandlers.colorpicker = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel)
            {
                var value = valueAccessor();
                $(element).colpick({
                    colorScheme:'dark',
                    layout:'hex',
                    color:value(),
                    onSubmit:function(hsb,hex,rgb,el) {
                        $(el).css('background-color', '#'+hex);
                        value(hex);
                        $(el).colpickHide();
                    },
                    onChange:function(hsb,hex,rgb,el,bySetColor) {
                        $(el).css('background-color', '#'+hex);
                        value(hex);
                    }                    
                });
                $(element).css("background-color","#"+value());
            }
        };                               

/*









*/

//<![CDATA[ 

ko.bindingHandlers.fitText = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var self = this;
        // var value = valueAccessor();
        //console.log("DEBUG: fitText firing on: " + element);
        // $(element).fitText(1.2,{ minFontSize: '20px', maxFontSize: '60px' }).resize()
        var resize = function(){
            $(element).parent().textfill({ maxFontPixels: 36});
        }

        $(window).on('resize orientationchange', resize);        

        // if(value){
        //     resize();
        // }

        resize();
    }
};

ko.bindingHandlers.helperTip = {
    init: function(element, valueAccessor) {
        var data = valueAccessor();
        if(!$('#' + data.template)[0]){
            return;
        }
        var new_element = document.createElement("div");
        //append a new ul to our element
        document.body.appendChild(new_element);

        //could use jQuery or DOM APIs to build the "template"
        new_element.innerHTML = $('#' + data.template).text();

        new_element = $(new_element).find("div")[0];

        data.when.helperFitter = ko.computed(function(){
            if(data.when()){
                if(data.position == 'bottom'){
                    var bodyRect = document.body.getBoundingClientRect();
                    var elemRect = element.getBoundingClientRect();
                    var offset   = elemRect.bottom + 10;
                    var right_offset   = elemRect.right - ($(element).width()/2);;
                    $(new_element).css("top",offset+'px');
                    $(new_element).css("left",right_offset+'px');
                } else {
                    var bodyRect = document.body.getBoundingClientRect();
                    var elemRect = element.getBoundingClientRect();
                    var offset   = elemRect.top - bodyRect.top + ($(element).height()/2);
                    var right_offset   = elemRect.right + 10;
                    offset = offset - ($(new_element).height()/2);
                    $(new_element).css("top",offset+'px');
                    $(new_element).css("left",right_offset+'px');
                }
            }           
        });

        //apply foreach binding to the newly created ul with the data that we passed to the binding
        ko.applyBindingsToNode(new_element, { visible: data.when });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            // This will be called when the element is removed by Knockout or
            // if some other part of your code calls ko.removeNode(element)
            $(new_element).remove();
        });        

        //tell Knockout that we have already handled binding the children of this element
        return { controlsDescendantBindings: true };
    },
}

var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 200000, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

Section.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.topmodel;
    return copy; //return the copy to be serialized
};  

function Section(data,topmodel) {

    var self = this;
    self.topmodel = topmodel;
    self.id = ko.observable();
    self.position = ko.observable(data.position ? data.position : 0);

    if(data._id){
        self.id(data._id);
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_section",
              data: {
                restaurant_id: restaurant_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Section Saved.");
                    self.id(data.id);          
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the section " + errorThrown);
                },
                dataType: "json"
            });
        }
    }
    self.name = ko.observable(data.name);
    // self.subsections = ko.observableArray($.map(data.subsection, function(item) { return new Subsection(item) }));

    self.dishes = ko.observableArray([]);
    if(data.dishes){
        self.dishes = ko.observableArray($.map(data.dishes, function(item) { return new Dish(item,self) }));     
    }

    // self.dishes.extend({ rateLimit: 500 });
    self.dishes.subscribe(function(newvalue){
        _.each(self.dishes(),function(item,index){
            // console.log(item.name());
            item.position(index);
        });
    });    

    self.printJson = function(){
        console.log(ko.toJSON(self));
    }    

    if(data.dom_id){
        self.dom_id = data.dom_id;
    } else {
        self.dom_id = "";
    } 

    self.computed_name = ko.computed(function(){
        var reso = currentLangName(self.name);
        if(reso['reso'] == ""){
            if(reso['en'] == ""){
                return "New Section";                
            } else {
                return reso['en'];
            }
        } else {
            return reso['reso'];
        }
    });

    self.title_image = ko.computed(function() {
        // if(self.images().length > 0){
        //     return self.images()[0].url
        // } else {
            return "/app/public/icon@2x.png"
        // }
    }, self);        

    self.editing_name = ko.observable(false);
    // Behaviors
    self.edit_name = function() { 
        //console.log("Section Editing! " + self.editing_name());
        self.editing_name(true);
        //console.log("Section Editing! " + self.editing_name());     
    }; 

    self.remove = function(item) {
        bootbox.dialog({
          message: localizeMessage(item.name(),"remove_dish"),
          title: "Remove Dish",
          buttons: {
            success: {
              label: "No",
              className: "btn-default pull-left col-xs-3",
              callback: function() {

              }
            },
            danger: {
              label: "Yes",
              className: "btn-danger col-xs-3 pull-right",
              callback: function() {
                topmodel.current_dish(null);
                self.dishes.remove(item);
              }
            },
          }
        });        
    }

    // Operations
    self.newDishName = ko.observable();
    self.addDish = function() {
        // console.log("Adding Dish");
        var new_dish = new Dish({name:copyDefaultHash(default_language_hash), description:copyDefaultHash(default_language_hash)},self);
        self.dishes.unshift(new_dish);
        self.topmodel.current_section(null);
        self.topmodel.current_dish(new_dish);
    }   

}

function Image(data) {
    var self = this;
    self.progressValue = ko.observable(1);
    self.filename = ko.observable("");
    self.id = ko.observable("");
    self.url = ko.observable("/loader.gif");
    self.original = ko.observable("/loader.gif");
    self.medium = ko.observable("/loader.gif");
    self.completed = ko.observable(false);
    self.image_width = ko.observable(0);
    self.image_height = ko.observable(0);
    self.coordinates = [];
    self.failed = ko.observable(false);

    if(data){
        if(data.local_file || data.url){
            self.id(data._id);
            self.url = ko.observable(data.local_file || data.url);
            self.completed(true);
            self.original = ko.observable(data.original);
            self.medium = ko.observable(data.medium);
            self.image_width = ko.observable(data.width);
            self.image_height = ko.observable(data.height);            
        }  
    }

    self.crop = function(){
        $.ajax({
              type: "POST",
              url: image_crop_url,
              data: {
                image_id: self.id(),
                coordinates: self.coordinates,
            },
            success: function(data, textStatus, jqXHR){
                self.update_info(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log(textStatus);
            },
            dataType: "json"
        }); 
    } 

    self.update_info = function(item){
        self.url(item.thumbnailUrl);
        self.completed(true);
        self.id(item.image_id);
        self.original(item.original);
        self.image_width = ko.observable(item.width);
        self.image_height = ko.observable(item.height); 
    }
}

ko.bindingHandlers.file_upload = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var self = this;
        viewModel.imageModel;
        $(element).fileupload({
            dropZone: $(element),
            formData: {restaurant_id: restaurant_id},
            url: image_upload_url,
            dataType: 'json',
            progressInterval: 50,
            send: function (e, data) {
                $.each(data.files, function (index, file) {
                    viewModel.imageModel = viewModel.addImage();
                    //console.log(viewModel.imageModel);
                    viewModel.imageModel.filename(file.name);
                });                
            },
            done: function (e, data) {
                var file = data.result.files[0];
                viewModel.imageModel.update_info(file);                
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                viewModel.imageModel.progressValue(progress);
            },
            fail: function (e, data) {
                viewModel.imageModel.failed(true);
            },      
        });
    }
};

ko.bindingHandlers.file_upload_icon = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var self = this;
        viewModel.imageModel;
        $(element).fileupload({
            dropZone: $(element),
            formData: {restaurant_id: restaurant_id},
            url: icon_upload_url,
            dataType: 'json',
            progressInterval: 50,
            send: function (e, data) {
                $.each(data.files, function (index, file) {
                    viewModel.imageModel = viewModel.addImage();
                    //console.log(viewModel.imageModel);
                    viewModel.imageModel.filename(file.name);
                });                
            },
            done: function (e, data) {
                var file = data.result.files[0];
                viewModel.imageModel.update_info(file);                               
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                viewModel.imageModel.progressValue(progress);
            },
            fail: function (e, data) {
                viewModel.imageModel.failed(true);
            },                       
        });
    }
};

Dish.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.topmodel; //remove an extra property
    return copy; //return the copy to be serialized
};

function Dish(data, topmodel) {
    var self = this;
    self.name = ko.observable(data.name);  
    self.description = ko.observable(data.description);
    self.price = ko.observable(data.price);
    self.topmodel = topmodel;
    self.position = ko.observable(data.position ? data.position : 0);
    self.images = ko.observableArray([]);
    self.sizeSelectedOptionValue = ko.observable();
    self.modalVisible = ko.observable(false);

    self.printJson = function(){
        console.log(ko.toJSON(self));
    }

    self.computed_name = ko.computed(function(){
        var reso = currentLangName(self.name);
        if(reso['reso'] == ""){
            if(reso['en'] == ""){
                return "New Dish";                
            } else {
                return reso['en'];
            }
        } else {
            return reso['reso'];
        }
    });

    self.id = ko.observable();

    if(data._id){
        self.id(data._id);
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_dish",
              data: {
                restaurant_id: restaurant_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Section Saved.");
                    self.id(data.id);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the section " + errorThrown);
                },
                dataType: "json"
            });
        }
    }

    if(data.has_multiple_sizes){
        self.sizes = ko.observable(true);
        //console.log("data size:");
        //console.log(data.sizes);
        self.sizes_object = ko.observable(new Option(data.sizes,self));
    } else {
        self.sizes = ko.observable(false);
        //console.log("no data sizes");
        if(data.sizes){
            self.sizes_object = ko.observable(new Option(data.sizes,self));
        } else {
            self.sizes_object = ko.observable(new Option({type:"size",name:copyDefaultHash(default_sizes_hash),individual_options:[{name:copyDefaultHash(default_sizes_hash_small),price:'0.0'},{name:copyDefaultHash(default_sizes_hash_large),price:'0.0'}]},self));            
        }
    }

    self.sizeSelectedOptionValue = ko.observable(self.sizes_object().individual_options()[0]);  

    self.options = ko.observableArray([]);
    if(data.options){
        self.options = ko.observableArray($.map(data.options, function(item) { return new Option(item,self) }));        
    }

    if(data.image) {
        self.images = ko.observableArray($.map(data.image, function(item) { return new Image(item) }));                
    }

    self.quantity = ko.observable(1);

    self.computed_price = ko.computed(function() {
        var cost;
        if(self.sizes()){
            cost = parseFloat(self.sizeSelectedOptionValue().price());
        } else {
            cost = parseFloat(self.price());
        }
        _.each(self.options(),function(e){
            var plus_price = parseFloat(e.computed_price());
            // console.log("dish object -> " + plus_price + "\n" + cost + "\n---");
            cost = cost + plus_price;
            // console.log("new price: " + cost);
        });
        cost = cost * self.quantity();
        if(isNaN(cost)){
            return (0).toFixed(2);
        }
        return parseFloat(cost).toFixed(2);
    }, self);

    self.title_image = ko.computed(function() {
        if(self.images().length > 0){
            return self.images()[0].url();
        } else {
            return "/app/public/icon@2x.png";
        }
    }, self);  

    self.large_title_image = ko.computed(function() {
        if(self.images().length > 0){
            return self.images()[0].original();
        } else {
            return false;
        }
    }, self);  

    self.lazyLoadImage = ko.computed(function(){
        if(self.images().length > 0){
            return self.images()[0].original();
        } else {
            return "";
        }
    });

    self.lazyLoadMediumImage = ko.computed(function(){
        if(self.images().length > 0){
            return self.images()[0].medium();
        } else {
            return "";
        }
    });    

    self.addQuantity = function(){
        if(self.quantity() == 12){
            return;
        } else {
            self.quantity(self.quantity() + 1);
        }            
    }    

    self.subQuantity = function(){
        if(self.quantity() == 1){
            return;
        } else {
            self.quantity(self.quantity() - 1);
        }            
    }      

    self.editing = ko.observable(false);
    // Behaviors
    self.edit = function() { 
        console.log("Editing "+self.name()+"!");
        self.editing(true) 
    };

    self.editing_name = ko.observable(false);
    // Behaviors
    self.edit_name = function() { 
        console.log("Editing_name!");
        self.editing_name(true) 
    };

    // Which option template to use.
    self.templateToUse = function(item) {
        if(item.type == "size"){
            return 'size';
        } else {
            return 'default';
        }
    }

    self.addOption = function() { 
        console.log("Adding option!");
        self.options.push(new Option({name:copyDefaultHash(default_language_hash), type:"generic",placeholder:"Type the option group title here.",individual_options:[{placeholder:"Type the first option title here.",price:'0.0',name:copyDefaultHash(default_language_hash)},{placeholder:"Type the second option title here.",price:'0.0', name: copyDefaultHash(default_language_hash)}]},self));
    };

    self.addImage = function(item) { 
        var new_image = new Image(item);
        self.images.unshift(new_image);
        return new_image;
    };  

    self.removeImage = function(item) { 
        bootbox.dialog({
          message: localizeMessage(null,"remove_image"),
          title: "Remove Image",
          buttons: {
            success: {
              label: "No",
              className: "btn-default pull-left col-xs-3",
              callback: function() {

              }
            },
            danger: {
              label: "Yes",
              className: "btn-danger col-xs-3 pull-right",
              callback: function() {
                self.images.remove(item);
              }
            },
          }
        });        
    };      

    // Which option template to use.
    self.remove = function(item) {
        bootbox.dialog({
          message: "Are you sure you want to remove the option titled \"" + item.name() + "\"?",
          title: "Remove Option",
          buttons: {
            success: {
              label: "No",
              className: "btn-default pull-left col-xs-3",
              callback: function() {

              }
            },
            danger: {
              label: "Yes",
              className: "btn-danger col-xs-3 pull-right",
              callback: function() {
                self.options.remove(item);
              }
            },
          }
        });
    }

    self.triggerImageSelect = function(index){
        $('#image_upload' + index).click();
    }

    self.computedWidth = ko.computed(function(){
        var modal_width = 0;
        if(self.large_title_image()){
            modal_width += 40;
        }
        if(self.sizes() || self.description()[lang()]){
            modal_width += 40;
        }
        if(modal_width > 0){
            return modal_width + "%";
        } else {
            return "400px";
        }
    });

    self.computedHeight = ko.computed(function(){
        // var modal_width = 0;
        if(self.large_title_image()){
            // modal_width += 40;
            return '80%';
        }
        return '40%';
        // if(self.sizes() || self.description()[lang()]){
        //     modal_width += 40;
        // }
        // if(modal_width > 0){
        //     return "80%";
        // }
    });   

    self.modalImageWidth = ko.computed(function(){
        if(!self.sizes() && !self.description()[lang()]){
            return "dish_full";
        } else {
            return "dish_half";
        }
    }); 

    self.modalDescriptionWidth = ko.computed(function(){
        if(!self.large_title_image()){
            return "dish_full";
        } else {
            return "dish_half";
        }
    });

    self.noContent = ko.computed(function(){
        if(!self.sizes() && !self.description()[lang()] && !self.large_title_image()){
            return true;
        }
        return false;
    });                  

}

ko.bindingHandlers.modalResize = {
    update: function (element, valueAccessor) {
        var value = valueAccessor()();
        if(value){
            element = $(element);
            // var other_element = element.find(".custom_modal_body");
            var last_element = element.find(".dish_modal_body");
            // other_element.css("bottom","initial");
            var max_height = last_element.height();
            if(max_height < 75){
                max_height = 75;
            }
            if(max_height > 100){
                console.log("Big")
            }
            element.css("min-height",max_height + "px");
            // other_element.css("bottom","0px");
        }
    }
};

ko.bindingHandlers.menuImage = {
    update: function (element, valueAccessor) {
        // console.log("menuImaged");
        if(ko['menuVisible'] === undefined){
            ko['menuVisible'] = ko.observable(false);
        }
        var underlyingObservable = valueAccessor();
        if(ko.menuVisible()){
            element.setAttribute('src', underlyingObservable());
        } else {
            element.setAttribute('src', "");
        }
    }
}; 

ko.bindingHandlers.modalImage = {
    update: function (element, valueAccessor, allBindings, bindingContext) {
        var visible = valueAccessor();
        if(bindingContext.modalVisible()){
            element.setAttribute('src', valueAccessor()());
        } else {
            element.setAttribute('src', "");
        }
    }
}; 

Option.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.dish; //remove an extra property
    delete copy.multiple_prices; 
    delete copy.sizes_object_names; 
    return copy; //return the copy to be serialized
};

function Option(data,dish) {
    var self = this;
    self.name = ko.observable(data.name);
    self.dish = dish;
    self.advanced = ko.observable(false);  
    self.extra_cost = ko.observable(false); 
    self.placeholder = ko.observable("Type the option title here.");

    if(data.placeholder){
        self.placeholder(data.placeholder);
    }

    self.id = ko.observable();

    if(data._id){
        self.id(data._id);
        self.advanced(data.advanced);
        if(data.extra_cost){
            self.extra_cost(data.extra_cost);
        }
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_option",
              data: {
                restaurant_id: restaurant_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Option Saved.");
                    self.id(data.id);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the option " + errorThrown);
                },
                dataType: "json"
            });
        }
    }

    self.type = data.type; 
    self.max_selections = ko.observable(data.max_selections ? data.max_selections : 0);
    self.min_selections = ko.observable(data.min_selections ? data.min_selections : 0);  
    self.multiple_prices = self.dish.sizes;

    if(data.type != "size"){
        // This is the list of size options if this happens to be the size option version of this model.
        self.sizes_object_names = dish.sizes_object().individual_options;
    }

    self.individual_options = ko.observableArray([]);
    if(data.individual_options){
        self.individual_options = ko.observableArray($.map(data.individual_options, function(item) { return new IndividualOption(item,self)})); 
    }

    self.max_selection_list = ko.computed(function(){
        var list = [];
        _.each(self.individual_options(),function(item, index){ list.push(index + 1) });
        return list;
    });

    self.min_selection_list = ko.computed(function(){
        var list = [];
        _.each(self.individual_options(),function(item, index){ list.push(index) });
        return list;
    });    

    self.selectedOptionValue = ko.observableArray([]);
  
    self.maxSelectionsMet = ko.computed(function(){
        if(self.selectedOptionValue().length >= self.max_selections()){
            return true;
        } else {
            return false;
        }
    });

    self.computed_price = ko.computed(function(){
        var cost = 0;
        if(self.extra_cost()) {
            _.each(self.selectedOptionValue(),function(e){
                // console.log(e);
                cost += parseFloat(e.computed_price());
            });
        }
        return cost;
    });



    self.option_title = ko.computed(function(){
        return "Add an option to " + self.dish.name() + ".";
    });    

    self.editing_name = ko.observable(false);
    self.edit_name = function() { 
        self.editing_name(true);    
    };  

    // Which option template to use.
    self.addSize = function() {
        self.individual_options.push(new IndividualOption({name:copyDefaultHash(default_language_hash),placeholder:"Type new size title here.",price:'0.0'},self));        
    }

    // Which option template to use.
    self.addOption = function() {
        self.individual_options.push(new IndividualOption({name:copyDefaultHash(default_language_hash),placeholder:"Type new option title here.",price:'0.0'},self));
    }   

    // Which option template to use.
    self.remove = function(item) {
        bootbox.dialog({
          message: "Are you sure you want to remove the size option titled \"" + item.name() + "\"?",
          title: "Remove Size Option",
          buttons: {
            success: {
              label: "No",
              className: "btn-default pull-left col-xs-3",
              callback: function() {

              }
            },
            danger: {
              label: "Yes",
              className: "btn-danger col-xs-3 pull-right",
              callback: function() {
                item.remove_size_options();     
                self.individual_options.remove(item);
              }
            },
          }
        });        
    }

    self.toggleAdvanced = function() {
        self.advanced(!self.advanced());
    }

}

function SizePrices(data) {
    var self = this;
    self.name = data.name;  
    self.ind_opt = data.ind_opt;
    self.size_ind_opt = data.size_ind_opt;
    self.size_ind_opt_id = data.size_ind_opt._id;
    self.price = ko.observable(data.price);
    self.e_price = ko.observable(false);  
    self.size_id = ko.observable(data.size_id);

    self.edit_price_size = function() { 
        self.e_price(true);     
    };  

    self.remove_self = function(){
        bootbox.dialog({
          message: "Are you sure you want to remove the suboption titled \"" + item.name() + "\"?",
          title: "Remove Suboption",
          buttons: {
            success: {
              label: "No",
              className: "btn-default pull-left col-xs-3",
              callback: function() {

              }
            },
            danger: {
              label: "Yes",
              className: "btn-danger col-xs-3 pull-right",
              callback: function() {
                self.ind_opt.remove_size_option(self);
              }
            },
          }
        });        
    }    
}
SizePrices.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.ind_opt; //remove an extra property
    delete copy.size_ind_opt;    
    return copy; //return the copy to be serialized
};


IndividualOption.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.option; //remove an extra property
    delete copy.dish; 
    delete copy.type;  
    delete copy.size_prices_to_remove; 
    return copy; //return the copy to be serialized
};
function IndividualOption(data,option) {

    var self = this;
    self.id = ko.observable();
    if(data._id){
        self.id(data._id);
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_individual_option",
              data: {
                restaurant_id: restaurant_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Individual Option Saved.");
                    self.id(data.id);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the individual option " + errorThrown);
                },
                dataType: "json"
            });
        }
    }
    self.option = option;
    self.name = ko.observable(data.name);
    self.price = ko.observable(data.price);     
    self.type = option.type;
    self.dish = option.dish;
    self.destroy_it = false;
    self.icon = ko.observable();
    self.size_prices = ko.observableArray([]); 
    self.price_according_to_size = ko.observable(false); 
    self.placeholder = ko.observable("Type the option here.");

    if(data.placeholder){
        self.placeholder(data.placeholder);
    }    

    if(data.icon) {
        self.icon(new Image(data.icon));               
    }  

    if(data.price_according_to_size){
        self.price_according_to_size(data.price_according_to_size);
    }  

    if(data.size_prices && self.type != 'size'){
        _.each(data.size_prices,function(e){
            var found_object = _.find(self.option.sizes_object_names(),function(i){ return i.id() == e.size_id});
            if(found_object){
                var new_size_prices = new SizePrices({name:found_object.name,size_id:found_object.id,price:e.price,ind_opt:self,size_ind_opt:found_object});
                self.size_prices.push(new_size_prices);
            } 
        });        
    }

    // if this is a size version of Options, then we need to remove all SizePrices from all other options. They will be pushed to this array.
    self.size_prices_to_remove = new Array();

    if(self.type != "size"){

        // self.option.size_object is the size version of the options model. It lists the IndividualOptions of each size.
        _.each(self.option.sizes_object_names(),function(e){
            if(_.find(self.size_prices(),function(i){ return i.size_ind_opt == e})===undefined){
                self.new_size_prices = new SizePrices({
                                                        name:e.name,
                                                        size_id:e.id,
                                                        price:0.0,
                                                        ind_opt:self,
                                                        size_ind_opt:e
                                                    });
                self.size_prices.push(self.new_size_prices);
                e.size_prices_to_remove.push(self.new_size_prices);
            } 
        });

        self.option.sizes_object_names.subscribe(function (newValue) {
                _.each(self.option.sizes_object_names(),function(e){
                    if(_.find(self.size_prices(),function(i){ return i.size_ind_opt == e}) === undefined){
                        self.new_size_prices = new SizePrices({
                                                                name:e.name,
                                                                size_id:e.id,
                                                                price:0.0,
                                                                ind_opt:self,
                                                                size_ind_opt:e
                                                            });
                        self.size_prices.push(self.new_size_prices);
                        e.size_prices_to_remove.push(self.new_size_prices);
                    } 
                });
        }, self);

        self.computed_price = ko.computed(function(){
            // console.log("self.computed_price -> " + self.dish.sizes());
            if(self.dish.sizes()){
                if(self.price_according_to_size()){
                    var p = _.find(self.size_prices(),function(i){ return i.name() == self.dish.sizeSelectedOptionValue().name()});
                    //console.log(p);   
                    return p.price();
                } else {
                    //console.log(self.name() + " <--");
                    return self.price();
                }
            }
            return self.price();
        });

    }

    self.remove_size_option = function(item) {      
        self.size_prices.remove(item);      
    };  

    self.remove_size_options = function(){
        _.each(self.size_prices_to_remove,function(e){e.remove_self()}); 
    };

    self.editing_name = ko.observable(false);
    self.edit_name = function() { 
        self.editing_name(true);    
    }; 

    self.editing_price = ko.observable(false);
    self.edit_price = function() { 
        self.editing_price(true);   
    }; 

    self.addImage = function(item) { 
        var new_image = new Image(item);
        self.icon(new_image);
        return new_image;
    };  

    self.clickable = ko.computed({
        read: function(){
            if(!self.option.advanced()){
                return false;
            }
            if(self.option.maxSelectionsMet() && !(self.option.selectedOptionValue().indexOf(self) >= 0)){
                return true;
            } else {
                return false;
            }
        },
        deferEvaluation: true,
    });     
}

// function Restaurant(data) {
//     var self = this;
//     self.name = ko.observable(data.name);
//     self.lat = ko.observable(data.lat);
//     self.lon = ko.observable(data.lon);
//     self.id = data._id;
//     self.phone = ko.observable("450-458-0123");
//     self.address = ko.observable("45 Creme Brule");

//     self.image = ko.observable(new Image({local_file:"/assets/help.jpg"}));

//     if(data.images && data.images[0]) {
//         //console.log(data.images[0]);
//         self.image(new Image(data.images[0]));                
//     }    
// }

var editing_mode = true;
var lang;
function MenuViewModel() {
    // Data
    var self = this;
    self.menu = ko.observableArray([]);
    self.newDomCounter = 0;
    self.preview = ko.observable(false);
    self.restaurant = ko.observable(new Restaurant(resto_data));    
    self.languages = self.restaurant().languages;
    self.lang = ko.observable('en');
    lang = self.lang;
    var skip_warning = false;

    self.show_lang = ko.computed(function(){
        if(self.languages().length > 1){
            return true;
        } else {
            return false;
        }
    });    


    self.togglePreview = function(){
        self.preview(!self.preview());
    }

    self.previewText = ko.computed(function(){
        if(self.preview()){
            return "Web Preview"
        } else {
            return "iPhone Preview"
        }
    });

    // self.menu.extend({ rateLimit: 500 });
    self.menu.subscribe(function(newvalue){
        _.each(self.menu(),function(item,index){
            console.log(item.name());
            item.position(index);
        });
        console.log("----------------");
    });

    self.menu($.map(menu_data.menu, function(item) { return new Section(item,self) }));
    $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});

    self.current_dish = ko.observable();
    self.current_section = ko.observable();

    self.set_dish = function(dish) {
        self.current_section(null);
        self.current_dish(dish);
        $("body").animate({scrollTop:0}, '100', 'swing');
    };

    self.set_section = function(section) {
        self.current_dish(null);
        self.current_section(section);
        $("body").animate({scrollTop:0}, '100', 'swing');
    };    

    self.current_dish_check = function(dish) {    
        if(dish == self.current_dish()){
            return true;
        } else {
            return false;
        }
    } 

    self.current_section_check = function(section) {    
        if(section == self.current_section()){
            return true;
        } else {
            return false;
        }
    }   

    // Operations
    self.newSectionName = ko.observable();
    self.addSection = function() {
        console.log("Adding Section");
        self.newDomCounter++;
        var new_section = new Section({name:copyDefaultHash(sectionNames),subsection:[],dom_id:self.newDomCounter},self);
        self.menu.push(new_section);
        self.current_section(new_section);
        self.current_dish(null);
        // var target = "#"+self.newDomCounter;
        // $('html').animate({
        //     scrollTop: $(target).offset().top
        // }, 500);
    } 

    self.showModal = function(image) {
        console.log("#"+image.id());
        $("#"+image.id()).modal("show");
    };      

    self.publishMenu = function() {
        bootbox.dialog({
          message: "Are you sure you want to publish your changes to the menu? The changes will be immediately visible to the world.",
          title: "Publish Menu",
          buttons: {
            success: {
              label: "Cancel",
              className: "btn-default pull-left col-xs-5",
              callback: function() {

              }
            },
            danger: {
              label: "Publish",
              className: "btn-success col-xs-5 pull-right",
              callback: function() {

                var spinner = new Spinner(opts).spin(document.getElementById('center')); 
                $('#loading').fadeIn();

                $.ajax({
                  type: "POST",
                  url: "/app/administration/publish_menu",
                  data: {
                    restaurant_id: restaurant_id,
                    menu: ko.toJSON(self.menu)
                  },
                  success: function(data, textStatus, jqXHR){
                        // self.menu($.map(data.menu, function(item) { return new Section(item) }));
                        // $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});
                        spinner.stop();
                        $('#loading').fadeOut();
                        bootbox.alert("Menu Published!");
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        spinner.stop();
                        $('#loading').fadeOut();
                        bootbox.alert("There was an error publishing the menu.\n" + errorThrown);
                    },
                  dataType: "json"
                }); 
              }
            },
          }
        });          
    } 

    self.discardDraft = function() {
        bootbox.dialog({
          message: "Are you sure you want to discard all your changes? Everything will revert to your last save.",
          title: "Discard Draft",
          buttons: {
            success: {
              label: "Continue Editing",
              className: "btn-default pull-left col-xs-5",
              callback: function() {

              }
            },
            danger: {
              label: "Discard Draft",
              className: "btn-danger col-xs-5 pull-right",
              callback: function() {
                skip_warning = true;
                location.reload();
                // var spinner = new Spinner(opts).spin(document.getElementById('center')); 
                // $('#loading').fadeIn();

                // $.ajax({
                //   type: "POST",
                //   url: "/app/administration/reset_draft_menu",
                //   data: {
                //     restaurant_id: restaurant_id,
                //     menu: ko.toJSON(self.menu)
                //   },
                //   success: function(data, textStatus, jqXHR){
                //         // self.menu($.map(data.menu, function(item) { return new Section(item) }));
                //         // $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});
                //         spinner.stop();
                //         $('#loading').fadeOut();
                //         skip_warning = true;
                //         window.location.href = "/app";
                //     },
                //     error: function(XMLHttpRequest, textStatus, errorThrown) { 
                //         spinner.stop();
                //         $('#loading').fadeOut();
                //         bootbox.alert("There was an error publishing the menu.\n" + errorThrown);
                //     },
                //   dataType: "json"
                // }); 
              }
            },
          }
        });          
    }     

    self.for_real_discard = function(){
        $.ajax({
          type: "POST",
          url: "/app/administration/reset_draft_menu",
          data: {
            restaurant_id: restaurant_id,
            menu: ko.toJSON(self.menu)
          },
          success: function(data, textStatus, jqXHR){
                // self.menu($.map(data.menu, function(item) { return new Section(item) }));
                // $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});
                skip_warning = true;
                window.location.href = "/app";
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                bootbox.alert("There was an error publishing the menu.\n" + errorThrown);
            },
          dataType: "json"
        });        
    }  

    self.remove = function(item) {
        bootbox.dialog({
          message: localizeMessage(item.name(),"delete_section"),
          title: "Remove Section",
          buttons: {
            success: {
              label: "No",
              className: "btn-default pull-left col-xs-3",
              callback: function() {

              }
            },
            danger: {
              label: "Yes",
              className: "btn-danger col-xs-3 pull-right",
              callback: function() {
                self.menu.remove(item);
                self.current_section(self.menu()[0]);
              }
            },
          }
        });        
    }

    // Auto Saving
    // self.auto_save_previous;
    self.save_menu_modal = ko.observable(false);
    self.preview_token = ko.observable("");
    self.saveDraft = function(){
        var spinner = new Spinner(opts).spin(document.getElementById('center')); 
        $.ajax({
          type: "POST",
          url: "/app/administration/update_menu",
          data: {
            restaurant_id: restaurant_id,
            menu: ko.toJSON(self.menu)
          },
          success: function(data, textStatus, jqXHR){
                spinner.stop();
                self.preview_token(data.preview_token);
                self.save_menu_modal(true);
                skip_warning = true;   
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("There was an error saving the menu: " + errorThrown);
                spinner.stop();
            },
            dataType: "json"
        });
    }

    $(window).on('beforeunload', function () {
        if(!skip_warning){
            return "Make sure you've saved your changes!";            
        }
    }); 

    self.firstSectionHelp = ko.computed(function(){
        return self.menu().length == 0
    });

    self.firstSectionNameHelp = ko.computed(function(){
        return self.menu().length == 1 && self.menu()[0].name()['en'] == '' && self.current_section()
    });

    self.firstDishHelp = ko.computed(function(){
        return self.menu().length == 1 && self.menu()[0].dishes().length == 0 && self.menu()[0].name()['en'] != ''
    });

    self.firstDishPreviewHelp = ko.computed(function(){
        return self.menu().length == 1 && self.menu()[0].dishes().length == 1;
    });          

};

ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

ko.bindingHandlers.masonry = {
    update: function(element, valueAccessor) {
        var value = valueAccessor();
        var id = value[1].replace(/[^a-z]/g,'');
        value = value[0]();
        if(value && $(element).width() > 768){
            // var w = Number($(element).width());
            // console.log(w);
            $(element).find(".image_section").addClass(id);
            id = "." + id;
            $(element).masonry({
              columnWidth: id,
              itemSelector: id,
            });
        }
    },
};

var translations = {
    "Hours" : {
        "en" : "Hours",
        "fr" : "Heures",
    },
    "Address" : {
        "en" : "Address",
        "fr" : "Adresse"
    },
    "Opens" : {
        "en" : "Opens",
        "fr" : "Ouvrir"
    },
    "Closes" : {
        "en" : "Closes",
        "fr" : "Fermer"
    },
    "closed" : {
        "en" : "Closed",
        "fr" : "Fermer"
    },    
    "open" : {
        "en" : "Open",
        "fr" : "Ouvert"
    },        
    "currently" : {
        "en" : "Currently",
        "fr" : "Presentement",
    }      
};

function PublicMenuModel() {

    if(!ko["menuVisible"]){
        ko.menuVisible = ko.observable(false);
    }

    if(!ko["reloadMap"]){
        ko.reloadMap = ko.observable(false);
    }    

    var self = this;
    self.menu = ko.observableArray([]);
    self.newDomCounter = 0;
    self.preview = ko.observable(true);
    self.restaurant = ko.observable(new Restaurant(resto_data));
    self.languages = self.restaurant().languages; 
    self.lang = ko.observable(self.languages()[0]);
    lang = self.lang;
    self.selected_dish = ko.observable();

    self.show_lang = ko.computed(function(){
        if(self.languages().length > 1){
            return true;
        } else {
            return false;
        }
    }); 

    self.languages_full = {
      'en'  : 'English',
      'fr'  : 'Français',
    }    

    self.main_title_visible = ko.computed(function(){
        if($(window).width() < 900) {
            return true;
        } else {
            return !ko["menuVisible"]();
        }
    })

    self.set_dish = function(dish) {
        self.selected_dish(dish);
    };  

    self.getFullLangName = function(l){ 
      return ko.observable(self.languages_full[l]) 
    }      

    self.display_menu = ko.observable(false);
    self.display_menu_toggle = function(){
        self.display_menu(!self.display_menu());
    } 

    self.goto_and_kill_menu = function(location){
        pager.goTo(location);
        self.display_menu(false);        
    }     

    self.design = new Design(design_data);

    self.contact_tr = ko.observable({
        'en':'Contact',
        'fr':'Contact'
    });

    self.menu_tr = ko.observable({
        'en':'Menu',
        'fr':'la Carte'
    }); 

    self.about_tr = ko.observable({
        'en':'About',
        'fr':'Sur'
    });

    var keep_scrolling_updates = true;
    self.atTop = ko.observable(false);
    if($(window).width() > 600){
        keep_scrolling_updates = false;
    }

    //This is for anything that should be applied to small screens.
    if(keep_scrolling_updates){    
        $(document).on("scrollstop",function(){
            console.log("scrollstop " + $("body").scrollTop());
            if($("body").scrollTop() <= 30){
                self.atTop(false);
            } else {
                self.atTop(true);
            }           
         });
        if($("body").scrollTop() <= 30){
            self.atTop(false);
        } else {
            self.atTop(true);
        }  
        // $(function(){          
        //     FastClick.attach(document.body);
        // });
    }


    var body = document.body,
        timer;

    window.addEventListener('scroll', function() {
      clearTimeout(timer);
      if(!body.classList.contains('disable-hover')) {
        body.classList.add('disable-hover')
      }
      
      timer = setTimeout(function(){
        body.classList.remove('disable-hover')
      },500);
    }, false);    
         
    self.showDetails = ko.observable(false);
    self.toggleDetails =  function(){
        self.showDetails(!self.showDetails());
    }   

    self.menu($.map(menu_data.menu, function(item) { return new Section(item,self) }));

    self.computeImage = function(image){
        //console.log(image);
        if(self.design.imgs[image]){
            return "url(" + self.design.imgs[image]() + ")";
        } else {
            return "";
        }
    };        

};

ko.bindingHandlers.jcrop = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext){
        var self = this;
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);

        //console.log(value);
        //console.log(valueUnwrapped);

        var update_cords = function update_crop(coords) {
            viewModel.coordinates = [coords.x,coords.y,coords.w,coords.h];
           //console.log(viewModel.coordinates);
        }

        $(element).attr("src",valueUnwrapped.src());

        $(element).css({
            width: valueUnwrapped.width(),
            height: valueUnwrapped.height(),
        })

        JcropAPI = $(element).data('Jcrop');

        if(JcropAPI != undefined) {
            JcropAPI.destroy();
        }

        $(element).Jcrop({ 
                boxWidth:   450,
                bgColor:    'black',
                bgOpacity:  .4,
                setSelect:  [ 100, 100, 50, 50 ], 
                onChange: update_cords,
                onSelect: update_cords,
            }
        );

    }
};

ko.bindingHandlers.lValue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
    //console.log("DEBUG: lValue firing on: " + element);
    var underlyingObservable = valueAccessor();
    var interceptor = ko.computed({
        read: function () {
            return underlyingObservable()[viewmodel.lang()];
        },

        write: function (newValue) {
            var current = underlyingObservable();
            current[viewmodel.lang()] = newValue;
            underlyingObservable(current);
        },
    });

    var default_value;

    var placeholder = ko.computed(function(){
        if(default_value == null){
            default_value = $(element).attr("placeholder");
        }
        if(viewmodel.lang() != 'en'){
            return fullLanguageName[viewmodel.lang()] + " translation for '" + underlyingObservable()['en'] + "'";
        }
        return default_value;
    });    

    ko.applyBindingsToNode(element, { value: interceptor, valueUpdate: 'afterkeydown'});
    ko.applyBindingsToNode(element, { attr: {placeholder:placeholder} });
  }
};

ko.bindingHandlers.price = {
    init: function (element, valueAccessor, allBindingsAccessor) {
    //console.log("DEBUG: lValue firing on: " + element);
    var underlyingObservable = valueAccessor();
    var interceptor = ko.computed({
        read: function () {
            return underlyingObservable();
        },
        write: function (newvalue) {
            var current = underlyingObservable();
            current = newvalue.replace(/[^0-9\.]/g,'');
            current = current.replace(/([0-9]*\.[0-9]*).*/,function(match,$1){ return $1 });
            // current = parseFloat(current).toFixed(2);
            underlyingObservable(current);
            underlyingObservable.notifySubscribers();
        },
    }).extend({ notify: 'always' });
    ko.applyBindingsToNode(element, { value: interceptor, valueUpdate: 'afterkeydown'});
  }
};

ko.bindingHandlers.lText = {
    update: function (element, valueAccessor) {
        //console.log("DEBUG: lText firing on: " + element);        
        var value = valueAccessor();
        var result = ko.observable(value()[viewmodel.lang()]);
        ko.bindingHandlers.text.update(element, result);
        
        // $(element).fadeOut(250, function() {
        //     ko.bindingHandlers.text.update(element, result);
        //     $(element).fadeIn(250);
        // });        
    }
}; 

ko.bindingHandlers.lStaticText = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var text = valueAccessor();
        if(typeof(text) == "function"){
            text = text();
        }
        var interceptor = ko.computed({
            read: function () {
                if(!translations[text]){
                    console.log("WARNING: Missing translation for '"+text+"'");
                    return text;
                }
                return translations[text][viewmodel.lang()];
            },
            deferEvaluation: true                 
        });
        ko.applyBindingsToNode(element, { text: interceptor});
    }
};

ko.bindingHandlers.lHtml = {
    update: function (element, valueAccessor) {
        //console.log("DEBUG: lHtml firing on: " + element);
        var value = valueAccessor();
        var result = ko.observable(value()[viewmodel.lang()]);
        ko.utils.setHtml(element, result);
        
        // $(element).fadeOut(250, function() {
        //     ko.bindingHandlers.text.update(element, result);
        //     $(element).fadeIn(250);
        // });        
    }
};   

ko.virtualElements.allowedBindings.lText = true; 

function DemoViewModel() {
    // Data
    var self = this;
    self.dish = new Dish(dish_demo_json,self);
    self.showModal = function(image) {
        //console.log("#"+image.id());
        $("#"+image.id()).modal("show");
    };     
}
//]]>  

;
