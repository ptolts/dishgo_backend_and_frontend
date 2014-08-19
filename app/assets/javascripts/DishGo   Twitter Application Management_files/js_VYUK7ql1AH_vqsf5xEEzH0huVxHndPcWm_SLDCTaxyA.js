(function ($, Drupal, twttr, window) {

  "use strict";

  Drupal.behaviors.helper_tfw = {

    attach: function (context, settings) {
      var self = this;

      if (typeof twttr !== "undefined" && typeof window._gaq !== "undefined") {
        twttr.ready(function (twttr) {
          // Track when a user clicks on the follow button
          twttr.events.bind('follow', function (event) {
            self.track_follow_click(event);
          });
        });
      }
    },

    track_follow_click: function (event) {
      var category = 'gaz';
      var type = event.type;
      var screen_name = event.data.screen_name;

      _gaq.push(['_trackEvent', category, type, screen_name]);
    }

  }

})(jQuery, Drupal, twttr, window);
;
