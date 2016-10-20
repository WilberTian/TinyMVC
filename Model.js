var Model = Klass.klass();


Model.guid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase();      
};

Model.extend(Pubsub);

Model.extend({
    setup: function(name, attributes) {
        var model = Model.klass();
        if(name) model.name = name;
        if(attributes) model.attributes = attributes;
        
        return model;
    },
    
    init: function() {
        this.records = {};
        this.attributes = [];
    }, 
    
    find: function(id) {
        var found = this.records[id];
        if (!found) {
            throw("Unknown record");
        }
        
        return found.copy();
    },
    
    exsits: function(id) {
        try {
            return this.find(id);
        } catch(e) {
            return null;
        }
    },
    
    all: function() {
        return this.copyArray(this.recordsValues());
    },
    
    count: function() {
        return this.recordsValues().length;
    },
    
    create: function(attributes) {
        var newRecord = this.instance();
        console.log(this)
        newRecord.init(attributes);
        newRecord.create();
        
        return newRecord;
    },
    
    update: function(id, attributes) {
        this.find(id).updateAttributes(attributes);
    },
    
    destroyAll: function() {
        for(var guid in this.records) {
            this.records[guid].destroy();
        }
    },
    
    
    // methods for internal use only
    recordsValues: function(){
         var values = [];
         for (var guid in this.records) {
            values.push(this.records[guid]);
         }
           
         return values;
   },
   
   copyArray: function(array) {
         var result = [];
         for (var i=0; i < array.length; i++) {
            result.push(array[i].copy());
         }
          
         return result;
   }

});

Model.include({

    newRecord: true,
    
    init: function(attributes) {
        if(attributes) {
            this.load(attributes);
        }
    },
  
    isNew: function() {
        return this.newRecord;
    },
  
    validate: function() {},

    load: function(attributes) {
        for(var name in attributes) {
            this[name] = attributes[name];
        }
    },
    
    attributes: function() {
        var attrs = {};
        for (var i=0; i < this._Klass.attributes.length; i++) {
            var attr = this._Klass.attributes[i];
            attrs[attr] = this[attr];
        }
        attrs.id = this.id;
        return attrs;
    },
    
    copy: function() {
        var copy = this._Klass.instance(this.attributes());
        copy.newRecord = this.newRecord;
        return copy;
    },
    
    create: function() {
        if(!this.id) {
            this.id = Model.guid();
        }
        
        this.newRecord = false;
        this._Klass.records[this.id] = this.copy();
        
    },
    
    update: function() {
        this._Klass.records[this.id] = this.copy();
    },
    
    updateAttributes: function(attributes){
        this.load(attributes);
        return this.save();
    },
    
    destroy: function() {
        delete this._Klass.records[this.id];
    }
    
});