/* global AnalyticsGoogle: object */
(function () {

  "use strict";

  var TwtrAnalytics;

  TwtrAnalytics = {
    google: null,
    scribe: null,

    /**
     * Tracking across all services
     */
    track: function (events, callback) {
      var incr = 0,
        totalRequest = 0,
        eventCallback;

      if (this.isTrackingEnabled() === false) {
        if (typeof callback === 'function') {
          callback();
        }
        return;
      }

      // The callback inside this function will be triggered after the last request
      // successfully went through
      eventCallback = function () {
        incr++;
        if (callback && totalRequest === incr) {
          callback();
        }
      };

      try {
        totalRequest += this.trackGoogle(events, eventCallback);
        totalRequest += this.trackScribe(events, eventCallback);
      } catch (e) {
        // Fail silently and trigger the callback
        if (callback) {
          callback();
        }
      }

      // If no tracking request were made then the callback must be executed
      if (totalRequest === 0 && callback) {
        callback();
      }
    },

    /**
     * Track event to Google
     *
     * @return number of events that will be tracked
     */
    trackGoogle: function (events, callback) {
      var data = [],
        eventObject;

      if (this.google === null) {
        return 0;
      }

      // Manipulate the events and make it comprehensive to the Google service
      for (var i = 0; i < events.length; i++) {
        if (events[i].length < 3) {
          continue;
        }

        eventObject = {
          category: events[i][0],
          type: events[i][1],
          action: events[i][2]
        };

        // in case there are more than 3 parameters
        for (var k = 3; k < events[i].length; k++) {
          eventObject.action += '-' + events[i][k];
        }

        if (this.google.isEventValid(eventObject) === true) {
          data.push(eventObject);
        }
      }

      this.google.trackEvents(data, callback);

      return this.google.getTotalTrackEvents(data);
    },

    /**
     * Track event to scribe
     *
     * @return number of events that will be tracked
     */
    trackScribe: function (events, callback) {
      var data = [],
        eventObject;

      if (this.scribe === null) {
        return 0;
      }

      // Manipulate the events and make it comprehensive to the Scribe service
      for (var i = 0; i < events.length; i++) {
        if (events[i].length !== 5) {
          continue;
        }

        eventObject = {
          page: events[i][0],
          section: events[i][1],
          component: events[i][2],
          element: events[i][3],
          action: events[i][4]
        };

        if (this.scribe.isEventValid(eventObject) === true) {
          data.push(eventObject);
        }
      }

      this.scribe.trackEvents(data, callback);

      return this.scribe.getTotalTrackEvents(data);
    },

    /**
     * Whether DoNotTrack is enabled or not
     */
    isTrackingEnabled: function () {
      return (
        window.navigator.doNotTrack !== "yes" &&
        window.navigator.doNotTrack !== "1" &&
        window.navigator.msDoNotTrack !== "1" &&
        (typeof doNotTrack === 'undefined' || doNotTrack !== "1")
      );
    },

    /**
     * Initialize all tracking services
     */
    initialize: function (settings) {
      if (this.isTrackingEnabled() === false) {
        return;
      }

      if (settings.google) {
        this.initializeGoogle(settings.google);
      }

      if (settings.scribe) {
        this.initializeScribe(settings.scribe);
      }

      return;
    },

    /**
     * Initialize Google tracking service
     */
    initializeGoogle: function (settings) {
      this.google = new TwtrAnalyticsGoogle(settings);
    },

    /**
     * Initialize Scribe tracking service
     */
    initializeScribe: function (settings) {
      this.scribe = new TwtrAnalyticsScribe(settings);
    }
  }

  window.TwtrAnalytics = TwtrAnalytics;

})();
;
(function () {

  "use strict";

  var TwtrAnalyticsGoogle;

  TwtrAnalyticsGoogle = function (settings) {
    var self = this,
      accounts = [],
      accountPrefixes = [],
      customUrl = false,
      domains = [];

    /**
     * Set a custom var
     */
    this.setCustomVar = function (key, value) {
      foreachAccount(function (index, account, prefix) {
        ga(prefix + '.set', key, value);
      });
    };

    /**
     * Track a set of events
     * Callback is only triggered if the event is valid.
     */
    this.trackEvents = function (events, callback) {
      foreachAccount(function (index, account, prefix) {
        for (var i = 0; i < events.length; i++) {
          if (self.isEventValid(events[i]) === false) {
            console.warn('Could not GA track event - category, type and/or action parameters are missing.');
            continue;
          }

          ga(prefix + '.send', 'event', events[i].category, events[i].type, events[i].action, {
            'hitCallback': callback
          });
        }
      });

      return true;
    };

    /**
     * Check if a single event is valid
     */
    this.isEventValid = function (event) {
      return !(!event.category || !event.type || !event.action);
    };

    /**
     * Based on a number of events return the number of queries
     * that will be made to Google Analytics
     */
    this.getTotalTrackEvents = function (events) {
      return events.length * accounts.length;
    };

    /**
     * Create the accounts
     */
    var createAccounts = function () {
      foreachAccount(function (index, account, prefix) {
        ga('create', account, 'auto', {
          'allowLinker': true,
          'name': prefix,
        });
      });

      ga('require', 'linker');
      ga('linker:autoLink', domains);
    };

    /**
     * Send page view
     */
    var sendPageView = function () {
      foreachAccount(function (index, account, prefix) {
        if (customUrl) {
          ga(prefix + '.send', 'pageview', customUrl);
        } else {
          ga(prefix + '.send', 'pageview');
        }
      });
    };

    /**
     * For each account run through the callback
     */
    var foreachAccount = function (callback) {
      for (var index = 0; index < accountPrefixes.length; index++) {
        callback(index, accounts[index], accountPrefixes[index]);
      }
    };

    /**
     * Run code provided by Google
     */
    var injectScriptTag = function (trackerUrl) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script',trackerUrl,'ga');
    }

    /**
     * Set accounts and matching prefixes
     */
    var initializeAccounts = function (accts) {
      accounts = accts;

      for (var i = 0; i < accts.length; i++) {
        accountPrefixes.push(String.fromCharCode(97 + i));
      }
    };

    var initialize = function (settings) {
      var customVar;

      injectScriptTag(settings.options.trackerUrl);

      initializeAccounts(settings.accounts);

      domains = settings.options.domains;
      customUrl = settings.options.customUrl;

      // Send data to GA
      createAccounts();
      for (customVar in settings.options.customVars) {
        self.setCustomVar(customVar, settings.options.customVars[customVar]);
      }

      if (settings.options.displayAdvertisingFeatures == true) {
        foreachAccount(function (index, account, prefix) {
          ga(prefix + '.require', 'displayfeatures');
        });
      } else if (typeof console !== 'undefined' && console.log) {
        console.log('Tailored ads opt-out is enabled.');
      }
      sendPageView();
    };

    initialize(settings);
  };

  window.TwtrAnalyticsGoogle = TwtrAnalyticsGoogle;
})();
;
(function () {

  "use strict";

  var TwtrAnalyticsScribe;

  TwtrAnalyticsScribe = function (settings) {
    var self = this,
      client,
      transport,
      clientEvent,
      pageViewCallback = null;

    /**
     * Track a set of events
     * Callback is only triggered if the event is valid.
     */
    this.trackEvents = function (events, callback) {
      var i,
        terms,
        data;

      for (i = 0; i < events.length; i++) {
        if (this.isEventValid(events[i]) === false) {
          console.warn('Could not scribe event - page, section, component, element and/or action parameters are missing.');
          continue;
        }

        terms = {
          client: client,
          page: events[i].page,
          section: events[i].section,
          component: events[i].component,
          element: events[i].element,
          action: events[i].action
        }

        sendData(terms, callback);
      }
    };

    /**
     * Check if a single event is valid
     */
    this.isEventValid = function (event) {
      return (
        clientEvent &&
        event.page &&
        event.component !== undefined &&
        event.section !== undefined &&
        event.element !== undefined &&
        event.action !== undefined
      );
    };

    /**
     * Return the number of potential queries made to scribe based on a set of events
     */
    this.getTotalTrackEvents = function (events) {
      // Fail silently
      if (!clientEvent) {
        return 0;
      }

      return events.length;
    };

    /**
     * Send page view
     */
    var sendPageView = function () {
      var data,
        terms;

      if (pageViewCallback === null) {
        return false;
      }

      data = pageViewCallback();

      // The function is not used properly
      if (!data.page || data.section === undefined) {
        return false;
      }

      terms = {
        client: client,
        page: data.page,
        section: data.section,
        action: 'impression'
      };

      return sendData(terms);
    };

    /**
     * Send data to scribe
     */
    var sendData = function (data, callback) {
      // Fail silently
      if (!clientEvent) {
        return false;
      }

      clientEvent.scribe(data);

      if (callback) {
        callback();
      }

      return true;
    };

    var initializeTransport = function () {
      transport = new ScribeTransport({
        useAjax: false,      // the scribe API will be called using an <img> tag GET request
        bufferEvents: false, // scribe events will not be buffered
        flushOnUnload: true  // flush the scribe buffer when the page unloads
      });
    };

    var initializeClientEvent = function () {
      if (transport === undefined) {
        initializeTransport();
      }

      clientEvent = new ClientEvent(transport);
    };

    var initialize = function (settings) {
      if (!window.ScribeTransport || !window.ClientEvent) {
        return false;
      }

      if (!settings.client) {
        return false;
      }

      client = settings.client;

      if (settings.pageViewCallback) {
        pageViewCallback = settings.pageViewCallback;
      }

      initializeTransport();
      initializeClientEvent();

      sendPageView();

      return true;
    };

    initialize(settings);
  };

  window.TwtrAnalyticsScribe = TwtrAnalyticsScribe;

})();
;
(function ($, Drupal, window) {

  "use strict";

  Drupal.behaviors.helper_analytics = {

    settings: {},

    attach: function (context, settings) {
      var self = this,
        GoogleAnalytics;

      self.initializeSettings();

      if (typeof TwtrAnalytics !== "undefined" && typeof twttr !== "undefined"
          && typeof twttr.conversion !== "undefined") {
        twttr.ready(function (twttr) {
          if (TwtrAnalytics.isTrackingEnabled() === true) {
            self.initializeTrackingPixel();
          }
        });
      }

      if (typeof TwtrAnalytics !== 'undefined') {
        self.initializeAnalytics();
      }
    },

    initializeSettings: function () {
      var $settingsContainer = $("#drupal-settings");

      if ($settingsContainer.length === 0) {
        return;
      }

      this.settings = $.parseJSON($settingsContainer.html());
    },

    initializeTrackingPixel: function () {
      var trackingSettings;

      if (!this.settings.analyticsSettings.trackingPixel) {
        return;
      }

      trackingSettings = this.settings.analyticsSettings.trackingPixel;

      if (typeof trackingSettings.pixel_ids !== 'undefined') {
        $.each(trackingSettings.pixel_ids, function(pid) {
          twttr.conversion.trackPid(pid);
        });
      }
    },

    initializeAnalytics: function () {
      if (!this.settings.analyticsSettings) {
        return;
      }

      this.initializeAnalyticsScribeSettings();

      TwtrAnalytics.initialize({
        google: this.settings.analyticsSettings.google,
        scribe: this.settings.analyticsSettings.scribe
      });
    },

    initializeAnalyticsScribeSettings: function () {
      if (!this.settings.analyticsSettings.scribe) {
        return false;
      }

      this.settings.analyticsSettings.scribe.pageViewCallback = function () {
        var pageValue,
          pageName,
          sectionName,
          sectionValue,
          terms;

        if ($(document.body).attr('data-analytics-page')) {
          pageValue = $(document.body);
        } else {
          pageValue = $('[data-analytics-page]');
        }

        if (!pageValue.length) {
          return {};
        }

        pageName = pageValue.first().data('analytics-page');
        sectionName = '';

        if (this.settings.analyticsSettings.scribe.scribeSectionWithImpression) {
          sectionValue = pageValue.first().find('[data-analytics-section]');
          if (sectionValue.length) {
            sectionName = sectionValue.first().data('analytics-section');
          }
        }

        return {
          page: pageName,
          section: sectionName
        };
      }.bind(this);
    }

  }

})(jQuery, Drupal, window);
;
