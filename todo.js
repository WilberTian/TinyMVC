var TodoListModel = Model.setup('todoList', ['title', 'description', 'status']);

TodoListModel.create({ 'title': 'read java book', 'status': false });
TodoListModel.create({ 'title': 'read javascript book', 'status': true });
TodoListModel.create({ 'title': 'read html book', 'status': false });
TodoListModel.create({ 'title': 'read css book', 'status': false });
TodoListModel.create({ 'title': 'read python book', 'status': false });

var TodoItemView = View.klass();

TodoItemView.include({
    
    templates: {
        todoItemTemplate: $('#todo-item-template').html()
    },

    events: {
        'click #toggle-todo-item': 'toggleTodoItemHandler',
        'click #delete-todo-item': 'deleteTodoItemHandler'
    },

    listeners: {
        'update': 'render',
        'destroy': 'remove'
    },

    toggleTodoItemHandler: function () {
        this.model.updateAttributes({status: !this.model.status});
        console.log('complete item click!!!')
    },

    deleteTodoItemHandler: function () {
        this.model.destroy();
        console.log('delete item click!!!')
    },

    render: function () {
        this.el.html(TodoItemView.parseTemplate(this.templates.todoItemTemplate, this.model));
        this.el.toggleClass('completed-todo-item', this.model.status);
        this.el.find('#toggle-todo-item').val(this.model.status?'open':'close');
    }
});




var TodoListView = View.klass();

TodoListView.include({
    el: $('#container'),

    render: function () {
        var self = this;
        self.el.empty();
        this.model.all().forEach(function (todo) {
            self.el.append(TodoItemView.instance({ model: todo }).el);
        });

    }
});


var TodoItemAddView = View.klass();

TodoItemAddView.include({
    el: $('#container'),

    templates: {
        todoItemAddTemplate: $('#add-todo-item-template').html()
    },

    render: function() {
        this.el.html(TodoItemAddView.parseTemplate(this.templates.todoItemAddTemplate, this.model));
    }

});

var TodoItemEditView = View.klass();

TodoItemEditView.include({
    el: $('#container'),

    templates: {
        todoItemEditTemplate: $('#edit-todo-item-template').html()
    },

    render: function() {
        this.el.html(TodoItemEditView.parseTemplate(this.templates.todoItemEditTemplate, this.model));
    }

});



Router.init({ mode: 'hashchange'});

Router
.add(/edit/, function() {
    console.log('navigate to edit view');
    TodoItemEditView.instance({model: {}});
})
.add(/add/, function() {
    console.log('navigate to add view');
    TodoItemAddView.instance({model: {}});
})
.add(/list/, function(){
    console.log('navigate to list view');
    TodoListView.instance({ model: TodoListModel });
})

Router.navigate('/list', true);