		<script type="text/javascript">

	        var restaurant_id = "<%= params[:restaurant_id]%>";
	        var menu_data = <%= raw(@menu_data) %>;
	        var design_data = <%= raw(@design_data.to_json) %>;
	        var resto_data = <%= raw(@resto_data.to_json) %>;	
	        var background_images = <%= raw(@carousel.to_json) %>;

			$(function(){
			        $.mbBgndGallery.buildGallery({
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
	        	ko.applyBindings(viewmodel);        			
				pager.start();			
			});

			function initialize() {
				var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
				var mapOptions = {
					center: myLatlng,
					zoom: 12
				};			
				var map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
				var marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					title: 'Hello World!'
				});					
			}
			google.maps.event.addDomListener(window, 'load', initialize);

			function showModal(page, callback) {
				$(page.element).modal('show');
			};
			function hideModal(page, callback) {
				$(page.element).modal('hide');
			};				

        </script>