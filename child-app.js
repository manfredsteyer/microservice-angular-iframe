var childApp = {
    sendHeight: function() {
        var that = this;
        var body = document.body, html = document.documentElement;

        /*
        var height = Math.max( body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.scrollHeight, html.offsetHeight );
        console.debug('heights', body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight);
        */

        var height = html.offsetHeight;
        parent.postMessage({ message: 'set-height', appPath: that.childConfig.appId, height: height}, '*');
    },
    config: function(config) {
      this.childConfig = config;
    },
    sendRoute: function(url) {
        parent.postMessage({ message: 'routed', appPath: this.childConfig.appId, route: url  }, '*');
    },
    registerForRouteChange: function(callback) {
        window.addEventListener('message', (e) => {
            if (e.data && e.data.message === 'sub-route') {
             callback(e.data.route);
            }
          }, true);
    },
    init: function() {
      if (!parent) return;
      window.addEventListener('load', this.sendHeight.bind(this), true);
      window.addEventListener('resize', this.sendHeight.bind(this), true);
    }
  }