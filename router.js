var router = {
    additionalConfig: {
        hashPrefix: '/'
    },
    activatedRoute: null,
    config: function(config) { this.config = config },
    init: function() {
        window.addEventListener('hashchange', this.routeByUrl.bind(this), false);
        window.addEventListener('message', this.handleMessage.bind(this), false);
        if (!location.hash && this.config && this.config.length > 0) {
            var defaultRoute = this.config[0];
            this.go(defaultRoute.path);
        }
        else {
            this.routeByUrl();
        }
    },
    handleMessage: function(event) {
        if (!event.data) return;

        if (event.data.message == 'routed') {
            this.setRouteInHash(event.data.appPath, event.data.route);
        }
        else if (event.data.message == 'set-height') {
            this.resizeIframe(event.data.appPath, event.data.height);
        }
    },
    resizeIframe: function(appPath, height) {
        let iframe = document.getElementById(appPath);
        if (!iframe) return;
        iframe.style.height = height + 'px';
    },
    go: function(path, subRoute) {
        var route = this.config.find(function(route) { 
            return route.path === path;
        } );
        if (!route) throw Error('route not found: ' + route);

        this.ensureIframeCreated(route, subRoute);
        this.activateRoute(route, subRoute);
    },
    ensureIframeCreated: function(route, subRoute) {
        if (!this.getIframe(route)) {

            var url = '';

            if (subRoute) {
                url = route.app + '#' + this.additionalConfig.hashPrefix + subRoute;
            }
            else {
                url = route.app;
            }

            var iframe = document.createElement('iframe');
            iframe.style['display'] = 'none';
            iframe.src = url;
            iframe.id = route.path;
            iframe.className = 'outlet-frame';

            let outlet = this.getOutlet();
            if (!outlet) throw new Error('outlet not found');

            outlet.appendChild(iframe);
        }
    },
    activateRoute: function(routeToActivate, subRoute)  {
        var that = this;
        this.config.forEach(function(route) { 
            var iframe = that.getIframe(route);
            if (iframe) {
                iframe.style['display'] = route === routeToActivate ? 'block' : 'none';
            }
        });

        if (subRoute) {
            var activatedIframe = this.getIframe(routeToActivate);
            activatedIframe.contentWindow.postMessage({message: 'sub-route', route: subRoute }, '*' );
        }

        this.setRouteInHash(routeToActivate.path, subRoute);
        this.activatedRoute = routeToActivate;
    },
    setRouteInHash: function(path, subRoute) {

        if (subRoute && subRoute.startsWith('/')) {
            subRoute = subRoute.substr(1);
        }
        
        var hash = '';

        if (subRoute) {
             hash = path + '/' + subRoute;
        }
        else {
            hash = path;
        }
        history.replaceState(null, null, document.location.pathname + '#' + hash);
    },
    getIframe: function(route) {
        return document.getElementById(route.path);
    },
    getOutlet: function() {
        return document.getElementById('outlet');
    },
    routeByUrl: function() {
        if (!location.hash) return;
        var path = location.hash.substr(1);
        if (!path) return;
        var segments = path.split('/');
        var appPath = segments[0];
        var rest = segments.slice(1).join('/');
        this.go(appPath, rest);
    },
    preload: function() {
        var that = this;
        this.config.forEach(function(route) {
            that.ensureIframeCreated(route);
        })
    }
};