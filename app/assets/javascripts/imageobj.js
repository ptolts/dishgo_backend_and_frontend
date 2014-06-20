 function ImageObj(data) {
    var self = this;
    self.progressValue = ko.observable(1);
    self.filename = ko.observable("");
    self.id = ko.observable("");
    self.url = ko.observable("/loader.gif");
    self.original = ko.observable("/loader.gif");
    self.medium = ko.observable("/loader.gif");
    self.small = ko.observable("/loader.gif");
    self.completed = ko.observable(false);
    self.image_width = ko.observable(0);
    self.image_height = ko.observable(0);
    self.started = ko.observable(false);
    self.rejected = ko.observable(false);
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
        self.rejected(data.rejected ? data.rejected : false);
        self.small = ko.observable(data.small ? data.small : "/loader.gif");
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

    self.reject = function(){
        $.ajax({
              type: "POST",
              url: "/app/profile/reject_image",
              data: {
                image_id: self.id(),
            },
            success: function(data, textStatus, jqXHR){
                self.rejected(data.rejected);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log(textStatus);
            },
            dataType: "json"
        });
       
    }     

    self.update_info = function(item){
        self.url(item.thumbnailUrl);
        self.small(item.small);
        self.id(item.image_id);
        self.original(item.original);
        self.image_width = ko.observable(item.width);
        self.image_height = ko.observable(item.height); 
        self.completed(true);
    }
}