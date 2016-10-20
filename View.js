var View = Klass.klass();

View.extend(Pubsub);

View.extend({
    eventSplitter: /^(\S+)\s*(.*)$/,

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
        console.log(code)
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
    },

    delegateEvents: function () {
        for (var key in this.events) {
            var methodName = this.events[key];
            var method = this[methodName];

            var match = key.match(this.eventSplitter);
            var eventName = match[1], selector = match[2];

            console.log(selector, eventName, method)
            if (selector === '') {
                this.el.bind(eventName, method);
            } else {
                this.el.delegate("div", eventName, method);
            }
        }
    },

    bindModelListener: function() {
        if('model' in this) {
            var model = this['model'];
            Pubsub.subscrib(model.name + '-updated', this.render);
        }
    },

    $: function (selector) {
        return $(selector, this.el);
    }

});


View.include({
    tag: 'div',

    init: function (options) {
        for (var key in options) {
            this[key] = options[key];
        }

        if (!this.el) this.el = document.createElement(this.tag);
        this.el = $(this.el);

        this._Klass.delegateEvents();
        this._Klass.bindModelListener();

        this.render();
    },

    render: function () {
    }
});


/*

var b = View.instance({
    events: {
        "click div": "clickBodyHandler"
    },

    model: {name:'will'},

    clickBodyHandler: function () {
        console.log("body click!!!")
    },

    render: function () {
        
    }
})

*/