
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
	    self.destroyed = ko.observable(false);
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
	    self.drop = function() { self.dropdowning(true) };

      	self.d_sub = self.default_image.subscribe(function(newvalue){
      		if(newvalue == true){
	      		if(self.parent){
	      			_.each(self.parent.global_images(),function(g){
	      												if(g === self){
	      													return;
	      												}
	      												g.default_image(false) 
	      											});
	      		}
	      	}
      	});	    

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

	        if(!self.defaultImage()){
	        	self.defaultImage(self.global_images()[0]);
	        }
      
	    }  

	    self.background = ko.computed(function(){
	    	return "url(" + self.url() + ")";
	    });

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

	    self.destroyMenuImage = function(item){
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
		              url: "/app/odesk/destroy_image",
		              data: {
		                image_id:item.id(),
		              },
		              success: function(data, textStatus, jqXHR){
		              	console.log("image destroyed");
		              	self.destroyed(true);
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
        		img.default_image = ko.observable(true);
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

	ko.bindingHandlers.file_upload_menu = {
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	        var self = this;
	        console.log(restaurant_id);
	        $(element).fileupload({
	            dropZone: $(element),
	            formData: {
	            	restaurant_id: restaurant_id,
	            	data: ko.toJSON(viewModel),
	            },           
	            url: "/app/odesk/upload_image",
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

	ko.bindingHandlers.file_upload_gallery = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	        var self = this;
	        self.value = valueAccessor();

	        $(element).fileupload({
	            dropZone: $(element),
	            formData: {
	            	restaurant_id: restaurant_id,
	            	data: ko.toJSON(self.image),
	            },           
	            url: "/app/website/upload_gallery",
	            dataType: 'json',
	            progressInterval: 50,
	            add: function(e,data){
			        image = new ImageObj({});
			        self.value.push(image);
			        data.image = image;
			        data.submit();
	            },
	            submit: function(e, data){
	            	console.log(data);
	            },
	            send: function (e, data) {
              		data.image.started(true);
	            },
	            done: function (e, data) {
	                var file = data.result.files[0];	                
	                data.image.update_info(file);                                               
	            },
	            progress: function (e, data) {
	                var progress = parseInt(data.loaded / data.total * 100, 10);
	                data.image.progressValue(progress);
	            },
	            fail: function (e, data) {
	                data.image.failed(true);
	            },                       
	        });
	    }
	};			

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
