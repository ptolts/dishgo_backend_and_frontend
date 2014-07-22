var carousel;

$(function(){
	if($(window).width() > 1000){
        carousel = new mbBgndGallery({
                containment:"body",
                timer:4000,
                effTimer:2000,
                grayScale:false,
                images: background_images,

                onStart:function(){},
                onPause:function(){},
                onPlay:function(opt){},
                onChange:function(idx){}, //idx=the zero based index of the displayed photo
                onNext:function(opt){},   //opt=the options relatives to this component instance
                onPrev:function(opt){}   //opt=the options relatives to this component instance
        });
	} else {
		$(".background_mobile").addClass("static_background");
		$(".background_mobile").css("background","url("+ background_images[0] +")");				
	}
})

editing_mode = false;    
var viewmodel = new PublicMenuModel();

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("active");
});			

$(function(){	
	pager.Href.hash = '#!/';
	pager.extendWithPage(viewmodel);
	ko.applyBindings(viewmodel,$("html")[0]);      			
	pager.start();
	if($(window).width() <= 600){
		pager.navigate("#!/contact");
	}
	viewmodel.loading(false);
});

var map;

ko.bindingHandlers.iMap = {
    update: function (element, valueAccessor) {
    	var value = valueAccessor();
    	if(value()){
			var html = $('#iMapTemplate').text().replace(/endscript/g, 'script').replace(/hhtml/g, 'html').replace(/bbody/g, 'body').replace(/hhead/g, 'head');
			$(element)[0].contentWindow.document.open('text/html', 'replace');
			$(element)[0].contentWindow.document.write(html);
			$(element)[0].contentWindow.document.close();
			value(false);
		}		          
    }
}; 

ko.bindingHandlers.stop_scroll = {
    init: function (element, valueAccessor) {
		element.addEventListener('touchstart', function(event){
		    this.lastY = event.pageY;
		});

		element.addEventListener('touchmove', function(event){
		    var up = (event.pageY > this.lastY);
		    var down = !up;
		    this.lastY = event.pageY;

		    this.allowUp = (this.scrollTop > 0);
		    this.allowDown = (this.scrollTop < this.scrollHeight - this.clientHeight);					    

		    if ((up && this.allowUp) || (down && this.allowDown)) {
		    	event.stopPropagation()
		    } else {
		    	event.preventDefault()
		    }
		});	   				          
    }
};

function pauseCarousel(){
	if(carousel){
		carousel.mbBgndGalleryPause();
	}
}

function playCarousel(){
	if(carousel){
		var t = carousel.get(0);
		t.opt.paused = false;
		carousel.mbBgndGalleryPlay();
	}
} 	           				

function showModal(page, callback) {
	$(page.element).modal('show');
};
function hideModal(page, callback) {
	$(page.element).modal('hide');
};