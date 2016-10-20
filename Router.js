
var Router = Klass.klass();

Router.extend({
    routes: [],
    
    options: {
        mode: null,
        root: '/',
        interval: 50,
    },
    
    init: function(options) {
        // set the options
        this.extend.call(this.options, options || {});
        
        // set current fragment
        this.fragment = this.getFragment();
        
        // general addEventListener
        var addEventListener = window.addEventListener || function(eventName, listener) {
            return attachEvent('on' + eventName, listener);
        };
        
        
        if(this.options.mode === 'history') {
            addEventListener('popstate', this.proxy(this.checkUrl), false);
        } else if('onhashchange' in window) {
            addEventListener('hashchange', this.proxy(this.checkUrl), false);
        } else {
            this._intervalCheck = setInterval(this.proxy(this.checkUrl), this.options.interval);
        }
    },

    navigate: function(path) {
        path = path ? path : '';
        
        if(this.options.mode === 'history') {       
            history.pushState({}, document.title, this.options.root + this.clearSlashes(path));
            
            // force to check the url here since pushState will not trigger popstate
            this.checkUrl();
        } else {        
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }

    },
    
    add: function(re, handler) {
    
        if(typeof re == 'function') {
            handler = re;
            re = '';
        }
        
        this.routes.push({ re: re, handler: handler});
        return this;
    },
    
    remove: function(param) {
        for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
            if(r.handler === param || r.re.toString() === param.toString()) {
                this.routes.splice(i, 1); 
                return this;
            }
        }
        return this;
    },
    
    getFragment: function() {
        var fragment = '';
        
        if(this.options.mode === 'history') {
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.options.root != '/' ? fragment.replace(this.options.root, '') : fragment;
        } else {
            var match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }
        
        return this.clearSlashes(fragment);
    },
    
    clearSlashes: function(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
    
    checkUrl: function() {       
        var currentFragment = this.getFragment();

        if(this.fragment === currentFragment) return;
        
        this.match(currentFragment);
    },
    
    match: function(fragment) {
    
        for(var i=0; i<this.routes.length; i++) {
            var match = fragment.match(this.routes[i].re);

            if(match) {
                this.routes[i].handler.apply({}, match);
                return this;
            }           
        }
        return this;
    }
});



/*

// configuration
Router.init({ mode: 'history'});


// adding routes
Router
.add(/about/, function() {
    console.log('about');
})
.add(/products\/(.*)\/edit\/(.*)/, function() {
    console.log('products', arguments);
})
.add(function() {
    console.log('default');
})


// forwarding
Router.navigate('/about');


*/