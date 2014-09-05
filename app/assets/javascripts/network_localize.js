var network_localize = {
    "fr" : {
        "Profile":"Profil",
        "Dish":"Plat",
        "Restaurant":"Restaurant",
        "Get Listed":"Inscrivez Votre Menu",
        "Search by Dish":"Recherche par Plat",
        "Search by Restaurant Name":"Recherche par Restaurant",
        "Search Restaurant Name":"Recherche par Restaurant",
        "Search Dish Name":"Recherche par Plat",
        "Sign Up":"Inscription",
        "Submit":"Soumettre",
        "Web Design":"Conception de site web",
        "App":"Appli",
        "Top Dishes of the Day":"Meilleurs Plats du jour",
        "Contact Us":"Contactez Nous",
        "Legal":"Légal",
        "Claim this page":"Revendiquer cette page",
        "Show Details":"Voir les détails",
        "Hide Details":"Cacher les détails"
        "Rate This Dish":"Évaluer ce plat",
        "Add Photo":"Ajouter une photo",
    },    
}

ko.bindingHandlers.localize = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var language = lang() || 'en';
        if(language == 'en'){
            return;
        }
        if(valueAccessor()){
            var text = valueAccessor()();
        } else {
            var text = $(element).text();
        }
        if(network_localize[language] && network_localize[language][text]){
            text = network_localize[language][text];
        } else {
            console.log(language + " translation for " + text + " not found.");
        }
        // ko.applyBindingsToNode(element, { text: text });
        $(element).text(text);
    }
};

ko.bindingHandlers.localizePlaceholder = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var language = lang() || 'en';
        if(valueAccessor()){
            var text = valueAccessor()();
        } else {
            var text = $(element).text();
        }
        if(language == 'en'){
            $(element).attr("placeholder", text);
            return;
        }        
        if(network_localize[language] && network_localize[language][text]){
            text = network_localize[language][text];
        } else {
            console.log(language + " translation for " + text + " not found.");
        }
        // ko.applyBindingsToNode(element, { text: text });
        $(element).attr("placeholder", text);
    }
};