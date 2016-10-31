
var Klass = {
	init: function() {},
	
	instancePrototype: {
		init: function() {}
	},
	
	klass: function() {
		var object = Object.create(this);
		object._Super = this;
		object.init.apply(object, arguments);

		object.instancePrototype = Object.create(this.instancePrototype);

		return object;
	},
	
	instance: function() {
		var instance = Object.create(this.instancePrototype);
		instance._Klass = this;
		instance.init.apply(instance, arguments);
		return instance;
	},
	
	proxy: function(func) {
		var self = this;
		return (function() {
			return func.apply(self, arguments);
		});
	},
	
	include: function(object) {
		
		delete object.include;
		delete object.extend;
		
		for(var prop in object) {
			this.instancePrototype[prop] = object[prop];
		}
		
	},
	
	extend: function(object) {
	
		delete object.include;
		delete object.extend;
		
		for(var prop in object) {
			this[prop] = object[prop];
		}
		
	}

}

Klass.fn = Klass.instancePrototype;
Klass.fn.proxy = Klass.proxy;

Klass.extend(Pubsub);