 CoverPhoto.prototype.fastJSON = function(){
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

 function CoverPhoto(data) {
    data = data || {};
    var self = this;
    self.progressValue = ko.observable(1);
    self.filename = ko.observable("");
    self.id = ko.observable(data.id || "");
    self.official_site_image = ko.observable(data.official_site_image || false);
    self.url = ko.observable("");
    self.original = ko.observable();
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

    if(data){
        self.id(data._id);
        self.url = ko.observable(data.local_file || data.url);
        self.completed(true);
        self.original = ko.observable(data.original);
        self.medium = ko.observable(data.medium);
        self.image_width = ko.observable(data.width);
        self.image_height = ko.observable(data.height);            
        self.rejected(data.rejected ? data.rejected : false);
        self.not_profile_image(data.not_profile_image ? data.not_profile_image : false);
        self.small = ko.observable(data.small ? data.small : "");
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