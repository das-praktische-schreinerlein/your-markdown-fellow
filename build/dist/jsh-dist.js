/*! jsh-0.1.0 */

/**
 * initialize namespace
 */
window.JsHelferlein = {};

/**
 * base module of an app (with service-configuration...)
 * 
 * @param {JsHelferlein.AppBaseConfig} config          optional configuration (default JsHelferlein.AppBaseConfig)
 * @return {JsHelferlein.AppBase}                      an instance of the service
 * @constructor
 */
JsHelferlein.AppBase = function (config) {
    'use strict';

    // create my own instance
    var me = {};

    /**
     * initialize the app 
     */
    me._init = function () {
        // check Config
        me.config = me.checkConfig(config, JsHelferlein.AppBaseConfig());

        me._configureDefaultServices();
        me._configureDefaultDetectors();
    };

    // vars
    me.serviceConfigs = [];
    me.services = [];
    me.detectors = [];
    me.props = [];
    me.config = {};

    /**
     * configure service
	 * @param {string} serviceName         name of the service
	 * @param {function} constrCallBack    constructor of the service
     */
    me.configureService = function (serviceName, constrCallBack) {
        console.log('configureService: set new serviceconfig:' + serviceName);
        // delete all instances
        if (me.services[serviceName]) {
            console.log('configureService: delete instance for serviceconfig:' + serviceName);
            me.services[serviceName] = null;
            me.services.splice(me.services.indexOf(serviceName), 1);
        }
        if (me.services.hasOwnProperty(serviceName)) {
            console.log('configureService: delete instance for serviceconfig:' + serviceName);
            me.services.splice(me.services.indexOf(serviceName), 1);
        }

        // define service as property
        console.log('configureService:' + serviceName);
        Object.defineProperty(me, serviceName, {
            get: function () {
                return me.getService(serviceName);
            },
            enumerable: true,
            configurable: true,
            true: false
        });

        me.serviceConfigs[serviceName] = constrCallBack;
    };

    /**
     * get configured service-constructor
	 * @param {string} serviceName         name of the service
	 * @return {function}                  constrCallBack of the service
     */
    me.getServiceConfig = function (serviceName) {
        return me.serviceConfigs[serviceName];
    };

    /**
     * set service
	 * @param {string} serviceName                          name of the service
	 * @param {JsHelferlein.ServiceBase} serviceInstance    instance of the service
     */
    me.setService = function (serviceName, serviceInstance) {
        me.services[serviceName] = serviceInstance;
    };

    /**
     * get service
	 * @param {string} serviceName           name of the service
	 * @return {JsHelferlein.ServiceBase}    instance of the service
     */
    me.getService = function (serviceName) {
        if (!me.services[serviceName]) {
            console.log('create new instance of:' + serviceName);
            if (me.serviceConfigs.hasOwnProperty(serviceName)) {
                var constr = me.getServiceConfig(serviceName);
                var service;
                if (typeof constr === 'function') {
                    service = constr(me);
                } else {
                    service = constr;
                }
                me.setService(serviceName, service);
            }
        }
        return me.services[serviceName];
    };

    /**
     * set service
	 * @param {string} serviceName                          name of the service
	 * @param {JsHelferlein.ServiceBase} serviceInstance    instance of the service
     */
    me.set = function (serviceName, serviceInstance) {
        me.setService(serviceName, serviceInstance);
    };

    /**
     * get service
	 * @param {string} serviceName        name of the service
	 * @return {JsHelferlein.ServiceBase} instance of the service
     */
    me.get = function (serviceName) {
        return me.getService(serviceName);
    };


    /**
     * set detector
	 * @param {string} detectorName                           name of the detector
	 * @param {JsHelferlein.DetectorBase} detectorInstance    instance of the detector
     */
    me.setDetector = function (detectorName, detectorInstance) {
        me.detectors[detectorName] = detectorInstance;
    };

    /**
     * get detector
	 * @param {string} detectorName          name of the detector
	 * @return {JsHelferlein.DetectorBase}   instance of the detector
     */
    me.getDetector = function (detectorName) {
        return me.detectors[detectorName];
    };


    /**
     * set property
	 * @param {string} propName      name of the property
	 * @param {Object} value         value of the property
     */
    me.setProp = function (propName, value) {
        me.props[propName] = value;
    };

    /**
     * read property
	 * @param {string} propName      name of the property
	 * @return {Object}              value of the property
     */
    me.getProp = function (propName) {
        return me.props[propName];
    };

    /**
     * check and merge config with defaultConfig
     * 
	 * @param {JsHelferlein.ConfigBase} config         optional configuration
	 * @param {JsHelferlein.ConfigBase} defaultConfig  default configuration
	 * @return {JsHelferlein.ConfigBase}               merged configuration
     */
    me.checkConfig = function (config, defaultConfig) {
        if (!config) {
            console.log('no config: use default:', defaultConfig);
            return defaultConfig;
        }
        console.log('config set use:', config);
        for (var propName in defaultConfig) {
            if (!defaultConfig.hasOwnProperty(propName)) {
                continue;
            }
            if (!config.hasOwnProperty(propName)) {
                console.log('option not set: use default: ' + propName, defaultConfig[propName]);
                config[propName] = defaultConfig[propName];
            }
        }

        return config;
    };


    /**
     * publish detector-css-styles for all configured detectors to DOM
     */
    me.publishDetectorStyles = function () {
        var styles = '';
        console.log('detectrors', me.detectors);
        for (var detectorName in me.detectors) {
            if (!me.detectors.hasOwnProperty(detectorName)) {
                continue;
            }
            console.log('detectror' + detectorName);
            styles += me.getDetector(detectorName).generateStyles();
        }
        me.DOMHelper.insertStyleBeforeScript(styles);
        me.DOMHelper.appendStyleAtEnd(styles);
        if (me.Logger && me.Logger.isDebug) {
            me.Logger.logDebug('JsHelferlein.AppBase.publishDetectorStyles ' + styles);
        }
    };

    /**
     * configure the services of the app 
     */
    me._configureDefaultServices = function () {
        me.configureService('jQuery', function () {
            return $;
        });
        me.configureService('$', function () {
            return $;
        });

        // configure instances
        me.configureService('JsHelferlein.Logger', function () {
            return JsHelferlein.Logger(me);
        });
        me.configureService('JsHelferlein.DOMHelper', function () {
            return JsHelferlein.DOMHelper(me);
        });
        me.configureService('JsHelferlein.DataUtils', function () {
            return JsHelferlein.DataUtils(me);
        });
        me.configureService('JsHelferlein.FileUtils', function () {
            return JsHelferlein.FileUtils(me);
        });
        me.configureService('JsHelferlein.UIDialogs', function () {
            return JsHelferlein.UIDialogs(me);
        });
        me.configureService('JsHelferlein.UIToggler', function () {
            return JsHelferlein.UIToggler(me);
        });
        me.configureService('JsHelferlein.SpeechServiceHelper', function () {
            return JsHelferlein.SpeechServiceHelper(me);
        });
        me.configureService('JsHelferlein.SpeechSynthController', function () {
            return JsHelferlein.SpeechSynthController(me);
        });
        me.configureService('JsHelferlein.SpeechRecognitionController', function () {
            return JsHelferlein.SpeechRecognitionController(me);
        });
        me.configureService('JsHelferlein.DiagramWidgets', function () {
            return JsHelferlein.DiagramWidgets(me);
        });
        me.configureService('JsHelferlein.ChecklistParser', function () {
            return JsHelferlein.ChecklistParser(me);
        });
        me.configureService('JsHelferlein.MermaidParser', function () {
            return JsHelferlein.MermaidParser(me);
        });
        me.configureService('JsHelferlein.MindmapParser', function () {
            return JsHelferlein.MindmapParser(me);
        });
        me.configureService('JsHelferlein.PlantumlParser', function () {
            return JsHelferlein.PlantumlParser(me);
        });
        me.configureService('JsHelferlein.ImageSlimboxParser', function () {
            return JsHelferlein.ImageSlimboxParser(me);
        });
        me.configureService('JsHelferlein.SyntaxHighlighterParser', function () {
            return JsHelferlein.SyntaxHighlighterParser(me);
        });
        me.configureService('JsHelferlein.MarkdownRenderer', function () {
            return JsHelferlein.MarkdownRenderer(me);
        });
        me.configureService('JsHelferlein.Renderer', function () {
            return JsHelferlein.Renderer(me);
        });

        // configure aliases
        me.configureService('Logger', function () {
            return me.get('JsHelferlein.Logger');
        });
        me.configureService('DOMHelper', function () {
            return me.get('JsHelferlein.DOMHelper');
        });
        me.configureService('UIDialogs', function () {
            return me.get('JsHelferlein.UIDialogs');
        });
        me.configureService('UIToggler', function () {
            return me.get('JsHelferlein.UIToggler');
        });
        me.configureService('DataUtils', function () {
            return me.get('JsHelferlein.DataUtils');
        });
        me.configureService('FileUtils', function () {
            return me.get('JsHelferlein.FileUtils');
        });
        me.configureService('SpeechServiceHelper', function () {
            return me.get('JsHelferlein.SpeechServiceHelper');
        });
        me.configureService('SpeechSynthController', function () {
            return me.get('JsHelferlein.SpeechSynthController');
        });
        me.configureService('SpeechRecognitionController', function () {
            return me.get('JsHelferlein.SpeechRecognitionController');
        });
        me.configureService('DiagramWidgets', function () {
            return me.get('JsHelferlein.DiagramWidgets');
        });
        me.configureService('ChecklistParser', function () {
            return me.get('JsHelferlein.ChecklistParser');
        });
        me.configureService('MermaidParser', function () {
            return me.get('JsHelferlein.MermaidParser');
        });
        me.configureService('MindmapParser', function () {
            return me.get('JsHelferlein.MindmapParser');
        });
        me.configureService('PlantumlParser', function () {
            return me.get('JsHelferlein.PlantumlParser');
        });
        me.configureService('ImageSlimboxParser', function () {
            return me.get('JsHelferlein.ImageSlimboxParser');
        });
        me.configureService('SyntaxHighlighterParser', function () {
            return me.get('JsHelferlein.SyntaxHighlighterParser');
        });
        me.configureService('MarkdownRenderer', function () {
            return me.get('JsHelferlein.MarkdownRenderer');
        });
        me.configureService('Renderer', function () {
            return me.get('JsHelferlein.Renderer');
        });
    };

    /**
     * configure the detectors of the app 
     */
    me._configureDefaultDetectors = function () {
        me.setDetector('JavascriptDetector', JsHelferlein.JavascriptDetector(me));
        me.setDetector('SpeechSynthDetector', JsHelferlein.SpeechSynthDetector(me));
        me.setDetector('SpeechRecognitionDetector', JsHelferlein.SpeechRecognitionDetector(me));
    };

    // init all
    me._init();

    return me;
};

/**
 * base configuration of an JsHelferlein.AppBase
 *
 * @return {JsHelferlein.AppBaseConfig}         an instance of the config
 * @augments JsHelferlein.ConfigBase
 * @constructor
 */
JsHelferlein.AppBaseConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.styleNS = 'jsh-';
    me.defaultDetectorStyleNS = me.styleNS;
    me.additionalDetectorStyleNS = [];
    me.appBaseVarName = 'jsHelferlein';

    return me;
};
/**
 * base configuration for all JsHelferlein
 *
 * @return {JsHelferlein.ConfigBase}                an instance of the config
 * @constructor
 */
JsHelferlein.ConfigBase = function () {
    'use strict';

    // my own instance
    var me = {};

    /**
     * check if option exists and is set
     * @param {string} option      name of the option
     * @return {boolean}           true/false if option exists and is set
     */
    me.isSet = function (option) {
        if (!me.hasOwnProperty(option)) {
            return false;
        }
        if (!me[option]) {
            return false;
        }

        return true;
    };

    return me;
};
/**
 * base detector for all JsHelferlein
 * 
 * @param {JsHelferlein.AppBase} appBase                  appBase of the application
 * @param {JsHelferlein.DetectorBaseConfig} config        optional configuration
 * @param {JsHelferlein.DetectorBaseConfig} defaultConfig optional defaultconfig if no configuration is set
 * @return {JsHelferlein.DetectorBase}                    an instance of the detector
 * @constructor
 */
JsHelferlein.DetectorBase = function (appBase, config, defaultConfig) {
    'use strict';

    // my own instance
    var me = {};

    /**
     * initialize the detector-base
     */
    me._init = function () {
        // check Config
        me.appBase = appBase;
        me.config = appBase.checkConfig(config, defaultConfig);
    };

    /**
     * check if function is supported
     * @abstract
     * @return {boolean}           true/false if function is supported
     */
    me.isSupported = function () {
        return false;
    };

    /**
     * publish detector-css-styles if function is supported to DOM
     */
    me.publishDetectorStyles = function () {
        var svcDOMHelper = me.appBase.DOMHelper;
        var svcLogger = me.appBase.Logger;

        var styles = me.generateStyles();
        svcDOMHelper.insertStyleBeforeScript(styles);
        svcDOMHelper.appendStyleAtEnd(styles);
        if (svcLogger && svcLogger.isDebug) {
            svcLogger.logDebug('JsHelferlein.DetectorBase.publishDetectorStyles ' + styles);
        }
    };

    /**
     * generate detector-css-styles
     * @return {string}            generated css-styles                  
     */
    me.generateStyles = function () {
        var flgSet = me.isSupported();
        // generate default NS
        var styles = me._generateStylesForNS(me.appBase.config.defaultDetectorStyleNS, me.config.styleBaseName, flgSet);

        // generate additional NS
        if (me.appBase.config.isSet('additionalDetectorStyleNS')) {
            var additionalNS = me.appBase.config.additionalDetectorStyleNS;
            for (var index = 0; index < additionalNS.length; ++index) {
                styles += me._generateStylesForNS(additionalNS[index], me.config.styleBaseName, flgSet);
            }
        }

        return styles;
    };

    /**
     * generate detector-styles for this namespace
     * @param {string} ns               namespace of the detector-styles
     * @param {string} name             name of the detector-style
     * @param {boolean} flgSet          function is supported ?
     * @return {string}                 generated css-style                  
     */
    me._generateStylesForNS = function (ns, name, flgSet) {
        var styles = '';

        styles += '/** ' + ns + ' ' + name + '**/\n';
        if (flgSet) {
            styles += '.' + ns + 'is-' + name + ' { display: block;}\n';
        } else {
            styles += '.' + ns + 'is-not-' + name + ' { display: block;}\n';
        }
        styles += '.' + ns + 'show-if-' + name + ' { display: ' + (flgSet ? 'block' : 'none') + ';}\n';
        styles += '.' + ns + 'show-inline-if-' + name + ' { display: ' + (flgSet ? 'inline' : 'none') + ';}\n';
        styles += '.' + ns + 'show-inline-block-if-' + name + ' { display: ' + (flgSet ? 'inline-block' : 'none') + ';}\n';
        styles += '.' + ns + 'hide-if-' + name + ' { ' + (flgSet ? 'display: none;' : '') + '}\n';

        return styles;
    };

    me._init();

    return me;
};
/**
 * base configuration for all JsHelferlein.DetectorConfig
 *
 * @return {JsHelferlein.DetectorBaseConfig}      an instance of the config
 * @augments JsHelferlein.ConfigBase
 * @constructor
 */
JsHelferlein.DetectorBaseConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.styleBaseName = 'misconfigured-detector';

    return me;
};
/**
 * base service for all JsHelferlein.Services
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration
 * @param {JsHelferlein.ConfigBase} defaultConfig   optional defaultconfig if no configuration is set
 * @return {JsHelferlein.ServiceBase}               an instance of the service
 * @constructor
 */
JsHelferlein.ServiceBase = function (appBase, config, defaultConfig) {
    'use strict';

    // my own instance
    var me = {};

    me.logNotImplemented = function () {
        var svcLogger = me.appBase.Logger;
        if (svcLogger) {
            svcLogger.logError('not implemented', false);
        }
        throw 'function is not implemented';
    };

    /**
     * generate a css-stylename with configured namespace 
     */
    me.generateStyleName = function (styleName) {
        var prefix = '';
        if (me.config && me.config.styleNS) {
            prefix = me.appBase.config.styleNS;
        }
        if (me.appBase.config && me.appBase.config.styleNS) {
            prefix = me.appBase.config.styleNS;
        }
        return prefix + styleName;
    };

    /**
     * initialize the service-base
     */
    me._init = function () {
        // check Config
        me.appBase = appBase;
        me.config = appBase.checkConfig(config, defaultConfig);
        me.jQuery = appBase.jQuery;
        me.$ = me.jQuery;
    };

    me._init();

    return me;
};
/**
 * base widget for all JsHelferlein.Widgets
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration
 * @param {JsHelferlein.ConfigBase} defaultConfig   optional defaultconfig if no configuration is set
 * @return {JsHelferlein.WidgetBase}                an instance of the widget
 * @constructor
 */
JsHelferlein.WidgetBase = function (appBase, config, defaultConfig) {
    'use strict';

    // my own instance
    var me = {};

    me._init = function () {
        // check Config
        me.appBase = appBase;
        me.$ = me.appBase.$;
        me.$instance = undefined;
        me.config = appBase.checkConfig(config, defaultConfig);
    };

    /**
     * prepare the box (create or reset html-element)
     */
    me.prepare = function() {
    };

    /**
     * show html-element
     */
    me.open = function() {
    };

    /**
     * hide the element (hide content)
     */
    me.close = function() {
    };

    /**
     * destroy the widget
     */
    me.destroy = function() {
    };

    /**
     * create or reset html-element
     */
    me._createUI = function() {
    };

    /**
     * destroy html-element
     */
    me._removeUI = function() {
    };

    /**
     * show html-element
     */
    me._showUI = function() {
    };

    /**
     * hide html-element
     */
    me._hideUI = function() {
    };

    /**
     * get the html-element
     * @abstract
     * @return {jQuery}       element
     */
    me._getUIInstance = function() {};

    me._checkUI = function () {
        me.$instance = me._getUIInstance();
        return !me.appBase.DataUtils.isUndefined(me.$instance);
    };

    me._init();

    return me;
};
/**
 * servicefunctions for cookie-handling
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @return {JsHelferlein.CookieHelper}         an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.CookieHelper = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * write cookie
     * @param {string} name     name of the cookie
     * @param {string} value    value to set
     * @param {int} days        expires in x days
     * @param {string} path     path (if not set /)
     */
    me.writeCookie = function (name, value, days, path) {
        // wie lange gueltig??
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString() ();
        } else {
            expires = '';
        }
        // Coockie setzen
        document.cookie = name + '=' + value + expires + '; path=/';
    };

    /**
     * read cookie
     * @param {string} name     name of the cookie to read
     * @return {string|null}    resulting value
     */
    me.readCookie = function (name) {
        // Vollen Namen mit = suchen
        var nameFull = name + '=';
        var cookie = document.cookie;
        var ca = cookie.split(';');
        if (ca.length === 0) {
            ca = [cookie];
        }
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            // replace spaces
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }

            // extract value
            if (c.indexOf(nameFull) === 0) {
                return c.substring(nameFull.length, c.length);
            }
        }
        return null;
    };

    return me;
};
/**
 * servicefunctions for dom-handling
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @return {JsHelferlein.DOMHelper}            an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.DOMHelper = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * append an style-block behind parentId
     * @param {string} styles                css-styles to add
     * @param {string} parentId              id of the parent
     * @return {Boolean}                     done or not
     */
    me.appendStyle = function (styles, parentId) {
        // neues Stylelement erzeugen
        var newStyle = document.createElement('style');
        newStyle.setAttribute('type', 'text/css');
        var flgDone = false;
        var parent = document.getElementById(parentId);
        if (parent) {
            parent.appendChild(newStyle);
            // erst belegen, wenn im DM-Baum (wegen IE)
            if (newStyle.styleSheet) {
                // IE
                newStyle.styleSheet.cssText = styles;
            } else {
                // the world
                var textStyles = document.createTextNode(styles);
                newStyle.appendChild(textStyles);
            }
            flgDone = true;
        }
        return flgDone;
    };

    /**
     * append an html-block in new div behind parentId
     * @param {string} html                  html to add
     * @param {string} parentId              id of the parent
     * @param {string} className             className of the new div
     * @return {Boolean}                     done or not
     */
    me.appendHtml = function (html, parentId, className) {
        // neues Htmllement erzeugen
        var newDiv = document.createElement('div');
        var flgDone = false;
        if (parentId) {
            var parentElement = document.getElementById(parentId);
            if (parentElement) {
                parentElement.appendChild(newDiv);
                // ait for DOM-Baum (IE....)
                newDiv.innerHTML = html;
                if (className) {
                    newDiv.className = className;
                }
                flgDone = true;
            }
        }
        return flgDone;
    };

    /**
     * fuegt ein Style vor dem 1. JavaScript-Block ein
     * @param styles:                CSS-Styles
     * @return                       {Boolean} falls angefuegt
     */
    me.insertStyleBeforeScript = function (styles) {
        // neues Stylelement erzeugen
        var newStyle = document.createElement('style');
        newStyle.setAttribute('type', 'text/css');
        var flgDone = false;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag) {
            firstScriptTag.parentNode.insertBefore(newStyle, firstScriptTag);
            if (newStyle.styleSheet) {   // IE
                newStyle.styleSheet.cssText = styles;
            } else {                // the world
                var textStyles = document.createTextNode(styles);
                newStyle.appendChild(textStyles);
            }
            flgDone = true;
        }
        return flgDone;
    };

    /**
     * append an style-block on end of body
     * @param {string} styles                css-styles to add
     * @return {Boolean}                     done or not
     */
    me.appendStyleAtEnd = function (styles) {
        // neues Stylelement erzeugen
        var newStyle = document.createElement('style');
        newStyle.setAttribute('type', 'text/css');
        var flgDone = false;
        var bodyTag = document.getElementsByTagName('body')[0];
        if (bodyTag) {
            bodyTag.appendChild(newStyle);
            if (newStyle.styleSheet) {   // IE
                newStyle.styleSheet.cssText = styles;
            } else {                // the world
                var textStyles = document.createTextNode(styles);
                newStyle.appendChild(textStyles);
            }
            flgDone = true;
        }
        return flgDone;
    };

    /**
     * search for all elements with classNames and set the event as OnClick-event
     * @param {string} classNames           lit of classNames for filtering
     * @param {handler} event               handler to call onclick
     * @param {boolean} force               overwrite existing events
     */
    me.addLinkOnClickEvent = function (classNames, event, force) {
        var svcLogger = me.appBase.Logger;
        try {
            // alle Klassen iterieren
            for (var i = 0; i < classNames.length; i++) {
                var className = classNames[i];
                // Links suche und iterieren
                var links = document.getElementsByClassName(className);
                for (var j = 0; j < links.length; j++) {
                    // Elemente iterieren
                    var link = links[j];
                    if ((!link.onclick) || force) {
                        // entweder nicht definiert, oder Force
                        if (svcLogger && svcLogger.isDebug) {
                            svcLogger.logDebug('DOMHelper.addLinkOnClickEvent set a.onclick() for '
                                + className + ' Id:' + link.id + ' with event');
                        }
                        link.onclickold = link.onclick;
                        link.onclick = event;
                    } else {
                        // nicht definiert
                        if (svcLogger && svcLogger.isDebug) {
                            svcLogger.logDebug('DOMHelper.addLinkOnClickEvent cant set a.onclick() for '
                                + className + ' Id:' + link.id + ' with event already defined');
                        }
                    }
                }
            }
        } catch (ex) {
            if (svcLogger && svcLogger.isError) {
                svcLogger.logError('DOMHelper.addLinkOnClickEvent set a.onclick() Exception: ' + ex, false);
            }
        }
    };

    return me;
};
/**
 * base-instance of javascript detectors
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @param {JsHelferlein.ConfigBase} config     optional configuration (default JsHelferlein.JavascriptDetectorConfig)
 * @return {JsHelferlein.JavascriptDetector}   an instance of the service
 * @augments JsHelferlein.DetectorBase
 * @constructor
 */
JsHelferlein.JavascriptDetector = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.DetectorBase(appBase, config, JsHelferlein.JavascriptDetectorConfig());

    /**
     * is that feature supported ?
     * @abstract
     * @returns {boolean}         true/false if that feature is supported
     */
    me.isSupported = function () {
        return true;
    };

    return me;
};
/**
 * default configuration for JsHelferlein.JavascriptDetector
 *
 * @return {JsHelferlein.JavascriptDetectorConfig}   an instance of the config
 * @augments JsHelferlein.DetectorBaseConfig
 * @constructor
 */
JsHelferlein.JavascriptDetectorConfig = function () {
    'use strict';

    var me = JsHelferlein.DetectorBaseConfig();

    me.styleBaseName = 'javascript';

    return me;
};
/**
 * a logger
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @param {JsHelferlein.LoggerConfig} config   optional configuration
 * @return {JsHelferlein.Logger}               an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.Logger = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, JsHelferlein.LoggerConfig());

    /**
     * initialize the logger
     */
    me._init = function () {
        // my props
        me.console = {};

        // bietet Browser console an ??
        if (window.console) {
            me.console = window.console;

            // IE has a console that has a 'log' function but no 'debug'. to make console.debug work in IE,
            // we just map the function. (extend for info etc if needed)
            if (!window.console.debug && typeof window.console.log !== 'undefined') {
                window.console.debug = window.console.log;
            }
        }

        // ... and create all functions we expect the console to have (took from firebug).
        var names = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml',
            'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];

        for (var i = 0; i < names.length; ++i) {
            if (!me.console[names[i]]) {
                me.console[names[i]] = function () {
                };
            }
        }

        // eigene Console oeffnen
        me.ownConsoleElement = null;
        if (me.config.flgOwnConsole) {
            me.ownConsoleElement = me._initOwnConsole();
        }

        // WebLogger-Url
        me.webLoggerUrl = me.config.webLoggerUrl;

        /*
         * Root-Logger initialisieren
         */
        me.isError = true;
        me.isErrorWebLogger = false;
        me.isWarning = true;
        me.isWarningWebLogger = false;
        me.isInfo = false;
        me.isInfoWebLogger = false;
        me.isDebug = false;
        me.isDebugWebLogger = false;
        me.LoggerRoot = false;
    };

    /**
     * log errors
     * - if ownConsoleElement active - do logOwnConsole too
     * - if webLoggerUrl and isErrorWebLoogger active - Logging do logWebLogger too
     * @param {string} text           message to log
     * @param {boolean}flgShowDialog  open error dialog
     */
    me.logError = function (text, flgShowDialog) {
        me.console.error(' ERROR:' + text);
        if (flgShowDialog) {
            me.appBase.UIDialogs.showToastMessage('error', 'Oops! Ein Fehlerchen :-(', me.appBase.DataUtils.htmlEscapeText(text));
            //        me.openErrorDialog(me.appBase.DataUtils.htmlEscapeText(message));
        }
        if (me.ownConsoleElement) {
            me._logOwnConsole(text);
        }
        if (me.webLoggerUrl && me.isErrorWebLogger) {
            me._logWebLogger('ERROR', text);
        }
    };

    /**
     * log warnings
     * - if ownConsoleElement active - do logOwnConsole too
     * - if webLoggerUrl and isErrorWebLoogger active - Logging do logWebLogger too
     * @param {string} text           message to log
     */
    me.logWarning = function (text) {
        me.console.warn(' WARNING:' + text);
        if (me.ownConsoleElement) {
            me._logOwnConsole(text);
        }
        if (me.webLoggerUrl && me.isWarningWebLogger) {
            me._logWebLogger('WARNING', text);
        }
    };

    /**
     * log infos
     * - if ownConsoleElement active - do logOwnConsole too
     * - if webLoggerUrl and isErrorWebLoogger active - Logging do logWebLogger too
     * @param {string} text           message to log
     */
    me.logInfo = function (text) {
        me.console.info(' INFO:' + text);
        if (me.ownConsoleElement) {
            me._logOwnConsole(text);
        }
        if (me.webLoggerUrl && me.isInfoWebLogger) {
            me._logWebLogger('INFO', text);
        }
    };

    /**
     * log debug-messages
     * - if ownConsoleElement active - do logOwnConsole too
     * - if webLoggerUrl and isErrorWebLoogger active - Logging do logWebLogger too
     * @param {string} text           message to log
     */
    me.logDebug = function (text) {
        me.console.debug(' DEBUG:' + text);
        if (me.ownConsoleElement) {
            me._logOwnConsole(text);
        }
        if (me.webLoggerUrl && me.isDebugWebLogger) {
            me._logWebLogger('DEBUG', text);
        }
    };


    /**
     * init own logConsole
     * @returns {HtmlElement}
     */
    me._initOwnConsole = function () {
        var consoleWindowElement = null;
        try {
            // open on console-window
            var consoleWindow = window.open('', 'LoggerOwnConsole', 'height=400,width=650,resizable=yes,scrollbars=yes');

            // exists already: use this Textarea
            consoleWindowElement = consoleWindow.document.getElementById('LoggerOwnConsoleDiv');

            // not exists: create new Textarea
            if (!consoleWindowElement) {
                consoleWindow.document.write('<textarea id="LoggerOwnConsoleDiv" cols="80" rows="40"></textarea>');
                consoleWindowElement = consoleWindow.document.getElementById('LoggerOwnConsoleDiv');
            }
        } catch (e) {
            me.logError('JMSLOGGER.initOwnConsole cant open Console window:' + e, false);
        }
        return consoleWindowElement;
    };

    /**
     * if ownConsoleElement active: log to ownConsoleElement
     * @param {string} text     message to log to ownConsoleElement
     */
    me._logOwnConsole = function (text) {
        if (me.ownConsoleElement) {
            try {
                me.ownConsoleElement.value = me.ownConsoleElement.value + '\n' + text;
            } catch (e) {
            }
        }
    };

    /**
     * if webLoggerUrl active:, insert iframe with Id:weblogger who embeds webLoggerUrl
     * @param {string}  logLevel      loglevel to log to webLoggerUrl
     * @param {string}  text          message to log to ownConsoleElement
     */
    me._logWebLogger = function (logLevel, text) {
        if (me.webLoggerUrl) {
            try {
                // Logurl erzegen
                var url = me.webLoggerUrl + 'LOGLEVEL=' + logLevel + '&LOGMSG=' + text + '&LOGURL=' + window.location;

                // neues Logelement erzeugen
                var logElement = document.createElement('script');
                logElement.src = url;
                var parent = document.getElementsByTagName('script')[0];
                parent.parentNode.insertBefore(logElement, parent);

            } catch (e) {
                //alert('Exception:' + e)
            }
        }
    };

    // init all
    me._init();

    return me;
};
/**
 * default configuration for JsHelferlein.Logger
 *
 * @return {JsHelferlein.LoggerConfig}       an instance of the config
 * @augments JsHelferlein.ConfigBase
 * @constructor
 */
JsHelferlein.LoggerConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.flgOwnConsole = false;
    me.webLoggerUrl = undefined;

    return me;
};
/**
 * base-instance with service functions for parser
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @param {JsHelferlein.ConfigBase} config        optional configuration
 * @param {JsHelferlein.ConfigBase} defaultConfig optional defaultconfig if no configuration is set
 * @return {JsHelferlein.AbstractParser}          an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.AbstractParser = function (appBase, config, defaultConfig) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, defaultConfig);

    /**
     * executes renderer on filtered blocks
     * @abstract
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
    };

    /**
     * add service-links to the block
     * @abstract
     * @param {string} block                 selector to identify the block via jquery
     */
    me._addServiceLinks = function (block) {
    };

    return me;
};

/**
 * servicefunctions for parsing checklists
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.ChecklistParser}         an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.ChecklistParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    // states
    me.checkListConfigs = {
        'checklist-state-OPEN': {
            matchers: ['OPEN', 'OFFEN', 'o', 'O', '0', 'TODO']
        },
        'checklist-state-RUNNING': {
            matchers: ['RUNNING']
        },
        'checklist-state-LATE': {
            matchers: ['LATE']
        },
        'checklist-state-BLOCKED': {
            matchers: ['BLOCKED', 'WAITING', 'WAIT']
        },
        'checklist-state-WARNING': {
            matchers: ['WARNING']
        },
        'checklist-state-DONE': {
            matchers: ['DONE', 'OK', 'x', 'X', 'ERLEDIGT']
        },
        'checklist-test-TESTOPEN': {
            matchers: ['TESTOPEN']
        },
        'checklist-test-PASSED': {
            matchers: ['PASSED']
        },
        'checklist-test-FAILED': {
            matchers: ['FAILED', 'ERROR']
        }
    };

    /**
     * executes checklist-formatter (add span with checklist-Styles) on the block [use me.checkListConfigs]
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     * @param {boolean} force                   force parsing
     */
    me.renderBlock = function (selector, force) {
        me.$(selector).each(function (i, block) {
            console.log('ChecklistParser.renderBlock ' + selector);
            try {
                me._highlightCheckList(block, force);
            } catch (ex) {
                console.error('ChecklistParser.renderBlock error:' + ex, ex);
            }
        });
    };

    /**
     * executes checklist-formatter (add span with checklist-Styles) on the block [use me.checkListConfigs]
     * @param descBlock              id-filter to identify the block to format
     * @param force                  force parsing
     */
    me._highlightCheckList = function (descBlock, force) {
        var $blockElement = me.$(descBlock);
        var descBlockId = $blockElement.attr('id');
        if ($blockElement.attr('data-checklist-processed') && !force) {
            console.log('highlightCheckList already done for block: ' + descBlockId);
            return;
        }
        $blockElement.attr('data-checklist-processed', true);
        console.log('highlightCheckList highlight for block: ' + descBlockId);

        // do it
        var prefix = 'jsh-';
        for (var idx in me.checkListConfigs) {
            if (!me.checkListConfigs.hasOwnProperty(idx)) {
                continue;
            }
            var matchers = me.checkListConfigs[idx].matchers;
            me._highlightCheckListForMatchers(descBlock, matchers, prefix + idx, '');
        }
    };

    /**
     * executes checklist-formatter (add span with checklistFormat) with style and styleclass for all matchers '[XXX]' on descBlock
     * @param descBlock              id-filter to identify the block to format
     * @param matchers               list of matcher which will call as stringfilter of '[' + matcher + ']' to identify checklist-entry
     * @param styleClass             styleClass to add to span for matcher found
     * @param style                  style to add to new span for matcher found
     */
    me._highlightCheckListForMatchers = function (descBlock, matchers, styleClass, style) {
        var descBlockId = me.$(descBlock).attr('id');
        console.log('highlightCheckListForMatchers matchers "' + matchers + '" for descBlock: ' + descBlockId);
        for (var idx in matchers) {
            if (!matchers.hasOwnProperty(idx)) {
                continue;
            }
            me._highlightCheckListForMatcher(descBlock, '[' + matchers[idx] + ']', styleClass, style);
        }
    };

    /**
     * executes checklist-formatter (add span with checklistFormat) with style and styleclass for all matchers '[XXX]' on descBlock
     * @param descBlock              id-filter to identify the block to format
     * @param matcherStr             matcher will call as stringfilter to identify checklist-entry
     * @param styleClass             styleClass to add to span for matcher found
     * @param style                  style to add to new span for matcher found
     */
    me._highlightCheckListForMatcher = function (descBlock, matcherStr, styleClass, style) {
        var descBlockId = me.$(descBlock).attr('id');
        console.log('highlightCheckListForMatcher matcherStr "' + matcherStr + '" for descBlock: ' + descBlockId);
        var filter = '#' + descBlockId +' li:contains("' + matcherStr + '"),' +
            '#' + descBlockId +' h1:contains("' + matcherStr + '"),' +
            '#' + descBlockId +' h2:contains("' + matcherStr + '")';
        var regEx = new RegExp(me.appBase.DataUtils.escapeRegExp(matcherStr), 'gi');

        me.$(filter).each(function (index, value) {
            findAndReplaceDOMText(me.$(value).get(0), {
                find: regEx,
                replace: function (portion) {
                    var el = document.createElement('span');
                    if (style) {
                        el.style = style;
                    }
                    if (styleClass) {
                        el.className = styleClass;
                    }
                    el.innerHTML = portion.text;
                    return el;
                }
            });
        });
    };

    return me;
};

/**
 * servicefunctions to decorate diagrams
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.DiagramWidgets}          an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.DiagramWidgets = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * create and add service-links to diagram-block
     * @param {string} block                 filter to identify the block to add links (used as jquery-selector)
     * @param {string} type                  diagram-type (mermaid, plantuml...)
     * @param {string} downloadLink          html with downloadLink
     */
    me.addServiceLinksToDiagramBlock = function (block, type, downloadLink) {
        var $blockElement = me.$(block);
        var content = $blockElement.html();
        var blockId = $blockElement.attr('id');
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;

        // add source
        $blockElement.before(
            '<div class="' + type + '-source" id="fallback' + blockId + '">' +
            '<pre>' + content + '</pre>' +
            '</div>');
        // add service-links
        var toggleHandler = ymfAppBaseVarName +
            '.DiagramWidgets.toggleLinks(' +
            '\'#toggleorig' + blockId + '\', \'#togglesource' + blockId + '\', \'#' + blockId + '\', \'#fallback' + blockId + '\'); ' +
            'return false;';
        me.$('#fallback' + blockId).before(
            '<div class="services' + type + '" id="services' + blockId + '">' +
            '<div>' +
            downloadLink +
            '<a href="#" style="display: none;" id="toggleorig' + blockId + '" onclick="' + toggleHandler + '"' +
            ' target="_blank">Diagramm</a>' +
            '<a href="#" id="togglesource' + blockId + '" onclick="' + toggleHandler + '" target="_blank">Source</a>' +
            '</div>' +
            '</div>');
    };

    /**
     * toggle diagram-services (if id1 displayed: hide id1, show link1 and show id2, hide link2)...
     * @param {Object} link1         JQuery-Filter (html.id, style, objectlist...) for the link of service1
     * @param {Object} link2         JQuery-Filter (html.id, style, objectlist...) for the link of service2
     * @param {Object} id1           JQuery-Filter (html.id, style, objectlist...) for service1
     * @param {Object} id2           JQuery-Filter (html.id, style, objectlist...) for service2
     */
    me.toggleLinks = function (link1, link2, id1, id2) {
        if (me.$(id1).css('display') !== 'none') {
            me.$(id1).css('display', 'none');
            me.$(link1).css('display', 'inline');
            me.$(id2).css('display', 'block');
            me.$(link2).css('display', 'none');
        } else {
            me.$(id2).css('display', 'none');
            me.$(link2).css('display', 'inline');
            me.$(id1).css('display', 'block');
            me.$(link1).css('display', 'none');
        }
        return false;
    };
    
    return me;
};

/**
 * servicefunctions for parsing images as slimbox
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.ImageSlimboxParser}      an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.ImageSlimboxParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the blocks as image-slimbox
     * @param {string} selector                 filter to identify the images to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, image) {
            var $imageElement = me.$(image);
            if ($imageElement.attr('data-image-processed')) {
                console.log('ImageSlimboxParser.renderBlock already done for image: ' + selector);
                return;
            }
            $imageElement.attr('data-image-processed', true);

            // OnClick loeschen
            $imageElement.each(function(){
                $(this).removeAttr('onclick');
            });

            try {
                // an Lightbox anfuegen
                $imageElement.slimbox(
                    {/* Put custom options here */},
                    function(el) {
                        // read image
                        var img = el;

                        var url = img.src;
                        if (! url) {
                            return null;
                        }

                        var desc = img.getAttribute('diadesc');
                        if (! desc) {
                            desc = img.alt;
                        }

                        return [url, desc];
                    },
                    function(el) {
                        var img = el;

                        var url = img.src;
                        if (! url) {
                            return false;
                        }
                        return true;
                    }
                );
            } catch (ex) {
                console.error('ImageSlimboxParser.renderBlock error:' + ex, ex);
            }
        });
    };

    return me;
};
 
/**
 * servicefunctions for parsing mermaid-sources
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.MermaidParser}           an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.MermaidParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the block-content as mermaid
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, block) {
            var $blockElement = me.$(block);
            if ($blockElement.attr('data-mermaid-processed') || $blockElement.attr('data-processed')) {
                console.log('MermaidParser.renderBlock already done for block: ' + selector);
                return;
            }
            $blockElement.attr('data-mermaid-processed', true);

            me._addServiceLinks(block);

            mermaid.parseError = function (err, hash) {
                me.appBase.UIDialogs.showToastMessage('error', 'Oops! Ein Fehlerchen :-(', 'Syntaxfehler bei Parsen des Diagrammcodes:' + err);
            };
            try {
                mermaid.init(block);
            } catch (ex) {
                console.error('MermaidParser.renderBlock error:' + ex, ex);
            }
        });
    };

    /**
     * add service-links (source, download, diagram) to the block
     * @param {string} block                 selector to identify the block via jquery
     */
    me._addServiceLinks = function (block) {
        var blockId = me.$(block).attr('id');
        var jshAppBaseVarName = me.appBase.config.appBaseVarName;

        var clickHandler = jshAppBaseVarName +
            '.FileUtils.downloadAsFile(' +
            jshAppBaseVarName + '.$(\'#linkdownload' + blockId + '\'), ' +
            jshAppBaseVarName + '.$(\'#' + blockId + '\').html(), \'diagram.svg\', \'image/svg+xml\', \'utf-8\'); ' +
            'return true;';
        me.appBase.DiagramWidgets.addServiceLinksToDiagramBlock(block, 'mermaid',
            '<a href="" id="linkdownload' + blockId + '"  target="_blank"' +
            ' onclick="' + clickHandler + '">Download</a>');
    };

    /**
     * render all mermaid in document
     */
    me.renderMermaidGlobal = function () {
        mermaid.parseError = function (err, hash) {
            me.appBase.UIDialogs.showToastMessage('error', 'Oops! Ein Fehlerchen :-(', 'Syntaxfehler bei Parsen des Diagrammcodes:' + err);
        };
        try {
            mermaid.init();
        } catch (ex) {
            console.error('renderMermaidGlobal error:' + ex, ex);
        }
    };

    /**
     * prepare the text to format as mermaid
     * delete "."
     * @param descText               the string to prepare
     * @return                       {String}  prepared text to format with mermaid
     */
    me.prepareTextForMermaid = function (descText) {
        // prepare descText
        var newDescText = descText;
        newDescText = newDescText.replace(/\n\.\n/g, '\n\n');
        return newDescText;
    };


    return me;
};

/**
 * servicefunctions for parsing mindmap-sources
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.MindmapParser}           an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.MindmapParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the block-content as mindmap.
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, block) {
            var blockId = me.$(block).attr('id');
            console.log('MindmapParser.renderBlock ' + blockId);
            try {
                me._formatMindmap(block);
            } catch (ex) {
                console.error('MindmapParser.renderBlock error:' + ex, ex);
            }
        });
    };

    /**
     * format the block-content as mindmap.
     * <ul>
     * <li>creates a FlashObject /dist/vendors/freemind-flash/visorFreemind.swf
     * <li>Calls /converters/mindmap with the html-content of the block
     * <li>insert the returning flash-object into block-element
     * </ul>
     * @param block                  jquery-html-element with the content to convert to mindmap
     */
    me._formatMindmap = function (block) {
        var $blockElement = me.$(block);
        var content = $blockElement.html();
        var blockId = $blockElement.attr('id');

        if ($blockElement.attr('data-mindmap-processed')) {
            console.log('formatMindmap already done for block: ' + blockId);
            return;
        }
        $blockElement.attr('data-mindmap-processed', true);

        me._addServiceLinks(block);

        var url = '/converters/mindmap?source=' + encodeURIComponent(content);
        console.log('formatMindmap ' + blockId + ' url:' + url);
        var fo = new FlashObject('/dist/vendors/freemind-flash/visorFreemind.swf', 'visorFreeMind', '100%', '100%', 6, '#9999ff');
        fo.addParam('quality', 'high');
        fo.addParam('bgcolor', '#a0a0f0');
        fo.addVariable('openUrl', '_blank');
        fo.addVariable('startCollapsedToLevel', '10');
        fo.addVariable('maxNodeWidth', '200');
        //
        fo.addVariable('mainNodeShape', 'elipse');
        fo.addVariable('justMap', 'false');

        fo.addVariable('initLoadFile', url);
        fo.addVariable('defaultToolTipWordWrap', 200);
        fo.addVariable('offsetX', 'left');
        fo.addVariable('offsetY', 'top');
        fo.addVariable('buttonsPos', 'top');
        fo.addVariable('min_alpha_buttons', 20);
        fo.addVariable('max_alpha_buttons', 100);
        fo.addVariable('scaleTooltips', 'false');
        fo.write(blockId);
    };

    /**
     * add service-links (source, download, diagram) to the block
     * @param {string} block                 selector to identify the block via jquery
     */
    me._addServiceLinks = function (block) {
        var $blockElement = me.$(block);
        var blockId = $blockElement.attr('id');

        var content = $blockElement.html();
        var url = '/converters/mindmap?source=' + encodeURIComponent(content);
        me.appBase.DiagramWidgets.addServiceLinksToDiagramBlock(block, 'jshmindmap',
            '<a href="' + url + '" id="download' + blockId + '" target="_blank">Download</a>');
    };

    return me;
};

/**
 * servicefunctions for parsing plantuml-sources
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.PlantumlParser}          an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.PlantumlParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the block-content as plantuml.
     * creates a Img-Tag with src 'http://www.plantuml.com/plantuml/img/
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, block) {
            var $blockElement = me.$(block);
            if ($blockElement.attr('data-plantuml-processed')) {
                console.log('PlantumlParser.renderBlock already done for block: ' + selector);
                return;
            }
            $blockElement.attr('data-plantuml-processed', true);

            me._addServiceLinks(block);

            try {
                var content = $blockElement.html();
                var url = me._generatePlantuml(content);
                console.log('PlantumlParser.renderBlock ' + selector + ' url:' + url);
                $blockElement.html('<img class="jsf-plantuml" src="' + url + '" id="' + selector + 'Img">');
            } catch (ex) {
                console.error('PlantumlParser.renderBlock error:' + ex, ex);
            }
        });
    };

    /**
     * add service-links (source, download, diagram) to the block
     * @param {string} block                 selector to identify the block via jquery
     */
    me._addServiceLinks = function (block) {
        var $blockElement = me.$(block);
        var blockId = $blockElement.attr('id');

        var content = $blockElement.html();
        var url = me._generatePlantuml(content);
        me.appBase.DiagramWidgets.addServiceLinksToDiagramBlock(block, 'jshplantuml',
            '<a href="' + url + '" id="download' + blockId + '" target="_blank">Download</a>');
    };


    /**
     * generate a plantuml for the content (url can be used as img.src)
     * @param {string} content       plant-uml source to parse a plantuml  
     */
    me._generatePlantuml = function (content) {
        /*jshint bitwise: false */
        function encode64(data) {
            var r = '';
            for (var i = 0; i < data.length; i += 3) {
                if (i + 2 === data.length) {
                    r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
                } else if (i + 1 === data.length) {
                    r += append3bytes(data.charCodeAt(i), 0, 0);
                } else {
                    r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1),
                        data.charCodeAt(i + 2));
                }
            }
            return r;
        }

        function append3bytes(b1, b2, b3) {
            var c1 = b1 >> 2;
            var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
            var c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
            var c4 = b3 & 0x3F;
            var r = '';
            r += encode6bit(c1 & 0x3F);
            r += encode6bit(c2 & 0x3F);
            r += encode6bit(c3 & 0x3F);
            r += encode6bit(c4 & 0x3F);
            return r;
        }

        function encode6bit(b) {
            if (b < 10) {
                return String.fromCharCode(48 + b);
            }
            b -= 10;
            if (b < 26) {
                return String.fromCharCode(65 + b);
            }
            b -= 26;
            if (b < 26) {
                return String.fromCharCode(97 + b);
            }
            b -= 26;
            if (b === 0) {
                return '-';
            }
            if (b === 1) {
                return '_';
            }
            return '?';
        }
        /*jshint bitwise: true */

        var txt = content;
        txt = txt.replace(/&gt;/g, '>');
        txt = txt.replace(/&lt;/g, '<');
        txt = txt.replace(/\n\.\n/g, '\n');
        txt = txt.replace(/\n\n/g, '\n');
        var s = decodeURIComponent(encodeURIComponent(txt));
        var url = me.appBase.config.plantUmlBaseUrl + 'plantuml/svg/' + encode64(deflate(s, 9));

        return url;
    };


    return me;
};

/**
 * servicefunctions for parsing sourcecode-sources
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.SyntaxHighlighterParser} an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.SyntaxHighlighterParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the block-content as sourcecode with syntax-highlighting
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, block) {
            var $blockElement = me.$(block);
            var blockId = $blockElement.attr('id');
            if ($blockElement.attr('data-syntaxhighlight-processed')) {
                console.log('SyntaxHighlighterParser.renderBlock already done for block: ' + blockId);
                return;
            }
            $blockElement.attr('data-syntaxhighlight-processed', true);

            console.log('SyntaxHighlighterParser.renderBlock ' + blockId);
            try {
                hljs.highlightBlock(block);
            } catch (ex) {
                console.error('SyntaxHighlighterParser.renderBlock error:' + ex, ex);
            }
        });
    };

    return me;
};

/**
 * Extended Markdown-syntax
 *
 */
(function () {
    'use strict';


    marked.Lexer.prototype.extenedBlockRules = {
        ruleBoxStart: /^ *(<|&lt;)\!---(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)/,
        ruleBoxEnd: /^ *(<|&lt;)\!---\/(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)/
    };

    /**
     * implementation of the abstract tokenizeExtenedMarkdown from marked.Lexer
     * @param {marked.Lexer} lexer       instance of the Lexer
     * @param {string} src               markdown-source to parse
     * @return {Object}                  rest-src which should parsed by another lexer
     */
    marked.Lexer.prototype.tokenizeExtenedMarkdown = function (lexer, src) {
        var cap;
        // check block.msextend
        if (lexer.extenedBlockRules.ruleBoxStart) {
            cap = lexer.extenedBlockRules.ruleBoxStart.exec(src);
            if (cap) {
                src = src.substring(cap[0].length);
                lexer.tokens.push({
                    type: 'ruleBoxStart',
                    boxtype: cap[2],
                    attr: cap[3]
                });
                return {src: src, found: true};
            }
        }
        if (lexer.extenedBlockRules.ruleBoxEnd) {
            cap = lexer.extenedBlockRules.ruleBoxEnd.exec(src);
            if (cap) {
                src = src.substring(cap[0].length);
                lexer.tokens.push({
                    type: 'ruleBoxEnd',
                    boxtype: cap[2],
                    attr: cap[3]
                });
                return {src: src, found: true};
            }
        }

        return {src: src, found: false};
    };

    marked.Parser.prototype.renderExtenedMarkdownToken = function (parser, token) {
        switch (token.type) {
            case 'ruleBoxStart':
            {
                return parser.renderer._renderExtendedMarkdownBoxStart(token.boxtype, token.attr);
            }
            case 'ruleBoxEnd':
            {
                return parser.renderer._renderExtendedMarkdownBoxEnd(token.boxtype, token.attr);
            }
            case 'toggler':
            {
                return parser.renderer._renderExtendedMarkdownToggler(token.togglertype, token.attr);
            }
            case 'splitter':
            {
                return parser.renderer._renderExtendedMarkdownSplitter(token.togglertype, token.attr, token.pre, token.after);
            }
        }
        return '';
    };

    marked.InlineLexer.prototype.extenedInlineRules = {
        toggler: /([\s\S]*?)(<|&lt;)!---(TOGGLER) *([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)([\s\S]*)/,
        togglerAppend: /([\s\S]*?)(<|&lt;)!---(TOGGLER\.AFTER|TOGGLER\.BEFORE) *([-#_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)([\s\S]*)/,
        splitter: /([\s\S]*?)(:\|:)(.*)([\s\S]*)/,
        toc: /(.*?)(<|&lt;)!---(TOC) *([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)([\s\S]*)/,
        ruleBoxStart: /(.*?)(<|&lt;)\!---(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)([\s\S]*)/,
        ruleBoxEnd: /(.*?)(<|&lt;)\!---\/(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)([\s\S]*)/
    };

    marked.InlineLexer.prototype.renderExtenedInlineSyntax = function (inlinelexer, src) {
        var out = '', cap;

        // check inline.msextend
        if (inlinelexer.extenedInlineRules.splitter) {
            cap = inlinelexer.extenedInlineRules.splitter.exec(src);
            if (cap) {
                out += inlinelexer.renderer._renderExtendedMarkdownSplitter(cap[2], '',
                    inlinelexer.output(cap[1]), inlinelexer.output(cap[3]));
                src = cap[4];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.toggler) {
            cap = inlinelexer.extenedInlineRules.toggler.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownToggler(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.togglerAppend) {
            cap = inlinelexer.extenedInlineRules.togglerAppend.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownTogglerAppend(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.toc) {
            cap = inlinelexer.extenedInlineRules.toc.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownTOC(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.ruleBoxStart) {
            cap = inlinelexer.extenedInlineRules.ruleBoxStart.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownBoxStart(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.ruleBoxEnd) {
            cap = inlinelexer.extenedInlineRules.ruleBoxEnd.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownBoxEnd(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        return {out: '', src: src, found: false};
    };


    marked.Renderer.prototype.initStylesClassesForTags = function (prefix) {
        var renderer = this;
        var tags = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
            'img', 'a', 'p', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'br', 'li', 'ul', 'ol',
            'container',
            'box', 'box-ue', 'box-container',
            'infobox', 'infobox-ue', 'infobox-container',
            'warnbox', 'warnbox-ue', 'warnbox-container',
            'alertbox', 'alertbox-ue', 'alertbox-container',
            'togglerparent', 'splitter1', 'splitter2'
        ];
        var allTagStyles = renderer.allTagStyles;
        tags.map(function (tag) {
            var style = (prefix ? prefix : '') + 'md-' + tag;
            var tagStyles = allTagStyles[tag];
            if (!tagStyles) {
                tagStyles = {};
            }
            tagStyles[style] = style;
            allTagStyles[tag] = tagStyles;
        });
        renderer.allTagStyles = allTagStyles;
    };

    marked.Renderer.prototype._renderExtendedMarkdownBoxhtmlStart = function (type, param) {
        var renderer = this;
        return '<div class="' + renderer.genStyleClassesForTag(type + 'box') + '">' +
            '<div class="' + renderer.genStyleClassesForTag(type + 'box-ue') + '">' + param + '</div>' +
            '<div class="' + renderer.genStyleClassesForTag(type + 'box-container') + '">';
    };

    marked.Renderer.prototype._renderExtendedMarkdownBoxStart = function (type, param) {
        var renderer = this;
        var res = '';

        if (type.toLowerCase() === 'box') {
            res = '<div class="' + renderer.genStyleClassesForTag('box') + ' ' + param + '">';
        } else if (type.toLowerCase() === 'container') {
            res = '<div class="' + renderer.genStyleClassesForTag('container') + ' md-container-' + param + '" id="md-container-' + param + '">';
        } else if (type.toLowerCase() === 'box.info') {
            res = renderer._renderExtendedMarkdownBoxhtmlStart('info', param);
        } else if (type.toLowerCase() === 'box.warn') {
            res = renderer._renderExtendedMarkdownBoxhtmlStart('warn', param);
        } else if (type.toLowerCase() === 'box.alert') {
            res = renderer._renderExtendedMarkdownBoxhtmlStart('alert', param);
        } else if (type.toLowerCase() === 'style' && param) {
            // do set style for next elements

            // split params elements:styles
            var params = param.split(':'),
                tags = [],
                styles = [];
            if (params.length > 0) {
                tags = params[0].split(' ');
                if (params.length > 1) {
                    styles = params[1].split(' ');
                }
            }
            // set styles for all tags
            var allTagStyles = renderer.allTagStyles;
            tags.map(function (tag) {
                var tagStyles = allTagStyles[tag];
                if (!tagStyles) {
                    tagStyles = {};
                }
                styles.map(function (style) {
                    tagStyles[style] = style;
                });
                allTagStyles[tag] = tagStyles;
            });
            renderer.allTagStyles = allTagStyles;
        }
        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownBoxEnd = function (type, param) {
        var renderer = this;
        var res = '';

        if (type.toLowerCase() === 'box') {
            res = '</div>';
        } else if (type.toLowerCase() === 'box.info' ||
            type.toLowerCase() === 'box.alert' ||
            type.toLowerCase() === 'box.warn') {
            res = '</div></div>';
        } else if (type.toLowerCase() === 'container') {
            res = '</div>';
        } else if (type.toLowerCase() === 'style' && param) {
            // do reset style for next elements
            // split params elements:styles
            var params = param.split(':'),
                tags = [],
                styles = [];
            if (params.length > 0) {
                tags = params[0].split(' ');
                if (params.length > 1) {
                    styles = params[1].split(' ');
                }
            }
            // reset styles for all tags
            var allTagStyles = renderer.allTagStyles;
            tags.map(function (tag) {
                styles.map(function (style) {
                    if (allTagStyles[tag] && allTagStyles[tag][style]) {
                        allTagStyles[tag][style] = '';
                        delete allTagStyles[tag][style];
                    }
                });
            });
        }
        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownToggler = function (type, attr) {
        var renderer = this;
        var appBaseVarName = renderer.appBaseVarName;
        if (!appBaseVarName) {
            appBaseVarName = 'jshAppBase';
        }
        var res = '';
        var params = (attr || '').split(','),
            togglerType = 'icon',
            id;
        if (params.length > 0) {
            id = params[0].replace(' ');
            if (params.length > 1) {
                togglerType = params[1];
            }
        }

        if (type.toLowerCase() === 'toggler' && id !== undefined && id !== '') {
            res = '<div class="' + renderer.genStyleClassesForTag('togglerparent') + ' md-togglerparent-' + id + '" id="md-togglerparent-' + id + '"></div>' +
                '<script>' + appBaseVarName + '.get(\'UIToggler\').appendToggler(".md-togglerparent-' + id + '", ".md-container-' + id + '", "' + togglerType + '");</script>';
        }
        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownTogglerAppend = function (type, attr) {
        var renderer = this;
        var appBaseVarName = renderer.appBaseVarName;
        if (!appBaseVarName) {
            appBaseVarName = 'jshAppBase';
        }
        var res = '';
        var params = (attr || '').split(','),
            togglerType = 'icon',
            tags = [],
            styles = [],
            flgInsertBefore = (type === 'TOGGLER.BEFORE');
        if (params.length > 0) {
            if (params.length > 1) {
                togglerType = params[1];
            }

            // split params elements:styles
            var filter = params[0].replace(' ').split(':');
            if (filter.length > 0) {
                tags = filter[0].split(' ');
                if (filter.length > 1) {
                    styles = filter[1].split(' ');
                }
            }
            tags.map(function (tag) {
                styles.map(function (style) {
                    res = '<script>' + appBaseVarName + '.get(\'UIToggler\').appendTogglerForElements("' +
                        tag + '.' + style + '", "' + togglerType + '", ' + flgInsertBefore + ');</script>';
                });
            });
        }

        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownTOC = function (type, attr) {
        var renderer = this;
        var appBaseVarName = renderer.appBaseVarName;
        if (!appBaseVarName) {
            appBaseVarName = 'jshAppBase';
        }
        var res = '';
        var params = (attr || '').split(','),
            togglerType = 'icon',
            id;
        if (params.length > 0) {
            id = params[0].replace(' ');
            if (params.length > 1) {
                togglerType = params[1];
            }
        }

        if (marked.nextTocId === undefined) {
            marked.nextTocId = 1;
        }
        if (type.toLowerCase() === 'toc') {
            var tocId = 'jsh-md-toc-container-' + marked.nextTocId,
                tocElement = appBaseVarName + '.$(\'div.'+ tocId + '\')',
                srcElement = tocElement + '.parents(\'div\')',
                settings = 'undefined';
            res = '<div class="jsh-md-toc-container ' + tocId + '" id="' + tocId + '"></div>' +
                '<script>' + appBaseVarName + '.get(\'Renderer\').addTOCForBlock(' +
                tocElement +', ' + srcElement + ', ' + settings + ');</script>';
        }
        marked.nextTocId++;
        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownSplitter = function (type, attr, first, second) {
        var renderer = this;
        return '<label class="' + renderer.genStyleClassesForTag('splitter1') + '">' + first + '</label>' +
            '<span class="' + renderer.genStyleClassesForTag('splitter2') + '">' + second + '</span>';
    };

})();
/**
 * servicefunctions for markdown-rendering
 * 
 * @param {JsHelferlein.AppBase} appBase                appBase of the application
 * @param {JsHelferlein.MarkdownRendererConfig} config  optional configuration  (default JsHelferlein.MarkdownRendererConfig)
 * @return {JsHelferlein.MarkdownRenderer}              an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.MarkdownRenderer = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, new JsHelferlein.MarkdownRendererConfig());

    me._localHtmlId = 1;

    /**
     * format the descText as Markdown
     * @param descText               the string to format
     * @param flgHighlightNow        if is set do syntax-highlighting while markdown-processing, if not set do it later
     * @param headerPrefix           headerPrefix for heading-ids
     * @return                       {String} - formatted markdown
     */
    me.renderMarkdown = function (descText, flgHighlightNow, headerPrefix) {
        // Marked
        me._configureMarked(flgHighlightNow, headerPrefix);
        return marked(descText);
    };

    /**
     * prepare the text to format as markdown
     * prefix empty lines inline code-segs (```) so that they will interpreted as codeline by markdown-parser
     * @param descText               the string to prepare
     * @return                       {String}  prepared text to format as markdown
     */
    me.prepareTextForMarkdown = function (descText) {
        // prepare descText
        var noCode = '';
        var newDescText = '';
        var newDescTextRest = descText;
        var codeStart = newDescTextRest.indexOf('```');
        while (codeStart >= 0) {
            // splice start before ```and add to newDescText
            noCode = newDescTextRest.slice(0, codeStart + 3);

            // replace <> but prevent <br> in noCode
            noCode = me.appBase.DataUtils.htmlEscapeTextLazy(noCode);
            noCode = noCode.replace(/&lt;br&gt;/g, '<br>');
            newDescText += noCode;

            // extract code
            newDescTextRest = newDescTextRest.slice(codeStart + 3);
            var codeEnd = newDescTextRest.indexOf('```');
            if (codeEnd >= 0) {
                // splice all before ending ```
                var code = newDescTextRest.slice(0, codeEnd);
                newDescTextRest = newDescTextRest.slice(codeEnd);

                // replace empty lines in code
                code = code.replace(/\r\n/g, '\n');
                code = code.replace(/\n\r/g, '\n');
                code = code.replace(/\n[ \t]*\n/g, '\n.\n');
                code = code.replace(/\n\n/g, '\n.\n');

                // add code to newDescText
                newDescText += code;

                // extract ending ``` and add it to newDescText
                newDescText += newDescTextRest.slice(0, 3);
                newDescTextRest = newDescTextRest.slice(3);
            }
            codeStart = newDescTextRest.indexOf('```');
        }

        // replace <> but prevent <br> in noCode
        noCode = newDescTextRest;
        noCode = me.appBase.DataUtils.htmlEscapeTextLazy(noCode);
        noCode = noCode.replace(/&lt;br&gt;/g, '<br>');

        // add rest to newDescText
        newDescText += noCode;

        return newDescText;
    };


    /**
     * configure the instance of marked with a render 
     * @param {boolean} flgHighlightNow        do syntax-highlighting while rendering with marked 
     * @param {string} headerPrefix            optional prefix for heading-ids
     */
    me._configureMarked = function (flgHighlightNow, headerPrefix) {
        var renderer = me._createMarkdownRenderer();
        marked.setOptions({
            renderer: renderer,
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            headerPrefix: headerPrefix
        });
        if (flgHighlightNow) {
            marked.setOptions({
                highlight: function (code) {
                    return hljs.highlightAuto(code).value;
                }
            });
        }
    };

    /**
     * create and configure a instance of marked.Renderer
     * @returns {marked.Renderer}              the resulting renderer
     */
    me._createMarkdownRenderer = function () {
        var renderer = new marked.Renderer();

        renderer.appBaseVarName = me.appBase.config.appBaseVarName;

        // my own code-handler
        renderer.code = me._renderMarkdownCode;

        // my own heading-handler to be sure that the heading id is unique
        renderer.heading = me._renderMarkdownHeading;

        // my own link-renderer: for jsh
        renderer.link = me._renderMarkdownLink;

        // my own img-renderer: for jsh
        renderer.image = me._renderMarkdownImage;

        // init styleclasses
        renderer.initStylesClassesForTags('jsh-');

        return renderer;
    };

    /**
     * parse jsh-links from href and replace if exists with dms-urls...
     * @param {string} href          the url to parse
     * @param {boolean} dmsOnly      parse dms only: not yaio:
     * @return  {string}             mapped url
     */
    me._parseLinks = function (href, dmsOnly) {
        return href;
    };

    /**
     * callback to render markdown "code"-blocks
     * @param {string} code          source of the code-block
     * @param {string} language      optional language of the code
     * @return {string}              rendered block
     */
    me._renderMarkdownCode = function (code, language) {
        var prefix = me.config.styleNS || '';
        code = me.appBase.DataUtils.htmlEscapeTextLazy(code);
        if (code.match(/^sequenceDiagram/) || code.match(/^graph/) || code.match(/^gantt/)) {
            return '<div id="inlineMermaid' + (me._localHtmlId++) + '" class="' + prefix + 'mermaid mermaid">' +
                me.appBase.MermaidParser.prepareTextForMermaid(code) + '</div>';
        } else if (!me.appBase.DataUtils.isUndefinedStringValue(language) &&
            (language.match(/^jshmindmap/) || language.match(/^jshfreemind/) ||
             language.match(/ymfmindmap/) || language.match(/^ymffreemind/) ||
             language.match(/^yaiomindmap/) || language.match(/^yaiofreemind/))) {
            return '<div id="inlineMindmap' + (me._localHtmlId++) + '" class="' + prefix + 'mindmap jshmindmap">' + code + '</div>';
        } else if (!me.appBase.DataUtils.isUndefinedStringValue(language) && (language.match(/^jshplantuml/) || language.match(/^ymfplantuml/) ||
                language.match(/^yaioplantuml/))) {
            return '<div id="inlinePlantUML' + (me._localHtmlId++) + '" class="' + prefix + 'plantuml jshplantuml">' + code + '</div>';
        } else {
            return '<pre><code id="inlineCode' + (me._localHtmlId++) + '" class="' + prefix + 'code lang-' + language + '">' + code + '</code></pre>';
        }
    };

    /**
     * callback to render markdown "heading"-blocks
     * @param {string} text          source of the heading-block
     * @param {int} level            heading-level (1,2,3,4,5,6)
     * @param {string} raw           raw text
     * @return {string}              rendered block
     */
    me._renderMarkdownHeading = function (text, level, raw) {
        return '<h' + level + this.genStyleClassAttrForTag('h' + level) +
            ' id="' + this.options.headerPrefix + '_' + (me._localHtmlId++) + '_' + raw.toLowerCase().replace(/[^\w]+/g, '-') +
            '">' + text +'</h' + level + '>\n';
    };

    /**
     * callback to render markdown "link"-blocks
     * @param {string} href          href of the link
     * @param {string} title         title
     * @param {string} text          text
     * @return {string}              rendered block
     */
    me._renderMarkdownLink = function (href, title, text) {
        if (this.options.sanitize) {
            var prot;
            try {
                prot = decodeURIComponent(href)
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (e) {
                return '';
            }
            /*jshint scripturl: true */
            if (prot && prot.indexOf('javascript:') === 0) {
                return '';
            }
            /*jshint scripturl: false */
            href = me._parseLinks(href, false);
        }
        var out = '<a href="' + href + '"' + this.genStyleClassAttrForTag('a');
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    };

    /**
     * callback to render markdown "image"-blocks
     * @param {string} href          src of the image
     * @param {string} title         title
     * @param {string} text          text
     * @return {string}              rendered block
     */
    me._renderMarkdownImage = function (href, title, text) {
        if (this.options.sanitize) {
            var prot;
            try {
                prot = decodeURIComponent(href)
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (e) {
                return '';
            }
            /*jshint scripturl: true */
            if (prot && prot.indexOf('javascript:') === 0) {
                return '';
            }
            /*jshint scripturl: false */
            href = me._parseLinks(href, true);
        }
        var out = '<img src="' + href + '" alt="' + text + '"' + this.genStyleClassAttrForTag('img');
        if (title) {
            out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
    };

    return me;
};

/**
 * default configuration for JsHelferlein.MarkdownRenderer
 *
 * @return {JsHelferlein.MarkdownRendererConfig}       an instance of the config
 * @augments JsHelferlein.ConfigBase
 * @constructor
 */
JsHelferlein.MarkdownRendererConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.styleNS = 'jsh-';

    return me;
};
/**
 * servicefunctions for formatting (markdown, diagrams, mindmaps..)
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.Renderer}                an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.Renderer = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * executes all format-renderer like (mermaid, checklist, highlight, plantuml, mindmap, image-slimbox) on the block
     * @param {string} descBlock              id-filter to identify the block to render (used as jquery-filter)
     */
    me.runAllRendererOnBlock = function (descBlock) {
        var descBlockId = me.$(descBlock).attr('id');

        var svcSyntaxHighlighterParser = me.appBase.SyntaxHighlighterParser;
        var svcChecklistParser = me.appBase.ChecklistParser;
        var svcMermaidParser = me.appBase.MermaidParser;
        var svcMindmapParser = me.appBase.MindmapParser;
        var svcPlantumlParser = me.appBase.PlantumlParser;
        var svcImageSlimboxParser = me.appBase.ImageSlimboxParser;

        console.log('runAllRendererOnBlock highlight for descBlock: ' + descBlockId);

        // highlight code-blocks
        me.$('#' + descBlockId + ' code').each(function (i, block) {
            var $blockElement = me.$(block);
            var blockId = $blockElement.attr('id');
            if (($blockElement.hasClass('lang-mermaid') || $blockElement.hasClass('mermaid') ||
                    $blockElement.hasClass('jshmermaid') || $blockElement.hasClass('ymfmermaid') ||
                    $blockElement.hasClass('yaiomermaid'))
                && !$blockElement.attr('data-processed')) {
                // mermaid: no highlight
                console.log('runAllRendererOnBlock mermaid descBlock: ' + descBlockId + ' block: ' + blockId);
                svcMermaidParser.renderBlock(block);
            } else {
                // do highlight
                console.log('runAllRendererOnBlock highlight descBlock: ' + descBlockId + ' block: ' + blockId);
                svcSyntaxHighlighterParser.renderBlock(block);
            }
        });

        // mermaid/mindmap div-blocks
        me.$('#' + descBlockId + ' div').each(function (i, block) {
            var $blockElement = me.$(block);
            var blockId = $blockElement.attr('id');
            if (($blockElement.hasClass('lang-mermaid') || $blockElement.hasClass('mermaid') ||
                    $blockElement.hasClass('lang-jshmermaid') || $blockElement.hasClass('jshmermaid') ||
                    $blockElement.hasClass('lang-ymfmermaid') || $blockElement.hasClass('ymfmermaid') ||
                    $blockElement.hasClass('yaiomermaid-mermaid') || $blockElement.hasClass('yaiomermaid'))
                && !$blockElement.attr('data-processed')) {
                // mermaid: no highlight
                console.log('runAllRendererOnBlock mermaid descBlock: ' + descBlockId + ' block: ' + blockId);
                svcMermaidParser.renderBlock(block);
            } else if ($blockElement.hasClass('lang-jshmindmap') || $blockElement.hasClass('jshmindmap') ||
                       $blockElement.hasClass('lang-ymfmindmap') || $blockElement.hasClass('ymfmindmap') ||
                       $blockElement.hasClass('lang-yaiomindmap') || $blockElement.hasClass('yaiomindmap')) {
                // mindmap: no highlight
                console.log('runAllRendererOnBlock jshmindmap for descBlock: ' + descBlockId + ' block: ' + blockId);
                svcMindmapParser.renderBlock(block);
            } else if ($blockElement.hasClass('lang-jshplantuml') || $blockElement.hasClass('jshplantuml') ||
                       $blockElement.hasClass('lang-ymfplantuml') || $blockElement.hasClass('ymfplantuml') ||
                       $blockElement.hasClass('lang-yaioplantuml') || $blockElement.hasClass('yaioplantuml')) {
                // plantuml: no highlight
                console.log('runAllRendererOnBlock jshplantuml for descBlock: ' + descBlockId + ' block: ' + blockId);
                svcPlantumlParser.renderBlock(block);
            }
        });

        // highlight checklist
        svcChecklistParser.renderBlock(descBlock, true);

        // highlight checklist
        svcImageSlimboxParser.renderBlock('#' + descBlockId + ' img.jsh-md-img');
    };

    /**
     * calls the global mermaid-renderer
     */
    me.renderMermaidGlobal = function () {
        return me.appBase.MermaidParser.renderMermaidGlobal();
    };

    /**
     * render the descText as Markdown
     * @param {string} descText               the string to format
     * @param {boolean} flgHighlightNow       if is set do syntax-highlighting while markdown-processing, if not set do it later
     * @param {string} headerPrefix           optional headerPrefix for heading-ids
     * @return {String}                       formatted markdown
     */
    me.renderMarkdown = function (descText, flgHighlightNow, headerPrefix) {
        var svcJshMarkdownRenderer = me.appBase.MarkdownRenderer;

        // prepare descText
        descText = svcJshMarkdownRenderer.prepareTextForMarkdown(descText);

        return svcJshMarkdownRenderer.renderMarkdown(descText, flgHighlightNow, headerPrefix);
    };

    /**
     * parse the srcElement, extract all headings and create an TOC in tocElement
     * @param {object} tocElement             element to be used a TOC (used as jquery-selector)
     * @param {object} srcElement             element to be parsed for headings (used as jquery-selector)
     * @param {Object} settings               optional settings for toc
     * 
     */
    me.addTOCForBlock = function (tocElement, srcElement, settings) {
        // add TOC
        settings = settings || {toc: {}};
        settings.toc = settings.toc || {};
        settings.toc.dest = me.$(tocElement);
        me.$.fn.toc(me.$(srcElement), settings);
    };

    return me;
};

/**
 * Widget of the SpeechRecognition-Box
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @param {JsHelferlein.ConfigBase} config        optional configuration (default is set in module)
 * @return {JsHelferlein.SpeechRecognitionBox}    an instance of the widget
 * @augments JsHelferlein.WidgetBox
 * @constructor
 */
JsHelferlein.SpeechRecognitionBox = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'jsh-speechrecognition-box';
    defaultConfig.content = '<div class="jsh-box jsh-hide-if-speechrecognition">' +
        '    <div id="info">Leider unterstützt Ihr Browser keine SpracheGenerierung :-(</div>' +
        '</div>' +
        '<div class="jsh-box jsh-show-if-speechrecognition">' +
        '    <div id="jsh-sr-info-div">' +
        '        <p id="jsh-sr-info-start">Klicke auf das Microfon und spreche deinen Text.</p>' +
        '        <p id="jsh-sr-info-speak-now" style="display: none">Und los: Sprich !!!</p>' +
        '        <p id="jsh-sr-info-no-speech" style="display: none">' +
        '            Mmhh. Nichts erkannt. <a href="https://www.google.com/support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">Mikrofon-Einstellungen</a>?' +
        '        </p>' +
        '        <p id="jsh-sr-info-no-microphone" style="display: none">' +
        '            Mmhh. Kein Mikrofon gefunden. Sind die <a href="https://www.google.com/support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">Einstellungen</a> korrekt?' +
        '        </p>' +
        '        <p id="jsh-sr-info-allow" style="display: none">Klicke auf den "Erlauben"-Button im Seitenkopf.</p>' +
        '        <p id="jsh-sr-info-denied" style="display: none">Wenn du die Erlaubnis nicht gibst, funktioniert das ganze nicht.</p>' +
        '        <p id="jsh-sr-info-blocked" style="display: none">Zugriff auf das Mikrofon in gesperrt. Ändere dies in chrome://settings/contentExceptions#media-stream</p>' +
        '        <p id="jsh-sr-info-upgrade" style="display: none">' +
        '            Oopps. Die Web Speech API wird von diesem Browser nicht unterstützt. Upgrade to <a href="//www.google.com/chrome">Chrome 25</a> oder höher.' +
        '        </p>' +
        '    </div>' +
        '    <div id="jsh-sr-div-start">' +
        '        <button id="jsh-sr-button-start">' +
        '            <img alt="Start" id="jsh-sr-status-img" src="https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif">' +
        '        </button>' +
        '    </div>' +
        '    <div id="jsh-sr-results">' +
        '        <span class="jsh-sr-interim" id="jsh-sr-span-interim"></span>' +
        '        <textarea class="jsh-sr-final" id="jsh-sr-textarea-final" cols="30" rows="15"></textarea>' +
        '    </div>' +
        '    <input type="button" class="jsh-button" id="jsh-sr-button-stop" value="&Uuml;bernehmen">' +
        '</div>';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
    };

    /**
     * set content of the speechrecognition-box
     * @param {string} content    content to show in box
     */
    me.setContent = function (content) {
        me.$('#jsh-sr-textarea-final').html(content);
    };

    /**
     * opens speechrecognition-box as jquery-dialog
     */
    me.open = function () {
        me._showUI();
    };

    /**
     * create speechrecognition-box as jquery-dialog
     */
    me._createUI = function () {
        me.$box.dialog({
            modal: true,
            width: 600,
            height: 500,
            title: 'JSH-SpeechRecognition',
            buttons: {
                Ok: function () {
                    me.appBase.SpeechRecognitionController._stopRecognition();
                    me.close();
                }
            }
        });
    };

    me._init();

    return me;
};


/**
 * default configuration of the JsHelferlein.SpeechRecognitionController
 *
 * @return {JsHelferlein.SpeechRecognitionConfig}      an instance of the config
 * @augments JsHelferlein.ConfigBase
 * @constructor
 */
JsHelferlein.SpeechRecognitionConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.defaultLang = 'de-DE';

    me.finalTextareaSelector = '#jsh-sr-textarea-final';
    me.interimSpanSelector = '#jsh-sr-span-interim';
    me.infoDivSelector = '#jsh-sr-info-div';
    me.statusImgSelector = '#jsh-sr-status-img';

    me.statusImgSrcStart = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
    me.statusImgSrcRunning = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif';
    me.statusImgSrcStop = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-slash.gif';

    me.buttonStartSelector = '#jsh-sr-button-start';
    me.buttonStopSelector = '#jsh-sr-button-stop';

    return me;
};
/**
 * services for adding SpeechRecognition-support to your app
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @param {JsHelferlein.SpeechRecognitionConfig} config  optional configuration (default JsHelferlein.SpeechRecognitionConfig)
 * @return {JsHelferlein.SpeechRecognitionController}    an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.SpeechRecognitionController = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, JsHelferlein.SpeechRecognitionConfig());

    /**
     * initialize the recognition and widget
     */
    me._init = function () {
        me._initUi();
        window.onbeforeunload = function (e) {
            me.stopRecognition();
        };
    };

    var finalTranscript = '';
    var recognizing = false;
    var ignoreOnEnd;
    var startTimestamp;
    var regExTwoLines = /\n\n/g;
    var regExOneLine = /\n/g;
    var regExFirstChar = /\S/;

    /**
     * open an SpeechRecognition-widget with the content of textareaId and if closed rite content back to that textarea
     * @param {string} textareaId      textareaId to get/set the by SpeechRecognition
     */
    me.open = function(textareaId) {
        me.initSrc(textareaId);
        me.speechRecognitionWidget.open();
    };

    /**
     * int the SpeechRecognition-widget with the content of textareaId
     * @param {string} textareaId      textareaId to get/set the by SpeechRecognition
     */
    me.initSrc = function (textareaId) {
        var srcElement;

        if (textareaId) {
            me.config.srcTextareaId = textareaId;
        }

        if (me.config.srcTextareaId) {
            srcElement = '#' + me.config.srcTextareaId;
        } else if (opener && opener.targetElement) {
            srcElement = opener.targetElement;
        }

        if (srcElement) {
            me.$(me.config.finalTextareaSelector).val(me.$(srcElement).text());
            if (!me.$(me.config.finalTextareaSelector).value) {
                me.$(me.config.finalTextareaSelector).val(me.$(srcElement).val());
            }
        }
    };

    /**
     * publish result of SpeechRecognition
     * @param {boolean} forceCloseWindow      if it is opened in a new window close it
     */
    me.publishResult = function (forceCloseWindow) {
        // Text vorbereiten
        var str = me.$(me.config.finalTextareaSelector).val();
        str = str.replace(/<\/?.*?\/?>/g, String.fromCharCode(13));

        if (me.config.srcTextareaId) {
            var $element = me.$('#' + me.config.srcTextareaId);
            $element.val(str);
            me.appBase.DataUtils.callUpdateTriggerForElement($element);
            if (window.callUpdateTriggerForElement) {
                // fallback
                window.callUpdateTriggerForElement($element);
            }
        } else if (opener && opener.targetElement) {
            // text an Opener uebergeben
            opener.targetElement.value = str;
            if (opener.callUpdateTriggerForElement) {
                opener.callUpdateTriggerForElement(opener.targetElement);
            }

            // Fenster schließen
            if (forceCloseWindow) {
                window.close();
            }
        }
    };

    /**
     * button-handler: start recognition
     */
    me._startRecognition = function () {
        if (recognizing) {
            me.recognition.stop();
            return;
        }
        finalTranscript = me.$(me.config.finalTextareaSelector).val();
        me.recognition.lang = 'de-de';
        me.recognition.start();
        ignoreOnEnd = false;
        me.$(me.config.interimSpanSelector).html('');
        me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcStop);

        me._showInfo('jsh-sr-info-allow');
        startTimestamp = event.timeStamp;
    };

    /**
     * button-handler: stop recognition and publish result
     */
    me._stopRecognition = function () {
        me.publishResult(true);
    };

    /**
     * init the ui (widget, button-handler...)
     */
    me._initUi = function () {
        me.speechRecognitionWidget = new JsHelferlein.SpeechRecognitionBox(me.appBase);
        if (me.appBase.getDetector('SpeechRecognitionDetector').isSupported()) {
            me._initRecognition();
            me._initControllerElements();
        } else {
            var svcLogger = me.appBase.Logger;
            if (svcLogger && svcLogger.isWarning) {
                svcLogger.logWarning('JsHelferlein.SpeechRecognitionController.initUi: speechsynth not suppoorted');
            }
            me._disableControllerElements();
        }
    };

    /**
     * init the recognition-engine (language...)
     */
    me._initRecognition = function () {
        // Erkennung aktivieren
        me.recognition = new webkitSpeechRecognition();

        // Diktat aktivieren: fuehrt nach Pause fort
        me.recognition.continuous = true;

        // interim results aendern sich nachtraeglich
        me.recognition.interimResults = true;

        // add language
        me.recognition.lang = 'de-DE';

        // Handler

        // beim Start
        me.recognition.onstart = function () {
            recognizing = true;
            me._showInfo('jsh-sr-info-speak-nowr');
            me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcRunning);
        };

        // Am Ende
        me.recognition.onerror = function (event) {
            if (event.error === 'no-speech') {
                me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcStart);
                me._showInfo('jsh-sr-info-no-speech');
                ignoreOnEnd = true;
            }
            if (event.error === 'audio-capture') {
                me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcStart);
                me._showInfo('jsh-sr-info-no-microphone');
                ignoreOnEnd = true;
            }
            if (event.error === 'not-allowed') {
                if (event.timeStamp - startTimestamp < 100) {
                    me._showInfo('jsh-sr-info-blocked');
                } else {
                    me._showInfo('jsh-sr-info-denied');
                }
                ignoreOnEnd = true;
            }
        };

        me.recognition.onend = function () {
            recognizing = false;
            if (ignoreOnEnd) {
                return;
            }
            me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcStart);
            if (!finalTranscript) {
                me._showInfo('jsh-sr-info-start');
                return;
            }
            me._showInfo('');
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                range.selectNode(me.$(me.config.finalTextareaSelector)[0]);
                window.getSelection().addRange(range);
            }
        };

        me.recognition.onresult = function (event) {
            var interimTranscript = '';
            finalTranscript = me.$(me.config.finalTextareaSelector).val();
            if (typeof (event.results) === 'undefined') {
                me.recognition.onend = null;
                me.recognition.stop();
                me.upgrade();
                return;
            }

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += ' ' + event.results[i][0].transcript;
                } else {
                    interimTranscript += ' ' + event.results[i][0].transcript;
                }
            }
            finalTranscript = me._capitalize(finalTranscript);
            me.$(me.config.finalTextareaSelector).val(me._linebreak(finalTranscript));
            me.$(me.config.interimSpanSelector).html(me._linebreak(interimTranscript));
        };
    };

    /**
     * init the controller-elements of the ui (buttons)
     */
    me._initControllerElements = function () {
        if (me.config.isSet('buttonStartSelector')) {
            me.$(me.config.buttonStartSelector).click(me._startRecognition);
        }
        if (me.config.isSet('buttonStopSelector')) {
            me.$(me.config.buttonStopSelector).click(me._stopRecognition);
        }
    };

    /**
     * disable the controller-elements of the ui (buttons)
     */
    me._disableControllerElements = function () {
        if (me.config.isSet('buttonStartSelector')) {
            me.$(me.config.buttonStartSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonStopSelector')) {
            me.$(me.config.buttonStopSelector).attr('disabled', 'disabled');
        }
    };

    /**
     * show static infos about recognition result
     * @param {string} s            
     */
    me._showInfo = function (s) {
        if (!me.config.isSet('infoDivSelector')) {
            return;
        }
        var $info = me.$(me.config.infoDivSelector);
        if (s) {
            me.$($info).children().each(function(idx, child) {
                me.$(child).css('display', me.$(child).attr('id') === s ? 'inline' : 'none');
            });
            me.$($info.css('visibility', 'visible'));
        } else {
            me.$($info.css('visibility', 'hidden'));
        }
    };

    /**
     * escape linebreaks with html-linebreaks
     * @param {string} s           source to parse
     * @returns {string}           resulting html             
     */
    me._linebreak = function (s) {
        return s.replace(regExTwoLines, '<p></p>').replace(regExOneLine, '<br>');
    };

    /**
     * capitalize first letter of the words 
     * @param {string} s           source to parse
     * @returns {string}           resulting html             
     */
    me._capitalize = function (s) {
        return s.replace(regExFirstChar, function (m) {
            return m.toUpperCase();
        });
    };

    // init all
    me._init();

    return me;
};
/**
 * check that SpeechRecognition is supported
 * 
 * @param {JsHelferlein.AppBase} appBase                               appBase of the application
 * @param {JsHelferlein.SpeechRecognitionDetectorConfig} config        optional configuration (default JsHelferlein.SpeechRecognitionDetectorConfig)
 * @return {JsHelferlein.SpeechRecognitionDetector}                    an instance of the service
 * @augments JsHelferlein.DetectorBase
 * @constructor
 */
JsHelferlein.SpeechRecognitionDetector = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.DetectorBase(appBase, config, JsHelferlein.SpeechRecognitionDetectorConfig());

    /**
     * detect if SpeechRecognition is supported
     * @returns {boolean}       is supported true/false
     */
    me.isSpeechRecognitionSupported = function () {
        try {
            if ('webkitSpeechRecognition' in window) {
                return true;
            }
        } catch (ex) {
            if (me.appBase.Logger && me.appBase.Logger.isError) {
                me.appBase.Logger.logError('JsHelferlein.SpeechRecognitionDetector.isSpeechRecognitionSupported Exception: ' + ex, false);
            }
        }
        return false;
    };

    /**
     * detect if SpeechRecognition is supported
     * @returns {boolean}       is supported true/false
     */
    me.isSupported = function () {
        return me.isSpeechRecognitionSupported();
    };

    return me;
};
/**
 * default configuration of the JsHelferlein.SpeechRecognitionDetector
 *
 * @return {JsHelferlein.SpeechRecognitionDetectorConfig}      an instance of the config
 * @augments JsHelferlein.DetectorBaseConfig
 * @constructor
 */
JsHelferlein.SpeechRecognitionDetectorConfig = function () {
    'use strict';

    var me = JsHelferlein.DetectorBaseConfig();

    me.styleBaseName = 'speechrecognition';

    return me;
};
/**
 * service for adding Speech-links to your app-elements
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @return {JsHelferlein.SpeechServiceHelper}            an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.SpeechServiceHelper = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * add speechRecognition-link to labels of input-elements if availiable<br>
     * set the flg webkitSpeechRecognitionAdded on the element, so that there is no doubling
     * @param {Object} filter                 selector to filter label elements (used as jquery-filter)
     */
    me.addSpeechRecognitionToElements = function (filter) {
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;

        console.log('addSpeechRecognitionToElements: check for support');
        // add speechrecognition if availiable
        if (me.appBase.getDetector('SpeechRecognitionDetector').isSupported()) {
            console.log('addSpeechRecognitionToElements: supported start for  : ' + filter);
            // add speechrecognition to nodeDesc+name
            me.$(filter).append(function (idx) {
                var link = '';
                var label = this;

                // check if already set
                if (me.$(label).attr('webkitSpeechRecognitionAdded')) {
                    console.error('addSpeechRecognitionToElements: SKIP because already added: ' + me.$(label).attr('for'));
                    return link;
                }

                // get corresponding form
                var forName = me.$(label).attr('for');
                var form = me.$(label).closest('form');

                // get for-element byName from form
                var forElement = form.find('[name=' + forName + ']').first();
                if (forElement.length > 0) {
                    // define link to label
                    var clickHandler = ymfAppBaseVarName +
                        '.SpeechRecognitionController.open(\'' + forElement.attr('id') + '\'); return false;';
                    link = '<a href="" class=""' +
                        ' onClick="' + clickHandler + '"' +
                        ' lang="tech" data-tooltip="tooltip.command.OpenSpeechRecognition">' +
                        '<img alt="Spracherkennung nutzen" style="width:25px"' +
                        ' src="' + me.appBase.SpeechRecognitionController.config.statusImgSrcStart + '"></a>';

                    // set flag
                    me.$(label).attr('webkitSpeechRecognitionAdded', 'true');
                    console.log('addSpeechRecognitionToElements: add : ' + forName + ' for ' + forElement.attr('id'));
                }
                return link;
            });
        }
    };

    /**
     * add speechSynth-linl to element-label if availiable<br>
     * set the flg speechSynthAdded on the element, so that there is no doubling
     * @param {Object} filter                 selector to filter label elements (used as jquery-filter)
     */
    me.addSpeechSynthToElements = function (filter) {
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;
        console.log('addSpeechSynthToElements: check support');

        // add speechSynth if availiable
        if (me.appBase.getDetector('SpeechSynthDetector').isSupported()) {
            // add speechrecognition to nodeDesc+name
            console.log('addSpeechSynthToElements: supported start for  : ' + filter);
            me.$(filter).append(function (idx) {
                var link = '';
                var label = this;

                // check if already set
                if (me.$(label).attr('speechSynthAdded')) {
                    console.error('addSpeechSynthToElements: SKIP because already added: ' + me.$(label).attr('for'));
                    return link;
                }

                // get corresponding form
                var forName = me.$(label).attr('for');
                var form = me.$(label).closest('form');

                // get for-element byName from form
                var forElement = form.find('[name=' + forName + ']').first();
                if (forElement.length > 0) {
                    // define link to label
                    var clickHandler = ymfAppBaseVarName +
                        '.SpeechSynthController.open(\'' + forElement.attr('id') + '\'); return false;';
                    link = '<a href="" class="button"' +
                        ' onClick="' + clickHandler + '" lang="tech" ' +
                        ' data-tooltip="tooltip.command.OpenSpeechSynth" class="button">common.command.OpenSpeechSynth</a>';

                    // set flag
                    me.$(label).attr('speechSynthAdded', 'true');
                    console.log('addSpeechSynthToElements: add : ' + forName + ' for ' + forElement.attr('id'));
                }
                return link;
            });
        }
    };

    return me;
};
/**
 * Widget of the SpeechRecognition-Box
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @param {JsHelferlein.ConfigBase} config        optional configuration (default is set in module)
 * @return {JsHelferlein.SpeechSynthBox}          an instance of the widget
 * @augments JsHelferlein.WidgetBox
 * @constructor
 */
JsHelferlein.SpeechSynthBox = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'jsh-speechsynth-box';
    defaultConfig.content = '<div class="jsh-box jsh-hide-if-speechsynth">' +
    '    <div id="jsh-ss-info">Leider unterstützt Ihr Browser keine Sprach-Generierung :-(' +
    '    </div>' +
    '</div>' +
    '<div class="jsh-box jsh-show-if-speechsynth">' +
    '    <textarea id="jsh-ss-textarea-final" class="jsh-textarea jsh-ss-textarea-final" rows="20" cols="30"></textarea>' +
    '</div>' +
    '<div class="jsh-box jsh-show-if-speechsynth">' +
    '    <label for="jsh-ss-voice">Voice:</label>' +
    '    <select id="jsh-ss-voice"> </select>' +
    '    <label class="hidden" for="jsh-ss-rate">Rate (0.1 - 10):</label>' +
    '    <input class="hidden" id="jsh-ss-rate" type="number" min="0.1" max="10" value="1" step="0.1"/>' +
    '    <label class="hidden" for="jsh-ss-pitch">Pitch (0.1 - 2):</label>' +
    '    <input class="hidden" id="jsh-ss-pitch" type="number" min="0.1" max="2" value="1" step="0.1"/>' +
    '    <br/>' +
    '    <button id="jsh-ss-button-start" class="jsh-button" >Start</button>' +
    '    <button id="jsh-ss-button-pause" class="jsh-button" >Pause</button>' +
    '    <button id="jsh-ss-button-resume" class="jsh-button" >Fortfahren</button>' +
    '    <button id="jsh-ss-button-stop" class="jsh-button" >Schliessen</button>' +
    '</div>';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
    };

    /**
     * set content of the speechsynth-box
     * @param {string} content    content to show in box
     */
    me.setContent = function (content) {
        me.$('#jsh-ss-textarea-final').html(content);
    };

    /**
     * opens speechsynth-box as jquery-dialog
     */
    me.open = function () {
        me._showUI();
    };

    /**
     * create speechsynth-box as jquery-dialog
     */
    me._createUI = function () {
        me.$box.dialog({
            modal: true,
            width: 600,
            height: 500,
            title: 'JSH-SpeechSynthesis',
            buttons: {
                Ok: function () {
                    me.appBase.SpeechSynthController._stopSpeech();
                    me.close();
                }
            }
        });
    };

    me._init();

    return me;
};


/**
 * default configuration of the JsHelferlein.SpeechSynthController
 *
 * @return {JsHelferlein.SpeechSynthConfig}      an instance of the config
 * @augments JsHelferlein.ConfigBase
 * @constructor
 */
JsHelferlein.SpeechSynthConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.splitChars = '\n?!:;,.';
    me.splitWords = [' und ', ' oder ', ' aber ', ' dabei ', ' bis ', ' '];

    me.defaultLang = 'de-DE';
    me.selectVoiceSelector = '#jsh-ss-voice';
    me.inputRateSelector = '#jsh-ss-rate';
    me.inputPitchSelector = '#jsh-ss-pitch';

    me.textareaFinalSelector = '#jsh-ss-textarea-final';

    me.buttonStartSelector = '#jsh-ss-button-start';
    me.buttonPauseSelector = '#jsh-ss-button-pause';
    me.buttonResumeSelector = '#jsh-ss-button-resume';
    me.buttonStopSelector = '#jsh-ss-button-stop';

    return me;
};
/**
 * services for adding SpeechSynth-support to your app
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @param {JsHelferlein.SpeechSynthConfig} config        optional configuration (default JsHelferlein.SpeechSynthConfig)
 * @return {JsHelferlein.SpeechSynthController}          an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.SpeechSynthController = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, JsHelferlein.SpeechSynthConfig());

    /**
     * initialize the widget and synth-engine
     */
    me._init = function () {
        me._initUi();
        window.onbeforeunload = function (e) {
            me._stopSpeech();
        };
    };

    /**
     * open an SpeechSynth-widget with the content of textareaId
     * @param {string} textareaId      textareaId to get the content to be told by SpeechSynth
     */
    me.open = function(textareaId) {
        me.initSrc(textareaId);
        me.speechSynthWidget.open();
    };

    /**
     * init an SpeechSynth-widget with the content of textareaId
     * @param {string} textareaId      textareaId to get the content to be told by SpeechSynth
     */
    me.initSrc = function (textareaId) {
        var srcElement;

        if (textareaId) {
            me.config.srcTextareaId = textareaId;
        }

        if (me.config.srcTextareaId) {
            srcElement = '#' + me.config.srcTextareaId;
        } else if (opener && opener.targetElement) {
            srcElement = opener.targetElement;
        }

        if (srcElement) {
            me.$(me.config.textareaFinalSelector).val(me.$(srcElement).text());
            if (!me.$(me.config.textareaFinalSelector).val()) {
                me.$(me.config.textareaFinalSelector).val(me.$(srcElement).val());
            }
        }
    };

    me._startSpeech = function () {
        me._stopSpeech();
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).removeAttr('disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).attr('disabled', 'disabled');
        }
        me._splitOrSpeakText(me.$(me.config.textareaFinalSelector).val(), me.config.splitChars, 0, 150);
    };

    me._pauseSpeech = function () {
        window.speechSynthesis.pause();
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).removeAttr('disabled');
        }
    };

    me._resumeSpeech = function () {
        window.speechSynthesis.resume();
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).removeAttr('disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).attr('disabled', 'disabled');
        }
    };

    me._stopSpeech = function () {
        for (var i = 1; i < 100; i++) {
            window.speechSynthesis.cancel(); // if it errors, this clears out the error.
        }
    };

    me._initUi = function () {
        me.speechSynthWidget = new JsHelferlein.SpeechSynthBox(me.appBase);
        if (me.appBase.getDetector('SpeechSynthDetector').isSupported()) {
            me._initVoices();
            me._initControllerElements();
        } else {
            var svcLogger = me.appBase.Logger;
            if (svcLogger && svcLogger.isWarning) {
                svcLogger.logWarning('JsHelferlein.SpeechSynthController.initUi: speechsynth not supported');
            }
            me._disableControllerElements();
        }
    };

    me._initVoices = function () {
        // inspired by http://www.sitepoint.com/talking-web-pages-and-the-speech-synthesis-api/
        // init voice config
        me.$voices = me.$(me.config.selectVoiceSelector);

        // Workaround for a Chrome issue (#340160 - https://code.google.com/p/chromium/issues/detail?id=340160)
        var svcLogger = me.appBase.Logger;
        var watch = setInterval(function () {
            // Load all voices available
            var voicesAvailable = speechSynthesis.getVoices();
            if (voicesAvailable.length !== 0) {
                var select = '';
                for (var i = 0; i < voicesAvailable.length; i++) {
                    var selected = '';
                    if (voicesAvailable[i].lang === me.config.defaultLang) {
                        selected = ' selected ';
                    }
                    svcLogger.logDebug('_initVoices add voice:' + voicesAvailable[i].name);
                    select += '<option value="' + voicesAvailable[i].lang + '"' +
                        'data-voice-uri="' + voicesAvailable[i].voiceURI + '"' + selected + '>' +
                        voicesAvailable[i].name +
                        (voicesAvailable[i].default ? ' (default)' : '') + '</option>';
                }
                svcLogger.logDebug('_initVoices set voices:', select);
                me.$voices.html(select);
                clearInterval(watch);
            }
        }, 1);
    };

    me._initControllerElements = function () {
        me.$rate = me.$(me.config.inputRateSelector);
        me.$pitch = me.$(me.config.inputPitchSelector);
        if (me.config.isSet('buttonStartSelector')) {
            me.$(me.config.buttonStartSelector).click(me._startSpeech);
        }
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).click(me._pauseSpeech);
            me.$(me.config.buttonPauseSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).click(me._resumeSpeech);
            me.$(me.config.buttonResumeSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonStopSelector')) {
            me.$(me.config.buttonStopSelector).click(me._stopSpeech);
        }
    };

    me._disableControllerElements = function () {
        if (me.config.isSet('buttonStartSelector')) {
            me.$(me.config.buttonStartSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonStopSelector')) {
            me.$(me.config.buttonStopSelector).attr('disabled', 'disabled');
        }
    };

    me._createSpeaker = function () {
        var msg = new SpeechSynthesisUtterance();
        var svcLogger = me.appBase.Logger;

        var $selectedVoice = me.$voices.find(':selected');
        var rate = parseFloat(me.$rate.val());
        var pitch = parseFloat(me.$pitch.val());
        svcLogger.logDebug('_createSpeaker voice:' + $selectedVoice.attr('data-voice-uri') + ' rate:' + rate + ' pitch:' + pitch);
        msg.voice = $selectedVoice.attr('data-voice-uri'); // Note: some voices don't support altering params
        msg.voiceURI = 'native';
        msg.lang = $selectedVoice.val();
        msg.volume = 1; // 0 to 1
        msg.rate = rate; // 0.1 to 10
        msg.pitch = pitch; //0 to 2

        // create handler
        msg.onstart = function (event) {
            svcLogger.logDebug('started:' + event + ' text:' + msg.text);
        };
        msg.onend = function (event) {
            svcLogger.logDebug('Finished in ' + event.elapsedTime + ' seconds.');
        };
        msg.onerror = function (event) {
            svcLogger.logError('Errored ' + event, false);
        };
        msg.onpause = function (event) {
            svcLogger.logDebug('paused ' + event);
        };
        msg.onboundary = function (event) {
            svcLogger.logDebug('onboundary ' + event);
        };

        return msg;
    };

    me._speakText = function (text) {
        var svcLogger = me.appBase.Logger;
        var speaker = me._createSpeaker();
        svcLogger.logDebug('say text: ' + text);
        speaker.text = text;
        window.speechSynthesis.speak(speaker);
    };

    me._splitOrSpeakText = function (text, splitterStr, ebene, maxLength) {
        // inspired by http://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
        var svcLogger = me.appBase.Logger;

        // set default maxLength if not set
        if (maxLength < 100) {
            maxLength = 100;
        }

        // split sentences
        var splitter = splitterStr.substr(ebene, 1);
        var sentences = [];

        // if last splitChar rechaed, split by splitwords
        if (ebene >= splitterStr.length) {
            // split at last splitword before maxLength
            var nextText = '';
            var wordIndex = 0;

            // interate splitwords till text < maxLength
            do {
                var splitWord = me.config.splitWords[wordIndex];
                var pos = text.lastIndexOf(splitWord);
                while (pos > 0 && text.length > maxLength) {
                    // iterate until splitword found before maxLength
                    nextText = text.substr(pos) + nextText;
                    text = text.substr(0, pos);
                    pos = text.lastIndexOf(splitWord);
                    svcLogger.logDebug('split by word:"' + splitWord + '" text:"' + text + '" nextText:"' + nextText + '"');
                }
                wordIndex++;
            } while (wordIndex < me.config.splitWords.length && text.length > maxLength);

            // fallback if text > maxLength
            if (text.length > maxLength) {
                // attempt to split a ' ' before maxLength
                var posSpace = text.indexOf(' ');
                var text1, text2;
                if ((posSpace <= 0 || posSpace > maxLength)) {
                    // not ' ' before maxLength -> do it hard
                    text1 = text.substr(0, maxLength);
                    text2 = text.substr(maxLength);
                    svcLogger.logDebug('split texthard text1:"' + text1 + '" text2:"' + text2 + '"');
                    sentences = [text1, text2];
                } else {
                    // split at space   
                    text1 = text.substr(0, posSpace);
                    text2 = text.substr(posSpace);
                    svcLogger.logDebug('split space text1:"' + text1 + '" text2:"' + text2 + '"');
                    sentences = [text1, text2];
                }
            } else {
                // add text
                sentences.push(text);
            }

            // add nextText
            sentences.push(nextText);
        } else {
            // split text by splitter
            svcLogger.logDebug('split by:"' + splitter + '" ebene:' + ebene);
            sentences = text.split(splitter);
        }

        // iterate sentences
        for (var i = 0; i < sentences.length; i++) {
            if (sentences[i].length > maxLength) {
                // sentence  > maxLength: split it with next splitChar
                svcLogger.logDebug('split new ' + i + ' sentences[i]:' + sentences[i]);
                me._splitOrSpeakText(sentences[i], splitterStr, ebene + 1);
            } else {
                // sentence ok: say it
                svcLogger.logDebug('say i: ' + i + ' sentences[i]:' + sentences[i]);
                me._speakText(sentences[i] + splitter);
            }
        }
    };

    // init all
    me._init();

    return me;
};
/**
 * check that SpeechSynth is supported
 * 
 * @param {JsHelferlein.AppBase} appBase                         appBase of the application
 * @param {JsHelferlein.SpeechSynthDetectorConfig} config        optional configuration (default JsHelferlein.SpeechSynthDetectorConfig)
 * @return {JsHelferlein.SpeechSynthDetector}                    an instance of the service
 * @augments JsHelferlein.DetectorBase
 * @constructor
 */
JsHelferlein.SpeechSynthDetector = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.DetectorBase(appBase, config, JsHelferlein.SpeechSynthDetectorConfig());

    /**
     * detect if SpeechSynth is supported
     * @returns {boolean}       is supported true/false
     */
    me.isSpeechSynthSupported = function () {
        try {
            if ('speechSynthesis' in window) {
                return true;
            }
        } catch (ex) {
            var svcLogger = me.appBase.Logger;
            if (svcLogger && svcLogger.isError) {
                svcLogger.logError('JsHelferlein.SpeechSynthDetector.isSpeechSynthSupported Exception: ' + ex, false);
            }
        }
        return false;
    };

    /**
     * detect if SpeechSynth is supported
     * @returns {boolean}       is supported true/false
     */
    me.isSupported = function () {
        return me.isSpeechSynthSupported();
    };

    return me;
};
/**
 * default configuration of the JsHelferlein.SpeechSynthDetector
 *
 * @return {JsHelferlein.SpeechSynthDetectorConfig}      an instance of the config
 * @augments JsHelferlein.DetectorBaseConfig
 * @constructor
 */
JsHelferlein.SpeechSynthDetectorConfig = function () {
    'use strict';

    var me = JsHelferlein.DetectorBaseConfig();

    me.styleBaseName = 'speechsynth';

    return me;
};
/**
 * services for adding dialog-support to your app
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @return {JsHelferlein.UIDialogs}                      an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.UIDialogs = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepareWidgets();
    };

    /**
     * initialize the widget (error-box, confirm-box)
     */
    me.prepareWidgets = function() {
        me.createErrorBox();
        me.createConfirmBox();
    };

    /**
     * open modal dialog #jsh-error-message with message
     * @param {string} message     error-message to display
     */
    me.openErrorDialog = function (message) {
        // set messagetext
        me.$('#jsh-error-message-text').html(message);

        // show message
        me.$('#jsh-error-message').dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    me.$(this).dialog('close');
                }
            }
        });
    };

    /**
     * open modal confirmation-dialog #jsh-dialog-confirm with message
     * @param {string} message      message to display
     * @param {handler} yesHandler  handler to call if OK pressed
     * @param {handler} noHandler   handler to call if NO pressed
     */
    me.openConfirmDialog = function (message, yesHandler, noHandler) {
        // set messagetext
        me.$('#jsh-dialog-confirm-text').html(message);

        // show message

        me.$('#jsh-dialog-confirm').dialog({
            resizable: false,
            height: 140,
            modal: true,
            buttons: {
                'Ja': function () {
                    me.$(this).dialog('close');
                    if (yesHandler) {
                        yesHandler();
                    }
                },
                'Abbrechen': function () {
                    me.$(this).dialog('close');
                    if (noHandler) {
                        noHandler();
                    }
                }
            }
        });
    };

    /**
     * open toast-message with message
     * @param {string} type        message-type [error, info, warn]
     * @param {string} title       message-title
     * @param {string} message     message to display
     */
    me.showToastMessage = function (type, title, message) {
        // show message
        toastr.options = {
            'closeButton': true,
            'debug': false,
            'newestOnTop': true,
            'progressBar': true,
            'positionClass': 'toast-top-right',
            'preventDuplicates': false,
            'showDuration': '300',
            'hideDuration': '1000',
            'timeOut': '10000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
        toastr[type](me.appBase.DataUtils.htmlEscapeText(message), title);
    };

    /**
     * create or reset box #jsh-error-message
     */
    me.createErrorBox = function () {
        var $box = me.initBox('jsh-error-message', '');

        $box.append(me.$(
            '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span></p>' +
            '<p id="jsh-error-message-text"></p>'));

        return $box;
    };

    /**
     * create or reset box #jsh-dialog-confirm
     */
    me.createConfirmBox = function () {
        var $box = me.initBox('jsh-dialog-confirm', '');

        $box.append(me.$(
            '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span></p>' +
            '<p id="jsh-dialog-confirm-text"></p>'));

        return $box;
    };

    /**
     /**
     * create or reset a hidden box with id and content
     * @param {string} id          id of the box
     * @param {string} content     content of the box
     * @returns {JQuery}           JQuery-Html-Element
     */
    me.initBox = function (id, content) {
        var $box = me.$('#' + id);
        if ($box.size() <= 0) {
            me.$('body').append('<div id="' + id + '" class="hidden">');
            $box = me.$('#' + id);
        }
        $box.html(content);

        return $box;
    };

    me._init();

    return me;
};
/**
 * services for adding toggler-support to your app
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @return {JsHelferlein.UIToggler}                      an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.UIToggler = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);
    me._nextId = 1;

    /**
     * toggle the specified ojects with a fade.
     * @param {Object} id     JQuery-Filter (html.id, style, objectlist...)
     */
    me.toggleTableBlock = function (id) {
        // get effect type from
        var selectedEffect = 'fade';

        // most effect types need no options passed by default
        var options = {};
        // some effects have required parameters
        if (selectedEffect === 'scale') {
            options = {percent: 0};
        } else if (selectedEffect === 'size') {
            options = {to: {width: 200, height: 60}};
        }

        // run the effect
        me.$(id).toggle(selectedEffect, options, 500);
    };

    /**
     * toggle pre-elements depending on class 'pre-nowrap', 'pre-wrap' and 'flg-pre-nowrap', 'flg-pre-wrap'
     * @param {Object} element    JQuery-Filter (html.id, style, objectlist...)
     */
    me.togglePreWrap = function (element) {
        var classNoWrap = 'pre-nowrap';
        var classWrap = 'pre-wrap';
        var flgClassNoWrap = 'flg-pre-nowrap';
        var flgClassWrap = 'flg-pre-wrap';
        var codeChilden = me.$(element).find('code');

        // remove/add class if element no has class
        if (me.$(element).hasClass(flgClassNoWrap)) {
            me.$(element).removeClass(flgClassNoWrap).addClass(flgClassWrap);
            console.log('togglePreWrap for id:' + element + ' set ' + classWrap);
            // wrap code-blocks too
            me.$(codeChilden).removeClass(classNoWrap).addClass(classWrap);
            me.$(codeChilden).parent().removeClass(classNoWrap).addClass(classWrap);
        } else {
            me.$(element).removeClass(flgClassWrap).addClass(flgClassNoWrap);
            console.log('togglePreWrap for id:' + element + ' set ' + classNoWrap);
            // wrap code-blocks too
            me.$(codeChilden).removeClass(classWrap).addClass(classNoWrap);
            me.$(codeChilden).parent().removeClass(classNoWrap).addClass(classWrap);
        }
    };

    /**
     * toggle the specified ojects with a drop
     * @param {Object} id     JQuery-Filter (html.id, style, objectlist...)
     */
    me.toggleElement = function (id) {
        // get effect type from
        var selectedEffect = 'drop';

        // most effect types need no options passed by default
        var options = {};
        // some effects have required parameters
        if (selectedEffect === 'scale') {
            options = {percent: 0};
        } else if (selectedEffect === 'size') {
            options = {to: {width: 200, height: 60}};
        }

        // run the effect
        me.$(id).toggle(selectedEffect, options, 500);
    };

    /**
     * append toggler to specified elements
     * @param {Object} filter                JQuery-Filter (html.id, style, objectlist...)
     * @param {string} type                  type of the toggler (text, icon, icon)
     * @param {boolean} flgInsertBefore      option true/false: insert before/after element
     */
    me.appendTogglerForElements = function (filter, type, flgInsertBefore) {
        me.$(filter).each(function (i, block) {
            if ($(block).attr('data-toggler-processed')) {
                console.log('appendTogglerForElement already done:' + filter + ' block:' + block);
                return;
            }
            $(block).attr('data-toggler-processed', true);
            var id = $(block).attr('id');
            if (!id) {
                id = 'jshTogglerId' + (me._nextId++);
                $(block).attr('id', id);
            }
            console.log('appendTogglerForElement:' + filter + ' block:' + block + ' id:' + id);
            me.insertToggler('#' + id, '#' + id, type, flgInsertBefore);
        });
    };

    /**
     * append toggler for containerId on parentId  
     * @param {Object} parentId              JQuery-Filter (html.id, style, objectlist...) to append the toggler
     * @param {string} containerId           id of the container to toggle
     * @param {string} type                  type of the toggler (text, icon, icon)
     */
    me.appendToggler = function (parentId, containerId, type) {
        var $ele = me.$(me._generateTogglerId(containerId));
        if ($ele.length <= 0) {
            // create toggler
            console.log('appendTogglerCommon link not exists: create new toggler parent=' + parentId
                + ' containerId=' + containerId);
            var html = me._createTogglerElement(containerId, type, 'jsh-block-toggler-inline');
            me.$(parentId).append(html);
            console.log('appendTogglerCommon link not exists: create new toggler parent=' + parentId
                + ' html=' + html);
        } else {
            console.log('appendTogglerCommon link exists: skip new toggler parent=' + parentId
                + ' containerId=' + containerId);
        }
    };

    /**
     * insert toggler for containerId before/after parentId  
     * @param {Object} parentId              JQuery-Filter (html.id, style, objectlist...) to append the toggler
     * @param {string} containerId           id of the container to toggle
     * @param {string} type                  type of the toggler (text, icon, icon)
     * @param {boolean} flgInsertBefore      option true/false: insert before/after element
     */
    me.insertToggler = function (parentId, containerId, type, flgInsertBefore) {
        var $ele = me.$(me._generateTogglerId(containerId));
        if ($ele.length <= 0) {
            // create toggler
            console.log('appendTogglerCommon link not exists: create new toggler parent=' + parentId
                + ' containerId=' + containerId);
            var html = me._createTogglerElement(containerId, type, 'jsh-block-toggler-block');
            if (flgInsertBefore) {
                me.$(html).insertBefore(parentId);
            } else {
                me.$(html).insertAfter(parentId);
            }
            console.log('appendTogglerCommon link not exists: create new toggler parent=' + parentId
                + ' html=' + html);
        } else {
            console.log('appendTogglerCommon link exists: skip new toggler parent=' + parentId
                + ' containerId=' + containerId);
        }
    };

    /**
     * generate toggler-id from containerId
     * @param {string} containerId           id of the container to toggle
     * @returns {string}                     id for toggler-element
     */
    me._generateTogglerId = function (containerId) {
        var containerClass = containerId.replace('.', '').replace('#', '');
        return '.block4Toggler' + containerClass;
    };

    /**
     * create toggler-element for containerId
     * @param {string} containerId           id of the container to toggle
     * @param {string} type                  type of the toggler (text, icon, icon)
     * @param {string} additionalClass       additional css-class for toggler-element
     * @returns {string}                     html for toggler-element
     */
    me._createTogglerElement = function (containerId, type, additionalClass) {
        var togglerId = me._generateTogglerId(containerId);
        var togglerClass = togglerId.replace('.', '').replace('#', '');

        var html;
        if (type === 'text') {
            html = me._createTogglerLinks(containerId, togglerId,
                '<span class="jsh-text-toggler jsh-text-toggler-on">[Bitte mehr Details... ]</span>',
                '<span class="jsh-text-toggler jsh-text-toggler-off">[OK reicht. Bitte weniger Details.]</span>', '', '');
        } else if (type === 'icon2') {
            html = me._createTogglerLinks(containerId, togglerId,
                '<span class="jsh-icon-toggler jsh-icon-toggler2-on">&nbsp;</span>',
                '<span class="jsh-icon-toggler jsh-icon-toggler2-off">&nbsp;</span>', '', '');
        } else if (type === 'icon' || 1) {
            html = me._createTogglerLinks(containerId, togglerId,
                '<span class="jsh-icon-toggler jsh-icon-toggler-on">&nbsp;</span>',
                '<span class="jsh-icon-toggler jsh-icon-toggler-off">&nbsp;</span>', '', '');
        }
        html = '<div class="jsh-block-toggler ' + additionalClass + ' ' + togglerClass + ' jsh-toggler-show"' +
            ' togglerbaseid="' + containerId + '" toggleid="' + togglerId + '">' + html + '</div>';
        return html;
    };

    /**
     * create toggler-links for container
     * @param {string} toggleContainer           id of the container to toggle
     * @param {string} toggler                   id of the toggler
     * @param {string} htmlOn                    html to for 'on'-link
     * @param {string} htmlOff                   html to for 'off'-link
     * @param {string} addStyleOn                additional css-class for 'on'-link
     * @param {string} addStyleOff               additional css-class for 'off'-link
     * @returns {string}                         html-snippet with links                      
     */
    me._createTogglerLinks = function (toggleContainer, toggler,
                                       htmlOn, htmlOff, addStyleOn, addStyleOff) {
        // parameter pruefen
        var appBaseVarName = me.appBase.config.appBaseVarName;
        if (!toggleContainer) {
            return null;
        }

        // html erzeugen
        var togglerBaseClass = toggler.replace('.', '');
        var clickHandler = appBaseVarName + '.UIToggler.toggle(' +
            '\'' + toggleContainer + '\', ' +
            '\'' + toggler + '\', false); return false;';
        var html = '<a href="#" onclick="' + clickHandler + '"' +
            ' class="jsh-toggler jsh-toggler-on ' + togglerBaseClass + '_On ' + addStyleOn + '"' +
            ' id="' + togglerBaseClass + '_On">' + htmlOn + '</a>';

        clickHandler = appBaseVarName + '.UIToggler.toggle(' +
            '\'' + toggleContainer + '\', ' +
            '\'' + toggler + '\', true); return false;';
        html += '<a href="#" onclick="' + clickHandler + '"' +
            ' class="jsh-toggler jsh-toggler-off ' + togglerBaseClass + '_Off ' + addStyleOff + '"' +
            ' id="' + togglerBaseClass + '_Off">' + htmlOff + '</a>';

        return html;
    };

    /**
     * Toggle the specific toggleContainer managed by toggler
     * @param {Object} toggleContainer        JQuery-Filter (html.id, style, objectlist...) for the specific toggleContainer to toggle
     * @param {Object} toggler                JQuery-Filter (html.id, style, objectlist...) for the specific toggle to toggle
     */
    me.toggle = function (toggleContainer, toggler) {
        if (me.$(toggler).hasClass('jsh-toggler-hidden')) {
            // show
            me.$(toggleContainer).slideDown(1000);
            me.$(toggler).addClass('jsh-toggler-show').removeClass('jsh-toggler-hidden');
        } else {
            // hide
            me.$(toggleContainer).slideUp(1000);
            me.$(toggler).addClass('jsh-toggler-hidden').removeClass('jsh-toggler-show');
        }
    };

    /**
     * Toggle all toggleContainer managed by the masterToggler
     * @param {Object} masterTogglerId        JQuery-Filter (html.id, style, objectlist...) for the masterToggler
     * @param {Object} toggleContainerId      JQuery-Filter (html.id, style, objectlist...) for the specific toggleContainer to toggle
     * @param {Object} togglerId              JQuery-Filter (html.id, style, objectlist...) for the specific toggle to toggle
     */
    me.toggleAllToggler = function (masterTogglerId, toggleContainerId, togglerId) {
        if (me.$(masterTogglerId).hasClass('jsh-toggler-hidden')) {
            // show all
            me.$(toggleContainerId).slideDown(1000);
            me.$(togglerId).addClass('jsh-toggler-show').removeClass('jsh-toggler-hidden');
            me.$(masterTogglerId).addClass('jsh-toggler-show').removeClass('jsh-toggler-hidden');
        } else {
            // hide all
            me.$(toggleContainerId).slideUp(1000);
            me.$(togglerId).addClass('jsh-toggler-hidden').removeClass('jsh-toggler-show');
            me.$(masterTogglerId).addClass('jsh-toggler-show').removeClass('jsh-toggler-hidden');
        }
    };

    return me;
};
/**
 * base-instance with service functions for box-widget
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @param {JsHelferlein.ConfigBase} config        optional configuration
 * @param {JsHelferlein.ConfigBase} defaultConfig optional defaultconfig if no configuration is set
 * @return {JsHelferlein.WidgetBox}               an instance of the widget
 * @augments JsHelferlein.WidgetBase
 * @constructor
 */
JsHelferlein.WidgetBox = function (appBase, config, defaultConfig) {
    'use strict';

    var me = JsHelferlein.WidgetBase(appBase, config, defaultConfig);

    me.$box = undefined;

    /**
     * prepare the content-element (create or reset html-element)
     */
    me.prepare = function() {
        me._createContentElement();
    };

    /**
     * show widget
     * @abstract
     */
    me.open = function() {};

    /**
     * hide the widget (hide content)
     * @abstract
     */
    me.close = function() {
        me._hideUI();
    };

    /**
     * destroy the widget
     */
    me.destroy = function() {
        me._hideUI();
        me._removeUI();
        me._removeContentElement();
    };

    /**
     * resize the box depending on window
     * @abstract
     * @param {int} globBorder     border
     */
    me.resizeOnWindow = function(globBorder) {
    };

    /**
     * create or reset content-element (html-element)
     */
    me._createContentElement = function() {
        if (!me.appBase.DataUtils.isUndefined(me.$box)) {
            me._removeContentElement();
        }
        me.$box = me.initBox(me.config.contentId, me.config.content);
    };

    /**
     * destroy content-element (html-element)
     */
    me._removeContentElement = function() {
        if (!me.appBase.DataUtils.isUndefined(me.$box)) {
            me.$box.empty();
        }
        me.$box = undefined;
    };

    /**
     * get the dialog-element of the widget
     * @abstract
     * @return {jQuery}       element
     */
    me._getUIInstance = function() {
        me.$instance = me.$box.data('ui-dialog');
        return me.$instance;
    };
    
    /**
     * create or reset dialog-element of the widget
     * @abstract
     */
    me._createUI = function() {
    };

    /**
     * destroy dialog-element of the widget
     */
    me._removeUI = function() {
        me._getUIInstance();
        if (me._checkUI()) {
            me.$instance.destroy();
        }
        me.$instance = undefined;
    };

    /**
     * show dialog-element of the widget
     */
    me._showUI = function() {
        me._getUIInstance();
        if (!me._checkUI()) {
            me._createUI();
            me._getUIInstance();
        }
        me.$instance.open();
    };

    /**
     * hide dialog-element of the widget
     */
    me._hideUI = function() {
        me._getUIInstance();
        if (me._checkUI()) {
            me.$instance.close();
        }
    };

    /**
     /**
     * create or reset a hidden box with id and content
     * @param {string} id          id of the box
     * @param {string} content     content of the box
     * @returns {JQuery}           JQuery-Html-Element
     */
    me.initBox = function (id, content) {
        var $box = me.$('#' + id);
        if ($box.size() <= 0) {
            me.$('body').append('<div id="' + id + '" class="hidden">');
            $box = me.$('#' + id);
        }
        $box.html(content);

        return $box;
    };

    /**
     * reset or create a box with id and title and open it as jquer-dialog
     * @param {string} id       id of the box
     * @param {string} title    title of the box
     */
    me.initDialogBox = function (id, title) {
        var $box = me.initBox(id, '');
        $box.dialog({
            modal: true,
            width: '300px',
            title: title,
            buttons: {
                'Schliessen': function () {
                    me.$(this).dialog('close');
                }
            }
        });

        return $box;
    };


    return me;
};
/**
 * util-functions for formatting data
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.DataUtils}               an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.DataUtils = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /*****************************************
     *****************************************
     * Service-Funktions (data)
     *****************************************
     *****************************************/

    /**
     * check if value undefined or null
     * @param {object} value     value to check
     * @return {boolean}         true/false if empty
     */
    me.isUndefined = function (value) {
        return (value === undefined || value === null);
    };

    /**
     * check if value undefined or null (checks for 'undefined', 'null' as strings too)
     * @param {object} value     value to check
     * @return {boolean}         true/false if empty
     */
    me.isUndefinedStringValue = function (value) {
        return (me.isUndefined(value) || value === 'undefined' || value === 'null' || value === 'NaN');
    };

    /**
     * check if value empty
     * @param {object} value     value to check
     * @return {boolean}         true/false if empty
     */
    me.isEmpty = function (value) {
        return (!value || value === undefined || value === null || value === 0);
    };

    /**
     * check if value empty (checks for 'undefined', 'null', '0', '0.0', '0,0' as strings too)
     * @param {object} value     value to check
     * @return {boolean}         true/false if empty
     */
    me.isEmptyStringValue = function (value) {
        return (me.isEmpty(value) || value === 'undefined' || value === '' || value === 'null' ||
            value === '0'|| value === '0.0' || value === '0,0');
    };


    /**
     * html-escape the entities (&,<,>,",',\) in text
     * @param {string} text     text to escape
     * @return {string}         escaped  text
     */
    me.htmlEscapeText = function (text) {
        if (!me.isUndefinedStringValue(text)) {
            text = text.replace(/&/g, '&amp;');
            text = text.replace(/</g, '&lt;');
            text = text.replace(/>/g, '&gt;');
            text = text.replace(/"/g, '&quot;');
            text = text.replace(/'/g, '&#x27;');
            text = text.replace(/\//g, '&#x2F;');
        }
        return text;
    };

    /**
     * lazy html-escape the entities (<,>) in text
     * @param {string} text     text to escape
     * @return {string}         escaped  text
     */
    me.htmlEscapeTextLazy = function (text) {
        if (!me.isUndefinedStringValue(text)) {
            text = text.replace(/</g, '&lt;');
            text = text.replace(/>/g, '&gt;');
        }
        return text;
    };

    /**
     * format the milliseconds as german datetime
     * @param {int} millis     millis to format
     * @return {string}        date in DD.MM.JJJJ HH24:mm
     */
    me.formatGermanDateTime = function (millis) {
        if (me.isUndefinedStringValue(millis)) {
            return '';
        }
        var date = new Date(millis);
        return me.padNumber(date.getDate(), 2)
            + '.' + me.padNumber(date.getMonth() + 1, 2)
            + '.' + date.getFullYear()
            + ' ' + me.padNumber(date.getHours(), 2)
            + ':' + me.padNumber(date.getMinutes(), 2);
    };

    /**
     * format the milliseconds as german date
     * @param {int} millis     millis to format
     * @return {string}        date in DD.MM.JJJJ
     */
    me.formatGermanDate = function (millis) {
        if (me.isUndefinedStringValue(millis)) {
            return '';
        }
        var date = new Date(millis);
        return me.padNumber(date.getDate(), 2)
            + '.' + me.padNumber(date.getMonth() + 1, 2)
            + '.' + date.getFullYear();
    };

    /**
     * pad the number with leading 0
     * @param {int} number     number to pad
     * @param {int} count      length of the number-string
     * @return {string}        padded number 13,6 -> 000013
     */
    me.padNumber = function (number, count) {
        var r = String(number);
        while (r.length < count) {
            r = '0' + r;
        }
        return r;
    };

    /**
     * format the number with ','
     * @param {int} number     number to format
     * @param {int} nachkomma  
     * @param {string} suffix  suffix behind number
     * @return {string}        padded number 13,6 -> 000013
     */
    me.formatNumbers = function (number, nachkomma, suffix) {
        if (me.isUndefinedStringValue(number)) {
            return '';
        }

        return (number.toFixed(nachkomma)) + suffix;
    };

    /**
     * escape the regex-string
     * @param {string} str     regex-string to escape
     * @return {string}        escaped regex
     */
    me.escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    };

    /**
     * get parameter from current url
     * @param {string} name    name of the parameter
     * @return {string}        value of the parameter
     */
    me.getURLParameter = function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
    };

    /**
     * get baseref from url
     * @param {string} url    url to get from
     * @return {string}       baseref of the url
     */
    me.getBaseRefFromUrl = function (url) {
        var withoutAncor = url.split('#')[0];
        var withoutParams = withoutAncor.split('?')[0];
        var withoutFile = withoutParams.split('/');
        withoutFile.splice(-1, 1);
        return withoutFile.join('/');
    };

    /**
     * a hack to call updatetrigger for the element because for speechregognition the popup
     * @param {Object} element            jquery-selector to fire the trigger
     */
    me.callUpdateTriggerForElement = function(element) {
        if (!me.appBase.DataUtils.isUndefined(element)) {
            console.log('callUpdateTriggerForElement:' + element +
                ' count:' + me.$(element).length +
                ' id:' + me.$(element).attr('id'));
            me.$(element).trigger('input').triggerHandler('change');
            me.$(element).trigger('select').triggerHandler('change');
            me.$(element).trigger('input');
            me.$(element).focus();

            // update ace-editor
            var parentEditor = me.$(element).data('aceEditor');
            if (!parentEditor) {
                var id = me.$(element).attr('id');
                if (id) {
                    id = '#editor' + id.charAt(0).toUpperCase() + id.slice(1);
                    parentEditor = me.$(id).data('aceEditor');
                }
            }
            if (parentEditor) {
                console.log('callUpdateTriggerForElement aceeditor:' + parentEditor);
                parentEditor.setValue(me.$(element).val());
            }
        }
    };

    return me;
};
/**
 * util functions for file-manipulation (download, load...)
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.FileUtils}               an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.FileUtils = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * load the file via jquery-ajax
     * @param {string} fileName      file to load
     * @return {jqXHR}               promise
     */
    me.loadFile = function (fileName) {
        var msg = 'loadFile fileName:' + fileName;

        console.log('START ' + msg);
        var req = me.$.ajax({
            url: fileName,
            type: 'GET',
            complete: function () {
                console.log('COMPLETE ' + msg);
            }
        });

        return req;
    };

    /**
     * download the content as file (create response and open in new window)
     * @param {jQuery} $link     jQuery-instance of the link to add the action
     * @param {string} data      data to download
     * @param {string} fileName  filename for save-dialog of the browser
     * @param {string} mime      mimetype of the file
     * @param {string} encoding  encoding to set
     * @param {string} target    link-target (window-name)
     */
    me.downloadAsFile = function ($link, data, fileName, mime, encoding, target) {
        if (me.appBase.DataUtils.isUndefined(mime)) {
            mime = 'application/text';
        }
        if (me.appBase.DataUtils.isUndefined(encoding)) {
            mime = 'uft-8';
        }
        if (me.appBase.DataUtils.isUndefined(target)) {
            target = '_blank';
        }
        // data URI
        var dataURI = 'data:' + mime + ';charset=' + encoding + ','
            + encodeURIComponent(data);

        // set link
        var flgSafeMode = 0;
        if ((navigator.userAgent.indexOf('Trident') >= 0)
            || (navigator.userAgent.indexOf('MSIE') >= 0)
            || flgSafeMode) {
            // IE or SafeMode
            var popup = window.open('');
            if (!popup) {
                // warn message
                me.appBase.Logger.logError('Leider kann der Download nicht angezeigt werden, da Ihr Popup-Blocker aktiv ist. Beachten Sie die Hinweise im Kopf des Browsers. ', true);
            } else {
                // set data to document
                me.$(popup.document.body).html('<pre>' + me.htmlEscapeTextLazy(data) + '</pre>');
            }
            return false;
        } else {
            // all expect IE
            $link.attr({
                'download': fileName,
                'href': dataURI,
                'target': target
            });
        }
    };

    return me;
};