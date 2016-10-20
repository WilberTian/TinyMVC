var TodoListModel = Model.setup('todoList', ['title', 'description', 'status']);


//var todoList = TodoListModel.instance();


var b = View.instance({

    el: $('#container'),

    events: {
        "click div": "clickBodyHandler"
    },

    model: {name:'will'},

    clickBodyHandler: function () {
        console.log("body click!!!")
    },

    render: function () {
        this.el.html('ad');
    }
})