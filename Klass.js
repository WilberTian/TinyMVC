
var Klass = {
	init: function() {},
	
	instancePrototype: {
		construct: function() {}
	},
	
	klass: function() {
		var object = Object.create(this);
		object._Super = this;
		// Klass init function
		object.init.apply(object, arguments);

		object.instancePrototype = Object.create(this.instancePrototype);

		return object;
	},
	
	instance: function() {
		var instance = Object.create(this.instancePrototype);
		instance._Klass = this;

		// call the construct of Super Klass
		instance._Klass._Super.instancePrototype.construct.apply(instance, arguments);

		instance.construct.apply(instance, arguments);
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