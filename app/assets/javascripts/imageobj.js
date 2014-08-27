 ImageObj.prototype.fastJSON = function(){
    var fast = {};
    for (var property in this) {
        if (this.hasOwnProperty(property)) {
            var result = this[property];
            while(ko.isObservable(result)){
                result = result.peek();
            }
            if(typeof result == "function"){
                continue;
            }
            if(typeof result == "object"){
                if(result == null){
                    fast[property] = result;
                    continue;
                }                              
                if(Array.isArray(result)){
                    continue;
                }
                if(result.fastJSON){
                    continue;
                }
            }         
            fast[property] = result;
        }
    } 
    return fast;
}

 function ImageObj(data) {
    data = data || {};
    var self = this;
    self.progressValue = ko.observable(1);
    self.filename = ko.observable("");
    self.id = ko.observable(data.id || "");
    self.official_site_image = ko.observable(data.official_site_image || false);
    self.url = ko.observable("");
    self.original = ko.observable("");
    self.medium = ko.observable("");
    self.small = ko.observable("");
    self.completed = ko.observable(false);
    self.image_width = ko.observable(0);
    self.image_height = ko.observable(0);
    self.started = ko.observable(false);
    self.rejected = ko.observable(false);
    self.not_profile_image = ko.observable(false);
    self.destroyed = ko.observable(false);
    self.coordinates = [];
    self.failed = ko.observable(false);
    self.dish_name = data.dish_name || "Not Found";
    self.restaurant_name = data.restaurant_name || "Not Found";
    self.restaurant_id = data.restaurant_id || "";
    self.user_name = data.user_name || "Not Found";

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
        self.rejected(data.rejected ? data.rejected : false);
        self.not_profile_image(data.not_profile_image ? data.not_profile_image : false);
        self.small = ko.observable(data.small ? data.small : "");
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

    self.setProperties = function(){
        $.ajax({
            type: "POST",
            url: "/app/menu_update/update_image",
            data: {
                image: ko.toJSON(self),
                restaurant_id: restaurant_id,                
            },
            success: function(data, textStatus, jqXHR){

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 

            },
            dataType: "json"
        }); 
    }    

    self.destroyGalleryImage = function(){
        bootbox.dialog({
          message: "Destroy Image?",
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
                      url: "/app/website/destroy_gallery_image",
                      data: {
                        image_id: self.id(),
                        },
                        success: function(data, textStatus, jqXHR){
                            self.destroyed(true);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                            console.log(textStatus);
                        },
                        dataType: "json"
                    }); 
              }
            },
          }
        }); 
    }

    self.reject = function(){
        $.ajax({
              type: "POST",
              url: "/app/profile/reject_image",
              data: {
                image_id: self.id(),
            },
            success: function(data, textStatus, jqXHR){
                self.not_profile_image(data.not_profile_image);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log(textStatus);
            },
            dataType: "json"
        }); 
    }     

    self.update_info = function(item){      
        self.url(item.thumbnailUrl);
        self.medium(item.medium || item.url);
        self.small(item.small);
        self.original(item.original || item.url);
        self.image_width = ko.observable(item.width);
        self.image_height = ko.observable(item.height); 
        self.completed(true);
        self.id(item.image_id);        
    }
}