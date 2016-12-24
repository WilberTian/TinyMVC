
var Klass = {
	init: function() {},
	
	instancePrototype: {
		construct: function() {}
	},
	
	subKlass: function() {
		var klass = Object.create(this);
		klass._Super = this;
		// Klass init function
		klass.init.apply(klass, arguments);

		klass.instancePrototype = Object.create(this.instancePrototype);

		return klass;
	},
	
	instance: function() {
		var instance = Object.create(this.instancePrototype);
		instance._Klass = this;

		// call the construct of Super Klass
		//instance._Klass._Super.instancePrototype.construct.apply(instance, arguments);

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
		// add props for instance
		delete object.include;
		delete object.extend;
		
		for(var prop in object) {
			this.instancePrototype[prop] = object[prop];
		}
		
	},
	
	extend: function(object) {
		// add props for klass
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