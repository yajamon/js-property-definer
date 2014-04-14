var PropertyDefiner = PropertyDefiner || {};

(function() {
	// プロパティ設定
	PropertyDefiner.define = function(obj, prop) {
		if (typeof obj !== 'object' || obj == null) {
			throw new TypeError('1st arg is not object!');
		}

		prop = Object(prop);
		var key  = null;
		var keys = Object.keys(prop);
		var settings = {};

		for(var index=0; index<keys.length; ++index){
			key = keys[index];
			settings[ key ] = get_setting(key, prop[key]);
		}

		Object.defineProperties(obj, settings);
	};

	function hasProperty(obj, prop){
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	function isCallable(v) {
		return typeof v === "function";
	}

	function get_setting (key, prop) {
		if (typeof prop !== "object" || prop === null){
			throw new TypeError("bad prop");
		}

		var setting = {};
		if (hasProperty(prop, "enumerable")){
			setting.enumerable = !!prop.enumerable;
		}
		if (hasProperty(prop, "configurable")){
			setting.configurable = !!prop.configurable;
		}
		if (hasProperty(prop, "value")){
			setting.value = prop.value;
		}
		if (hasProperty(prop, "writable")){
			setting.writable = !!prop.writable;
		}

		if (hasProperty(prop, "get")){
			setting.get = get_getter(key, prop.get);
		}
		if (hasProperty(prop, "set")){
			setting.set = get_setter(key, prop.set);
		}

		// ディスクリプタ競合チェック
		if (("get" in setting || "set" in setting) && ("value" in setting || "writable" in setting)){
			throw new TypeError("identity-confused descriptor");
		}

		return setting;
	}

	function get_getter (key, get) {
		if (!isCallable(get) && get !== "undefined"){
			throw new TypeError("bad get");
		}
		return get;
	}

	function get_setter (key, set) {
		if (!isCallable(set) && set !== "undefined"){
			throw new TypeError("bad set");
		}
		return set;
	}

})();