var localizedMessages = {
    'delete_section' : {
        'en':"Are you sure you want to remove the section titled \"MESSAGE\"?",
        'fr':"",
    },
    'remove_image' : {
        'en':"Are you sure you want to remove this image?",
        'fr':"",
    }, 
    'remove_dish' : {
        'en':"Are you sure you want to remove the dish titled \"MESSAGE\"?",
        'fr':"",
    }   
}

function Language(name,abbreviation){
    var self = this;
    self.name = name;
    self.abbreviation = abbreviation;

    self.canBeDefault = function(parent){
        return ko.computed(function(){
            return parent.languages().indexOf(self.abbreviation) >= 0;
        });      
    }
}

var fullLanguageName = {
    'en' : 'English',
    'fr' : 'French',
    'sp' : 'Spanish',
};

var default_language_hash = {
    en: '',
    fr: '',
    sp: '',
}

var default_sizes_hash = {
    en: 'Sizes',
    fr: 'Tailles',
}

var default_sizes_hash_small = {
    en: 'Small',
    fr: 'Petit',
}

var default_sizes_hash_large = {
    en: 'Large',
    fr: 'Grand',
}

var sectionNames = {
    en: '',
    fr: '',
}

var default_page_language_hash = {
    en: 'New Page',
    fr: 'Nouvelle Page',
};        

var default_web_language_hash = {
    en: 'Edit your page content!',
    fr: 'Modifier le contenu de votre page!',
};        

var opened_tr = {
        "open": {
            'en':'Opened',
            'fr':'ouvert',
        },       
        "closed": {
            'en':'Closed',
            'fr':'fermé',
        },
};

var days_tr = {
        "monday": {
            'en':'Monday',
            'fr':'lundi',
        },
        "tuesday": {
            'en':'Tuesday',
            'fr':'mardi',
        },
        "wednesday": {
            'en':'Wednesday',
            'fr':'mercredi',
        },   
        "thursday": {
            'en':'Thursday',
            'fr':'jeudi',
        },   
        "friday": {
            'en':'Friday',
            'fr':'vendredi',
        },   
        "saturday": {
            'en':'Saturday',
            'fr':'samedi',
        },    
        "sunday": {
            'en':'Sunday',
            'fr':'dimanche',
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

function copyDefaultHash(hash) {
    return JSON.parse(JSON.stringify(hash));
}

function currentLangName(observable){
    if(!observable()){
        return {
            'en':'error',
            'reso':'error',
        }
    }
    return {
                'en' : observable()['en'],
                'reso' : observable()[lang()]
            }
}

function localizeMessage(title, message){
    var lang = "en";
    var msg = localizedMessages[message][lang];
    if(title){
        var message_localized = title[lang];
        msg = msg.replace("MESSAGE",message_localized);
    }
    return msg;
}