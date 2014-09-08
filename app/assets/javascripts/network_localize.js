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
        "Hide Details":"Cacher les détails",
        "Rate This Dish":"Évaluer ce plat",
        "Add Photo":"Ajouter une photo",
    },        
}

ko.bindingHandlers.localize = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var language = lang() || 'en';
        var el = $(element);
        if(!el.data("language_key")){
            el.data("language_key",el.text());
        }
        if(valueAccessor()){
            var text = valueAccessor()();
        } else {
            var text = $(element).text();
        }
        if(network_localize[language] && network_localize[language][text]){
            text = network_localize[language][text];
        } else {
            if(language != 'en')
                console.log(language + " translation for " + text + " not found.");
                // if this is computed text, refer to it instead of the bound data
                if(valueAccessor()){
                    text = valueAccessor()();
                    el.text(text);
                    return;
                } else {
                    el.text(el.data("language_key"));
                    return;
                }            
            return;
        }
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