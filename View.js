var View = Klass.klass();

View.extend({
    parseTemplate: function (html, data) {
        var re = /<%([^%>]+)?%>/g,
            reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
            code = 'var r=[];\n',
            cursor = 0;

        var add = function (line, js) {
            js ?
                (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');

            return add;
        }

        while (match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }

        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';

        return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
    }
});

View.include({
    tag: 'div',
    
    eventSplitter: /^(\S+)\s*(.*)$/,

    init: function (options) {

        console.log('call init')
        for (var key in options) {
            this[key] = options[key];
        }

        if (!this.el) this.el = document.createElement(this.tag);
        this.el = $(this.el);

        this.delegateEvents();
        this.bindModelListener();
        this.render();
    },

    delegateEvents: function () {
        for (var key in this.events) {
            var methodName = this.events[key];
            var method = this.proxy(this[methodName]);

            var match = key.match(this.eventSplitter);

            var eventName = match[1], selector = match[2];

            if (selector === '') {
                this.el.bind(eventName, method);
            } else {
                this.el.delegate(selector, eventName, method);
            }
        }
    },

    bindModelListener: function() {
        for (var key in this.listeners) {
            var methodName = this.listeners[key];
            var method = this.proxy(this[methodName]);

            this.model.proxy(this.model._Klass.subscrib)(key, method);
        }
    },

    render: function() {
        return this;
    }
});
