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
        "What's Trending in Montreal":"Les Vedettes de Montréal",
        "Contact Us":"Contactez Nous",
        "Legal":"Légal",
        "Claim this page":"Revendiquer cette page",
        "Show Details":"Voir les détails",
        "Hide Details":"Cacher les détails",
        "Rate This Dish":"Évaluer ce plat",
        "Add Photo":"Ajouter une photo",
        "Opening Hours":"Heurs d'ouverture",
        "How to win":"Comment gagner",
        " Share for more entries":" Partager pour plusieurs entrées",
        "You've reached the limit of entries you can receive by rating. To obtain more, click here.":"Vous avez atteint le maximum nombre d'entrées pour évaluer les plats . Pour obtenir plus, partager ce concours avec vos amis.",
        "Up For Grabs":"À GAGNER",
        "Once the timer runs out we'll raffle off these prizes.":"Dès que le concours est terminé, nours tirons ces prix.",
        "Your rating:":"Votre évaluation:",
        "Rate this dish to win":"Évaluer ce plat pour gagner",
        "View Full Menu":"Voir le menu complet",
        "Write your review here.":"Écrivez votre évaluation ici.",
        "Submit your rating":"Soumettre votre évaluation",
        "help us find out who's king":"Aidez-nous à savoir qui est roi",
        "Rate your favorite dishes by selecting the number of stars. You can earn up to three entries for your contribution. To earn more entries refer your friends to this page. Every new person will earn you an additional entry!":"Évaluez vos plats préférés en sélectionnant le nombre d'étoiles. Vous pouvez gagner jusqu'à trois entrées pour votre contribution. Pour gagner plus d'entrées partager cette page avec vos amis. Chaque nouvelle personne qui visite vous gagne une entrée supplémentaire!",
        "Or share this link":"Ou partager ce lien",
        "flip through the dishes using the arrows":"parcourir les plats en utilisant les flèches",
        "until draw.":"jusqu'au tirage",
        "Log In":"Inscription",  
        "You have":"Vous avez",
        "contest entries.":"entrée dans ce concours.",
        "Thanks for using DishGo":"Merci pour utiliser DishGo",
        "We are a small Montreal based startup. We're working very hard to bring you Montreal's best menus, but we cant do it alone. Help us out by sharing this page on Facebook!":"Nous sommes une petite start-up basée à Montréal. Nous travaillons très dur pour vous apporter les meilleurs menus de Montréal, mais nous ne pouvons pas le faire seuls. Aidez-nous à en partageant cette page sur Facebook!",
        "Add you restaurant on DishGo":"Ajouter votre restaurant sur DishGo",
        "It's easy and it's free":"C'est facile et gratuit",
        "here are some reasons why":"Voici quelques raisons pour lesquelles",
        "Get Found":"soit trouvé",
        "Put your menu to work! Benefit from a free listing which lets hungry consumers find your food like never before.":"Mettez votre menu a travailler! Bénéficiez d'une inscription gratuite qui permet aux consommateurs de trouver votre nourriture comme jamais auparavant.",
        "Menu analytics":"des analytique de votre menu",
        "Find out what customers really think about your food. We track everything so you can apply optimization techniques to improve your product.":"Découvrez ce que les clients pensent de votre nourriture. Nous suivons tout les interaction avec votre menu digital donc vous pouvez appliquer des techniques d'optimisation pour améliorer votre produit.",
        "Dish Ratings & Images":"Les image et les évaluation",
        "Customers can upload photos and submit ratings for each of your dishes. You can then leverage positive feedback as markting content.":"Les clients peuvent télécharger des photos et faire des évaluations pour chacun de vos plats. Vous pouvez utiliser se contenu pour votre de marketing.",
        "Now enter your contact details so that we can verify the listing":"Maintenant, entrez vos coordonnées afin que nous puissions vérifier le listing.",
        "Submit":"Soumettre",
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
            var text = $(element).attr('placeholder');
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