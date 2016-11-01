JavaScript OOP


    Function.prototype.inherits = function(parent) {
        this.prototype = Object.create(parent.prototype);
    };

    Function.prototype.extend = function(object) {
        for(var prop in object) {
            this.prototype[prop] = object[prop];
        }
    };

    function Klass() {}
    Klass.extend({proxy: function(){}, instance: function(){}});



    function View() {}
    View.inherits(Klass)
    View.extend({parseTemplate: function() {}, el: 'View el'});



    function Model() {}
    Model.inherits(Klass)
    Model.extend({toJSON: function() {}, create: function(){}});



    function TodoItemView() {}
    TodoItemView.inherits(View);
    TodoItemView.extend({parseTemplate: function() {}, el: 'TodoItemView el'});

    var todoItemView = new TodoItemView




