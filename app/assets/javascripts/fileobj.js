		ko.bindingHandlers.file_upload_sign_up = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	        var self = this;
	        self.value = valueAccessor();

	        $(element).fileupload({
	            dropZone: $(element),
	            formData: {
	            	restaurant_id: restaurant_id,
	            	data: ko.toJSON(self.image),
	            },           
	            url: "/app/letsdishgo/upload_menu_file",
	            dataType: 'json',
	            progressInterval: 50,
	            add: function(e,data){
			        image = new FileObj({});
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
	                var file = data.result;	                
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

	function FileObj(data) {
	    var self = this;
	    self.progressValue = ko.observable(1);
	    self.id = ko.observable(data.id || null);
	    self.name = ko.observable(data.name || "");
	    self.url = ko.observable(data.url || null);
	    self.destroyed = ko.observable(false);
	    self.fresh = ko.observable(true);
	    self.failed = ko.observable(false);
        self.completed = ko.observable(data.url ? true : false);
        self.started = ko.observable(false);

        self.update_info = function(data){
        	self.completed(true);
        	self.name(data.name);
        	self.url(data.url);
        	self.id(data.id);
        }

	    self.destroy = function(item){
            $.ajax({
              type: "POST",
              url: "/app/letsdishgo/destroy_file",
              data: {
                id:self.id(),
              },
              success: function(data, textStatus, jqXHR){
              	self.destroyed(true);
              },
              dataType: "json"
            });		    	
	    }		        
	}