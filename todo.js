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
        'click #edit-todo-item': 'editTodoItemHandler',
        'click #delete-todo-item': 'deleteTodoItemHandler'
    },

    listeners: {
        'update': 'render',
        'destroy': 'remove'
    },

    toggleTodoItemHandler: function () {
        this.model.updateAttributes({status: !this.model.status});
        console.log('toggle item click!!!')
    },

    editTodoItemHandler: function() {

        console.log('edit item click!!!')
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
    el: $('#app-content'),

    render: function () {
        var self = this;
        self.el.empty();
        self.el.append('<a id="add-todo-item" href="#/create">+</a>');
        
        this.model.all().forEach(function (todo) {
            self.el.append(TodoItemView.instance({ model: todo }).el);
        });

    }
});


var TodoItemCreateView = View.klass();

TodoItemCreateView.include({
    el: $('#app-content'),

    templates: {
        todoItemCreateTemplate: $('#create-todo-item-template').html()
    },

    render: function() {
        this.el.html(TodoItemCreateView.parseTemplate(this.templates.todoItemCreateTemplate, this.model));
    }

});

var TodoItemEditView = View.klass();

TodoItemEditView.include({
    el: $('#app-content'),

    templates: {
        todoItemEditTemplate: $('#edit-todo-item-template').html()
    },

    events: {
        'click #save-todo-item': 'saveTodoItemHandler',
        'click #cancel-edit-btn': 'cancelEditHandler'
    },

    saveTodoItemHandler: function() {

    },

    cancelEditHandler: function() {

    },

    render: function() {
        this.el.html(TodoItemEditView.parseTemplate(this.templates.todoItemEditTemplate, this.model));
        this.el.find('#edit-todo-item-status').val(this.model.status.toString());
    }

});



Router.init({ mode: 'hashchange'});

Router
.add(/edit\/(.*)/, function() {
    console.log('navigate to edit view');
    TodoItemEditView.instance({model: TodoListModel.find(arguments[1])});
})
.add(/create/, function() {
    console.log('navigate to create view');
    TodoItemCreateView.instance({model: {}});
})
.add(/list/, function(){
    console.log('navigate to list view');
    TodoListView.instance({ model: TodoListModel });
})
.add(function(){
    console.log('navigate to default view');
    Router.navigate('/list', true);
})

Router.navigate('/list', true);