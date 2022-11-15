(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TokenFetchJS = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var axios$2 = {exports: {}};

	var axios$1 = {exports: {}};

	var bind$2 = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};

	var bind$1 = bind$2;

	// utils is a library of generic helper functions non-specific to axios

	var toString = Object.prototype.toString;

	// eslint-disable-next-line func-names
	var kindOf = (function(cache) {
	  // eslint-disable-next-line func-names
	  return function(thing) {
	    var str = toString.call(thing);
	    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
	  };
	})(Object.create(null));

	function kindOfTest(type) {
	  type = type.toLowerCase();
	  return function isKindOf(thing) {
	    return kindOf(thing) === type;
	  };
	}

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return Array.isArray(val);
	}

	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}

	/**
	 * Determine if a value is a Buffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer(val) {
	  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @function
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	var isArrayBuffer = kindOfTest('ArrayBuffer');


	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}

	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}

	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}

	/**
	 * Determine if a value is a plain Object
	 *
	 * @param {Object} val The value to test
	 * @return {boolean} True if value is a plain Object, otherwise false
	 */
	function isPlainObject(val) {
	  if (kindOf(val) !== 'object') {
	    return false;
	  }

	  var prototype = Object.getPrototypeOf(val);
	  return prototype === null || prototype === Object.prototype;
	}

	/**
	 * Determine if a value is a Date
	 *
	 * @function
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	var isDate = kindOfTest('Date');

	/**
	 * Determine if a value is a File
	 *
	 * @function
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	var isFile = kindOfTest('File');

	/**
	 * Determine if a value is a Blob
	 *
	 * @function
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	var isBlob = kindOfTest('Blob');

	/**
	 * Determine if a value is a FileList
	 *
	 * @function
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	var isFileList = kindOfTest('FileList');

	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} thing The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(thing) {
	  var pattern = '[object FormData]';
	  return thing && (
	    (typeof FormData === 'function' && thing instanceof FormData) ||
	    toString.call(thing) === pattern ||
	    (isFunction(thing.toString) && thing.toString() === pattern)
	  );
	}

	/**
	 * Determine if a value is a URLSearchParams object
	 * @function
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	var isURLSearchParams = kindOfTest('URLSearchParams');

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	}

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 * nativescript
	 *  navigator.product -> 'NativeScript' or 'NS'
	 */
	function isStandardBrowserEnv() {
	  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
	                                           navigator.product === 'NativeScript' ||
	                                           navigator.product === 'NS')) {
	    return false;
	  }
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined'
	  );
	}

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (isPlainObject(result[key]) && isPlainObject(val)) {
	      result[key] = merge(result[key], val);
	    } else if (isPlainObject(val)) {
	      result[key] = merge({}, val);
	    } else if (isArray(val)) {
	      result[key] = val.slice();
	    } else {
	      result[key] = val;
	    }
	  }

	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind$1(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}

	/**
	 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	 *
	 * @param {string} content with BOM
	 * @return {string} content value without BOM
	 */
	function stripBOM(content) {
	  if (content.charCodeAt(0) === 0xFEFF) {
	    content = content.slice(1);
	  }
	  return content;
	}

	/**
	 * Inherit the prototype methods from one constructor into another
	 * @param {function} constructor
	 * @param {function} superConstructor
	 * @param {object} [props]
	 * @param {object} [descriptors]
	 */

	function inherits(constructor, superConstructor, props, descriptors) {
	  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
	  constructor.prototype.constructor = constructor;
	  props && Object.assign(constructor.prototype, props);
	}

	/**
	 * Resolve object with deep prototype chain to a flat object
	 * @param {Object} sourceObj source object
	 * @param {Object} [destObj]
	 * @param {Function} [filter]
	 * @returns {Object}
	 */

	function toFlatObject(sourceObj, destObj, filter) {
	  var props;
	  var i;
	  var prop;
	  var merged = {};

	  destObj = destObj || {};

	  do {
	    props = Object.getOwnPropertyNames(sourceObj);
	    i = props.length;
	    while (i-- > 0) {
	      prop = props[i];
	      if (!merged[prop]) {
	        destObj[prop] = sourceObj[prop];
	        merged[prop] = true;
	      }
	    }
	    sourceObj = Object.getPrototypeOf(sourceObj);
	  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

	  return destObj;
	}

	/*
	 * determines whether a string ends with the characters of a specified string
	 * @param {String} str
	 * @param {String} searchString
	 * @param {Number} [position= 0]
	 * @returns {boolean}
	 */
	function endsWith(str, searchString, position) {
	  str = String(str);
	  if (position === undefined || position > str.length) {
	    position = str.length;
	  }
	  position -= searchString.length;
	  var lastIndex = str.indexOf(searchString, position);
	  return lastIndex !== -1 && lastIndex === position;
	}


	/**
	 * Returns new array from array like object
	 * @param {*} [thing]
	 * @returns {Array}
	 */
	function toArray(thing) {
	  if (!thing) return null;
	  var i = thing.length;
	  if (isUndefined(i)) return null;
	  var arr = new Array(i);
	  while (i-- > 0) {
	    arr[i] = thing[i];
	  }
	  return arr;
	}

	// eslint-disable-next-line func-names
	var isTypedArray = (function(TypedArray) {
	  // eslint-disable-next-line func-names
	  return function(thing) {
	    return TypedArray && thing instanceof TypedArray;
	  };
	})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

	var utils$9 = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isPlainObject: isPlainObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim,
	  stripBOM: stripBOM,
	  inherits: inherits,
	  toFlatObject: toFlatObject,
	  kindOf: kindOf,
	  kindOfTest: kindOfTest,
	  endsWith: endsWith,
	  toArray: toArray,
	  isTypedArray: isTypedArray,
	  isFileList: isFileList
	};

	var utils$8 = utils$9;

	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	var buildURL$1 = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }

	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils$8.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];

	    utils$8.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }

	      if (utils$8.isArray(val)) {
	        key = key + '[]';
	      } else {
	        val = [val];
	      }

	      utils$8.forEach(val, function parseValue(v) {
	        if (utils$8.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils$8.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });

	    serializedParams = parts.join('&');
	  }

	  if (serializedParams) {
	    var hashmarkIndex = url.indexOf('#');
	    if (hashmarkIndex !== -1) {
	      url = url.slice(0, hashmarkIndex);
	    }

	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	};

	var utils$7 = utils$9;

	function InterceptorManager$1() {
	  this.handlers = [];
	}

	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected,
	    synchronous: options ? options.synchronous : false,
	    runWhen: options ? options.runWhen : null
	  });
	  return this.handlers.length - 1;
	};

	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager$1.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};

	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager$1.prototype.forEach = function forEach(fn) {
	  utils$7.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};

	var InterceptorManager_1 = InterceptorManager$1;

	var utils$6 = utils$9;

	var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
	  utils$6.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};

	var AxiosError_1;
	var hasRequiredAxiosError;

	function requireAxiosError () {
		if (hasRequiredAxiosError) return AxiosError_1;
		hasRequiredAxiosError = 1;

		var utils = utils$9;

		/**
		 * Create an Error with the specified message, config, error code, request and response.
		 *
		 * @param {string} message The error message.
		 * @param {string} [code] The error code (for example, 'ECONNABORTED').
		 * @param {Object} [config] The config.
		 * @param {Object} [request] The request.
		 * @param {Object} [response] The response.
		 * @returns {Error} The created error.
		 */
		function AxiosError(message, code, config, request, response) {
		  Error.call(this);
		  this.message = message;
		  this.name = 'AxiosError';
		  code && (this.code = code);
		  config && (this.config = config);
		  request && (this.request = request);
		  response && (this.response = response);
		}

		utils.inherits(AxiosError, Error, {
		  toJSON: function toJSON() {
		    return {
		      // Standard
		      message: this.message,
		      name: this.name,
		      // Microsoft
		      description: this.description,
		      number: this.number,
		      // Mozilla
		      fileName: this.fileName,
		      lineNumber: this.lineNumber,
		      columnNumber: this.columnNumber,
		      stack: this.stack,
		      // Axios
		      config: this.config,
		      code: this.code,
		      status: this.response && this.response.status ? this.response.status : null
		    };
		  }
		});

		var prototype = AxiosError.prototype;
		var descriptors = {};

		[
		  'ERR_BAD_OPTION_VALUE',
		  'ERR_BAD_OPTION',
		  'ECONNABORTED',
		  'ETIMEDOUT',
		  'ERR_NETWORK',
		  'ERR_FR_TOO_MANY_REDIRECTS',
		  'ERR_DEPRECATED',
		  'ERR_BAD_RESPONSE',
		  'ERR_BAD_REQUEST',
		  'ERR_CANCELED'
		// eslint-disable-next-line func-names
		].forEach(function(code) {
		  descriptors[code] = {value: code};
		});

		Object.defineProperties(AxiosError, descriptors);
		Object.defineProperty(prototype, 'isAxiosError', {value: true});

		// eslint-disable-next-line func-names
		AxiosError.from = function(error, code, config, request, response, customProps) {
		  var axiosError = Object.create(prototype);

		  utils.toFlatObject(error, axiosError, function filter(obj) {
		    return obj !== Error.prototype;
		  });

		  AxiosError.call(axiosError, error.message, code, config, request, response);

		  axiosError.name = error.name;

		  customProps && Object.assign(axiosError, customProps);

		  return axiosError;
		};

		AxiosError_1 = AxiosError;
		return AxiosError_1;
	}

	var transitional = {
	  silentJSONParsing: true,
	  forcedJSONParsing: true,
	  clarifyTimeoutError: false
	};

	var toFormData_1;
	var hasRequiredToFormData;

	function requireToFormData () {
		if (hasRequiredToFormData) return toFormData_1;
		hasRequiredToFormData = 1;

		var utils = utils$9;

		/**
		 * Convert a data object to FormData
		 * @param {Object} obj
		 * @param {?Object} [formData]
		 * @returns {Object}
		 **/

		function toFormData(obj, formData) {
		  // eslint-disable-next-line no-param-reassign
		  formData = formData || new FormData();

		  var stack = [];

		  function convertValue(value) {
		    if (value === null) return '';

		    if (utils.isDate(value)) {
		      return value.toISOString();
		    }

		    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
		      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
		    }

		    return value;
		  }

		  function build(data, parentKey) {
		    if (utils.isPlainObject(data) || utils.isArray(data)) {
		      if (stack.indexOf(data) !== -1) {
		        throw Error('Circular reference detected in ' + parentKey);
		      }

		      stack.push(data);

		      utils.forEach(data, function each(value, key) {
		        if (utils.isUndefined(value)) return;
		        var fullKey = parentKey ? parentKey + '.' + key : key;
		        var arr;

		        if (value && !parentKey && typeof value === 'object') {
		          if (utils.endsWith(key, '{}')) {
		            // eslint-disable-next-line no-param-reassign
		            value = JSON.stringify(value);
		          } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
		            // eslint-disable-next-line func-names
		            arr.forEach(function(el) {
		              !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
		            });
		            return;
		          }
		        }

		        build(value, fullKey);
		      });

		      stack.pop();
		    } else {
		      formData.append(parentKey, convertValue(data));
		    }
		  }

		  build(obj);

		  return formData;
		}

		toFormData_1 = toFormData;
		return toFormData_1;
	}

	var settle;
	var hasRequiredSettle;

	function requireSettle () {
		if (hasRequiredSettle) return settle;
		hasRequiredSettle = 1;

		var AxiosError = requireAxiosError();

		/**
		 * Resolve or reject a Promise based on response status.
		 *
		 * @param {Function} resolve A function that resolves the promise.
		 * @param {Function} reject A function that rejects the promise.
		 * @param {object} response The response.
		 */
		settle = function settle(resolve, reject, response) {
		  var validateStatus = response.config.validateStatus;
		  if (!response.status || !validateStatus || validateStatus(response.status)) {
		    resolve(response);
		  } else {
		    reject(new AxiosError(
		      'Request failed with status code ' + response.status,
		      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
		      response.config,
		      response.request,
		      response
		    ));
		  }
		};
		return settle;
	}

	var cookies;
	var hasRequiredCookies;

	function requireCookies () {
		if (hasRequiredCookies) return cookies;
		hasRequiredCookies = 1;

		var utils = utils$9;

		cookies = (
		  utils.isStandardBrowserEnv() ?

		  // Standard browser envs support document.cookie
		    (function standardBrowserEnv() {
		      return {
		        write: function write(name, value, expires, path, domain, secure) {
		          var cookie = [];
		          cookie.push(name + '=' + encodeURIComponent(value));

		          if (utils.isNumber(expires)) {
		            cookie.push('expires=' + new Date(expires).toGMTString());
		          }

		          if (utils.isString(path)) {
		            cookie.push('path=' + path);
		          }

		          if (utils.isString(domain)) {
		            cookie.push('domain=' + domain);
		          }

		          if (secure === true) {
		            cookie.push('secure');
		          }

		          document.cookie = cookie.join('; ');
		        },

		        read: function read(name) {
		          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
		          return (match ? decodeURIComponent(match[3]) : null);
		        },

		        remove: function remove(name) {
		          this.write(name, '', Date.now() - 86400000);
		        }
		      };
		    })() :

		  // Non standard browser env (web workers, react-native) lack needed support.
		    (function nonStandardBrowserEnv() {
		      return {
		        write: function write() {},
		        read: function read() { return null; },
		        remove: function remove() {}
		      };
		    })()
		);
		return cookies;
	}

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	var isAbsoluteURL$1 = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
	};

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	};

	var isAbsoluteURL = isAbsoluteURL$1;
	var combineURLs = combineURLs$1;

	/**
	 * Creates a new URL by combining the baseURL with the requestedURL,
	 * only when the requestedURL is not already an absolute URL.
	 * If the requestURL is absolute, this function returns the requestedURL untouched.
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} requestedURL Absolute or relative URL to combine
	 * @returns {string} The combined full path
	 */
	var buildFullPath$1 = function buildFullPath(baseURL, requestedURL) {
	  if (baseURL && !isAbsoluteURL(requestedURL)) {
	    return combineURLs(baseURL, requestedURL);
	  }
	  return requestedURL;
	};

	var parseHeaders;
	var hasRequiredParseHeaders;

	function requireParseHeaders () {
		if (hasRequiredParseHeaders) return parseHeaders;
		hasRequiredParseHeaders = 1;

		var utils = utils$9;

		// Headers whose duplicates are ignored by node
		// c.f. https://nodejs.org/api/http.html#http_message_headers
		var ignoreDuplicateOf = [
		  'age', 'authorization', 'content-length', 'content-type', 'etag',
		  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
		  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
		  'referer', 'retry-after', 'user-agent'
		];

		/**
		 * Parse headers into an object
		 *
		 * ```
		 * Date: Wed, 27 Aug 2014 08:58:49 GMT
		 * Content-Type: application/json
		 * Connection: keep-alive
		 * Transfer-Encoding: chunked
		 * ```
		 *
		 * @param {String} headers Headers needing to be parsed
		 * @returns {Object} Headers parsed into an object
		 */
		parseHeaders = function parseHeaders(headers) {
		  var parsed = {};
		  var key;
		  var val;
		  var i;

		  if (!headers) { return parsed; }

		  utils.forEach(headers.split('\n'), function parser(line) {
		    i = line.indexOf(':');
		    key = utils.trim(line.substr(0, i)).toLowerCase();
		    val = utils.trim(line.substr(i + 1));

		    if (key) {
		      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
		        return;
		      }
		      if (key === 'set-cookie') {
		        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
		      } else {
		        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
		      }
		    }
		  });

		  return parsed;
		};
		return parseHeaders;
	}

	var isURLSameOrigin;
	var hasRequiredIsURLSameOrigin;

	function requireIsURLSameOrigin () {
		if (hasRequiredIsURLSameOrigin) return isURLSameOrigin;
		hasRequiredIsURLSameOrigin = 1;

		var utils = utils$9;

		isURLSameOrigin = (
		  utils.isStandardBrowserEnv() ?

		  // Standard browser envs have full support of the APIs needed to test
		  // whether the request URL is of the same origin as current location.
		    (function standardBrowserEnv() {
		      var msie = /(msie|trident)/i.test(navigator.userAgent);
		      var urlParsingNode = document.createElement('a');
		      var originURL;

		      /**
		    * Parse a URL to discover it's components
		    *
		    * @param {String} url The URL to be parsed
		    * @returns {Object}
		    */
		      function resolveURL(url) {
		        var href = url;

		        if (msie) {
		        // IE needs attribute set twice to normalize properties
		          urlParsingNode.setAttribute('href', href);
		          href = urlParsingNode.href;
		        }

		        urlParsingNode.setAttribute('href', href);

		        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
		        return {
		          href: urlParsingNode.href,
		          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
		          host: urlParsingNode.host,
		          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
		          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
		          hostname: urlParsingNode.hostname,
		          port: urlParsingNode.port,
		          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
		            urlParsingNode.pathname :
		            '/' + urlParsingNode.pathname
		        };
		      }

		      originURL = resolveURL(window.location.href);

		      /**
		    * Determine if a URL shares the same origin as the current location
		    *
		    * @param {String} requestURL The URL to test
		    * @returns {boolean} True if URL shares the same origin, otherwise false
		    */
		      return function isURLSameOrigin(requestURL) {
		        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
		        return (parsed.protocol === originURL.protocol &&
		            parsed.host === originURL.host);
		      };
		    })() :

		  // Non standard browser envs (web workers, react-native) lack needed support.
		    (function nonStandardBrowserEnv() {
		      return function isURLSameOrigin() {
		        return true;
		      };
		    })()
		);
		return isURLSameOrigin;
	}

	var CanceledError_1;
	var hasRequiredCanceledError;

	function requireCanceledError () {
		if (hasRequiredCanceledError) return CanceledError_1;
		hasRequiredCanceledError = 1;

		var AxiosError = requireAxiosError();
		var utils = utils$9;

		/**
		 * A `CanceledError` is an object that is thrown when an operation is canceled.
		 *
		 * @class
		 * @param {string=} message The message.
		 */
		function CanceledError(message) {
		  // eslint-disable-next-line no-eq-null,eqeqeq
		  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
		  this.name = 'CanceledError';
		}

		utils.inherits(CanceledError, AxiosError, {
		  __CANCEL__: true
		});

		CanceledError_1 = CanceledError;
		return CanceledError_1;
	}

	var parseProtocol;
	var hasRequiredParseProtocol;

	function requireParseProtocol () {
		if (hasRequiredParseProtocol) return parseProtocol;
		hasRequiredParseProtocol = 1;

		parseProtocol = function parseProtocol(url) {
		  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
		  return match && match[1] || '';
		};
		return parseProtocol;
	}

	var xhr;
	var hasRequiredXhr;

	function requireXhr () {
		if (hasRequiredXhr) return xhr;
		hasRequiredXhr = 1;

		var utils = utils$9;
		var settle = requireSettle();
		var cookies = requireCookies();
		var buildURL = buildURL$1;
		var buildFullPath = buildFullPath$1;
		var parseHeaders = requireParseHeaders();
		var isURLSameOrigin = requireIsURLSameOrigin();
		var transitionalDefaults = transitional;
		var AxiosError = requireAxiosError();
		var CanceledError = requireCanceledError();
		var parseProtocol = requireParseProtocol();

		xhr = function xhrAdapter(config) {
		  return new Promise(function dispatchXhrRequest(resolve, reject) {
		    var requestData = config.data;
		    var requestHeaders = config.headers;
		    var responseType = config.responseType;
		    var onCanceled;
		    function done() {
		      if (config.cancelToken) {
		        config.cancelToken.unsubscribe(onCanceled);
		      }

		      if (config.signal) {
		        config.signal.removeEventListener('abort', onCanceled);
		      }
		    }

		    if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
		      delete requestHeaders['Content-Type']; // Let the browser set it
		    }

		    var request = new XMLHttpRequest();

		    // HTTP basic authentication
		    if (config.auth) {
		      var username = config.auth.username || '';
		      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
		      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
		    }

		    var fullPath = buildFullPath(config.baseURL, config.url);

		    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

		    // Set the request timeout in MS
		    request.timeout = config.timeout;

		    function onloadend() {
		      if (!request) {
		        return;
		      }
		      // Prepare the response
		      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
		      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
		        request.responseText : request.response;
		      var response = {
		        data: responseData,
		        status: request.status,
		        statusText: request.statusText,
		        headers: responseHeaders,
		        config: config,
		        request: request
		      };

		      settle(function _resolve(value) {
		        resolve(value);
		        done();
		      }, function _reject(err) {
		        reject(err);
		        done();
		      }, response);

		      // Clean up request
		      request = null;
		    }

		    if ('onloadend' in request) {
		      // Use onloadend if available
		      request.onloadend = onloadend;
		    } else {
		      // Listen for ready state to emulate onloadend
		      request.onreadystatechange = function handleLoad() {
		        if (!request || request.readyState !== 4) {
		          return;
		        }

		        // The request errored out and we didn't get a response, this will be
		        // handled by onerror instead
		        // With one exception: request that using file: protocol, most browsers
		        // will return status as 0 even though it's a successful request
		        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
		          return;
		        }
		        // readystate handler is calling before onerror or ontimeout handlers,
		        // so we should call onloadend on the next 'tick'
		        setTimeout(onloadend);
		      };
		    }

		    // Handle browser request cancellation (as opposed to a manual cancellation)
		    request.onabort = function handleAbort() {
		      if (!request) {
		        return;
		      }

		      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

		      // Clean up request
		      request = null;
		    };

		    // Handle low level network errors
		    request.onerror = function handleError() {
		      // Real errors are hidden from us by the browser
		      // onerror should only fire if it's a network error
		      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request));

		      // Clean up request
		      request = null;
		    };

		    // Handle timeout
		    request.ontimeout = function handleTimeout() {
		      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
		      var transitional = config.transitional || transitionalDefaults;
		      if (config.timeoutErrorMessage) {
		        timeoutErrorMessage = config.timeoutErrorMessage;
		      }
		      reject(new AxiosError(
		        timeoutErrorMessage,
		        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
		        config,
		        request));

		      // Clean up request
		      request = null;
		    };

		    // Add xsrf header
		    // This is only done if running in a standard browser environment.
		    // Specifically not if we're in a web worker, or react-native.
		    if (utils.isStandardBrowserEnv()) {
		      // Add xsrf header
		      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
		        cookies.read(config.xsrfCookieName) :
		        undefined;

		      if (xsrfValue) {
		        requestHeaders[config.xsrfHeaderName] = xsrfValue;
		      }
		    }

		    // Add headers to the request
		    if ('setRequestHeader' in request) {
		      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
		        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
		          // Remove Content-Type if data is undefined
		          delete requestHeaders[key];
		        } else {
		          // Otherwise add header to the request
		          request.setRequestHeader(key, val);
		        }
		      });
		    }

		    // Add withCredentials to request if needed
		    if (!utils.isUndefined(config.withCredentials)) {
		      request.withCredentials = !!config.withCredentials;
		    }

		    // Add responseType to request if needed
		    if (responseType && responseType !== 'json') {
		      request.responseType = config.responseType;
		    }

		    // Handle progress if needed
		    if (typeof config.onDownloadProgress === 'function') {
		      request.addEventListener('progress', config.onDownloadProgress);
		    }

		    // Not all browsers support upload events
		    if (typeof config.onUploadProgress === 'function' && request.upload) {
		      request.upload.addEventListener('progress', config.onUploadProgress);
		    }

		    if (config.cancelToken || config.signal) {
		      // Handle cancellation
		      // eslint-disable-next-line func-names
		      onCanceled = function(cancel) {
		        if (!request) {
		          return;
		        }
		        reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
		        request.abort();
		        request = null;
		      };

		      config.cancelToken && config.cancelToken.subscribe(onCanceled);
		      if (config.signal) {
		        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
		      }
		    }

		    if (!requestData) {
		      requestData = null;
		    }

		    var protocol = parseProtocol(fullPath);

		    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
		      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
		      return;
		    }


		    // Send the request
		    request.send(requestData);
		  });
		};
		return xhr;
	}

	var _null;
	var hasRequired_null;

	function require_null () {
		if (hasRequired_null) return _null;
		hasRequired_null = 1;
		// eslint-disable-next-line strict
		_null = null;
		return _null;
	}

	var utils$5 = utils$9;
	var normalizeHeaderName = normalizeHeaderName$1;
	var AxiosError$1 = requireAxiosError();
	var transitionalDefaults = transitional;
	var toFormData = requireToFormData();

	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	function setContentTypeIfUnset(headers, value) {
	  if (!utils$5.isUndefined(headers) && utils$5.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}

	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = requireXhr();
	  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
	    // For node use HTTP adapter
	    adapter = requireXhr();
	  }
	  return adapter;
	}

	function stringifySafely(rawValue, parser, encoder) {
	  if (utils$5.isString(rawValue)) {
	    try {
	      (parser || JSON.parse)(rawValue);
	      return utils$5.trim(rawValue);
	    } catch (e) {
	      if (e.name !== 'SyntaxError') {
	        throw e;
	      }
	    }
	  }

	  return (encoder || JSON.stringify)(rawValue);
	}

	var defaults$3 = {

	  transitional: transitionalDefaults,

	  adapter: getDefaultAdapter(),

	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Accept');
	    normalizeHeaderName(headers, 'Content-Type');

	    if (utils$5.isFormData(data) ||
	      utils$5.isArrayBuffer(data) ||
	      utils$5.isBuffer(data) ||
	      utils$5.isStream(data) ||
	      utils$5.isFile(data) ||
	      utils$5.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils$5.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils$5.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }

	    var isObjectPayload = utils$5.isObject(data);
	    var contentType = headers && headers['Content-Type'];

	    var isFileList;

	    if ((isFileList = utils$5.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
	      var _FormData = this.env && this.env.FormData;
	      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
	    } else if (isObjectPayload || contentType === 'application/json') {
	      setContentTypeIfUnset(headers, 'application/json');
	      return stringifySafely(data);
	    }

	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    var transitional = this.transitional || defaults$3.transitional;
	    var silentJSONParsing = transitional && transitional.silentJSONParsing;
	    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
	    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

	    if (strictJSONParsing || (forcedJSONParsing && utils$5.isString(data) && data.length)) {
	      try {
	        return JSON.parse(data);
	      } catch (e) {
	        if (strictJSONParsing) {
	          if (e.name === 'SyntaxError') {
	            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
	          }
	          throw e;
	        }
	      }
	    }

	    return data;
	  }],

	  /**
	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
	   * timeout is not created.
	   */
	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,
	  maxBodyLength: -1,

	  env: {
	    FormData: require_null()
	  },

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  },

	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*'
	    }
	  }
	};

	utils$5.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults$3.headers[method] = {};
	});

	utils$5.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults$3.headers[method] = utils$5.merge(DEFAULT_CONTENT_TYPE);
	});

	var defaults_1 = defaults$3;

	var utils$4 = utils$9;
	var defaults$2 = defaults_1;

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	var transformData$1 = function transformData(data, headers, fns) {
	  var context = this || defaults$2;
	  /*eslint no-param-reassign:0*/
	  utils$4.forEach(fns, function transform(fn) {
	    data = fn.call(context, data, headers);
	  });

	  return data;
	};

	var isCancel$1;
	var hasRequiredIsCancel;

	function requireIsCancel () {
		if (hasRequiredIsCancel) return isCancel$1;
		hasRequiredIsCancel = 1;

		isCancel$1 = function isCancel(value) {
		  return !!(value && value.__CANCEL__);
		};
		return isCancel$1;
	}

	var utils$3 = utils$9;
	var transformData = transformData$1;
	var isCancel = requireIsCancel();
	var defaults$1 = defaults_1;
	var CanceledError = requireCanceledError();

	/**
	 * Throws a `CanceledError` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }

	  if (config.signal && config.signal.aborted) {
	    throw new CanceledError();
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	var dispatchRequest$1 = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  // Ensure headers exist
	  config.headers = config.headers || {};

	  // Transform request data
	  config.data = transformData.call(
	    config,
	    config.data,
	    config.headers,
	    config.transformRequest
	  );

	  // Flatten headers
	  config.headers = utils$3.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers
	  );

	  utils$3.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );

	  var adapter = config.adapter || defaults$1.adapter;

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData.call(
	      config,
	      response.data,
	      response.headers,
	      config.transformResponse
	    );

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData.call(
	          config,
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }

	    return Promise.reject(reason);
	  });
	};

	var utils$2 = utils$9;

	/**
	 * Config-specific merge-function which creates a new config-object
	 * by merging two configuration objects together.
	 *
	 * @param {Object} config1
	 * @param {Object} config2
	 * @returns {Object} New object resulting from merging config2 to config1
	 */
	var mergeConfig$2 = function mergeConfig(config1, config2) {
	  // eslint-disable-next-line no-param-reassign
	  config2 = config2 || {};
	  var config = {};

	  function getMergedValue(target, source) {
	    if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
	      return utils$2.merge(target, source);
	    } else if (utils$2.isPlainObject(source)) {
	      return utils$2.merge({}, source);
	    } else if (utils$2.isArray(source)) {
	      return source.slice();
	    }
	    return source;
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDeepProperties(prop) {
	    if (!utils$2.isUndefined(config2[prop])) {
	      return getMergedValue(config1[prop], config2[prop]);
	    } else if (!utils$2.isUndefined(config1[prop])) {
	      return getMergedValue(undefined, config1[prop]);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function valueFromConfig2(prop) {
	    if (!utils$2.isUndefined(config2[prop])) {
	      return getMergedValue(undefined, config2[prop]);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function defaultToConfig2(prop) {
	    if (!utils$2.isUndefined(config2[prop])) {
	      return getMergedValue(undefined, config2[prop]);
	    } else if (!utils$2.isUndefined(config1[prop])) {
	      return getMergedValue(undefined, config1[prop]);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDirectKeys(prop) {
	    if (prop in config2) {
	      return getMergedValue(config1[prop], config2[prop]);
	    } else if (prop in config1) {
	      return getMergedValue(undefined, config1[prop]);
	    }
	  }

	  var mergeMap = {
	    'url': valueFromConfig2,
	    'method': valueFromConfig2,
	    'data': valueFromConfig2,
	    'baseURL': defaultToConfig2,
	    'transformRequest': defaultToConfig2,
	    'transformResponse': defaultToConfig2,
	    'paramsSerializer': defaultToConfig2,
	    'timeout': defaultToConfig2,
	    'timeoutMessage': defaultToConfig2,
	    'withCredentials': defaultToConfig2,
	    'adapter': defaultToConfig2,
	    'responseType': defaultToConfig2,
	    'xsrfCookieName': defaultToConfig2,
	    'xsrfHeaderName': defaultToConfig2,
	    'onUploadProgress': defaultToConfig2,
	    'onDownloadProgress': defaultToConfig2,
	    'decompress': defaultToConfig2,
	    'maxContentLength': defaultToConfig2,
	    'maxBodyLength': defaultToConfig2,
	    'beforeRedirect': defaultToConfig2,
	    'transport': defaultToConfig2,
	    'httpAgent': defaultToConfig2,
	    'httpsAgent': defaultToConfig2,
	    'cancelToken': defaultToConfig2,
	    'socketPath': defaultToConfig2,
	    'responseEncoding': defaultToConfig2,
	    'validateStatus': mergeDirectKeys
	  };

	  utils$2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
	    var merge = mergeMap[prop] || mergeDeepProperties;
	    var configValue = merge(prop);
	    (utils$2.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
	  });

	  return config;
	};

	var data;
	var hasRequiredData;

	function requireData () {
		if (hasRequiredData) return data;
		hasRequiredData = 1;
		data = {
		  "version": "0.27.2"
		};
		return data;
	}

	var VERSION = requireData().version;
	var AxiosError = requireAxiosError();

	var validators$1 = {};

	// eslint-disable-next-line func-names
	['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
	  validators$1[type] = function validator(thing) {
	    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
	  };
	});

	var deprecatedWarnings = {};

	/**
	 * Transitional option validator
	 * @param {function|boolean?} validator - set to false if the transitional option has been removed
	 * @param {string?} version - deprecated version / removed since version
	 * @param {string?} message - some message with additional info
	 * @returns {function}
	 */
	validators$1.transitional = function transitional(validator, version, message) {
	  function formatMessage(opt, desc) {
	    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
	  }

	  // eslint-disable-next-line func-names
	  return function(value, opt, opts) {
	    if (validator === false) {
	      throw new AxiosError(
	        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
	        AxiosError.ERR_DEPRECATED
	      );
	    }

	    if (version && !deprecatedWarnings[opt]) {
	      deprecatedWarnings[opt] = true;
	      // eslint-disable-next-line no-console
	      console.warn(
	        formatMessage(
	          opt,
	          ' has been deprecated since v' + version + ' and will be removed in the near future'
	        )
	      );
	    }

	    return validator ? validator(value, opt, opts) : true;
	  };
	};

	/**
	 * Assert object's properties type
	 * @param {object} options
	 * @param {object} schema
	 * @param {boolean?} allowUnknown
	 */

	function assertOptions(options, schema, allowUnknown) {
	  if (typeof options !== 'object') {
	    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
	  }
	  var keys = Object.keys(options);
	  var i = keys.length;
	  while (i-- > 0) {
	    var opt = keys[i];
	    var validator = schema[opt];
	    if (validator) {
	      var value = options[opt];
	      var result = value === undefined || validator(value, opt, options);
	      if (result !== true) {
	        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
	      }
	      continue;
	    }
	    if (allowUnknown !== true) {
	      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
	    }
	  }
	}

	var validator$1 = {
	  assertOptions: assertOptions,
	  validators: validators$1
	};

	var utils$1 = utils$9;
	var buildURL = buildURL$1;
	var InterceptorManager = InterceptorManager_1;
	var dispatchRequest = dispatchRequest$1;
	var mergeConfig$1 = mergeConfig$2;
	var buildFullPath = buildFullPath$1;
	var validator = validator$1;

	var validators = validator.validators;
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios$1(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}

	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios$1.prototype.request = function request(configOrUrl, config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof configOrUrl === 'string') {
	    config = config || {};
	    config.url = configOrUrl;
	  } else {
	    config = configOrUrl || {};
	  }

	  config = mergeConfig$1(this.defaults, config);

	  // Set config.method
	  if (config.method) {
	    config.method = config.method.toLowerCase();
	  } else if (this.defaults.method) {
	    config.method = this.defaults.method.toLowerCase();
	  } else {
	    config.method = 'get';
	  }

	  var transitional = config.transitional;

	  if (transitional !== undefined) {
	    validator.assertOptions(transitional, {
	      silentJSONParsing: validators.transitional(validators.boolean),
	      forcedJSONParsing: validators.transitional(validators.boolean),
	      clarifyTimeoutError: validators.transitional(validators.boolean)
	    }, false);
	  }

	  // filter out skipped interceptors
	  var requestInterceptorChain = [];
	  var synchronousRequestInterceptors = true;
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
	      return;
	    }

	    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

	    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });

	  var responseInterceptorChain = [];
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
	  });

	  var promise;

	  if (!synchronousRequestInterceptors) {
	    var chain = [dispatchRequest, undefined];

	    Array.prototype.unshift.apply(chain, requestInterceptorChain);
	    chain = chain.concat(responseInterceptorChain);

	    promise = Promise.resolve(config);
	    while (chain.length) {
	      promise = promise.then(chain.shift(), chain.shift());
	    }

	    return promise;
	  }


	  var newConfig = config;
	  while (requestInterceptorChain.length) {
	    var onFulfilled = requestInterceptorChain.shift();
	    var onRejected = requestInterceptorChain.shift();
	    try {
	      newConfig = onFulfilled(newConfig);
	    } catch (error) {
	      onRejected(error);
	      break;
	    }
	  }

	  try {
	    promise = dispatchRequest(newConfig);
	  } catch (error) {
	    return Promise.reject(error);
	  }

	  while (responseInterceptorChain.length) {
	    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
	  }

	  return promise;
	};

	Axios$1.prototype.getUri = function getUri(config) {
	  config = mergeConfig$1(this.defaults, config);
	  var fullPath = buildFullPath(config.baseURL, config.url);
	  return buildURL(fullPath, config.params, config.paramsSerializer);
	};

	// Provide aliases for supported request methods
	utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios$1.prototype[method] = function(url, config) {
	    return this.request(mergeConfig$1(config || {}, {
	      method: method,
	      url: url,
	      data: (config || {}).data
	    }));
	  };
	});

	utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/

	  function generateHTTPMethod(isForm) {
	    return function httpMethod(url, data, config) {
	      return this.request(mergeConfig$1(config || {}, {
	        method: method,
	        headers: isForm ? {
	          'Content-Type': 'multipart/form-data'
	        } : {},
	        url: url,
	        data: data
	      }));
	    };
	  }

	  Axios$1.prototype[method] = generateHTTPMethod();

	  Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
	});

	var Axios_1 = Axios$1;

	var CancelToken_1;
	var hasRequiredCancelToken;

	function requireCancelToken () {
		if (hasRequiredCancelToken) return CancelToken_1;
		hasRequiredCancelToken = 1;

		var CanceledError = requireCanceledError();

		/**
		 * A `CancelToken` is an object that can be used to request cancellation of an operation.
		 *
		 * @class
		 * @param {Function} executor The executor function.
		 */
		function CancelToken(executor) {
		  if (typeof executor !== 'function') {
		    throw new TypeError('executor must be a function.');
		  }

		  var resolvePromise;

		  this.promise = new Promise(function promiseExecutor(resolve) {
		    resolvePromise = resolve;
		  });

		  var token = this;

		  // eslint-disable-next-line func-names
		  this.promise.then(function(cancel) {
		    if (!token._listeners) return;

		    var i;
		    var l = token._listeners.length;

		    for (i = 0; i < l; i++) {
		      token._listeners[i](cancel);
		    }
		    token._listeners = null;
		  });

		  // eslint-disable-next-line func-names
		  this.promise.then = function(onfulfilled) {
		    var _resolve;
		    // eslint-disable-next-line func-names
		    var promise = new Promise(function(resolve) {
		      token.subscribe(resolve);
		      _resolve = resolve;
		    }).then(onfulfilled);

		    promise.cancel = function reject() {
		      token.unsubscribe(_resolve);
		    };

		    return promise;
		  };

		  executor(function cancel(message) {
		    if (token.reason) {
		      // Cancellation has already been requested
		      return;
		    }

		    token.reason = new CanceledError(message);
		    resolvePromise(token.reason);
		  });
		}

		/**
		 * Throws a `CanceledError` if cancellation has been requested.
		 */
		CancelToken.prototype.throwIfRequested = function throwIfRequested() {
		  if (this.reason) {
		    throw this.reason;
		  }
		};

		/**
		 * Subscribe to the cancel signal
		 */

		CancelToken.prototype.subscribe = function subscribe(listener) {
		  if (this.reason) {
		    listener(this.reason);
		    return;
		  }

		  if (this._listeners) {
		    this._listeners.push(listener);
		  } else {
		    this._listeners = [listener];
		  }
		};

		/**
		 * Unsubscribe from the cancel signal
		 */

		CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
		  if (!this._listeners) {
		    return;
		  }
		  var index = this._listeners.indexOf(listener);
		  if (index !== -1) {
		    this._listeners.splice(index, 1);
		  }
		};

		/**
		 * Returns an object that contains a new `CancelToken` and a function that, when called,
		 * cancels the `CancelToken`.
		 */
		CancelToken.source = function source() {
		  var cancel;
		  var token = new CancelToken(function executor(c) {
		    cancel = c;
		  });
		  return {
		    token: token,
		    cancel: cancel
		  };
		};

		CancelToken_1 = CancelToken;
		return CancelToken_1;
	}

	var spread;
	var hasRequiredSpread;

	function requireSpread () {
		if (hasRequiredSpread) return spread;
		hasRequiredSpread = 1;

		/**
		 * Syntactic sugar for invoking a function and expanding an array for arguments.
		 *
		 * Common use case would be to use `Function.prototype.apply`.
		 *
		 *  ```js
		 *  function f(x, y, z) {}
		 *  var args = [1, 2, 3];
		 *  f.apply(null, args);
		 *  ```
		 *
		 * With `spread` this example can be re-written.
		 *
		 *  ```js
		 *  spread(function(x, y, z) {})([1, 2, 3]);
		 *  ```
		 *
		 * @param {Function} callback
		 * @returns {Function}
		 */
		spread = function spread(callback) {
		  return function wrap(arr) {
		    return callback.apply(null, arr);
		  };
		};
		return spread;
	}

	var isAxiosError;
	var hasRequiredIsAxiosError;

	function requireIsAxiosError () {
		if (hasRequiredIsAxiosError) return isAxiosError;
		hasRequiredIsAxiosError = 1;

		var utils = utils$9;

		/**
		 * Determines whether the payload is an error thrown by Axios
		 *
		 * @param {*} payload The value to test
		 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
		 */
		isAxiosError = function isAxiosError(payload) {
		  return utils.isObject(payload) && (payload.isAxiosError === true);
		};
		return isAxiosError;
	}

	var utils = utils$9;
	var bind = bind$2;
	var Axios = Axios_1;
	var mergeConfig = mergeConfig$2;
	var defaults = defaults_1;

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);

	  // Copy context to instance
	  utils.extend(instance, context);

	  // Factory for creating new instances
	  instance.create = function create(instanceConfig) {
	    return createInstance(mergeConfig(defaultConfig, instanceConfig));
	  };

	  return instance;
	}

	// Create the default instance to be exported
	var axios = createInstance(defaults);

	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;

	// Expose Cancel & CancelToken
	axios.CanceledError = requireCanceledError();
	axios.CancelToken = requireCancelToken();
	axios.isCancel = requireIsCancel();
	axios.VERSION = requireData().version;
	axios.toFormData = requireToFormData();

	// Expose AxiosError class
	axios.AxiosError = requireAxiosError();

	// alias for CanceledError for backward compatibility
	axios.Cancel = axios.CanceledError;

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = requireSpread();

	// Expose isAxiosError
	axios.isAxiosError = requireIsAxiosError();

	axios$1.exports = axios;

	// Allow use of default import syntax in TypeScript
	axios$1.exports.default = axios;

	(function (module) {
		module.exports = axios$1.exports;
	} (axios$2));

	var request = /*@__PURE__*/getDefaultExportFromCjs(axios$2.exports);

	/**
	 * A TokenProvider represents a source for token metadata. It can be any possible source, though generally
	 * speaking it would be an indexer of blockchain/marketplace/contract transaction metadata.
	 *
	 * A TokenProvider can have its own set of constructor arguments, and may provide additional methods.
	 *
	 * @interface TokenProvider
	 * @see {@link TezosProviders}
	 */
	class TokenProvider {
	    constructor(providerKey, contractSet) {
	        if (!providerKey && providerKey !== 0) {
	            throw new Error("new TokenProvider missing key");
	        }

	        this.key = providerKey;
	        this.contracts = contractSet || [];
	    }

	    /**
	     * Unique key used to identify provider instance.
	     * @memberof TokenProvider
	     * @type String
	     * @instance
	     */
	    key = "";

	    /**
	     * Fetch tokens and return a normalized set of {@link tokenMetadata}.
	     *
	     * @function
	     * @name TokenProvider#fetchTokens
	     * @param {Object} tokenQuery See {@link tokenQuery}.
	     * @returns {Array} Set of {@link tokenMetadata}.
	     */
	    fetchTokens() {
	        return [];
	    }
	}

	class GraphQLProvider extends TokenProvider {
	    constructor(key, contractSet, graphQLHost) {
	        super(key, contractSet);

	        this.graphQLHost = graphQLHost;
	    }

	    async queryGraphQL(query, variables, operationName) {
	        const data = { query };

	        if (variables) {
	            data.variables = variables;
	        }

	        if (operationName) {
	            data.operationName = operationName;
	        }

	        const response = await request(this.graphQLHost, {
	            method: "POST",
	            headers: {
	                "Content-Type": "application/json",
	            },
	            data,
	        });

	        if (response.data.errors) {
	            throw new Error(response.data.errors);
	        }

	        return response.data.data;
	    }
	}

	function parseTID(tid) {
	    const delimiterIndex = tid.indexOf(":");
	    const contract = tid.substring(0, delimiterIndex);
	    const tokenId = tid.substring(delimiterIndex + 1);

	    return { contract, tokenId };
	}

	const V1_CONTRACT = "KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE";
	const V2_CONTRACT = "KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi";

	/**
	 * Native fx(hash) indexer. Lacks support for many selectors. Review {@tutorial FxhashNative_Selector_Compatibility} for more information.
	 * @implements TokenProvider
	 * @memberof TezosProviders
	 */

	class FxhashNative extends GraphQLProvider {
	    /**
	     * @param {String} key Unique {@link TokenProvider} class instance identifier.
	     */
	    constructor(key) {
	        super(key, [V1_CONTRACT, V2_CONTRACT], "https://api.fxhash.xyz/graphql");
	    }

	    mimeType = "application/x-directory"; // move to config and use in multi indexers too
	    platformName = "fx(hash)"; // move to constants map of contract > display name
	    platformUrl = "https://www.fxhash.xyz"; // move to constants/config file contract > site map same for display name
	    v1Contract = V1_CONTRACT;
	    v2Contract = V2_CONTRACT;

	    async fetchTokens(tokenQuery) {
	        const { mimeType: mimeTypeQueryPartial } = tokenQuery;

	        if (mimeTypeQueryPartial) {
	            const { $eq, $neq, $in } = mimeTypeQueryPartial;

	            if (
	                ($eq && $eq !== this.mimeType) ||
	                ($in && !$in.includes(this.mimeType)) ||
	                ($nin && $nin.includes(this.mimeType)) ||
	                ($neq && $neq === this.mimeType)
	            ) {
	                return [];
	            }
	        }

	        if (tokenQuery.owner) {
	            if (tokenQuery.tid) {
	                return this.fetchOwnerTokensByTID(tokenQuery);
	            } else {
	                return this.fetchOwnerTokens(tokenQuery);
	            }
	        }

	        if (tokenQuery.tid) {
	            throw new Error(`${this.key} does not support querying for tokens by ID without an owner`);
	        }

	        return this.fetchTokensWithoutOwner(tokenQuery);
	    }

	    async fetchOwnerTokensByTID(tokenQuery) {
	        const response = await this.queryGraphQL(
	            `query Query($userId: String) {
                user(id: $userId) {
                  entireCollection {
                    ${this.getObjktFieldsString()}
                  }
                }
            }`,
	            { userId: tokenQuery.owner }
	        );

	        const tokens = response && response.user && response.user.entireCollection;

	        if (!tokens || !tokens.length) {
	            return [];
	        }

	        const { $eq, $neq, $in, $nin } = tokenQuery.tid;

	        let tidSet;

	        if ($eq || $neq) {
	            tidSet = [$eq || $neq];
	        } else if ($in || $nin) {
	            tidSet = $in || $nin;
	        }

	        const idSet = tidSet.map((tid) => parseTID(tid).tokenId);
	        const tokenMetadataSet = tokens.filter(function (token) {
	            const include = $eq || $in;

	            return include ? idSet.includes(token.id) : !idSet.includes(token.id);
	        });

	        if (!tokenMetadataSet.length) {
	            return [];
	        }

	        const filterHandlerMap = {
	            before: function (beforeDate, tokens) {
	                const beforeTimestamp = new Date(beforeDate).getTime();

	                return tokens.filter(function (token) {
	                    const tokenTimestamp = new Date(token.createdAt).getTime();

	                    return tokenTimestamp < beforeTimestamp;
	                });
	            },
	            after: function (afterDate, tokens) {
	                const afterTimestamp = new Date(afterDate).getTime();

	                return tokens.filter(function (token) {
	                    const tokenTimestamp = new Date(token.createdAt).getTime();

	                    return tokenTimestamp > afterTimestamp;
	                });
	            },
	            issuer: function (issuerAddress, tokens) {
	                const { $eq, $neq, $in, $nin } = tokenQuery.issuer;

	                let issuerAddressSet;

	                if ($eq || $neq) {
	                    issuerAddressSet = [$eq || $neq];
	                } else if ($in || $nin) {
	                    issuerAddressSet = $in || $nin;
	                }

	                const include = $eq || $in;

	                return tokens.filter(function (token) {
	                    return include
	                        ? issuerAddressSet.includes(token.issuer.address)
	                        : !issuerAddressSet.includes(token.issuer.address);
	                });
	            },
	        };

	        const filterOptions = Object.keys(filterHandlerMap);

	        let filteredTokens = tokenMetadataSet;

	        for (let i = 0; i < filterOptions.length; i++) {
	            const filterKey = filterOptions[i];
	            const filterValue = tokenQuery[filterKey];

	            if (filterValue) {
	                filteredTokens = filterHandlerMap[filterKey](filterValue, filteredTokens);
	            }
	        }

	        if (!filteredTokens.length) {
	            return [];
	        }

	        const sortedTokens = filteredTokens.sort(function (a, b) {
	            return b.createdAt - a.createdAt;
	        });

	        const startIndex = tokenQuery.skip || 0;

	        let endIndex = tokenQuery.limit ? startIndex + tokenQuery.limit : sortedTokens.length;

	        endIndex > sortedTokens.length ? (endIndex = sortedTokens.length) : endIndex;

	        if (startIndex >= endIndex) {
	            return [];
	        }

	        return sortedTokens.slice(startIndex, endIndex).map(this.parseTokenMetadata.bind(this));
	    }

	    async fetchOwnerTokens(tokenQuery) {
	        const variables = {
	            userId: tokenQuery.owner,
	            take: tokenQuery.limit,
	        };

	        const filters = this.parseObjktQueryFilters(tokenQuery);

	        if (filters) {
	            variables.filters = filters;
	        }

	        const results = await this.queryGraphQL(
	            `query UserTokenQuery($userId: String, $filters: ObjktFilter, $skip: Int, $take: Int, $sort: ObjktsSortInput) {
                user(id: $userId) {
                    objkts(filters: $filters, skip: $skip, take: $take, sort: $sort) {
                        ${this.getObjktFieldsString()}
                    }
                }
            }`,
	            variables
	        );

	        return results.user.objkts.map(this.parseTokenMetadata.bind(this));
	    }

	    async fetchTokensWithoutOwner(tokenQuery) {
	        const variables = {
	            take: tokenQuery.limit,
	        };

	        const {
	            orderBy: { date: dateSortParameter },
	        } = tokenQuery;

	        if (dateSortParameter) {
	            variables.sort = { createdAt: dateSortParameter === "DESC" ? "DESC" : "ASC" };
	        }

	        const filters = this.parseObjktQueryFilters(tokenQuery);

	        if (filters) {
	            variables.filters = filters;
	        }

	        const response = await this.queryGraphQL(
	            `query TokenQuery($filters: ObjktFilter, $skip: Int, $take: Int) {
                objkts(filters: $filters, skip: $skip, take: $take) {
                    ${this.getObjktFieldsString()}
                }
            }`,
	            variables
	        );

	        return response.objkts.map(this.parseTokenMetadata.bind(this));
	    }

	    getObjktFieldsString() {
	        return `id
                assigned
                iteration
                owner {
                    id
                    name
                    flag
                    avatarUri
                    __typename
                }
                issuer {
                    name
                    flag
                    author {
                        id
                        name
                        flag
                        avatarUri
                    }
                }
                name
                metadata
                createdAt
                version`;
	    }

	    parseObjktQueryFilters(tokenQuery) {
	        const { after, before, issuer } = tokenQuery;

	        const filters = {};

	        if (before) {
	            filters.createdAt_lt = before;
	        }

	        if (after) {
	            filters.createdAt_gt = after;
	        }

	        if (issuer) {
	            const { $eq, $neq, $in, $nin } = issuer;

	            if ($neq || $nin) {
	                throw new Error(`$neq | $nin not supported by ${this.key} issuer select query partials`);
	            }

	            const issuerAddressSet = $eq ? [$eq] : $in;

	            filters.author_in = issuerAddressSet;
	        }

	        return (Object.keys(filters).length && filters) || null;
	    }

	    parseTokenMetadata(token) {
	        const {
	            id: tokenId,
	            createdAt,
	            issuer: { author: { id: issuerAddress } = {} },
	            metadata: { artifactUri: artifact, description, displayUri: display },
	            name,
	            version: contractVersion,
	        } = token;

	        const contractAddress = contractVersion === 0 ? this.v1Contract : this.v2Contract;

	        return {
	            contract: {
	                address: contractAddress,
	                tokenId,
	            },
	            createdAt,
	            description,
	            ipfs: {
	                artifact,
	                display,
	            },
	            issuer: {
	                address: issuerAddress,
	            },
	            mime: "application/x-directory",
	            name,
	            // platform: {
	            //     name: null,
	            //     issuer: {
	            //         handle: null,
	            //         url: null,
	            //     },
	            // },
	            tid: `${contractAddress}:${tokenId}`,
	            _metadata: {
	                providerKey: this.key,
	            },
	        };
	    }
	}

	/**
	 * Native indexer for objkt.com.
	 * @implements TokenProvider
	 * @memberof TezosProviders
	 */
	class ObjktcomNative extends GraphQLProvider {
	    /**
	     * @param {String} key Unique TokenProvider instance identifier.
	     * @param {Object} multiProviderOptions See {@link multiProviderOptions}.
	     */
	    constructor(key, options = {}) {
	        super(key, ["*"], "https://data.objkt.com/v2/graphql");

	        this.providerOptions = options;
	    }

	    platformName = "objkt.com";
	    platformUrl = "https://objkt.com";

	    async fetchTokens(tokenQuery) {
	        const variables = {
	            limit: tokenQuery.limit,
	        };

	        if (tokenQuery.orderBy.date) {
	            variables.orderBy = [{ timestamp: tokenQuery.orderBy.date === "DESC" ? "desc" : "asc" }];
	        }

	        const whereClause = this.parseGraphQLWhereClause(tokenQuery);

	        if (whereClause) {
	            variables.where = whereClause;
	        }

	        variables.where = variables.where || {};
	        variables.where._and = variables.where._and || [];
	        variables.where._and.push({
	            supply: {_gt: 0},
	            timestamp: {
	                _is_null: false,
	            },
	            fa: {creator: {address: {_is_null: false}}}
	        });

	        const query = `query Token($where: token_bool_exp, $limit: Int, $orderBy: [token_order_by!]) {
                            token(where: $where, limit: $limit, order_by: $orderBy) {
                                pk
                                description
                                display_uri
                                token_id
                                timestamp
                                artifact_uri
                                name
                                mime
                                fa {
                                    collection_id
                                    contract
                                    creator {
                                        address
                                        alias
                                        tzdomain
                                    }
                                    description
                                    editions
                                    name
                                }
                                creators {
                                    holder {
                                        address
                                        alias
                                    }
                                }
                            }
                        }`;

	        const fetchResponse = await this.queryGraphQL(query, variables);

	        return fetchResponse.token.map((tokenMetadata) => this.parseTokenMetadata(tokenMetadata, tokenQuery));
	    }

	    isValidContract(contract) {
	    	const { contract: { allow: contractAllowSet, deny: contractDenySet } = {} } = this.providerOptions;
	        const contractIsAllowed = !contractAllowSet || contractAllowSet.includes(contract);
	        const contractIsDenied = contractDenySet && contractDenySet.includes(contract);

	        return contractIsAllowed && !contractIsDenied;
	    }

	    // @TODO split parsing logic out by target object vs tokenQuery parameter.
	    parseGraphQLWhereClause(tokenQuery) {
	        const { after, before, tid, issuer, mimeType, owner, searchTerm } = tokenQuery;

	        const whereClause = {};

	        if (before || after) {
	            if (before && after) {
	                whereClause.timestamp = {
	                    _lt: before,
	                    _gt: after,
	                };
	            } else if (before) {
	                whereClause.timestamp = {
	                    _lt: before,
	                };
	            } else if (after) {
	                whereClause.timestamp = {
	                    _gt: after,
	                };
	            }
	        }

	        if (owner) {
	            whereClause.holders = {
	                holder_address: this.parseSelectorQuery(owner),
	            };
	        }

	        if (issuer) {
	            whereClause.fa = {
	                creator_address: this.parseSelectorQuery(issuer),
	            };
	        }

	        const { contract: { allow: contractAllowSet, deny: contractDenySet } = {} } = this.providerOptions;

	        if (contractAllowSet) {
	            whereClause.fa_contract = {
	                _in: contractAllowSet,
	            };
	        } else if (contractDenySet) {
	            whereClause.fa_contract = {
	                _nin: contractDenySet,
	            };
	        }

	        if (tid) {
	            const { $in, $nin, $eq, $neq } = tid;

	            let tidQueryPartialSet;

	            if ($eq || $neq) {
	                const { contract: tidContract, tokenId: tidTokenId } = parseTID($eq || $neq);

	                if ($neq || this.isValidContract(tidContract)) {
	                    const selector = $eq ? "_eq" : "_neq";

	                    tidQueryPartialSet = [
	                        {
	                            [selector]: {
	                                fa_contract: tidContract,
	                                token_id: tidTokenId,
	                            },
	                        },
	                    ];
	                }
	            } else {
	                const tidSet = $in || $nin;

	                tidQueryPartialSet = tidSet.reduce((acc, tid) => {
	                    const { contract: tidContract, tokenId: tidTokenId } = parseTID(tid);

	                    if ($nin || this.isValidContract(tidContract)) {
	                        const selector = $in ? "_eq" : "_neq";

	                        acc.push({
	                            fa_contract: { [selector]: tidContract },
	                            token_id: { [selector]: tidTokenId },
	                        });
	                    }

	                    return acc;
	                }, []);
	            }

	            if (tidQueryPartialSet.length) {
	                whereClause._and = whereClause._and || [];

	                whereClause._and.push({ _or: tidQueryPartialSet });
	            }
	        }

	        if (mimeType) {
	            whereClause.mime = this.parseSelectorQuery(mimeType);
	        }

	        if (searchTerm) {
	            whereClause._or = [
	                {    
	                    "tags": {
	                      "tag": {
	                        "name": {
	                          "_similar": `%${searchTerm}%`
	                        }
	                      }
	                    }
	                },
	                {"name": {"_similar": `%${searchTerm}%`}},
	                {"description": {"_similar": `%${searchTerm}%`}}

	            ];
	        }

	        return Object.keys(whereClause) ? whereClause : null;
	    }

	    parseSelectorQuery(value) {
	        const { $eq, $neq, $in, $nin } = value;

	        if ($eq) {
	            return { _eq: $eq };
	        }

	        if ($neq) {
	            return { _neq: $neq };
	        }

	        if ($in) {
	            return { _in: $in };
	        }

	        if ($nin) {
	            return { _nin: $nin };
	        }
	    }

	    parseTokenMetadata(token) {
	        const {
	            artifact_uri: ipfsArtifact,
	            creators,
	            description,
	            display_uri: ipfsDisplay,
	            fa: { contract: contractAddress, creator: issuerMetadata },
	            mime: mimeType,
	            name,
	            timestamp: createdAt,
	            token_id: tokenId
	        } = token;

	        const issuerAddress =  (issuerMetadata && issuerMetadata.address) || creators[0].creator_address;
	        // const tokenId = contractTokenId || metadataTokenId;

	        return {
	            contract: {
	                address: contractAddress,
	                tokenId,
	            },
	            createdAt,
	            description,
	            ipfs: {
	                artifact: ipfsArtifact,
	                display: ipfsDisplay,
	                // cdn: {
	                //     artifact: `https://assets.objkt.media/file/assets-003/${ipfsArtifact.substring(7)}/artifact`,
	                //     display: `https://assets.objkt.media/file/assets-003/${contractAddress}/${tokenId}/thumb400`,
	                // },
	                gateway: {
	                    artifact: `https://ipfs.io/ipfs/${ipfsArtifact.substring(7)}`,
	                    display: `https://ipfs.io/ipfs/${ipfsDisplay.substring(7)}`,
	                    preload: true
	                },
	            },
	            issuer: {
	                address: issuerAddress,
	            },
	            mimeType,
	            name,
	            // @TODO flesh this out w/ contract > platform metadata w/ objkt.com fallback
	            platform: {
	                name: 'objkt.com',
	                url: "https://objkt.com",
	                tokenUrl: `https://objkt.com/asset/${contractAddress}/${tokenId}`,
	                issuer: {
	                    handle: (issuerMetadata && issuerMetadata.name) || null,
	                    url: `https://objkt.com/profile/${issuerAddress}/created`,
	                },
	            },
	            tid: `${contractAddress}:${tokenId}`,
	            _metadata: {
	                providerKey: this.key,
	            },
	        };
	    }
	}

	/**
	 * Indexer provided by teia.rocks. Indexes FA2 tokens minted on the hic et nunc
	 * minting contract, and swaps originated on the Teia Community swap contracts.
	 * @implements TokenProvider
	 * @memberof TezosProviders
	 */
	class TeiaRocks extends GraphQLProvider {
	    constructor(key) {
	        const henContract = "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton";

	        super(key, [henContract], "https://api-v5.teia.rocks/v1/graphql");

	        this.contract = henContract;
	    }

	    displayName = "teia.rocks";
	    homepage = "https://teia.art";

	    async fetchTokens(tokenQuery) {
	        const variables = {
	            limit: tokenQuery.limit,
	        };

	        if (tokenQuery.orderBy.date) {
	            variables.orderBy = [{ timestamp: tokenQuery.orderBy.date === "DESC" ? "desc" : "asc" }];
	        }

	        const whereClause = this.parseGraphQLWhereClause(tokenQuery);

	        if (whereClause) {
	            variables.where = whereClause;
	        }

	        // Omit tokens with no timestamp value.
	        variables.where = variables.where || {};
	        variables.where._and = variables.where._and || [];
	        variables.where._and.push({
	            supply: {_gt: 0},
	            timestamp: { _is_null: false }
	        });

	        const query = `query Token($where: token_bool_exp, $limit: Int, $orderBy: [token_order_by!]) {
                            token(where: $where, limit: $limit, order_by: $orderBy) {
                                id
                                artifact_uri
                                display_uri
                                thumbnail_uri
                                timestamp
                                mime
                                title
                                description
                                royalties
                                creator {
                                    address
                                    name
                                }
                            }
                        }`;

	        const response = await this.queryGraphQL(query, variables);

	        return response.token.map(this.parseTokenMetadata.bind(this));
	    }

	    parseGraphQLWhereClause(tokenQuery) {
	        const { after, before, tid, issuer, mimeType, owner, searchTerm } = tokenQuery;

	        const whereClause = {};

	        if (before || after) {
	            if (before && after) {
	                whereClause.timestamp = {
	                    _lt: before,
	                    _gt: after,
	                };
	            } else if (before) {
	                whereClause.timestamp = {
	                    _lt: before,
	                };
	            } else if (after) {
	                whereClause.timestamp = {
	                    _gt: after,
	                };
	            }
	        }

	        if (owner) {
	            whereClause.token_holders = {
	                holder: {
	                    address: this.parseSelectorQuery(owner),
	                },
	            };
	        }

	        if (issuer) {
	            whereClause.creator = {
	                address: this.parseSelectorQuery(issuer),
	            };
	        }

	        if (tid) {
	            const { $in, $nin } = tid;

	            const selector = $in ? "_in" : "_nin";

	            whereClause.id = { [selector]: ($in || $nin).map((tid) => tid.substring(tid.indexOf(":") + 1)) };
	        }

	        if (mimeType) {
	            whereClause.mime = this.parseSelectorQuery(mimeType);
	        }

	        if (searchTerm) {    
	            whereClause._or = [
	              {
	                "token_tags": {
	                  "tag": {
	                    "tag": {
	                      "_similar": `%${searchTerm}%`
	                    }
	                  }
	                }
	              },
	              {"title": {
	                                "_similar": `%${searchTerm}%`
	                              }},
	                {"description": {
	                                  "_similar": `%${searchTerm}%`
	                                }}
	            ];

	        }

	        return Object.keys(whereClause) ? whereClause : null;
	    }

	    parseSelectorQuery(value) {
	        const { $eq, $neq, $in, $nin } = value;

	        if ($eq) {
	            return { _eq: $eq };
	        }

	        if ($neq) {
	            return { _neq: $neq };
	        }

	        if ($in) {
	            return { _in: $in };
	        }

	        if ($nin) {
	            return { _nin: $nin };
	        }
	    }

	    parseTokenMetadata(token) {
	        const {
	            artifact_uri: ipfsArtifact,
	            creator: { address: issuerAddress, name: issuerHandle },
	            description,
	            display_uri: ipfsDisplay,
	            id: tokenId,
	            mime: mimeType,
	            timestamp: createdAt,
	            title: name,
	        } = token;

	        return {
	            contract: {
	                address: this.contract,
	                tokenId,
	            },
	            createdAt,
	            description,
	            ipfs: {
	                artifact: ipfsArtifact,
	                display: ipfsDisplay,
	                gateway: {
	                    artifact: `https://nftstorage.link/ipfs/${ipfsArtifact.substring(7)}`,
	                    display: `https://nftstorage.link/ipfs/${ipfsDisplay.substring(7)}`,
	                }
	            },
	            issuer: {
	                address: issuerAddress,
	            },
	            mimeType,
	            name,
	            platform: {
	                name: 'Teia',
	                url: 'https://teia.art',
	                tokenUrl: `https://teia.art/objkt/${tokenId}`,
	                issuer: {
	                    handle: issuerHandle,
	                    url: `https://teia.art/tz/${issuerAddress}`,
	                },
	            },
	            tid: `${this.contract}:${tokenId}`,
	            _metadata: {
	                providerKey: this.key,
	            },
	        };
	    }
	}

	/**
	 * {@link TokenProvider} class designed to interface with any HTTP reachable TezTok indexer.
	 * You must provide your own TezTok API host. Public instance: `https://api.teztok.com/v1/graphql`.
	 * @implements TokenProvider
	 * @memberof TezosProviders
	 */
	class TezTok extends GraphQLProvider {
	    /**
	     * @param {String} key Unique TokenProvider instance identifier.
	     * @param {String} teztokHost URL for indexer API.
	     * @param {Object} multiProviderOptions See {@link multiProviderOptions}.
	     */
	    constructor(providerKey, tezTokHost, options = {}) {
	        const { contract: { allow: contractAllowSet } = {} } = options;

	        super(providerKey, contractAllowSet || ["*"], tezTokHost);

	        this.providerOptions = options;
	    }

	    async fetchTokens(tokenQuery) {
	        const variables = {
	            limit: tokenQuery.limit,
	        };

	        if (tokenQuery.orderBy.date) {
	            variables.orderBy = [{ minted_at: tokenQuery.orderBy.date === "DESC" ? "desc" : "asc" }];
	        }

	        const whereClause = this.parseGraphQLWhereClause(tokenQuery);

	        if (whereClause) {
	            variables.where = whereClause;
	        }

	        // Omit tokens with no minted_at value.
	        variables.where = variables.where || {};
	        variables.where._and = variables.where._and || [];
	        variables.where._and.push({
	            editions: {_gt: 0},
	            minted_at: {
	                _is_null: false,
	            },
	        });

	        const query = `query Query_root($where: tokens_bool_exp, $limit: Int, $orderBy: [tokens_order_by!]) {
                            tokens(where: $where, limit: $limit, order_by: $orderBy) {
                                fa2_address,
                                minted_at,
                                description,
                                token_id,
                                artifact_uri,
                                display_uri,
                                artist_address,
                                artist_profile {
                                    alias
                                },
                                platform,
                                name,
                            }
                        }`;

	        const response = await this.queryGraphQL(query, variables);

	        return response.tokens.map(this.parseTokenMetadata.bind(this));
	    }

	    parseSelectorQuery(value) {
	        const { $eq, $neq, $in, $nin } = value;

	        if ($eq) {
	            return { _eq: $eq };
	        }

	        if ($neq) {
	            return { _neq: $neq };
	        }

	        if ($in) {
	            return { _in: $in };
	        }

	        if ($nin) {
	            return { _nin: $nin };
	        }
	    }

	    parseGraphQLWhereClause(tokenQuery) {
	        const { after, before, tid, issuer, mimeType, owner } = tokenQuery;

	        const whereClause = {};

	        if (before || after) {
	            if (before && after) {
	                whereClause.minted_at = {
	                    _lt: before,
	                    _gt: after,
	                };
	            } else if (before) {
	                variables.minted_at = {
	                    _lt: before,
	                };
	            } else if (after) {
	                whereClause.minted_at = {
	                    _gt: after,
	                };
	            }
	        }

	        if (owner) {
	            whereClause.holdings = {
	                holder_address: this.parseSelectorQuery(owner),
	            };
	        }

	        if (issuer) {
	            whereClause.artist_address = this.parseSelectorQuery(issuer);
	        }

	        const { contract: { allow: contractAllowSet, deny: contractDenySet } = {} } = this.providerOptions;

	        if (contractAllowSet) {
	            whereClause.fa2_address = {
	                _in: contractAllowSet,
	            };
	        } else if (contractDenySet) {
	            whereClause.fa2_address = {
	                _nin: contractDenySet,
	            };
	        }

	        if (tid) {
	            const { $in: allowSet, $nin: denySet, $eq, $neq } = tid;

	            let tidQueryPartialSet;

	            if ($eq || $neq) {
	                const { contract: tidContract, tokenId: tidTokenId } = parseTID($eq || $neq);

	                if ($neq || this.isValidContract(tidContract)) {
	                    const selector = $eq ? "_eq" : "_neq";

	                    tidQueryPartialSet = [
	                        {
	                            [selector]: {
	                                fa2_address: tidContract,
	                                token_id: tidTokenId,
	                            },
	                        },
	                    ];
	                }
	            } else {
	                const tidSet = $in || $nin;

	                tidQueryPartialSet = tidSet.reduce((acc, tid) => {
	                    const { contract: tidContract, tokenId: tidTokenId } = parseTID(tid);

	                    if ($nin || this.isValidContract(tidContract)) {
	                        const selector = $in ? "_eq" : "_neq";

	                        acc.push({
	                            fa2_address: { [selector]: tidContract },
	                            token_id: { [selector]: tidTokenId },
	                        });
	                    }

	                    return acc;
	                }, []);
	            }

	            if (tidQueryPartialSet.length) {
	                whereClause._and = whereClause._and || [];

	                whereClause._and.push({ _or: tidQueryPartialSet });
	            }
	        }

	        if (mimeType) {
	            whereClause.mime_type = this.parseSelectorQuery(mimeType);
	        }

	        return Object.keys(whereClause) ? whereClause : null;
	    }

	    parseTokenMetadata(token) {
	        return {
	            contract: {
	                address: token.fa2_address,
	                tokenId: token.token_id,
	            },
	            createdAt: token.minted_at,
	            description: token.description,
	            ipfs: {
	                artifact: token.artifact_uri,
	                display: token.display_uri,
	            },
	            issuer: {
	                address: token.artist_address,
	            },
	            mimeType: token.mime_type,
	            name: token.name,
	            // @TODO Create parser for this based on each platform
	            // platform: {
	            //     name: null,
	            //     issuer: {
	            //         handle: null,
	            //         url: null,
	            //     },
	            // },
	            tid: `${token.fa2_address}:${token.token_id}`,
	            _metadata: {
	                providerKey: this.key,
	            },
	        };
	    }

	    isValidContract(contract) {
	    	const { contract: { allow: contractAllowSet, deny: contractDenySet } = {} } = this.providerOptions;
	        const contractIsAllowed = !contractAllowSet || contractAllowSet.includes(contract);
	        const contractIsDenied = contractDenySet && contractDenySet.includes(contract);

	        return contractIsAllowed && !contractIsDenied;
	    }
	}

	/**
	 * Built-in {@link TokenProvider} classes for the Tezos blockchain. Instantiate the providers that support the
	 * contracts you wish to retrieve tokens from, and pass the resulting set to {@link module:TokenFetchJS.factory}.
	 * @namespace TezosProviders
	 */

	var Tezos = {
	    FxhashNative,
	    ObjktcomNative,
	    TeiaRocks,
	    TezTok,
	};

	var providers = {
	    Tezos,
	};

	/**
	 * Provide a set of token providers and fetch normalized token data
	 * using a simple query interface.
	 * @hideconstructor
	 */
	class TokenFetcher {
	    providers = [];

	    /**
	     * TokenFetcher requires a set of providers to fetch tokens from. Generally speaking,
	     * this will be a set of indexers. You can access built-in providers to utilize via
	     * {@link module:TokenFetchJS.providers}.
	     * @param {Array} providerSet A set of token providers to fetch tokens from.
	     * @param {Object} TokenQueryParser TokenQueryParser class
	     * @param {Object} TokenPaginator TokenPaginator class
	     */
	    constructor(providerSet = [], TokenQueryParser, TokenPaginator) {
	        this.TokenPaginator = TokenPaginator;
	        this.TokenQueryParser = TokenQueryParser;
	        this.queryParser = null;
	        this.providerMap = null;
	        this.providerSet = null;

	        this.setProviders(providerSet);
	    }

	    /**
	     * Fetch a normalized set of token metadata from the configured set of token providers.
	     * @param {Object} tokenQuery Dictionary of token filters used to refine fetch results.
	     * If no {@link tokenQuery} is given the most recent 50 tokens will be returned.
	     * @param {Object} pageCursor Metadata required by TokenFetchJS to gather the next page of results.
	     * @returns {Object} See {@link tokenFetchResponse}.
	     * @see {@link tokenQuery}
	     * @see {@link pageCursor}
	     */
	    async fetchTokens(rawTokenQuery = {}, pageCursor) {
	        const tokenQuery = this.queryParser.normalizeTokenQuery(
	            this.queryParser.applyTokenQueryDefaults(rawTokenQuery)
	        );
	        const providerTokenMetadataMap = await this.fetchTokensFromProviders(tokenQuery, pageCursor);
	        const paginator = new this.TokenPaginator(tokenQuery, providerTokenMetadataMap, pageCursor);

	        return paginator.getPage();
	    }

	    async fetchTokensFromProviders(tokenQuery, pageCursor) {
	        const providerTokenQueryMap = this.queryParser.parseProviderQueryMap(tokenQuery, pageCursor);
	        const providerTokenFetchResponseSet = await Promise.all(
	            Object.entries(providerTokenQueryMap).map(async ([providerKey, providerTokenQuery]) => {
	                const providerTokenMetadataSet = await this.providerMap[providerKey].fetchTokens(providerTokenQuery);

	                return { [providerKey]: providerTokenMetadataSet };
	            })
	        );

	        return providerTokenFetchResponseSet.reduce((acc, fetchResponse) => {
	            return Object.assign(acc, fetchResponse);
	        }, {});
	    }

	    /**
	     * Retrieve all provider instances.
	     * @returns {Array} Set of configured providers.
	     */
	    getProviders() {
	        return this.providerSet;
	    }

	    /**
	     * Apply set of provider instances. This will replace the existing configured provider set.
	     * @param {Array} providerSet A set of token providers to fetch tokens from.
	     * @returns {Array} Set of configured providers.
	     */
	    setProviders(providerSet) {
	        this.providerSet = providerSet;
	        this.providerMap = providerSet.reduce((acc, p) => (acc[p.key] = p) && acc, {});
	        this.queryParser = new this.TokenQueryParser(this.providerSet);

	        return this.getProviders();
	    }

	    /**
	     * Add a single provider instance.
	     * @param {Object} provider New provider instance to fetch tokens from.
	     * @returns {Array} Set of configured providers.
	     */
	    addProvider(provider) {
	        this.setProviders(this.getProviders().concat(provider));

	        return this.getProviders();
	    }

	    /**
	     * Remove a provider instance by key.
	     * @param {String} providerKey Key identifier supplied to TokenProvider constructor.
	     * @returns {Array} Set of configured providers.
	     */
	    removeProvider(providerKey) {
	        this.setProviders(this.providerSet.reduce((acc, p) => (p.key !== providerKey ? [...acc, p] : acc), []));

	        return this.getProviders();
	    }
	}

	class TokenPaginator {
	    constructor(tokenQuery, providerTokenMetadataMap, existingCursor) {
	        this.tokens = this.parseTokenMetadataSet(tokenQuery, providerTokenMetadataMap, existingCursor);
	        this.cursor = this.parseNextPageCursor(tokenQuery, this.tokens, existingCursor);
	        this.previousCursor = this.parsePreviousPageCursor(tokenQuery, this.tokens);
	    }

	    getPage() {
	        return {
	            previousCursor: this.previousCursor,
	            cursor: this.cursor,
	            tokens: this.tokens,
	        };
	    }

	    parseTokenMetadataSet(tokenQuery, providerTokenMetadataMap, cursor = {}) {
	        // Convert token metadata 2d array into tid namespaced map of tokens to remove duplicates.
	        const tidTokenMetadataMap = Object.values(providerTokenMetadataMap).reduce((acc, providerTokenMetadataSet) => {
	            for (let i = 0; i < providerTokenMetadataSet.length; i++) {
	                acc[providerTokenMetadataSet[i].tid] = providerTokenMetadataSet[i];
	            }

	            return acc;
	        }, {});

	        let orderByClause = tokenQuery;
	        let reverse = false;

	        // @TODO make this not shitty
	        if (cursor && Object.values(cursor).length && Object.values(cursor)[0].orderBy) {
	            orderByClause = Object.values(cursor)[0];
	            reverse = true;
	        }

	        const tokens = this.sortTokenMetadataSet(orderByClause, Object.values(tidTokenMetadataMap)).slice(0, tokenQuery.limit);

	        return reverse ? tokens.reverse() : tokens;
	    }

	    parseNextPageCursor(tokenQuery, tokenMetadataSet, existingCursor) {
	        const providerTokenMetadataMap = tokenMetadataSet.reduce((acc, tm) => {
	            acc[tm._metadata.providerKey] = acc[tm._metadata.providerKey] || [];

	            acc[tm._metadata.providerKey].push(tm);

	            return acc;
	        }, {});

	        return Object.entries(providerTokenMetadataMap).reduce((acc, [providerKey, tokenMetadataSet]) => {
	            acc[providerKey] = this.parsePaginationTokenQueryPartial(tokenQuery, tokenMetadataSet);

	            return acc;
	        }, existingCursor ? JSON.parse(JSON.stringify(existingCursor)) : {});
	    }

	    parsePreviousPageCursor(tokenQuery, tokenMetadataSet) {
	        const providerTokenMetadataMap = tokenMetadataSet.reduce((acc, tm) => {
	            acc[tm._metadata.providerKey] = acc[tm._metadata.providerKey] || [];

	            acc[tm._metadata.providerKey].push(tm);

	            return acc;
	        }, {});

	        return Object.entries(providerTokenMetadataMap).reduce((acc, [providerKey, tokenMetadataSet]) => {
	            acc[providerKey] = this.parsePreviousPagePaginationTokenQueryPartial(tokenQuery, tokenMetadataSet);

	            return acc;
	        }, {});
	    }

	    sortTokenMetadataSet(tokenQuery, tokenMetadataSet) {
	        const { orderBy: { date: dateParameter } = {} } = tokenQuery;

	        if (dateParameter) {
	            return tokenMetadataSet.sort((a, b) => {
	                const aCreated = new Date(a.createdAt);
	                const bCreated = new Date(b.createdAt);

	                if (tokenQuery.orderBy.date === "ASC") {
	                    return aCreated - bCreated;
	                } else if (tokenQuery.orderBy.date === "DESC") {
	                    return bCreated - aCreated;
	                }
	            });
	        }

	        return tokenMetadataSet;
	    }

	    parsePreviousPagePaginationTokenQueryPartial(tokenQuery, tokenMetadataSet) {
	        const dateParameter = tokenQuery.orderBy.date;

	        if (dateParameter) {
	            const firstCreatedAt = tokenMetadataSet[0].createdAt;
	            const cursorParameter = dateParameter === "DESC" ? "after" : "before";

	            return { [cursorParameter]: firstCreatedAt, orderBy: {date: dateParameter === "DESC" ? "ASC" : "DESC"} };
	        }

	        return null;
	    }

	    parsePaginationTokenQueryPartial(tokenQuery, tokenMetadataSet) {
	        const dateParameter = tokenQuery.orderBy.date;

	        if (dateParameter) {
	            const lastCreatedAt = tokenMetadataSet[tokenMetadataSet.length - 1].createdAt;
	            const cursorParameter = dateParameter === "DESC" ? "before" : "after";

	            return { [cursorParameter]: lastCreatedAt };
	        }

	        return null;
	    }
	}

	var config = Object.freeze({
	    tokenQuery: {
	        DEFAULT_LIMIT: 50,
	        SELECTOR_QUERY_FIELDS: ["tid", "issuer", "mimeType", "owner"],
	    },
	});

	const {
	    tokenQuery: { DEFAULT_LIMIT, SELECTOR_QUERY_FIELDS },
	} = config;

	class TokenQueryParser {
	    constructor(providerSet) {
	        this.contractProviderCompatibilityMap = this.parseContractProviderCompatibilityMap(providerSet);
	        this.providerKeySet = providerSet.map((p) => p.key);
	    }

	    applyTokenQueryDefaults(tokenQuery) {
	        tokenQuery.limit = tokenQuery.limit || DEFAULT_LIMIT;
	        tokenQuery.orderBy = tokenQuery.orderBy || { date: "DESC" };

	        return tokenQuery;
	    }

	    normalizeTokenQuery(tokenQuery) {
	        const normalizedQueryPartialMap = {};

	        for (let i = 0; i < SELECTOR_QUERY_FIELDS.length; i++) {
	            const field = SELECTOR_QUERY_FIELDS[i];
	            const fieldValue = tokenQuery[field];

	            if (!fieldValue || (typeof fieldValue === "object" && !Array.isArray(fieldValue))) {
	                continue;
	            }

	            if (Array.isArray(fieldValue)) {
	                normalizedQueryPartialMap[field] = { $in: fieldValue };
	            }

	            normalizedQueryPartialMap[field] = { $eq: fieldValue };
	        }

	        return Object.assign({}, tokenQuery, normalizedQueryPartialMap);
	    }

	    /**
	     * Iterate through the configured set of providers and construct a map of contract addresses to
	     * set of providers that support the contract.
	     * @param {Array} providerSet Set of TokenProviders to pair to contract addresses based off of compatibility.
	     * @returns {Object} Map of contract address to provider set.
	     * @ignore
	     */
	    parseContractProviderCompatibilityMap(providerSet) {
	        return providerSet.reduce((acc, p) => {
	            for (let i = 0; i < p.contracts.length; i++) {
	                const contract = p.contracts[i];

	                acc[contract] = acc[contract] || [];

	                acc[contract].push(p);
	            }

	            return acc;
	        }, {});
	    }

	    /**
	     * Iterate over TID set and determine which providers support its contract.
	     * Return a map of provider to TID scoped {@link tokenQuery} partials.
	     *
	     * Providers with a wildcard in their contract set will be used as a fallback if no
	     * providers support the TID's contract directly.
	     *
	     * The resulting mapped query is merged with the remaining applicable paramters from
	     * {@link tokenQuery} before tokens are fetched.
	     * @param {Array<String>} tidSet Set of TIDs to scope token results.
	     * @returns {Object} Map of provider key to TID scoped {@link tokenQuery}
	     * @ignore
	     */
	    parseProviderTIDQueryPartialMap(tidQueryPartial) {
	        let tidSet;

	        // Coerce tid selector query input into Array.
	        if (tidQueryPartial.$eq || tidQueryPartial.$neq) {
	            tidSet = [tidQueryPartial.$eq || tidQueryPartial.$neq];
	        } else {
	            tidSet = tidQueryPartial.$in || tidQueryPartial.$nin;
	        }

	        // Iterate through all TIDs being interfaced with and create a map of provider to token query partial.
	        return tidSet.reduce((acc, tid) => {
	            const { contract } = parseTID(tid);
	            const contractSupportedProviders = this.contractProviderCompatibilityMap[contract] || [];
	            const wildcardProviders = this.contractProviderCompatibilityMap["*"] || [];

	            let supportedProviders;

	            if (contractSupportedProviders.length) {
	                supportedProviders = [contractSupportedProviders[0]];
	            } else if (wildcardProviders.length) {
	                supportedProviders = wildcardProviders;
	            }

	            /**
	             * Iterate through all supported providers. In the event that no provider directly supports
	             * the TID's contract, all wildcard providers will be queried.
	             */
	            for (let i = 0; i < supportedProviders.length; i++) {
	                const provider = supportedProviders[i];

	                acc[provider.key] = acc[provider.key] || {};

	                if (tidQueryPartial.$eq || tidQueryPartial.$neq) {
	                    const selectorQueryFilter = tidQueryPartial.$eq ? "$in" : "$nin";

	                    acc[providerKey].tid = { [selectorQueryFilter]: [tid] };
	                } else if (tidQueryPartial.$in || tidQueryPartial.$nin) {
	                    const selectorQueryFilter = tidQueryPartial.$in ? "$in" : "$nin";

	                    acc[provider.key].tid = acc[provider.key].tid || {
	                        [selectorQueryFilter]: [],
	                    };

	                    acc[provider.key].tid[selectorQueryFilter].push(tid);
	                }
	            }

	            return acc;
	        }, {});
	    }

	    /**
	     * Anaylze tokenQuery input, current pageCursor, contract supported providers, build provider specific
	     * tokenQuery and return map of provider key to provider specific tokenQuery.
	     * @param {*} tokenQuery @see {@link tokenQuery}
	     * @param {*} pageCursor @see {@link pageCursor}
	     * @returns {Object} Map of provider key to provider specific tokenQuery partial.
	     * @ignore
	     */
	    parseProviderQueryMap(tokenQuery, pageCursor) {
            /**
	         * Build queries for providers that support TID targeted contracts.
	         * Falls back to any multi-indexer (contract set with '*').
	         */
	        const tidQueryPartialMap = tokenQuery.tid ? this.parseProviderTIDQueryPartialMap(tokenQuery.tid) : null;

	        return this.providerKeySet.reduce((acc, providerKey) => {
	            const paginationQueryPartial = pageCursor ? pageCursor[providerKey] : {};

	            if (tidQueryPartialMap) {
	                if (tidQueryPartialMap[providerKey]) {
	                    // Merge remaining tokenQuery parameters with TID scoped {@link tokenQuery} partial.
	                    acc[providerKey] = Object.assign({}, tokenQuery, tidQueryPartialMap[providerKey], paginationQueryPartial);
	                }
	            } else {
	                // Utilize tokenQuery if no provider query map is provided.
	                acc[providerKey] = Object.assign({}, tokenQuery, paginationQueryPartial);
	            }

	            return acc;
	        }, {});
	    }
	}

	/** @module TokenFetchJS */

	// @TODO document tokenMetadata.provider, document new cursor structure
	var index = {
	    /**
	     * Factory method for constructing {@link TokenFetcher} instances.
	     * @param {Array} tokenProviderSet Set of instantiated token providers to fetch tokens from.
	     * @see {@link TokenFetcher}
	     * @see {@link TokenProvider}
	     */
	    factory: function (tokenProviderSet) {
	        return new TokenFetcher(tokenProviderSet, TokenQueryParser, TokenPaginator);
	    },
	    /**
	     * Dictionary of built-in token providers. Generally, token providers will be blockchain/smart contract indexers.
	     * @property {Object} Tezos Built-in {@link TokenProvider} class set for the Tezos blockchain.
	     * @see {@link TezosProviders}
	     * @see {@link TokenProvider}
	     */
	    providers,
	};

	return index;

}));
//# sourceMappingURL=index.js.map
