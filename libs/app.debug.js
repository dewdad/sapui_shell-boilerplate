Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) if (this[i] > max) max = this[i];
    return max;
};

Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) if (this[i] < min) min = this[i];
    return min;
};

declareName = function(name){
    return name.split('.').reduce(function(holder, name){
        holder[name] = holder[name] || {};
        return holder[name];
    }, window);
};

function setLocationHash(hash){
    hash = hash.replace( /^#/, '' );
    var fx, node = $( '#' + hash );
    if ( node.length ) {
        node.attr( 'id', '' );
        fx = $( '<div></div>' )
            .css({
                position:'absolute',
                visibility:'hidden',
                top: '0px'
            })
            .attr( 'id', hash )
            .appendTo( document.body );
    }
    document.location.hash = hash;

    if ( node.length ) {
        fx.remove();
        node.attr( 'id', hash );
    }
}


isEmpty = function(o) {
    for ( var p in o ) {
        if ( o.hasOwnProperty( p ) ) { return false; }
    }
    return true;
};

isNotEmpty = function(o){
    return !isEmpty(o);
};

function isJsonStr(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function trim (str) {
    var	str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}

/**
 * Setting of object properties/deep-nested properties by path
  */
function setToValue(obj, value, path, delimiter) {
	if(!!!arguments[2]){
		obj = value;
		return obj;
	}

	var parent = obj;
	if(delimiter==undefined || !!!delimiter.length || delimiter.length !== 1) // if delimter is not provided or is invalid
		delimiter = '.';

	path = path.toString().split(delimiter);

	for (var i = 0, pathLen = path.length -1; i < pathLen; i += 1) {
		//console.log(parent);
		if(path[i].length>0){
			if(!!!parent[path[i]]){
				parent[path[i]] = isNonNegativeNumber(path[i+1])?[]:{};
			}
			parent = parent[path[i]];
		}
	}

	parent[path[path.length-1]] = value;
	return obj;
}

/**
 * return a values array for the given object keys
 * @param {Object} obj
 * @param {Array} keys
 * @return {Array}
 */
function getValuesByKeys(obj, keys){
    var values=[];
    for(var i = 0, keysLen = keys.length; i<keysLen; i++){
        var value = obj[keys[i]];
        if(value) values.push(value);
    }
    return values;
}

/**
 * returns object with a key/value pair for each url param
 * @return {Object}
 */
function getUrlVars(url) {
    var vars = {};
    if(!url){
        if(!!window.location.URLVars) return window.location.URLVars;
        url = window.location.href;
        window.location.URLVars = vars;
    }

    var parts = url.replace(/[?&]+([^=&#]+)=([^&#]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getObjProperty(obj, path, delimiter){
	if(!arguments[1])
		return obj;

	var parent = obj;
	if(delimiter==undefined || !!!delimiter.length || delimiter.length !== 1) // if delimter is not provided or is invalid
		delimiter = '.';

    var delimRegx = new RegExp("\\"+delimiter+'{2,}', "gi"); // fix multiple delimiters
    path = path.replace(delimRegx, delimiter);
    path = path.replace(new RegExp("\\"+delimiter+'$'), ''); // fix trailing delimiter

	path = path.split(delimiter);

	for (var i = 0, parts = path.length -1 ; i < parts ; i += 1) {
		if(path[i].length>0){
			//console.log(parent);
			parent = parent[path[i]];
            if(typeof(parent)=='undefined') return undefined;
		}
	}
	return parent[path[path.length-1]];
}
function getFromObjPath(obj, path, delimiter){ return getObjProperty.apply(this, arguments);} //alias for getObjProperty

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for ( var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[12] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1); // bits 6-7 of the
    // clock_seq_hi_and_reserved to 01

    var uuid = s.join("");
    return uuid;
}

function clone(src) {
    function mixin(dest, source, copyFunc) {
        var name, s, i, empty = {};
        for(name in source){
            // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
            // inherited from Object.prototype.   For example, if dest has a custom toString() method,
            // don't overwrite it with the toString() method that source inherited from Object.prototype
            s = source[name];
            if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
                dest[name] = copyFunc ? copyFunc(s) : s;
            }
        }
        return dest;
    }

    if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
        // null, undefined, any non-object, or function
        return src;  // anything
    }
    if(src.nodeType && "cloneNode" in src){
        // DOM Node
        return src.cloneNode(true); // Node
    }
    if(src instanceof Date){
        // Date
        return new Date(src.getTime());  // Date
    }
    if(src instanceof RegExp){
        // RegExp
        return new RegExp(src);   // RegExp
    }
    var r, i, l;
    if(src instanceof Array){
        // array
        r = [];
        for(i = 0, l = src.length; i < l; ++i){
            if(i in src){
                r.push(clone(src[i]));
            }
        }
        // we don't clone functions for performance reasons
        //    }else if(d.isFunction(src)){
        //      // function
        //      r = function(){ return src.apply(this, arguments); };
    }else{
        // generic objects
        r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src, clone);

}

function delFromObjPath(obj, path, delimiter){
	if(!!!arguments[1])
		return false;

	var parent = obj;
	if(delimiter==undefined || !!!delimiter.length || delimiter.length !== 1) // if delimter is not provided or is invalid
		delimiter = '.';

	path = path.split(delimiter);

	for (var i = 0, parts = path.length -1; i < parts; i += 1) {
		if(path[i].length>0){
			//console.log(parent);
			parent = parent[path[i]];
		}
	}
	if(jQuery.isArray(parent)){
		parent.splice(path[path.length-1],1)
	}else{
        try{
		    delete parent[path[path.length-1]];
        }catch(ex){}
    }
	return obj;
}

function diff(template, override) {
	var ret = {};
	for (var name in template) {
		if (name in override) {
			if (_.isObject(override[name]) && !$.isArray(override[name])) {
				var diff = difference(template[name], override[name]);
				if (!_.isEmpty(diff)) {
					ret[name] = diff;
				}
			} else if (!_.isEqual(template[name], override[name])) {
				ret[name] = override[name];
			}
		}
	}
	return ret;
}

function isArray(value){
    return value instanceof Array;
}

/**
 *  Takes extract an array/object by template from the src, will remove
 *  template from source if splice is set to true.
 * @param {Object|Array} src
 * @param {Object|Array} template
 * @param {booleran} splice
 * @return {Object|Array} extracted template from source
 * @dependent Prototype library (_isArray, _isObject)
 */
function extractTemplate(src, template, splice){

    if(!src) return undefined;

	var extraction=$.isArray(template)?[]:{}, tmpval;

	if($.isArray(template)){
		if(!$.isArray(src)) return false;
		for (var i = 0, srcLen = src.length ; i < srcLen ; i++) {
			if(tmpval=extractTemplate(src[i],template[0], splice))
				extraction[i]=tmpval;
		}
	}else{
		for( var key in template )
			if( src.hasOwnProperty(key) ){
				if(_.isObject(template[key]) || $.isArray(template[key])){
					if(_.isObject(src[key]) || $.isArray(template[key]))
						extraction[key] = extractTemplate(src[key], template[key], splice);
				}else{
					extraction[key] = src[key];
                    if(splice){
                        delete src[key];
                    }
				}
			}
	}
	return extraction;
}

function mergeOverwriteDst(dst, src){
	for (var key in src) {
		if(src.hasOwnProperty(key))
			dst[key]=src[key];
	}
}

function updateObj(dst, src){
    for (var key in dst) {
        if(src.hasOwnProperty(key))
            dst[key]=src[key];
    }
}

/**
 * takes a destination object and a source object and updates
 * missing properties from source to destination, good for integrating defaults
 * @param {Object} dst destination object
 * @param {Object} objsource object
 */
mergeDiff = function (dst, obj) {
    if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')

    for(prop in obj){
        if(!dst.hasOwnProperty(prop)){
            dst[prop] = obj[prop];
        }
    }
    return dst;
};

function indexOfKeyValue(array,key,value){
	for (var i = 0; i < array.length; i++) {
		if(_.isEqual(array[i][key], value) )
			return i;
	}
	return -1;
}

function sort (prop, arr) {
    prop = prop.split('.');
    var len = prop.length;

    arr.sort(function (a, b) {
        var i = 0;
        while( i < len ) { a = a[prop[i]]; b = b[prop[i]]; i++; }
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    });
    return arr;
}

/**
 *
 * @param obj array or object to be queried for key value pair
 * @param key
 * @param value
 * @param index a reference passed in that will be set to -1 if the pair is not found or the obj is not indexable, or the index otherwise
 * @return {item: object, index: int}|null
 */
function findByKey(obj, key, value){
    if(!key || _.isEqual(typeof(obj[key])==='function' ? obj[key].call(obj) : obj[key], value )) {
        return {item: obj, index:null};
    }
    if(!!obj.length){
        return  arrayFindByKey(obj,key,value);
    }
    return null;
}


function arrayFindByKey(array,key,value){
    if(!array || !array.length) return undefined;
	for (var i = 0, arrLen = array.length; i < arrLen; i++) {
       var item = array[i][key];
		if(_.isEqual(typeof(item)==='function' ? item.call(array[i]) : item, value ) ){
			return {item: array[i], index: i};
        }
	}
	return {item: undefined, index: undefined};
}
function ArrayItemByKey (array,key,value,index){ return arrayFindByKey.apply(this, arguments);}

/**
 * arrayFindByPath allows you to search on an array using complex property paths e.g "size.height.getHeightByPixel"
 * @param array array to search on
 * @param {string} path
 * @param {*} value
 * @param {boolean} index whether to return an index or value
 * @param {string} [delimiter = '.']
 * @return {int|*} if index argument is set then the method will return the index of the found element, otherwise the element itself
 */
function arrayFindByPath(array,path,value, index, delimiter){
    for (var i = 0, arrLen = array.length; i < arrLen; i++) {
        var item = getObjProperty(array[i], path, delimiter);
        if(_.isEqual(typeof(item)==='function' ? item.call(array[i]) : item, value ) )
            return !!index? i: array[i];
    }
    return null;
}

function isNumeric(test){
	return jQuery.isNumeric(test);
}

// TODO: what is the purpose of this function?, it is hardcoded with dataList, assumeably from SOP model configuration
function arrayFindByKeySet(array, keys, record ){
    if ((array=== null) || (array == undefined)) {
        return false;
    }
    if ((keys=== null) || (keys == undefined)) {
        return false;
    }
    if ((record=== null) || (record == undefined)) {
        return false;
    }

    for (var i = 0, arrLen = array.length; i < arrLen; i++) {
        var curRowInArray=array[i];
        var isFound = false;

        for (var j= 0, keyNum = keys.length; j< keyNum; j++){
            var path = "dataList." + keys[j];
            var itemInCurRow = getObjProperty(curRowInArray, path );
            var itemInRecord = getObjProperty(record, path );

            if  (_.isEqual(itemInRecord,itemInCurRow) ){
                isFound = true;
                continue;
            } else {
                isFound = false;
                break;
            }
        }
        if (!isFound){
            continue;
        } else {
            return curRowInArray;
        }
    }
    return null;
}


function isNonNegativeNumber(test){
	return isNumeric(test) && test>-1;
}

var validate={

    /**
     * first argument can be notifier a function taking a string message, the rest
     * should be in form of {value: val|[val1, val2], validator: handler}
     * @return {*}
     */
//    validationError: function(){
//        for(var i=0; arguments.length>i; i++){
//            var validation = arguments[i];
//            if(!isArray(validation.value)) validation.value = [validation.value];
//            var isValid = validation.validator.apply(null, validation.value);
//            if(!isValid){
//                return (!!validation.message && validatione.message) || true;
//            }
//        }
//        return false;
//    },
    /**
     *  Validates that a string contains only valid integer number.
     * @param strValue String to be tested for validity
     * @returns true if valid, otherwise false.
     */
    isInt: function( strValue ) {
        var objRegExp  = /(^-?\d\d*$)/;
        return objRegExp.test(strValue);
    },

    isNum: function(v) {
        var objRegExp  =  /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;
        return objRegExp.test(v);
    },

    /**
     *  Validates that a string contains only valid integer number.
     * @param v String to be tested for validity
     * @returns true if valid, otherwise false.
     */
    isPosInt: function(v) {
        var objRegExp  = /(^[1-9]\d*$)/;
        return objRegExp.test(v);
    },
    isNNInt: function(v) {
        var objRegExp  = /(^[0-9]\d*$)/;
        return objRegExp.test(v);
    },

    min: function(v, p_min){
        return v.hasOwnProperty('length') && !validateNum(v)? v.length: v >= p_min ;
    },

    max: function(v, p_max){
        return v.hasOwnProperty('length') && !validateNum(v)? v.length: v <= p_max ;
    }
};

/**
 *
 * @param pValue
 * @param pArray
 * @return {boolean}  true if elment is found in the array false otherwise
 */
function inArray(pValue, pArray){
    if(pArray)
	    return (jQuery.inArray(pValue, pArray)>=0)
}

function isDefined(v){
	return v !== null && v !== undefined;
}

function isSet(v){
    return !!v || v===0;
}

/**
 * Take string input in varName and determine whether it is defined object in Javascript
 * @param {String} varName
 * @return {boolean}
 */

function isDefinedName(varName) {

	var retStatus = false;

	if (typeof varName == "string") {
		try {
			var arrCheck = varName.split(".");
			var strCheckName = "";
			
			for (var i= 0, arrLen = arrCheck.length ; i < arrLen; i++){
				strCheckName = strCheckName + arrCheck[i];
				
				//check wether this exist
				if (typeof eval(strCheckName) == "undefined") {
					//stop processing
					retStatus = false;
					break;
				} else {
					//continue checking next node
					retStatus = true;
					strCheckName = strCheckName + ".";
				}
			}
		} catch (e) {
			//any error means this var is not defined
			retStatus = false;
		}
	} else {
		throw "the varName input must be a string like myVar.someNode.anotherNode[]";
	}

	return retStatus;
}

function renameObjProperty(obj, oldName, newName){
    if (obj.hasOwnProperty(oldName)) {
        obj[newName] = obj[oldName];
        delete obj[oldName];
    }
    return obj;
}

Function.prototype.defaultTo = function() {
  var fn = this, defaults = arguments;
  return function() {
    var args = arguments,
      len = arguments.length,
      newArgs = [].slice.call(defaults, 0),
      overrideAll = args[len - 1] === undefined;
    for(var i = 0; i < len; i++) {
      if(overrideAll || args[i] !== undefined) {
        newArgs[i] = args[i];
      }
    }
    return fn.apply(this, newArgs);
  };
};

function DateInXDays(aDate, xDays){
    newDate = new Date(aDate);
    newDate.setDate(newDate.getDate()+xDays);
    return newDate;
}

var DateFunctions={
	date2yyyy_mm_dd_hh_mm_ss:function (jsDate) {
		var	tDate = jsDate || new Date(), 	year = "" + tDate.getFullYear(), month, day, hour, minute, second;

		month = "" + (tDate.getMonth() + 1); if (month.length == 1) { month = "0" + month; }

		day = "" + tDate.getDate(); if (day.length == 1) { day = "0" + day; }

		hour = "" + tDate.getHours(); if (hour.length == 1) { hour = "0" + hour; }

		minute = "" + tDate.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }

		second = "" + tDate.getSeconds(); if (second.length == 1) { second = "0" + second; }

		return year + "-" + month + "-" + day + " " + hour + "-" + minute + "-" + second;
	},
	yyyy_mm_dd2Date: function(yyyymmdd){
		var YYYY = yyyymmdd.substring(0, 4);
		var MM = yyyymmdd.substring(4, 6);
		var DD = yyyymmdd.substring(6);
		return new Date(parseInt(YYYY, 10), parseInt(MM, 10) - 1, parseInt(DD, 10));
	},
	DateDiff: {
        inDays: function(d1, d2) {
            var mD1 = new Date(d1);
            var mD2 = new Date(d2);
            mD1.setHours(0,0,0,0);
            mD2.setHours(0,0,0,0);

            return  Math.ceil((mD2 - mD1) / 86400000) + 1;
        },

		inWeeks: function(d1, d2) {
				var t2 = d2.getTime();
				var t1 = d1.getTime();

				return parseInt((t2-t1)/(24*3600*1000*7), 10);
		},

		inMonths: function(d1, d2) {
				var d1Y = d1.getFullYear();
				var d2Y = d2.getFullYear();
				var d1M = d1.getMonth();
				var d2M = d2.getMonth();

				return (d2M+12*d2Y)-(d1M+12*d1Y);
		},

		inYears: function(d1, d2) {
				return d2.getFullYear()-d1.getFullYear();
		}
	}
};

//***************** Polyfills *******************//

if (!Object.keys) {
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')

            var result = [];

            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) result.push(prop)
            }

            if (hasDontEnumBug) {
                for (var i=0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])
                }
            }
            return result
        }
    })()
}

if (!Array.prototype.reduce)
{
    Array.prototype.reduce = function(fun /*, initial*/)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var i = 0;
        if (arguments.length >= 2)
        {
            var rv = arguments[1];
        }
        else
        {
            do
            {
                if (i in this)
                {
                    rv = this[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= len)
                    throw new TypeError();
            }
            while (true);
        }

        for (; i < len; i++)
        {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}


//************************** Type definitions ******************************//
// definition of validation error
function ValidationError(message){
    this.message = message;
};
if(!!getUrlVars().mock && getUrlVars().mock == 'true'){ // hook mock resource if mock flag is set
    jQuery.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        if(!!originalOptions.noFilter) return;
        var mockStrict = getUrlVars().mockStrict == 'true';
        options.timeout = originalOptions.timeout = 400;

        var originalURL = originalOptions.url;
        var serviceResource = null;
        if(!!originalURL.match("sap/sop/services")){
            serviceResource = originalURL.substring(originalURL.lastIndexOf('/')+1).split('.')[0];
        }
        else if(!!originalURL.match("objName=")){
            var isSopServerService = true;
            serviceResource = getUrlVars(originalURL).objName;
        }

        if(!!serviceResource){
            var requestId = getUrlVars(originalURL).id;
            // Add POST prefix on POST requests
            if(!!isSopServerService && originalOptions.type ==='POST' && !!requestId){
                    serviceResource = 'POST_'+serviceResource+'_'+requestId;
                    var isPOST;
            }

            options.url = '/sap/sop/ui/mocks/'+serviceResource+'.json';
            options.type = 'GET';
            options.error = function(xhr, status, error){
                originalOptions.noFilter = true;
                jQuery.ajax(originalOptions);
            };

            if(!!requestId && !mockStrict){
                options.success = function(data){
                    var result = findByKey(data,'id', requestId).item;
                    if(!!result){
                        originalOptions.success.call(originalOptions.context, result);
                    } else{
                        originalOptions.noFilter = true;
                        jQuery.ajax(originalOptions);
                    }
                }
            }
        }
    });
};
/**
 * This file serves as a repository for SAPUI5 workarouds
 * specifically those pending fixes from the core team.
 * These workarounds should be detachable (remove to refactor). In cases where
 * they are not please mention refactoring effort
 * Please include the version for which a workaround was introduced and the
 * id of the bug that was filed
 */

/**
 * @problem: not robust in common binding scenarios
 * @version 1.4
 * @csn: this is schduled to be fixed in 1.5
 */
//(function () {
//    jQuery.sap.require("sap.ui.model.json.JSONModel");
//
//    var fnOld = sap.ui.model.json.JSONModel.prototype.setProperty;
//    sap.ui.model.json.JSONModel.prototype.setProperty = function () {
//        try {
//            fnOld.apply(this, arguments);
//        } catch (ex) {
//        }
//    };
//})();

/**
 * @problem:
 *  multiSelector.attachClosed(function(){
 *      try{multiSelector.destroyContent();} catch(e){}
 *      try{multiSelector.destroyButtons();} catch(e){}
 *      try{multiSelector.destroy();} catch(e){}
 * });
 * After the following code execution an uncaught exception was thrown:
 * Uncaught Error: "nullpx" is of type string, expected sap.ui.core.CSSSize for property "contentSize" of Element sap.ui.core.ScrollBar#__table7-hsb
 * sap-ui-core.js:18791
 * @version 1.4.1
 * @csn:
 */
//(function () {
//    jQuery.sap.require("sap.ui.core.ScrollBar");
//
//    var fnOld = sap.ui.core.ScrollBar.prototype.setContentSize;
//    sap.ui.core.ScrollBar.prototype.setContentSize = function () {
//        try {
//            fnOld.apply(this, arguments);
//        } catch (ex) {
//            sui.log.warning(ex);
//        }
//    };
//})();

/**
 * @problem:  ThingInspector does not call close event handlers on call TI.close(). However on built-in close button,
 * The handlers will be called prior to running the below method
 * @version 1.4.1
 * @csn:
 */
(function () {
    jQuery.sap.require('sap.ui.ux3.Overlay');

    var fnOld = sap.ui.ux3.Overlay.prototype.close;
    sap.ui.ux3.Overlay.prototype.close = function () {
        this.fireClose();
        try {
            fnOld.apply(this, arguments);
        } catch (ex) {
            sui.log.warning(ex);
        }
    };
})();

/**
 * @problem:  ComboBox and DropdownBox are limited to 100 items
 * @version 1.4.1
 * @csn: fixed in 1.5 (setSizeLimit)
 */
//(function () {
//    jQuery.sap.require('sap.ui.commons.ComboBox');
//
//    var fnOld = sap.ui.commons.ComboBox.prototype.updateAggregation;
//    sap.ui.commons.ComboBox.prototype.updateAggregation = function (sName, iStart, iLength) {
//        if ( sName === 'items' ) {
//            var oBindingInfo = this.mBindingInfos[sName];
//            var oBinding = oBindingInfo.binding;
//            iLength = iLength || (oBinding && oBinding.iLength);
//        }
//        fnOld.call(this, sName, iStart, iLength);
//    };
//})();

/**
 * @problem:  MatrixLayout with a label and dropdown row with a tooltip inside a ToolPopup throws error on hover:
  *  Uncaught TypeError: Cannot read property 'sTypedChars' of undefined ../../../../phoenix/resources/sap/ui/commons/library-preload.json/sap.ui.commons.DropdownBox:667
 * @version 1.8
 * @csn: https://community.wdf.sap.corp/sbs/message/342780#342780
 */
jQuery.sap.require("sap.ui.commons.DropdownBox");

(function() {
    var old = sap.ui.commons.DropdownBox.prototype.applyFocusInfo;
    sap.ui.commons.DropdownBox.prototype.applyFocusInfo = function(oFocusInfo) {
        if ( oFocusInfo ) {
            old.apply(this,arguments);
        }
        return this;
    };
}());

/**
 * @problem:  Upon changing binding context for a ComboBox or its extensions, the control fails to update form the new
 * model context and instead overwrites the model values with its former values
 * @version 1.8
 * @csn: //TODO: Report the bug
 */
(function () {
    jQuery.sap.require('sap.ui.commons.ComboBox');

    var fnOld = sap.ui.commons.ComboBox.prototype.updateBindingContext;
    sap.ui.commons.ComboBox.prototype.updateBindingContext = function () {
        var keyBindContext = this.getBindingPath('selectedKey');
        var  valueBindContext = this.getBindingPath('value');
        var restoreContexts = keyBindContext !== undefined && valueBindContext !== undefined;

        if(restoreContexts)
            this.unbindProperty('selectedKey').unbindProperty('value');

        var toRet =  fnOld.apply(this,arguments);

        if(restoreContexts)
            this.bindProperty('selectedKey', keyBindContext).bindProperty('value', valueBindContext);

        return toRet;
    };

    var fnOld2 = sap.ui.commons.ComboBox.prototype.updateBindings;
    sap.ui.commons.ComboBox.prototype.updateBindings = function () {
        var keyBindContext = this.getBindingPath('selectedKey');
        var  valueBindContext = this.getBindingPath('value');
        var restoreContexts = keyBindContext !== undefined && valueBindContext !== undefined;

        if(restoreContexts)
            this.unbindProperty('selectedKey').unbindProperty('value');

        var toRet =  fnOld2.apply(this,arguments);

        if(restoreContexts)
            this.bindProperty('selectedKey', keyBindContext).bindProperty('value', valueBindContext);

        return toRet;
    };

})();

// *********************************************** This section is for Hacks/Improvements? *********************************************//;
$.sap.require('sap.ui.commons.TextViewDesign');
$.sap.require('sap.ui.core.BusyIndicator');
$.sap.require('sap.ui.commons.MessageBox');
$.sap.require('sap.ui.model.FilterOperator');


sui = {
    log: jQuery.sap.log,

    setViewResource: function(sViewResource){
        this._viewResource = sViewResource;
    },
    getViewResource: function(){
      return this._viewResource;
    },
    /**
     *
     * @param oView supports the sap.ui.view API completely, and adds support of singleton pattern by passing domId, and shortHand
     * </br>such as sui.view("path.to.viewResource"), which will create the view with the ID, the type defaults to JSview.
     * @param viewData pass an object to the view's updateView method, which does something and returns the view itself
     * @return {sap.ui.view}
     */
    view: function(oView, viewData){
        var viewObj= oView || {};
        var strArg = false;
        if(typeof(oView) == 'string'){
            viewObj = {};
            viewObj.viewName = oView;
            strArg = true;
        }

        viewObj.type = oView.type || sap.ui.core.mvc.ViewType.JS;

        var vResource = sui.getViewResource();
        if(!!vResource && !!viewObj.viewName && viewObj.viewName.search('^'+vResource)<0){
            viewObj.viewName = vResource+'.'+viewObj.viewName;
        }

        if(strArg){
            viewObj.id = viewObj.viewName.replace(/\./g,'_');
        }

        if(!!viewObj.id){
            var oElement = sap.ui.getCore().getElementById(viewObj.id);
            if(!!oElement){
                return (oElement.updateView && oElement.updateView(viewData)) || oElement;
            }
        }
        var oView = sap.ui.view(viewObj);
        return (oView.updateView && oView.updateView(viewData)) || oView;
    },
    BusyHide: function() {
        try{
            window.busyIndicatorShow.pop();
        }catch(e){}
        //sap.ui.core.BusyIndicator.hide();

            $('#ajaxLoaderOverlay').hide();
    },
    BusyShow: function(iDuration, iDelay) {
        //sap.ui.core.BusyIndicator.show(iDelay);
        if(!window.busyIndicatorShow){
            window.busyIndicatorShow = [];
        }
        window.busyIndicatorShow.push(1);
       var iDelay = /(^-?\d\d*$)/.test(iDelay)? iDelay : 330;
        window.setTimeout(function(){
            if(!!window.busyIndicatorShow[0])
                $('#ajaxLoaderOverlay').show();
        }, iDelay);

        if (!!iDuration) {
            window.setTimeout(sui.BusyHide, iDuration);
        }
    },
    Int:function (oFormatOptions, oConstraints) {
        return new sap.ui.model.type.Integer(oFormatOptions, oConstraints);
    },
    DatePicker: function (sId, mSettings) {
        return new sap.ui.commons.DatePicker(sId, $.extend({isReadOnly:true }, mSettings));
    },
    Date:function (oFormatOptions, oConstraints) {
        return new sap.ui.model.type.Date(oFormatOptions, oConstraints);
    },
    DateTime:function (oFormatOptions, oConstraints) {
        return new sap.ui.model.type.DateTime(oFormatOptions, oConstraints);
    },
    FormatDateObj:function(dateobj, oFormatOptions, oLocale) {
        var oDate = SopDate2Date(dateobj), oDateObj = getUIDateInstance(
            oFormatOptions || {
                //pattern : "MM.dd.yyyy",
                style : 'short'
            }, oLocale);
        return oDateObj.format(oDate);
    },
    Tooltip:function (sId, mSettings) {
        return new sap.ui.commons.RichTooltip(sId, mSettings);
    },
    Callout:function (sId, mSettings) {
        return new sap.ui.commons.Callout(sId, mSettings);
    },
    /*
		 * ToolPop was written according to bug fix (CSN number 1927899)
		 * IF SAPUI5 WILL BE UPGRADED TO VERSION 1.51 AND ABOVE THE IMPLEMENTATION CAN BE DELETED
		 * AND ONLY new sap.ui.ux3.ToolPopup (sId, mSettings) WILL BE RETURNED
		 * */
    ToolPopup:function(sId, mSettings) {
    	if (mSettings.modal == true)
    	{
    		var toolPop = new sap.ui.ux3.ToolPopup (sId, mSettings);
    		toolPop._ensurePopup();
			toolPop.oPopup._bModal = true;
    	}
    	return toolPop;
    },
    HLayout:function (sId, mSettings) {
        return new sap.ui.commons.layout.HorizontalLayout(sId, mSettings);
    },
    VLayout:function (sId, mSettings) {
        return new sap.ui.commons.layout.VerticalLayout(sId, mSettings);
    },
    RowRepeater: function(sId, mSettings){
      return new sap.ui.commons.RowRepeater(sId, mSettings);
    },
    /**
     * Constructor for a new layout/MatrixLayout.
     *
     * Accepts an object literal <code>mSettings</code> that defines initial
     * property values, aggregated and associated objects as well as event handlers.
     *
     * If the name of a setting is ambiguous (e.g. a property has the same name as an event),
     * then the framework assumes property, aggregation, association, event in that order.
     * To override this automatic resolution, one of the prefixes "aggregation:", "association:"
     * or "event:" can be added to the name of the setting (such a prefixed name must be
     * enclosed in single or double quotes).
     *
     * The supported settings are:
     * <ul>
     * <li>Properties
     * <ul>
     * <li>{@link #getVisible visible} : boolean (default: true)</li>
     * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
     * <li>{@link #getHeight height} : sap.ui.core.CSSSize</li>
     * <li>{@link #getLayoutFixed layoutFixed} : boolean (default: true)</li>
     * <li>{@link #getColumns columns} : int</li>
     * <li>{@link #getWidths widths} : sap.ui.core.CSSSize[]</li></ul>
     * </li>
     * <li>Aggregations
     * <ul>
     * <li>{@link #getRows rows} : sap.ui.commons.layout.MatrixLayoutRow[]</li></ul>
     * </li>
     * <li>Associations
     * <ul></ul>
     * </li>
     * <li>Events
     * <ul></ul>
     * </li>
     * </ul>

     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     *
     * <p>
     * A matrix layout arranges controls in a grid structure, using rows which
     * need not have the same number of cells.
     * </p>
     *
     * <p>
     * It uses predefined cell classes that guarantee appropriate distances
     * between cells in the grid. The cell's <code>vGutter</code> property lets
     * you specify additional horizontal distances easily. You can set these
     * additional distances (known as gutters) with or without separators.
     * The distance for each cell is specified by assigning a specific
     * enumeration value of the class <code>LayoutCellSeparator</code> of the
     * matrix data object.
     * </p>
     *
     * <p>
     * You should <b>avoid nesting</b> matrix layouts. You should only use a
     * matrix layout if you need to align controls horizontally across rows.
     * </p>
     *
     * @extends sap.ui.core.Control
     *
     * @author d029921
     * @version 1.4.1
     *
     * @constructor
     * @public
     * @name sui.MatrixLayout
     */
    MatrixLayout:function (sId, mSettings) {
        return new sap.ui.commons.layout.MatrixLayout(sId, mSettings);
    },
    MLRow:function (sId, mSettings) {
        return new sap.ui.commons.layout.MatrixLayoutRow(sId, mSettings);
    },
    MLCell:function (sId, mSettings) {
        var cell =new sap.ui.commons.layout.MatrixLayoutCell(sId, mSettings);
        cell.ctorSettings = $.extend({}, mSettings);
        return cell;
    },
    /**
     * All arguments passed that are not cell will be wrapped in a Cell element and added to the returned
     * array, cells will be added directly. The first argument may contain a cell settings object which will be
     * applied to all the cells in the returned array. MLCells passed in must use sui.MLCell as the instantiator/ctor.
     * If cells are applied they
     * @return {sap.ui.commons.layout.MatrixLayoutCell[]}
     * @constructor
     */
    MakeMLCells: function(){
        var cells = arguments;
        if(!arguments[0].getModel){ // not a SAPUI element
            var cellSettings = arguments[0];
            cells = Array.prototype.slice.call(arguments, 1); // arguments is not of type Array
        }
        return $.map(cells, function(o){
            var cell = !!o.getColSpan? o: sui.MLCell({content:[o]});
            if(cell.hasOwnProperty('ctorSettings') && !!cellSettings){
                cell.applySettings(
                    !!cell.ctorSettings? // were original cell settings defined
                        $.extend(cellSettings, cell.ctorSettings): // override with explicit settings
                        cellSettings // otherwise, apply the general settings
                );
            }
            return cell;
        });
    },
    /**
     * @field Begin
     * @field Center
     * @field End
     * @field Left
     * @field Right
     *
     */
    HAlign:sap.ui.commons.layout.HAlign,
    VAlign:sap.ui.commons.layout.VAlign,
    Padding: sap.ui.commons.layout.Padding,
    TxtDesign:sap.ui.commons.TextViewDesign,
    BusyUI: sap.ui.core.BusyIndicator,
    Image: function (sId, mSettings) {
        return new sap.ui.commons.Image(sId, mSettings);
    },
    HDivider:function (sId, mSettings) {
        return new sap.ui.commons.HorizontalDivider(sId, mSettings);
    },
    TxtArea:function (sId, mSettings) {
        return new sap.ui.commons.TextArea(sId, mSettings);
    },
    TxtFld:function (sId, mSettings) {
        return new sap.uiext.commons.TextField(sId, mSettings);
    },
    /**
     * Constructor for a new ValHelpFld.
     *
     * Accepts an object literal <code>mSettings</code> that defines initial
     * property values, aggregated and associated objects as well as event handlers.
     *
     * If the name of a setting is ambiguous (e.g. a property has the same name as an event),
     * then the framework assumes property, aggregation, association, event in that order.
     * To override this automatic resolution, one of the prefixes "aggregation:", "association:"
     * or "event:" can be added to the name of the setting (such a prefixed name must be
     * enclosed in single or double quotes).
     *
     * The supported settings are:
     * <ul>
     * <li>Properties
     * <ul>
     * <li>{@link #getIconURL iconURL} : sap.ui.core.URI</li>
     * <li>{@link #getIconHoverURL iconHoverURL} : sap.ui.core.URI</li>
     * <li>{@link #getIconDisabledURL iconDisabledURL} : sap.ui.core.URI</li></ul>
     * </li>
     * <li>Aggregations
     * <ul></ul>
     * </li>
     * <li>Associations
     * <ul></ul>
     * </li>
     * <li>Events
     * <ul>
     * <li>{@link sap.ui.commons.ValueHelpField#event:valueHelpRequest valueHelpRequest} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
     * </li>
     * </ul>
     *
     *
     * In addition, all settings applicable to the base type {@link sap.ui.commons.TextField#constructor sap.ui.commons.TextField}
     * can be used as well.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * A TextField with an attached icon which triggeres an event.
     * @extends sap.ui.commons.TextField
     *
     * @author SAP AG
     * @version 1.4.1
     *
     * @constructor
     * @public
     * @name sui.ValueHelpField
     */
    ValHelpFld:function (sId, mSettings) {
        return new sap.ui.commons.ValueHelpField(sId, mSettings);
    },
    ValHelpLimit: function(sId, mSettings) {
        var oTxtFld, oBtn;
        var hLayout =  new sap.ui.commons.layout.HorizontalLayout(sId+'-ValHelpLimit', {content: [
            oTxtFld = sui.TxtFld(sId),
            oBtn = sui.Btn(sId+'-ValHelpBtn', {lite: true, icon:sui.getIconPath('sap.ui.commons.ValueHelpField:sapUiValueHelpIconRegularUrl')})
        ]});
        hLayout.oTxtFld = oTxtFld;
        hLayout.Btn = oBtn;
        oTxtFld.applySettings(mSettings);
        //oBtn.applySettings(mSettings);
        hLayout.setValue = function(oValue){oTxtFld.setValue(oValue); return hLayout;};
        hLayout.getValue = function(){oTxtFld.getValue(); return hLayout;};
        hLayout.setEditable = function(bool){oTxtFld.setEditable(bool); return hLayout;};
        hLayout.getEditable = function(){oTxtFld.getEditable(); return hLayout;};
        hLayout.valueHelpRequest = function(oData, fnFunction, oListener){oBtn.attachPress(oData || oTxtFld, fnFunction, oListener || hLayout); return hLayout;};
        hLayout.getValueState = function(){return oTxtFld.getValueSate()};
        hLayout.attachChange = function( ){return sap.uiext.commons.TextField.prototype.attachChange.apply(oTxtFld, arguments)};
        if(!!mSettings.valueHelpRequest) oBtn.attachPress(oTxtFld, mSettings.valueHelpRequest, hLayout);
        oTxtFld.setEditable(false);
        return hLayout;
    },
    TxtView:function (sId, mSettings) {
        return new sap.ui.commons.TextView(sId, mSettings);
    },
    Link:function (sId, mSettings) {
        return new sap.ui.commons.Link(sId, mSettings);
    },
    DataTable:function (sId, mSettings) {
        var settingsIndex = typeof(sId)=='object'? 0: 1; // settings index, need to find settings object in the arugments for the c'tor
        mergeDiff(arguments[settingsIndex], {
            showNoData: false,
            dynamicHeight:!arguments[settingsIndex].visibleRowCount && !arguments[settingsIndex].height
        });
        if(!arguments[settingsIndex].visibleRowCount) arguments[settingsIndex].visibleRowCount = 0;
        return new sap.uiext.table.DataTable(sId, mSettings);
    },
    Table:  function(sId, mSettings) {
        // set other defaults for Ctor settings, in this case we want
        // to hide the "no data" overlay from table
        var settings = typeof(sId) == 'object'? sId: mSettings;
        mergeDiff(settings, {showNoData: false});
        return new sap.ui.table.Table(sId, mSettings);
    },
    /**
     * Options in the form of: {keyBind, textBind, listBind:{key, text, listPath},
     * valueBind:{key,text}}
     */
    Combo:function(sId, mSettings){
        var noId = false, configObj;
        if(typeof(sId)=='object'){
            noId = true;
            mSettings = sId;
        }

        var comboSettings = sui.comboBind(mSettings);
        configObj = $.extend(comboSettings, mSettings);

        var mCombo = new sap.uiext.commons.ComboBox(
            noId? configObj:sId,
            noId? undefined: configObj
        );
        return mCombo;
    },
    /**
     * Options in the form of: {keyBind, textBind, listBind:{key, text, path},
     * valueBind:{key,text}}
     */
    DropDown: function (sId, mSettings) {
        var noId = false, configObj;
        if(typeof(sId)=='object'){
            noId = true;
            mSettings = sId;
        }

        var comboSettings = sui.comboBind(mSettings);
        configObj = $.extend({maxHistoryItems : 0}, comboSettings, mSettings);

        var mDropDown = new sap.uiext.commons.DropdownBox(
            noId? configObj:sId,
            noId? undefined: configObj
        );
        return mDropDown;
    },
    comboBind: function(mSettings){
        var extSettings, extPropsTemplate = {valueBind:'', listBind:'', key:'', text:'', listPath:''};

        extSettings = extractTemplate(mSettings, extPropsTemplate, true);

        if(!isEmpty(extSettings)){
            var ListItem, comboSettings,
                valueBind = extSettings.valueBind || {
                    key : extSettings.key || '',
                    text : extSettings.text
                },
                listBind = extSettings.listBind || {
                    key : extSettings.key || '{}',
                    text : extSettings.text
                };

            // make text definition optional and default to key
            //valueBind.text = valueBind.text || valueBind.key;
            listBind.text =  listBind.text || listBind.key;

            ListItem = new sap.ui.core.ListItem({
                text : listBind.text,
                key : listBind.key,
                additionalText:listBind.additionalText || ''
            });

            comboSettings = {
                items : {
                    path : extSettings.listPath || listBind.listPath || listBind.path || '{}',
                    template : ListItem,
                    filters: listBind.filters || null
                },
                value : valueBind.text || '',
                selectedKey : valueBind.key || ''
            };

            return comboSettings;
        }

        return mSettings;
    },
    /**
     * usage: sui.ListItems( {mSettings:{text:'Open'}}, {mSettings:{text:'Close'}} )
     */
    ListItems: function(){
            return $.map(arguments, function(i){
                return new sap.ui.core.ListItem (i.sId, i.mSettings);
            });
    },

    /**
     * Constructor for a new Button.
     *
     * Accepts an object literal <code>mSettings</code> that defines initial
     * property values, aggregated and associated objects as well as event handlers.
     *
     * If the name of a setting is ambiguous (e.g. a property has the same name as an event),
     * then the framework assumes property, aggregation, association, event in that order.
     * To override this automatic resolution, one of the prefixes "aggregation:", "association:"
     * or "event:" can be added to the name of the setting (such a prefixed name must be
     * enclosed in single or double quotes).
     *
     * The supported settings are:
     * <ul>
     * <li>Properties
     * <ul>
     * <li>{@link #getText text} : string (default: '')</li>
     * <li>{@link #getEnabled enabled} : boolean (default: true)</li>
     * <li>{@link #getVisible visible} : boolean (default: true)</li>
     * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
     * <li>{@link #getHelpId helpId} : string (default: '')</li>
     * <li>{@link #getIcon icon} : sap.ui.core.URI (default: '')</li>
     * <li>{@link #getIconFirst iconFirst} : boolean (default: true)</li>
     * <li>{@link #getHeight height} : sap.ui.core.CSSSize</li>
     * <li>{@link #getStyled styled} : boolean (default: true)</li>
     * <li>{@link #getLite lite} : boolean (default: false)</li>
     * <li>{@link #getStyle style} : sap.ui.commons.ButtonStyle (default: sap.ui.commons.ButtonStyle.Default)</li></ul>
     * </li>
     * <li>Aggregations
     * <ul></ul>
     * </li>
     * <li>Associations
     * <ul></ul>
     * </li>
     * <li>Events
     * <ul>
     * <li>{@link sap.ui.commons.Button#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
     * </li>
     * </ul>

     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Enables users to trigger actions such as save or print. For the button UI, you can define some text or an icon, or both.
     *
     * @extends sap.ui.core.Control
     *
     * @author SAP AG
     * @version 1.4.1
     *
     * @constructor
     * @public
     * @name sui.Btn
     */
    Btn:function (sId, mSettings) {
        return new sap.ui.commons.Button(sId, mSettings);
    },
    TriStateCheckBox: function(sId, mSettings){
        return new sap.ui.commons.TriStateCheckBox (sId, mSettings);
    },
    /**
     * Constructor for a new CheckBox.
     *
     * Accepts an object literal <code>mSettings</code> that defines initial
     * property values, aggregated and associated objects as well as event handlers.
     *
     * If the name of a setting is ambiguous (e.g. a property has the same name as an event),
     * then the framework assumes property, aggregation, association, event in that order.
     * To override this automatic resolution, one of the prefixes "aggregation:", "association:"
     * or "event:" can be added to the name of the setting (such a prefixed name must be
     * enclosed in single or double quotes).
     *
     * The supported settings are:
     * <ul>
     * <li>Properties
     * <ul>
     * <li>{@link #getChecked checked} : boolean (default: false)</li>
     * <li>{@link #getText text} : string</li>
     * <li>{@link #getVisible visible} : boolean (default: true)</li>
     * <li>{@link #getEnabled enabled} : boolean (default: true)</li>
     * <li>{@link #getEditable editable} : boolean (default: true)</li>
     * <li>{@link #getValueState valueState} : sap.ui.core.ValueState (default: sap.ui.core.ValueState.None)</li>
     * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
     * <li>{@link #getTextDirection textDirection} : sap.ui.core.TextDirection (default: sap.ui.core.TextDirection.Inherit)</li>
     * <li>{@link #getName name} : string</li></ul>
     * </li>
     * <li>Aggregations
     * <ul></ul>
     * </li>
     * <li>Associations
     * <ul></ul>
     * </li>
     * <li>Events
     * <ul>
     * <li>{@link sap.ui.commons.CheckBox#event:change change} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
     * </li>
     * </ul>

     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     *
     * Provides a box which can be flagged, the box has a label. A check box can either stand alone, or in a group with other check boxes. As an option, the boxes can initially be set to status 'Not Editable'.
     * @extends sap.ui.core.Control
     *
     * @author SAP AG
     * @version 1.4.1
     *
     * @constructor
     * @public
     */
    CheckBox:function (sId, mSettings) {
        return new sap.ui.commons.CheckBox(sId, mSettings);
    },
    /**
     * 
     * @param sId
     * @param mSettings
     * @returns {sap.ui.commons.RadioButton}
     */
    RadioButton:function (sId, mSettings) {
    	return new sap.ui.commons.RadioButton (sId, mSettings); 
    },
    /**
     * 
     * @param sId
     * @param mSettings
     * @returns {sap.ui.commons.RadioButtonGroup}
     */
    RadioButtonGroup:function (sId, mSettings) {
    	return new sap.ui.commons.RadioButtonGroup (sId, mSettings); 
    },
    Lbl:function (sId, mSettings) {
        return new sap.ui.commons.Label(sId, mSettings);
    },
    /**
     * Constructor for a new Column.
     *
     * Accepts an object literal <code>mSettings</code> that defines initial
     * property values, aggregated and associated objects as well as event handlers.
     *
     * If the name of a setting is ambiguous (e.g. a property has the same name as an event),
     * then the framework assumes property, aggregation, association, event in that order.
     * To override this automatic resolution, one of the prefixes "aggregation:", "association:"
     * or "event:" can be added to the name of the setting (such a prefixed name must be
     * enclosed in single or double quotes).
     *
     * The supported settings are:
     * <ul>
     * <li>Properties
     * <ul>
     * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
     * <li>{@link #getFlexible flexible} : boolean</li>
     * <li>{@link #getResizable resizable} : boolean (default: true)</li>
     * <li>{@link #getHAlign hAlign} : sap.ui.commons.layout.HAlign (default: sap.ui.commons.layout.HAlign.Begin)</li>
     * <li>{@link #getSortProperty sortProperty} : string</li>
     * <li>{@link #getFilterProperty filterProperty} : string</li>
     * <li>{@link #getFilterOperator filterOperator} : string (default: 'Contains')</li></ul>
     * </li>
     * <li>Aggregations
     * <ul>
     * <li>{@link #getLabel label} : sap.ui.core.Control</li>
     * <li>{@link #getTemplate template} : sap.ui.core.Control</li></ul>
     * </li>
     * <li>Associations
     * <ul></ul>
     * </li>
     * <li>Events
     * <ul></ul>
     * </li>
     * </ul>
     *
     * In addition, all settings applicable to the base type {@link sap.ui.core.Element#constructor sap.ui.core.Element}
     * can be used as well.
     *
     * @param {object} [mSettings] initial settings for the new control
     * @param labelTxt
     *
     * @class
     * The column allows to define column specific properties that will be applied when rendering the table.
     * @extends sap.ui.core.Element
     *
     * @author
     * @version 1.4.1
     *
     * @constructor
     * @public
     */
    TblCol:function (mSettings, labelTxt) {
        var ret = new sap.ui.table.Column(mSettings);
        if (typeof(labelTxt) === 'string')
            ret.setLabel(sui.Lbl({
                text:labelTxt
            }));
        return ret;
    },
    JSModel:function (oData) {
        var jsmodel = new sap.uiext.model.json.JSONModel(oData);
        jsmodel.setSizeLimit(500);
        return jsmodel;
    },
    Filter: function (sPath, sOperator, oValue1, oValue2){
        return new sap.ui.model.Filter (sPath, sOperator, oValue1, oValue2);
    },
    /**
     * BT: "BT"
     * Contains: "Contains"
     * EQ: "EQ"
     * EndsWith: "EndsWith"
     * GE: "GE"
     * GT: "GT"
     * LE: "LE"
     * LT: "LT"
     * NE: "NE"
     * StartsWith: "StartsWith"
     * @type sap.ui.model.FilterOperator
     */
    FilterOp:sap.ui.model.FilterOperator,
    MsgBox:sap.ui.commons.MessageBox,
    MsgBoxShow: function(){
        $.sap.require("sap.ui.commons.MessageBox");
        sap.ui.commons.MessageBox.show.apply(this, arguments);
    },
    MsgBoxWarn:function (msg, title) {
        $.sap.require("sap.ui.commons.MessageBox");
        sap.ui.commons.MessageBox.show(msg, sap.ui.commons.MessageBox.Icon.WARNING, title || 'Warning!', [ sap.ui.commons.MessageBox.Action.OK ]);
    },
    MsgBoxAlert:function (msg, title) {
        sui.MsgBoxShow(
            msg,
            sui.MsgBox.Icon.INFORMATION,
            title || 'Alert!',
            [sui.MsgBox.Action.OK]
        );
    },
    MsgBoxInfo:function (msg) {
        sui.MsgBoxShow(
            msg,
            sui.MsgBox.Icon.INFORMATION,
            "Information",
            [sui.MsgBox.Action.OK]
        );
    },
    MsgBoxSuccess: function(title, msg){
        $.sap.require("sap.ui.commons.MessageBox");
        sap.ui.commons.MessageBox.show(msg,
            sap.ui.commons.MessageBox.Icon.SUCCESS,
            title,
            [sap.ui.commons.MessageBox.Action.OK]
        );
    },
    ConfirmYesNo: function(msg, title, yesCallback, noCallback ){
        sui.MsgBoxShow(
            msg,
            sui.MsgBox.Icon.QUESTION,
            title,
            [sui.MsgBox.Action.YES, sui.MsgBox.Action.NO],
            function(sResult){
                switch (sResult) {
                    case "YES":
                        if($.isFunction(yesCallback)){
                            yesCallback();
                        }
                        break;
                    default:
                        if($.isFunction(noCallback)){
                            noCallback();
                        }
                        break;
                }
            },
            sap.ui.commons.MessageBox.Action.YES
        );
    },
    Dialog: function(sId, mSettings){
        var settingsIndex = typeof(sId)=='object'? 0: 1; // settings index, need to find settings object in the arugments for the c'tor
        if(!!arguments[settingsIndex].contentIcon){
            arguments[settingsIndex].content = sui.MatrixLayout({
                rows:[sui.MLRow({
                    cells:sui.MakeMLCells(
                        sui.getIcon(arguments[settingsIndex].contentIcon),
                        sui.MLCell({content:arguments[settingsIndex].content})
                    )})
                ]
            });
            extractTemplate(mSettings, ['contentIcon'], true);
        }
        return new sap.ui.commons.Dialog (sId, mSettings);
    },
    NavTab: function(sId, mSettings){
        return new sap.ui.ux3.NavigationItem(sId, mSettings);
    },
    makeShellWorkSetItems: function(items, localeTextGetter){
        var localeTxtGtr = localeTextGetter || sui.localeText;
        return $.map(items, function(item){
            var isComposite = false;
            var itemTitle = (typeof(item)==='string')? item: item.title;
            if(!itemTitle) return;
            var itemId =itemTitle.replace(/ +/ig,'_').toLowerCase();
            if(!!localeTxtGtr) itemTitle = localeTxtGtr(itemTitle);

            return sui.NavTab(itemId, {key:itemId, text:itemTitle , subItems:!!item.items? sui.makeShellWorkSetItems(item.items):[]});
        });
    },
    UX3Shell: function(sId, mSettings){

        var settingsIndex = typeof(sId)=='object'? 0: 1; // settings index, need to find settings object in the arugments for the c'tor
        var oSettings = arguments[settingsIndex] || {};
        var tabLoadPath = oSettings.loadTabsFrom || 'app/tabs';
        var tabViewNamePrefix = tabLoadPath.replace('/','.');

        sap.ui.localResources(tabLoadPath.split('/')[0]);

        var getContent = function(key) {
            //var tabName = key.replace(/^ui_shell_tab-/,'');
            return sui.view(tabViewNamePrefix+'.'+key);
        };
        var navigateToHash = function(navHashId) {
            var navHashId = navHashId || "ui_shell_tab-" + (window.location.href.split("#")[1] || "");
            var navTab;
            if(!sap.ui.getCore().byId(navHashId)){
                navHashId =  sui.appShell.getWorksetItems()[0].getId();//'tab_home';
                __ignoreHashChange = true;
            }
            navTab = navHashId.replace(/^ui_shell_tab-/,'');
            if(window.location.hash !== '#'+navTab) window.location.hash = navTab;
            theShell.setSelectedWorksetItem(navHashId);
            theShell.setContent(getContent(navTab));
        };

//        sap.ui.getCore().attachInitEvent(function() {
//            $(window).bind('hashchange', function() {
//                if(!!window.__ignoreHashChange){
//                     window.__ignoreHashChange = false;
//                     return;
//                }
//                navigateToHash();
//            });
//        });

        if(!!arguments[settingsIndex].navItems){
            arguments[settingsIndex].worksetItems = sui.makeShellWorkSetItems(arguments[settingsIndex].navItems);
            delFromObjPath(arguments[settingsIndex],'navItems');
        }
        if(!oSettings.worksetItemSelected){
            arguments[settingsIndex].worksetItemSelected = function (oEvent) {
                var key = oEvent.getParameter("key");
                __ignoreHashChange = true
                navigateToHash(key);
            }
        }
        var theShell= sui.appShell =  new sap.uiext.ux3.Shell(sId, mSettings);
        if(!!oSettings.placeAt){
            theShell.placeAt(oSettings.placeAt);
        }
        $(function() {
            $(window).bind('hashchange', function() {
                if(!!window.__ignoreHashChange){
                     window.__ignoreHashChange = false;
                     return;
                }
                navigateToHash();
            });
            navigateToHash();
        });
        return theShell;
    },
    ThingGrp:function(sId, mSettings){
      return new sap.ui.ux3.ThingGroup (sId, mSettings);
    },
    ThingBtn:function (sId, mSettings) {
        return new sap.ui.ux3.ThingAction(sId, mSettings);
    },
    /**
     * @param btns accepts a mixed array of string | {id:'', settings:{}} | sap.ui.ux3.ThingAction
     * @returns sap.ui.ux3.ThingAction[]
     */
    ThingBtns: function(btns){
        return $.map(btns, function(item){
            var toret;
            if(typeof(item)=='string')
                toret = new sap.ui.ux3.ThingAction({text:item });
            else if(!!item.settings)
                toret = new sap.ui.ux3.ThingAction(item.id||null, item.settings);
            else
                return item;
            return toret;
        });
    },
    Panel: function(sId, mSettings){
        return new sap.ui.commons.Panel (sId, mSettings);
    },
    HTML: function(sId, mSettings){
        return new sap.ui.core.HTML (sId, mSettings);
    },
    Tree: function(sId, mSettings){
        return new sap.ui.commons.Tree(sId, mSettings);
    },
    /**
     *
     * @param sId
     * @param mSettings
     * @returns {sap.ui.commons.TreeNode}
     * @constructor
     */
    TreeNode: function(sId, mSettings){
        return new sap.ui.commons.TreeNode(sId, mSettings);
    },
    /**
     * @param {bPath, maxLength, minLength, startsWith,startsWithIgnoreCase, endsWith.endsWithIgnoreCase,contains, equals, search(regex)}
     */
    strValue: function(bPath, cfg){
        return {path:bPath || '', type:new sap.ui.model.type.String(null, cfg)};
    },
    /**
     * @param cfg:
     * <br/>{bPath: '',
     * <br/>minIntegerDigits: 1, // minimal number of non-fraction digits
     * <br/>maxIntegerDigits: 99, // maximal number of non-fraction digits
     * <br/>minFractionDigits: 0, // minimal number of fraction digits
     * <br/>maxFractionDigits: 0, // maximal number of fraction digits
     * <br/>groupingEnabled: false, // enable grouping (show the grouping separators)
     * <br/>groupingSeparator: ",", // the used grouping separator
     * <br/>decimalSeparator: "." // the used decimal separator
     * <br/>}
     */
    intValue: function(cfg){
        return {path:cfg.bPath || '', type: new sap.ui.model.type.Integer(cfg)};
    },
    getThemeParameters: function(){
      return   sap.ui.core.theming.Parameters.get();
    },
    getThemeName: function(){
        return sap.ui.getCore().getConfiguration().getTheme();
    },
    getThemePath: function(sPackage){
        var theme = sui.getThemeName();
        if(sui.isCustomTheme())
            return  window["sap-ui-config"].themeroots[theme];
        else
            return jQuery.sap.getModulePath("sap.ui."+sPackage||'commons', '/') + "themes/" + sap.ui.getCore().getConfiguration().getTheme();
    },
    isCustomTheme: function(){
        var theme = sui.getThemeName();
        return !!window["sap-ui-config"].themeroots[theme];
    },
    /**
     *
     * @param sIcoLocator e.g. 'sap.ui.commons.ValueHelpField:sapUiValueHelpIconRegularUrl'
     * @return {*}
     */
    getIconPath: function(sIcoLocator){
        var theme = window["sap-ui-config"].theme;
        var themingParams = sap.ui.core.theming.Parameters;
        var relIconPath = themingParams.get(sIcoLocator) || sap.ui.core.theming.Parameters.get('@'+sIcoLocator.split(':')[1]);
        if(!!window["sap-ui-config"].themeroots[theme])
            return  window["sap-ui-config"].themeroots[theme]+'/sap/ui/'+sIcoLocator.split('.')[2]+'/themes/'+theme+relIconPath;
        else
            return sui.getThemePath(sIcoLocator.split('.')[2])+relIconPath;
    },
    Icons:{
        CRITICAL: "CRITICAL",
        ERROR: "ERROR",
        INFORMATION: "INFORMATION",
        NONE: "NONE",
        QUESTION: "QUESTION",
        SUCCESS: "SUCCESS",
        WARNING: "WARNING"
    },
    IconClass:{
        INFORMATION : "sapUiMboxInfo",
        CRITICAL : "sapUiMboxCritical",
        ERROR : "sapUiMboxError",
        WARNING : "sapUiMboxWarning",
        SUCCESS : "sapUiMboxSuccess",
        QUESTION : "sapUiMboxQuestion"
    },
    /**
     * returns image of SAPUI library icon
     * @param icon use a member of sui.Icons
     */
    getIcon: function(icon){
        var oImage = new sui.Image({
            //tooltip : rb && rb.getText("MSGBOX_ICON_" + oIcon),
            decorative : true});
        oImage.addStyleClass("sapUiMboxIcon");
        oImage.addStyleClass(sui.IconClass[icon]);
        declareName('sui.icon_images');
        if(!sui.icon_images[icon])
            sui.icon_images[icon] = oImage;
        return sui.icon_images[icon];
    },
    /**
     * returns the control for the ID or returns the reference if passed in. Will throw if the ui is not a control
     * @param id [string|sap.ui.control]
     */
    getUI: function(id){
        var ui = typeof(id)==='string'?  sap.ui.getCore().getElementById(id): id;
        if(!ui || (!!ui && !ui.getModel)){
            jQuery.sap.log.warning('the passed in param must be an id of or a SAPUI element');
            return undefined;
        }
        return ui;
    },
    getDomId: function(elem){
        return typeof(elem)==='string'? elem: elem.getId();
    },
    initElements: function(elements, flags){
        for(var i=0, j = elements.length; i<j; i++){
            var elem = sui.getUI(elements[i]);
            if(!!elem.setValue){
                if( inArray('value',flags)){
                    elem.setValue('');
                }
                if(elem.getValueState()===sap.ui.core.ValueState.Error){ // TODO: SAPUI5 input fields do not redraw properly after validation 'Error' state
                    var context = elem.getBindingContext() + '/' + elem.getBindingPath('value');
                    context = context.replace('//','/');
                    var realVal = elem.getModel().getProperty(context);
                    elem.setValue(typeof(realVal)=='string'? realVal: '');
                }
            }
            if(!!elem.setText && inArray('value',flags)) elem.setText('');
            if(!!elem.setValueState) elem.setValueState('None');
        }
    },
    resetInputs: function(elem){
        var domId = sui.getDomId(elem);
        // TODO: add support of checkboxes and...
        $('#'+domId+' .sapUiTf ').each(function(index){
            var control = $(this).control()[0];
            control.setValueState(sui.ValueState.None).setValue('');
        });
    },
    clearValidation: function(elem){
        var domId = sui.getDomId(elem);
        $('#'+domId+' .sapUiTf ').each(function(index){
            var control = $(this).control()[0];
            control.setValueState(sui.ValueState.None);
        });
    },
    isVisible: function(ctrlId){
        return $('#'+ctrlId).is(':visible');
    },
    core: function(){
        return sap.ui.getCore();
    },
    config: function(){
        return sap.ui.getCore().getConfiguration();
    },
    browserLocale: function(){
        // The configuration language will often be retrieved with '-', while this is not the standard SAPUI works with
        return sap.ui.getCore().getConfiguration().getLanguage().replace('-', '_');
    },
    Locale: function(sLocale){
        return new sap.ui.core.Locale(sLocale || sui.browserLocale())
    },
    LocaleData: function(oLocale){
        return new sap.ui.core.LocaleData(oLocale || sui.Locale());
    },
    /**
     *
     * @param resources the same objec that would be passed to "jQuery.sap.resources" method or just a url string for the locale properties file
     * @return {Function}
     */
    localeTextGetter: function(resources){
        //var isArgStr = typeof(resources)==='string';
        jQuery.sap.require("jquery.sap.resources");
        var localeBundle = jQuery.sap.resources({
            url : resources.url || resources,
            locale: resources.locale || sui.browserLocale()
        });
        return sui.localeText =  function(){return localeBundle.getText.apply(localeBundle, arguments)};
    },
    CloseDestroy: function(){
        if(!!!this.attachClosed) return;

        this.detachClosed(sui.CloseDestroy);
        try{
            this.destroy();
        }catch(e){
            sui.log.warning(e);
        }
    },
    input_validation:{
        alert: function(messages){
            if(isEmpty(messages)) return;
            if(!isArray(messages)) messages = [messages];
            var ul = '', htmlStr;
            for(var i= 0, messagesLen=messages.length; i<messagesLen; i++){
                ul += "<li>"+messages[i]+"</li>\n";
            }
            htmlStr = "<div><ul>"+ul+"</ul></div>";
            oDialog = sui.Dialog({title:'Invalid input!' ,contentIcon: 'WARNING', content:[sui.HTML({content:htmlStr})]});
            oDialog.open();
        },
        addValidationErr: function(element, validator, validationErr){
            element = sui.getUI(element); // make sure that we have the control
            if(!this.validation_errors) this.validation_errors = {};
            if(!this.validation_errors[element.getId()]) this.validation_errors[element.getId()] = {element: element, validators:[], messages:[]};
            if(!inArray(validator, this.validation_errors[element.getId()].validators)){
                this.validation_errors[element.getId()].validators.push(validator);
                this.validation_errors[element.getId()].messages.push(validationErr);
            }
        },
        flushValidationErrs: function(element){
            var elementId = typeof element == 'string'? element: element.getId();
            delFromObjPath(this, 'validation_errors.'+elementId);
        },
        validate: function(notify){
            if(!isEmpty(getFromObjPath(this, 'validation_errors'))){
                if(!!notify){
                    var messages = [];
                    for(var errElem in this.validation_errors){
                        // TODO?: make inner loop to display messages for elements
                        var validationErr = this.validation_errors[errElem];
                        var message = validationErr.messages[0];
                        var element = validationErr.element;
                        var elementId = element.getId();

                        if(sui.isVisible(elementId)){
                            // if the validation message includes an id replace it with inputTitle
                            element.setValueState(sui.ValueState.Error);
                            if(message.search(elementId)>-1){
                                message = message.replace(elementId, element.x_GetInputTitle())
                            }

                            messages.push(message);
                        }
                    }
                    sui.input_validation.alert(messages);
                }
                return false;
            }
            return true;
        },
        /**
         *
         * @param {boolean [default:true]} updateElement
         */
        validateElement: function(updateElement){
            var i=0;
            var validatorsNum=this.x_validators.length;
            var model = this.getModel();
            var elementId=this.getId();
            if(!updateElement && updateElement !== false) updateElement = true;

            try{
                for(; i<validatorsNum; i++){
                    var validator = this.x_validators[i];
                    if(!!validator.args)
                        validator.handler.apply(validator.context, validator.args);
                    else
                        validator.handler.call(validator.context)
                }
                // at this point if nothing was thrown, clear validation error for model if exists and update value state
                if(this.validInput === false){
                    this.validInput = true;
                    // return original tooltip
                    this.setTooltip(this.x_OrigTooltip);
                    this.setValueState(sui.ValueState.None);
                    sui.input_validation.flushValidationErrs(this);
                    if(!!model){
                        delFromObjPath(model, 'validation_errors.'+elementId);
                    }
                }

                //  TODO: remove inline notifications !!clearer spec
            }catch(ex){
                if (ex instanceof ValidationError){
                    // if bound to model update the "validation_errors" with the error by elementId
                    var errMsg = this.x_validators[i].msg || ex.message || '';
                    // add validation error to validation app validation map
                    sui.input_validation.addValidationErr(this, this.x_validators[i].handler, errMsg);
                    // backup normal tooltip
                    if(this.validInput !== false) this.x_OrigTooltip = this.getTooltip();

                    this.validInput = false;
                    if(updateElement){
                        this.setValueState(sui.ValueState.Error);
                        this.setTooltip(errMsg);
                    }
                    if(!!model){
                        setToValue(model, sui.input_validation.validation_errors[elementId], 'validation_errors.'+elementId);
                    }
                    // TODO: if inline needs !!clearer spec
                } else {
                    //handle all others
                    throw ex;
                }
            }
        }
    },
    /**
     * @public
     * @field Error
     * @field None
     * @field Success
     * @field Warning
     */
    ValueState:sap.ui.core.ValueState,
    // ***  SAPUI Helpers *** //
    /**
     * For the purpose of aiding the migration from SAPUI ver -1.6
     * @param context   String or object representation of binding context
     * @return {string}     String representation of binding context
     */
    getBindingStr: function(context){
        return typeof(context)=='string'? context:context && context.getPath && context.getPath() || '';
    }
};

jQuery.sap.require("sap.ui.commons.Dialog");

(function() {
    var fnOld = sap.ui.commons.Dialog.prototype.close;
    sap.ui.commons.Dialog.prototype.close = function(oFocusInfo) {
        sui.resetInputs(this);
        return  fnOld.apply(this,arguments);
    };
}());;
jQuery.sap.log.setLevel(jQuery.sap.log.Level.DEBUG);
// Initializing objects for extending
jQuery.sap.require("sap.ui.core.Element");
jQuery.sap.require("sap.ui.ux3.Overlay");
jQuery.sap.require("sap.ui.ux3.ThingInspector");
jQuery.sap.require("sap.ui.table.Table");
jQuery.sap.require("sap.ui.commons.ComboBox");
jQuery.sap.require("sap.ui.model.Model");
jQuery.sap.require("sap.ui.commons.layout.MatrixLayout");
jQuery.sap.require("sap.ui.commons.TriStateCheckBox");


sap.ui.commons.layout.MatrixLayout.prototype.x_FormLabelField = function(sLabel , field){
    var oLabel = sui.Lbl({
        text : sLabel + " :",
        labelFor: field
    });
    if (field.getWidth() === undefined){
        field.setWidth("200px");
    }
    this.addRow(this.createAlignedRow(oLabel, field));
    return field;
};


sap.ui.commons.layout.MatrixLayout.prototype.createAlignedRow = function(object1, object2) {
    var oMLCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
        hAlign : sui.HAlign.Begin,
        vAlign : sui.VAlign.Top,
        content : [ object1 ]
    });
    var oMLCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
        hAlign : sui.HAlign.Begin,
        vAlign : sui.VAlign.Top,
        content : [ object2 ]
    });
    return new sap.ui.commons.layout.MatrixLayoutRow({
        cells : [ oMLCell1, oMLCell2 ],
        height : '40px'
    });
};

// Need to consult with SAPUI5 on how to make this sound with multi-bound elements, or multiple aggregations
sap.ui.core.Element.prototype.setPropertyFire = function(sPropertyName, oValue, bSuppressInvalidate){
    var toReturn = this.setPropertyFire(sPropertyName, oValue, bSuppressInvalidate);
    this.fireChange();
};
sap.ui.core.Element.prototype.x_AddUpdateRow = function(oData,sRowBindingPath, sIdProperty){
    var model = this.getModel();
    sIdProperty = sIdProperty || 'id';

    if(!!model){
        // If the RowBindingPath was not pass then extract from element binding info
        sRowBindingPath = sRowBindingPath || this.x_GetRowsBindingPath();
        return model.x_AddUpdateRow(oData, sRowBindingPath);
    }else{
        jQuery.sap.log.error('Element must have a model to execute function "x_AddUpdateRow"');
    }
};

if(!!sap.ui.commons.TriStateCheckBox){
    /**
     * takes a bound view and model paths to checklist and checked property. It can infer the latter 2 arguments if you pass in
     * the view who's aggregate binding contains a checkbox template
     * @param args {sap.ui.control boundView, string checkListPath, string checkedPath}
     */
    sap.ui.commons.TriStateCheckBox.prototype.x_RegisterCheckList = function(args){
        var triStateCbox = this;
        if(!args || !args.boundView){
            jQuery.sap.log.error('illegal call to sap.ui.commons.TriStateCheckBox.prototype.x_RegisterCheckList');
            return;
        }
        if(!args.checkListPath){ // try to infer the check list path from the aggregation binding path
            var defaultAggr = args.boundView.x_GetRecordsAggregation();
            if(!defaultAggr){
                jQuery.sap.log.error('call to sap.ui.commons.TriStateCheckBox.prototype.x_RegisterCheckList cannot infer checklist path');
                return;
            }
            var aggrBindingInfo = args.boundView.getBindingInfo(defaultAggr);
            if(!aggrBindingInfo || !aggrBindingInfo.path){
                jQuery.sap.log.error('call to sap.ui.commons.TriStateCheckBox.prototype.x_RegisterCheckList cannot infer checklist path');
                return;
            }
            args.checkListPath =aggrBindingInfo.path;
        }
        if(!args.checkedPath){ // try to infer the checked path from the binding template
            var oAggrTemplate = aggrBindingInfo.template;
            if(!oAggrTemplate || oAggrTemplate.getMetadata()._sClassName!=='sap.ui.commons.CheckBox'){
                jQuery.sap.log.error('call to sap.ui.commons.TriStateCheckBox.prototype.x_RegisterCheckList was made with a view having no aggregate binding template or one that is not a checkbox');
                return;
            }
            var cBoxBindingInfo =oAggrTemplate.getBindingInfo('checked');
            if(!cBoxBindingInfo || !cBoxBindingInfo.path){
                jQuery.sap.log.error('call to sap.ui.commons.TriStateCheckBox.prototype.x_RegisterCheckList cannot infer checked path for checklist items');
                return;
            }
            args.checkedPath = cBoxBindingInfo.path;
        }

        //** onAfterRendering recheck list state and update the tristate parent **//
//        var checkListState = function(){
//
//        };
//        if(addEventDelegate)
        //this.addDelegate();

        oAggrTemplate.attachChange(function(){
                var isChecked = this.getChecked();
                if(isChecked){
                    this.toggle("Unchecked");
                }
                else if(nSelectedChildren === allChildren.length){
                    this.toggle("Checked");
                }
                else{
                    this.toggle("Mixed");
                }
            }
        );
        this.attachChange(function(){
            if (this.getSelectionState() === "Checked"){
                for (var i = 0; i < allChildren.length; i++) {
                    allChildren[i].setChecked(true);
                    nSelectedChildren = allChildren.length;
                }
            }
            else {
                for (var i = 0; i < allChildren.length; i++) {
                    allChildren[i].setChecked(false);
                    nSelectedChildren = 0;
                }
            }
        });
    };
}

sap.ui.core.Element.prototype.x_SetData = function(oData,sPath){
    var model = this.getModel();
    if(!!model){
        return model.x_SetData(oData, sPath || '');
    }else{
        jQuery.sap.log.error('Element must have a model to execute function "x_AddUpdateRow"');
    }
};

sap.ui.core.Element.prototype.x_GetSetJSModel  = function(modelName){
	if(!this.getModel(modelName)){
        var jsmodel = new sap.uiext.model.json.JSONModel();
        jsmodel.setSizeLimit(500);
        this.setModel(jsmodel, modelName);
	}
	return this.getModel();
};

sap.ui.core.Element.prototype.x_SetJSModel  = function(oData){
    var jsmodel = new sap.uiext.model.json.JSONModel(oData);
    jsmodel.setSizeLimit(500);
	this.setModel(jsmodel);
	return this;
};

sap.ui.core.Element.prototype.x_IfNotSetModel = function(oModel){
	if(!this.hasModel()) this.setModel(oModel);
};

/**
 * Takes a string path or Context object and deletes the branch by the given path in the element's model
 * @param {string | Context} context
 */
sap.ui.core.Element.prototype.x_ModelDeleteRow = function(context){
    context = sui.getBindingStr(context);
	if(isEmpty(context)){
			jQuery.sap.log.debug('A context argument must be passed for x_ModelDeleteRow to operate');
			return;
		}
    if(!!this.getModel().removeFrom)
        this.getModel().removeFrom(context);
};

sap.ui.core.Element.prototype.x_GetModelRows = function(){
	if(this.hasModel()){
		var rowsBindPath =  this.x_GetRowsBindingPath(),

		aggrObj = getFromObjPath(this.getModel().getData(), rowsBindPath, '/');
		if(isEmpty(aggrObj)) {
				var newArr = new Array();
				setToValue(this.getModel().getData(), newArr,rowsBindPath, '/');
				return newArr;
			}
		return aggrObj;
	}
	jQuery.sap.log.debug("Element must have model to use method x_GetModelRows");
	return false;
};

sap.ui.core.Element.prototype.x_GetModelRowByIndex = function(i){
	return this.x_GetModelRows()[i];
};

sap.ui.core.Element.prototype.x_BindAggregation = function(aggrgationName, sPath, oTemplate, oSorter, aFilters){
    var defaultAggr = aggrgationName ||this.x_GetRecordsAggregation();
    var path = sPath || ''; //sPath[0]!='/' && !this.getBindingContext()? '/'+sPath: sPath
    var bTemplate = oTemplate || this.x_GetBindingTemplate();
//	var bindInfo = {
//			path: sPath[0]!='/' && !this.getBindingContext()? '/'+sPath: sPath,
//					template: oTemplate || this.x_GetBindingTemplate()
//		};
    if(!!defaultAggr && !!bTemplate){
        this.bindAggregation(defaultAggr, path, bTemplate, oSorter, aFilters);
    }
};

sap.ui.core.Element.prototype.x_BindRecordsAggregation = function(sPath, oTemplate, oSorter, aFilters){
	var defaultAggr = this.x_GetRecordsAggregation();
	if(!!defaultAggr){
		this.x_BindAggregation(defaultAggr, sPath, oTemplate, oSorter, aFilters);
    }
};

sap.ui.core.Element.prototype.x_GetRecordsAggregation = function(){
	if(!!this.getRows)
		return "rows";
	else if(!!this.getItems)
		return "items";
    else if(!!this.getContent){
        return "content";
    }
	else{
		jQuery.sap.log.debug('The element has no records binding aggregation.');
		return null;
	}
};

sap.ui.core.Element.prototype.x_GetRecordsBindingPath = function(){
    return this.getBindingPath(this.x_GetRecordsAggregation());
};

sap.ui.core.Element.prototype.getBindingSizeLimit = function(){
    // defaulted to one hundred as suggested by SAPUI5 team due to that being the default value
    // for the library's elements
    return this.getModel() && this.getModel().iSizeLimit || 100;
};

sap.ui.core.Element.prototype.x_isRecordBound = function(){
	return !isEmpty(this.getBindingPath(this.x_GetRecordsAggregation()));
};

sap.ui.core.Element.prototype.x_GetModelLastRow = function(){
	var mRows = this.x_GetModelRows(), mLastIndex = mRows.length-1;
	return mRows[mLastIndex];
};

sap.ui.core.Element.prototype.x_GetAggregatingParent = function(){
	var parent = this;
	while(parent !== this.getUIArea()){
		if(!isEmpty(parent.getBindingPath('rows')))
			return parent;
		parent = parent.getParent()
	}
	return false;
};

sap.ui.core.Element.prototype.x_GetRowsBindingPath = function(){
    var aggrParent = this.x_GetAggregatingParent(), bContext = aggrParent.getBindingContext(),
        rBPath = aggrParent.getBindingPath('rows'), patt = new RegExp(bContext);

    if(!!bContext && !patt.test(rBPath))
	    return [bContext, rBPath].join('/');

    return rBPath;
};

sap.ui.core.Element.prototype.x_GetBindingTemplate = function(aggr){
	var aggr = aggr || this.x_GetRecordsAggregation();
	return getFromObjPath(this, 'mBindingInfos.'+aggr+'.template');
};

sap.ui.core.Element.prototype.x_SetBindingTemplate = function(oTemplate, aggregationName){
    var aggregationName = aggregationName || this.x_GetRecordsAggregation();
    //if(!!getObjProperty(this, 'mBindingInfos.'+aggregationName))
    //setToValue(this, oTemplate, 'mBindingInfos.'+aggregationName+'.template');
    //this.x_BindingTemplate = oTemplate
    this.x_BindAggregation(aggregationName, null, oTemplate);
};

sap.ui.core.Element.prototype.x_GetLabel = function(){
    return $('label[for='+this.getId()+']');
};

/**
 * returns the label text for this input
 * @return {string}
 */
sap.ui.core.Element.prototype.x_GetLabelText = function(){
    return this.x_GetLabel().text().replace(/^[\s:]+|[\s:]+$/g,''); // trim and "user:" becomes "user"
};

/**
 *  Searches a name for this input, by looking in this order: x_inputTitle, x_GetLabelText, getId (non-framework generated) , and finally defaultsTo param and then 'input'
 * @param defaultsTo if no title is found the function will return the argument
 * @return {string}
 */
sap.ui.core.Element.prototype.x_GetInputTitle = function(defaultsTo){
    return this.x_inputTitle ||
        this.x_GetLabelText() ||
        (!/^__/.test(this.getId()) // if the id starts with "__", then it is generated by the framework, and is no good
            ? this.getId()
            :defaultsTo!==undefined
                ? defaultsTo
                : 'input');
};

/**
 * @argument [{handler: func , args:[], interrupt: true, msg: '', valueState: sap.ui.core.ValueState.Error, inline: true, error: func},...]     all fields except the handler will default to shown values
 * @usage fld.x_AttachValidators({handler: testRegex, args:[/^[a-z]/], interrupt: true, msg: 'invalid input!'},...)
 * @param inline If error notifications should be shown near the field
 * If a handler function returns a string or a boolean false value, the function validation will have failed
 * and a validation error item will be appended to the model's validation object. If the user provides a msg field, it will be used as the
 * validation error message, otherwise the handler return value will be used.
 *
 * The model is extended to have an x_Validate method  where the programmer can validate a model before performing transactions,
 * This way the programmer can define the desired interaction (UX) with the user to resolve validation errors on each form separately
 */
sap.ui.commons.TextField.prototype.x_SetValidators = function(){
    var args = Array.prototype.slice.call( arguments, 0 );
    var defaults = {
        interrupt: false,
        msg: '',
        valueState:sap.ui.core.ValueState.Error,
        context: this,
        inline: true
    };

    if(!arguments[0]) return; // exit with empty arguments //TODO: since this is a setter for now, allow for empty value

    if(typeof(arguments[0]) == 'string'){ //  1st arg can be an input title i.e  a business id for this input element
        this.x_inputTitle = arguments[0];
       args.shift();
    }

    if($.isArray(args[0])){ // simplified way of attaching validators
        var validators = $.map(args[0], function(item){return mergeDiff({handler: item}, defaults)});
        args.shift();
        args = validators.concat(args);
    }

    // attach validators to txtfld and update with defaults
    this.x_validators = $.map(args, function(item){ return mergeDiff(item, defaults); });
    this.attachChange(sui.input_validation.validateElement);
    sui.input_validation.validateElement.call(this,false);
    //if(!!model) model.x_validators = this.x_validators;

//    this.setProperty = function(){
//        var toReturn = sap.ui.commons.TextField.prototype.setProperty.apply(this, arguments);
//        if(arguments[0]=='value'){ // only the value property is relevant for input validation
//        }
//        return toReturn;
//    };

//    this.attachChange(function(){
//        // change value state on element if there are validation errors on it
//        //if(!isEmpty(getFromObjPath(sop.ui.input_validation,'validation_errors.'+this.getId()))){
//        if(this.validInput===false){
//            this.setValueState(sui.ValueState.Error);
//        }
//    }, this);
    return this;
};


//sap.ui.commons.TextField.prototype.detachValidator = function(){};

/**
 * Extends Overlay to cater to editing/creating
 * a record within a DataTable Control
 *
 * @param {sap.ui.base.Event|sap.ui.table.DataTable} oEvent Event when the action is "edit" and <code>DataTable</code> when the action is "new"
 * @return {sap.ui.ux3.ThingInspector} <code>this</code> to allow method chaining
 * @public
 */
sap.ui.ux3.Overlay.prototype.x_InspectRow = function(oEvent){
	var contextData = null, srcDataTable=null;
		
	if(!!oEvent.x_GetModelRows){ // if the oEvent param is a data grid the use has opted to create another row in the source table
			srcDataTable = oEvent;
			// Try to find the row data template for the table
			// Check if row data template for the source table was passed or defined on the table, and fail if not. TODO: throw error
			if(!!!srcDataTable.x_RowDataTemplate){
				alert("A row data template for the table has not been defined! Please define table.x_SetRowDataTemplate(template)");
				return false;
			}
			
			//this.x_currentModelContext = srcDataTable.getBindingPath()+"/"+(rowCount);
			this.x_OverlayParent = srcDataTable;
			contextData = srcDataTable.x_GetRowDataTemplate();
	}else if(!!oEvent.getSource){
		// get the binding context of the first selected row
		this.x_currentModelContext = oEvent.getParameter("rowContext") || oEvent.oSource.getBindingContext();
		// attach a reference of the source model to the editing container element.
		this.x_OverlayParent = oEvent.getSource();	
		contextData = clone(this.x_OverlayParent.getModel().getProperty(this.x_currentModelContext));
	}else{ // there is no overLayParent, oEvent is an original object to be inspected
        contextData = oEvent;
    }

    // update the overlay's model object and reset
    if(!!this.defaultModelAggregations)
        this.defaultModelAggregations(contextData);

    this.x_GetSetJSModel().setProperty('/selectedRowData', contextData);
		
	// Fire hook if defined in instance
	if(!!this.x_onInspectRow) this.x_onInspectRow(oEvent);
		
	this.open();

	return this;
};

sap.ui.ux3.Overlay.prototype.x_GetOverlayParent = function(){
	return this.x_OverlayParent;
};

/**
 * Extends ThingInpector to cater to updating the origin Model object
 * from which the dialog/inspector drew its values or to create a new one from the
 * DataTable which spawned it
 *
 * @return {object} The current row Model data from the ThingInspector in the format held by the origin table
 * @public
 */
sap.ui.ux3.Overlay.prototype.x_SourceModelUpdate = function(){
		this.x_OverlayParent.x_AddUpdateRow(this.getModel().getData().selectedRowData, this.x_currentModelContext);
};

sap.ui.ux3.ThingInspector.prototype.x_GetAction = function(key){
    if(typeof(key)==='string'){
        //return $.grep(this.getActions(), function(item){return item.getText()==key})[0];
        return ArrayItemByKey(this.getActions(), 'getText', key);
    }else if(typeof(key)==='number'){
        return this.getActions()[key];
    }
    return -1;
};

sap.ui.ux3.ThingInspector.prototype.x_RemoveAction = function(key){
    var action = this.x_GetAction(key);
    if(action !== -1)
        this.removeAction(action);
    return this;
};

sap.ui.table.Table.prototype.x_SetRowDataTemplate = function(data_template){
	this.x_RowDataTemplate = data_template;
};

sap.ui.table.Table.prototype.x_GetRowDataTemplate = function(){
	// if it is an object template container than get the object template from it
	if(!!this.x_RowDataTemplate.getObjectTemplate) return this.x_RowDataTemplate.getObjectTemplate();
	// return a clone of the data template object
	return jQuery.extend(true,{},this.x_RowDataTemplate);
};

// args = dataObject, tooltip, deleteHandler, confirmationMsg, notificationMsg
sap.ui.table.Table.prototype.x_AddRowDeleter = function(args){
    var currTbl = this, delBtn;
    this.addColumn(new sap.ui.table.Column({
        template : delBtn = new sap.ui.commons.Image({src : sop.pics.icons.trash,tooltip : args.tooltip || 'Delete',
            press:function(oControlEvent) {
                var rowPath = oControlEvent.getSource().getBindingContext();
                //var objId = oControlEvent.getSource().getModel().getProperty("id",oContext);
                var onDelete= function(){
                    if(!!args.notificationMsg){
                        sui.MsgBoxSuccess('Delete', args.notificationMsg);
                    }
                    if(!!args.success){
                        args.success.call(delBtn);
                    }
                };

                var deleteIt = function(){
                    if(args.dataObject){
                        args.dataObject.Delete({oDataBinder:currTbl, rowPath:rowPath, onSuccess: function(){
                                onDelete();
                                currTbl.x_ModelDeleteRow(rowPath);
                            }
                        });
                    }
                    else{
                        currTbl.x_ModelDeleteRow(rowPath);
                        onDelete();
                    }
                };

                if(!!args.confirmationMsg){
                    sui.MsgBox.confirm(
                        args.confirmationMsg, function(bResult) {
                            if (bResult) {
                                deleteIt();
                            }
                        }, "Delete");
                }else{
                    deleteIt();
                }
                //currTbl.checkRowsCount();
        }}),
        width : "40px"
    }));

    return this;
};

sap.ui.commons.ComboBox.prototype.x_GetSelectedItemBindingContext = function(){
	 var selectedItem = this.x_GetSelectedItem();

	 return !!selectedItem? selectedItem.getBindingContext(): undefined;
};

sap.ui.commons.ComboBox.prototype.x_GetSelectedItem = function(){
    if(!!this.getValue() && !this.getSelectedItemId()){
        this.setValue(this.getValue());
    }

	 return sap.ui.getCore().getElementById(this.getSelectedItemId());
};

sap.ui.commons.ComboBox.prototype.x_GetSelectedItemModelProperty = function(property){
	if(this.hasModel()){
		var model = this.getModel();
		return model.getProperty(property || '',this.x_GetSelectedItemBindingContext());
	}
};

/**
 *
 * @param oData the data object to write to the model
 * @param sRowsBindPath the row binding path from the requesting UI element
 * @param sIdProperty the identifying property of the oData object
 * @return {int} number of rows in the row binding path
 */
sap.ui.model.Model.prototype.x_AddUpdateRow = function(oData, sRowsBindPath, sIdProperty){
    sIdProperty = sIdProperty || 'id';

    if(!sRowsBindPath){
        jQuery.sap.log.error('An sPath or sRowBindPath must be provided to model.x_AddUpdateRow"');
        return -1;
    }
    var modelRows = this.getProperty(sRowsBindPath), modelRowsLen;
    
    if(!modelRows){
    	var mData={};
    	setToValue(mData,[oData],sRowsBindPath, '/');
    	this.setData(mData);
    	modelRows = this.getProperty(sRowsBindPath);
    }

    modelRowsLen = modelRows.length;

    var objIndex = !!oData[sIdProperty]? indexOfKeyValue(modelRows, sIdProperty, oData[sIdProperty]): -1;
    //  if objIndex>-1 oData was found and this is an add operation, otherwise it is an update operation
    var sPath = sRowsBindPath + '/' + (objIndex>-1? objIndex: modelRowsLen);
    this.x_SetData(oData, sPath);
    // return row count
    return (objIndex>-1? modelRowsLen: modelRowsLen+1);
};

sap.ui.model.Model.prototype.x_SetData = function(dataObj,sPath){
	var oData = this.getData();
    var dataClone = clone(dataObj);

	if(!isEmpty(sPath))
		setToValue(oData, dataClone, sPath, '/'); // this provides mirroring where as the merge supplied by SUI5 only supplies updating
	else
		oData = dataClone;

    this.setData(oData);
	this.checkUpdate();
};

// Helpers

function SUI5_SuccessDialog(title, msg){
	jQuery.sap.require("sap.ui.commons.MessageBox");
	sap.ui.commons.MessageBox.show(msg,
		sap.ui.commons.MessageBox.Icon.SUCCESS,
		title,
		[sap.ui.commons.MessageBox.Action.OK]
	);
}

function getUILocale(){
	return sap.ui.getCore().getConfiguration().getLanguage();
}

function getUIById(id){
	return sap.ui.getCore().getElementById(id);
}

function getUIDateInstance(oFormatOptions, oLocale){
	jQuery.sap.require("sap.ui.core.format.DateFormat");
	return sap.ui.core.format.DateFormat.getInstance(oFormatOptions, oLocale);
}


// Some improvements !?
jQuery.sap.require("sap.ui.commons.TextField");
(function(){
//jQuery.sap.declare("sap.uiext.commons.TextField");
var origTextField = sap.ui.commons.TextField;
origTextField.extend("sap.uiext.commons.TextField", {
    metadata:{
        properties: {
          oldValue:'string',
          validators:'object'
        },
        events:{
            beforeChange: {enablePreventDefault : false}
        }
    },

    onkeydown: function(evt){
        if(evt.keyCode === 13)
            this.fireBeforeChange();
        if(!!origTextField.prototype.onkeydown)
            origTextField.prototype.onkeydown.apply(this, arguments);
    },

    onfocusout: function(evt){
        this.fireBeforeChange();
        if(!! origTextField.prototype.onfocusout)
            origTextField.prototype.onfocusout.apply(this, arguments);
    },

    /**
     * Similar to original, but added "fireChange"  optional param in case the programmer would
     * @param {string} sValue
     * @param {?bool} fireChange
     */
    setValue: function(sValue, fireChange){
        //sap.ui.commons.TextField.prototype.setValue.apply(this, arguments);
        try{
            var toRet = origTextField.prototype.setValue.call(this, sValue);
            if(fireChange) this.fireChange();
        }catch(ex){throw ex}
        return toRet || this;
    },

    setValidators: function(){
        this.x_SetValidators.apply(this, arguments);
    },

    getValidators: function(){
        return this.x_validators;
    },

    init : function() {
        if(!!origTextField.prototype.init)
            origTextField.prototype.init.apply(this, arguments);
        // store the value in the "oldValue" property before a change is made
        if(!!this.attachBeforeChange)
            this.attachBeforeChange(function(evt){
                this.setOldValue(this.getValue());
            });
    },

    renderer : {} // an empty renderer by convention inherits the parent renderer
});
sap.ui.commons.TextField = sap.uiext.commons.TextField;
})();

//jQuery.sap.require("sap.ui.commons.DatePicker");
//jQuery.sap.declare("sap.uiext.commons.DatePicker");
//sap.ui.commons.DatePicker.extend("sap.uiext.commons.DatePicker", {
//    metadata:{
//        properties: {
//            isReadOnly:{type : "boolean", defaultValue : false}
//        }
//    },
//    constructor : function(sId,mSettings) {
//        if(typeof(sId)=='object')
//            mSettings = sId;
//
//        if (mSettings.isReadOnly){
//            this.attachBrowserEvent("keydown", function(oEvent) {
//                oEvent.stopPropagation();
//                oEvent.preventDefault();
//            });
//        }
//        if(!!sap.ui.commons.DatePicker.prototype.constructor)
//            sap.ui.commons.DatePicker.prototype.constructor.apply(this, arguments);
//    },
//
//    renderer : {} // an empty renderer by convention inherits the parent renderer
//});

jQuery.sap.require("sap.ui.commons.ComboBox");
jQuery.sap.declare("sap.uiext.commons.ComboBox");
sap.ui.commons.ComboBox.extend("sap.uiext.commons.ComboBox", {
    metadata:{
        properties: {
            freeText:{type : "boolean", defaultValue : false}
        }
    },

    init: function(){
        // enforce freeText property
        this.attachChange(function(oEvent){
            try{
            if(!this.getFreeText() && !!this.getValue()){ // freeText is disabled and the current value is set (not empty)
                // check if the current value belongs to the list of items for this combo, and if not reset;
                var itemTexts = $.map(this.getItems(), function(v){return v.getText()});
                if(!inArray(this.getValue(), itemTexts)) this.setValue('');
            }
            }catch(ex){}
        });
    },

    renderer : {} // an empty renderer by convention inherits the parent renderer
});

jQuery.sap.declare("sap.uiext.table.DataTable");
jQuery.sap.require("sap.ui.table.DataTable");
sap.ui.table.DataTable.extend("sap.uiext.table.DataTable", {
    metadata:{
        properties: {
            minVisibleRowCount:{type : "int", defaultValue : 0},
            maxVisibleRowCount:{type : "int", defaultValue : 0}, // 0 means there is no max row count
            dynamicHeight: {type : "boolean", defaultValue : false}
        }
    },

    //updateAggregation: function(){
    updateRows: function(){
        //sap.ui.table.DataTable.prototype.updateAggregation.apply(this,arguments);
        sap.ui.table.DataTable.prototype.updateRows.apply(this,arguments);
        if(this.getDynamicHeight()){
            this.checkRowsCount();
        }
    },

    checkRowsCount: function(){
        if(this.x_isRecordBound()){
            var visRow = this.x_GetModelRows();

            if(visRow){
                var visRowCount = visRow.length;
                var  maxRowCount = this.getMaxVisibleRowCount();
                var minRowCount = this.getMinVisibleRowCount();
                if( maxRowCount>0 && visRowCount>maxRowCount) visRowCount = maxRowCount;
                if(visRowCount<minRowCount) visRowCount = minRowCount;
                if(this.getVisibleRowCount()!==visRowCount)
                    this.setVisibleRowCount(visRowCount);
            }
        }
    },
    // TODO: In transition to Table from DataTable in SAPUI recheck to see if necessary as the rowSelect event is DataTable specific
    fireRowSelect: function(evt){
        if(evt.rowIndex>-1){
            sap.ui.table.DataTable.prototype.fireRowSelect.apply(this, arguments);
        }
    },

//    setSelectedIndex: function(i){  // TODO: Bug in SAPUI5, this function does not fire the "row selection event", this is manual workaround
//        if(!!sap.ui.table.DataTable.prototype.setSelectedIndex)
//            sap.ui.table.DataTable.prototype.setSelectedIndex.apply(this, arguments);
//
//        this.fireRowSelect({rowIndex:i, rowContext:this.x_GetRowsBindingPath()+'/'+i});
//    },
    
    columnSelect : function(sort){
    	sap.ui.table.DataTable.prototype.columnSelect.apply(this, sort);
    },

    renderer : {} // an empty renderer by convention inherits the parent rend
});

jQuery.sap.require('sap.ui.commons.DropdownBox');
jQuery.sap.declare("sap.uiext.commons.DropdownBox");
sap.ui.commons.DropdownBox.extend("sap.uiext.commons.DropdownBox", {
    updateBindingContext: function(){
        if(!!sap.ui.commons.DropdownBox.prototype.updateBindingContext)
            sap.ui.commons.DropdownBox.prototype.updateBindingContext.apply(this, arguments);
        var items = this.getItems() || [];
        if(!this.mBindingInfos.selectedKey && !!items.length)
            this.setSelectedKey(items[0].getKey());
    },
//    _handleItemsChanged: function(){
//      var selectedKey = this.getSelectedKey() || this.getModel().getProperty(getFromObjPath(this, 'mBindingInfos.selectedKey.path')) || '';
//      var toret =   sap.ui.commons.DropdownBox.prototype._handleItemsChanged.apply(this, arguments);
//      if(this.getSelectedKey()!== selectedKey)
//        this.setSelectedKey(selectedKey);
//      return toret;
//    },

    renderer : {}
});

jQuery.sap.require('sap.ui.commons.ValueHelpField');
jQuery.sap.declare("sap.uiext.commons.ValueHelpFieldLimit");

sap.ui.commons.ValueHelpField.extend("sap.uiext.commons.ValueHelpFieldLimit", {

    setEditable: function(bEditable){
        this.__proto__.__proto__.setEditable.call(this, bEditable);
    },
    renderer : {} // an empty renderer by convention inherits the parent renderer
});

jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.declare("sap.uiext.model.json.JSONModel");
sap.ui.model.json.JSONModel.extend("sap.uiext.model.json.JSONModel", {

    validateInput: function(notify){
        if(!isEmpty(getFromObjPath(this, 'validation_errors'))){
            if(!!notify){
                var messages = [];
                for(var errElem in this.validation_errors){
                    // TODO?: make inner loop to display messages for elements
                    messages.push(this.validation_errors[errElem].messages[0]);
                }
                sui.input_validation.alert(messages);
            }
            return false;
        }
        return true;
    },
    setProperty: function(sPath, oValue, oContext){
        var args = arguments;
        sPath = sui.getBindingStr(sPath); // fix to string if context object
        if(!!oContext){
            if(typeof(oContext) == 'string'){
               sPath = oContext+'/'+sPath;
               oContext = undefined;
            }else{
                   if(/^\//.test(sPath)){
                       sPath = sPath.substr(1, sPath.length);
                   }
            }
        }

        if(!args[2]){ // if there's no Context arg and sPath does not prefix with '/' fix it
            if(!/^\//.test(sPath)){
                args[0] = '/'+args[0];
            }
            args = [sPath, oValue];
        }

        if(this.getProperty(sPath, oContext)!==oValue){ // TODO: a fix for combo update bindings introduced with SAPUI 1.6
            var toReturn = sap.ui.model.json.JSONModel.prototype.setProperty.apply(this, args);
        }

        if(!!oContext){
            // TODO: migrate from string to object context from  SAPUI 1.4-1.6
            var contextPath = sui.getBindingStr(oContext);
        }
        if(!contextPath){
            var sPathParts = sPath.split('/');
            var partsLen = sPathParts.length;
            contextPath = (sPathParts.slice(0, partsLen-1)).join('/');
            sPath = (sPathParts.slice(partsLen-1,partsLen))[0];
        }

        this.fireEvent('propertyChange', {sPath:sPath, oValue:oValue, oContext:oContext, sContext:contextPath, bindPath:!!contextPath? contextPath+'/'+sPath: sPath});
        return toReturn || this;
    },
    /**
     * the path to the property
     * @param {String | Object} sPath
     * @param {String | Object} [oContext]
     * @return {Object}
     */
    getProperty: function(sPath, oContext){
        var args = arguments;
        sPath = sui.getBindingStr(sPath); // fix to string if context object
        if(!!oContext && typeof(oContext) == 'string'){
            sPath = oContext+'/'+sPath;
            args = [sPath];
        }
        // prefix sPath with '/' to make absolute path
        if(!args[1] && args[0][0]!=='/'){
            args[0] = '/'+args[0];
        }
        return sap.ui.model.json.JSONModel.prototype.getProperty.apply(this, args);
    },
    setData: function(){
        sap.ui.model.json.JSONModel.prototype.setData.apply(this, arguments);
        this.fireEvent('propertyChange', {sPath:'', oValue:arguments[0], oContext:'/'});
    },
    /**
     * Creates a subset of the model which is a proxy of it, changes will not affect the original model
     * unless commitChanges as been called on the proxy
     */
    proxy: function(sPath){
        var proxiedValue = this.getProperty(sPath||'/');
        var proxyModel = new sap.uiext.model.json.JSONModel({data:clone(proxiedValue)});
        proxyModel._dataSource = {model: this, path: sPath || '/'};
        return proxyModel;
    },
    revert: function(){
        var dataSrc = this.getDataSource();
        var srcModel = dataSrc.model;
        if(!!srcModel){
            this.setProperty('data', clone(srcModel.getProperty(dataSrc.path)));
        }
    },
    getDataSource: function(){return this._dataSource || {model:undefined, path:undefined};},
    commitChanges: function(){

    },
    removeFrom: function(sPath){
        delFromObjPath(this.getData(),sPath,'/');
        this.checkUpdate();
        var delPathArr = sPath.split('/');
        var changedPath = delPathArr.slice(0,delPathArr.length-1).join('/');
        this.fireEvent('propertyChange', {sPath:changedPath, oValue:null, oContext:'/', bindPath:changedPath});
    },
    renderer : {} // an empty renderer by convention inherits the parent renderer
});

jQuery.sap.require("sap.ui.ux3.Shell");
jQuery.sap.declare("sap.uiext.ux3.Shell");
sap.ui.ux3.Shell.extend("sap.uiext.ux3.Shell", {
    metadata:{
        properties: {
            busyTabs:{type : "object", defaultValue : {}}
        }
    },

    isTabBusy : function(tabId){
    return !!this.getBusyTabs()[tabId] && (this.getBusyTabs()[tabId]>0);
    },
    setTabBusy: function(tabId, isBusy){
        try{
            // set busy counter for the tabId
            var busyCounter = this.getBusyTabs()[tabId] = (this.getBusyTabs()[tabId] || 0) + (isBusy===false? -1: 1);
            //console.log({tabId: tabId, busy: isBusy, shellTabs: this.getBusyTabs()});
            var selectedTabId = this.getSelectedWorksetItem();
            var that = this;
            if(selectedTabId==tabId){
                if(busyCounter>0){
                    setTimeout(function(){
                        if(that.isTabBusy(selectedTabId)){
                            showOverlay($('.sapUiUx3ShellCanvas >.sapUiUx3ShellContent'));
                        }
                    }, 300);
                }else{
                    showOverlay($('.sapUiUx3ShellCanvas >.sapUiUx3ShellContent'), false);
                }
            }
        }catch(e){
            jQuery.sap.log.error(e.message);
        }
    },
    setContent: function(){
        sap.ui.ux3.Shell.prototype.setContent.apply(this, arguments);
        var selectedTabId = this.getSelectedWorksetItem();
        var that = this;
        setTimeout(function(){
            if(that.isTabBusy(selectedTabId)){
                showOverlay($('.sapUiUx3ShellCanvas >.sapUiUx3ShellContent'));
            }
        }, 300);
    },
    renderer : {} // an empty renderer by convention inherits the parent renderer
});


/**
 *
 *  Generic multiselection dialog. Pass in a set and a subset key array and recieve only the slected subset
 *  in the callback
 *
 * The supported settings are:

 * <ul>
 * <li>{set} : Object[] an array of Objects for multi-selection</li>
 * <li>{keyField} : String (default: 'id')</li>
 * <li>{selected} : String[] an array of keys from the the passed set</li>
 * <li>{textTemplate} : String[] (default: ['name']) The fields you want displayed, concatenated</li>
 * <li>{callback} : Function(:Object[] )</li>
 * <li>{title} : String (default: '') the title of the selection dialog</li>
 * <li>{dialogId} : String (default: '')</li>
 * <li>{width} : sap.ui.core.CSSSize (default: '396px') the dialog width</li>
 * </ul>
*
 * @param {object} [mSettings] initial settings for widget
 *
 * @extends sap.ui.core.Control
 *
 * @public
 * @name MultiSelector
 * @return  sap.ui.commons.Dialog
 */
MultiSelector = function (mSettings) {
    //jQuery.sap.require('sap.ui.commons.Dialog');
    var
    //visibleFields = mSettings.visibleFields || ['name'],
        textTemplate = mSettings.textTemplate || ['name'],
        keyField = mSettings.keyField || 'id',
        srcTbl,
        selectedTbl,
    //  load the model with source selection set augmented with an additional "selected field"
        model = sui.JSModel({
            rows:$.map(mSettings.set, function (obj) {
                obj.selected = $.inArray(obj[keyField], mSettings.selected) > -1;
                obj._bindingTextTemplate = getValuesByKeys(obj, textTemplate).join(' ');
                return obj;
            }
        )});

    // Filter for the filtering out non-selected items from the selectedTbl
    var selectedFilter = new sap.ui.model.Filter("selected", sap.ui.model.FilterOperator.EQ, true);

    var updateSelectedTbl = function () {
        selectedTbl.bindRows('/rows', '', null, [selectedFilter]);
    };

    var toggleRowSelection = function (oEvent) {
        var context = this.getBindingContext(),
            rowSelected = this.getModel().getProperty('selected', context);

        this.getModel().setProperty('selected', !rowSelected, context);
        updateSelectedTbl();
    };

    srcTbl = sui.Table({
        width:'90%',
        allowColumnReordering:false,
        selectionMode:'None',
        columns:[sui.TblCol({template: sui.TxtView({text:'{_bindingTextTemplate}'})}, 'All:')]
    });

    selectedTbl = srcTbl.clone();
    srcTbl.addStyleClass('multi-selector-src-grid');
    selectedTbl.addStyleClass('multi-selector-dest-grid');
    selectedTbl
        //.addColumn(sui.TblCol({width: '32px', template: new sap.ui.commons.Label({text:'-'/*, press:toggleRowSelection*/}).attachBrowserEvent('click', toggleRowSelection) }))
        .addColumn(sui.TblCol({width:'32px', template:new sap.ui.core.HTML({content:'<span style="cursor: pointer; font-weight: bolder; font-size: 16px; color: #F00;">&ndash;<strong></strong></span>'}).attachBrowserEvent('click', toggleRowSelection) }))
        .setToolbar(new sap.ui.commons.Toolbar({items:[
        sui.Btn({text:"Remove All", press:function () {
            for (var dataArr = model.getData().rows, i = 0, j = dataArr.length; i < j; i++) {
                dataArr[i].selected = false;
            }
            model.checkUpdate();
            updateSelectedTbl();
        }})
    ]}))
        .bindRows('/rows', '', null, [selectedFilter])
        .getColumns()[0].setLabel('Selection:');

    srcTbl
        .addColumn(sui.TblCol({width:'32px', template:sui.CheckBox({checked:'{selected}', name:'{' + keyField + '}', change:updateSelectedTbl})}))
        .setToolbar(new sap.ui.commons.Toolbar({items:[
        sui.Btn({text:"Select All", press:function () {
            for (var dataArr = model.oData.rows, i = 0, j = dataArr.length; i < j; i++) {
                dataArr[i].selected = true;
            }
            model.checkUpdate();
            updateSelectedTbl();
        }})
    ]}))
        .bindRows('/rows');

    srcTbl._onColumnResize = selectedTbl._onColumnResize = function () {};


    var multiSelector = new sap.ui.commons.Dialog({title:mSettings.title || '', width:mSettings.width || '480px', minHeight:'280px', modal:true,
        content:[sui.MatrixLayout({ widths:['50%', '50%'], rows:sui.MLRow({cells:[
            sui.MLCell({content:srcTbl, hAlign:sui.HAlign.Center}),
            sui.MLCell({content:selectedTbl, hAlign:sui.HAlign.Center})
        ]})}).setModel(model)],
        buttons:[
            sui.Btn({text:'OK', press:function () {
                if (!!mSettings.callback) mSettings.callback($.map(model.oData.rows, function (item) {
                    if (item.selected) return item;
                }));
                multiSelector.close();
            }}),
            sui.Btn({text:'Cancel', press:function () {
                multiSelector.close();
            }})
        ]
    });

    multiSelector.addStyleClass('multi-selector');
    var onClose = function () {
        multiSelector.detachClosed(onClose);
        try {
            multiSelector.destroyContent();
        } catch (e) {
        }
        try {
            multiSelector.destroyButtons();
        } catch (e) {
        }
        try {
            multiSelector.destroy();
        } catch (e) {
        }
    };

    multiSelector.attachClosed(onClose);

    return multiSelector;
};
;
declareName('app.pics');
app.pics.main = '/SOPWebApplication/AdminUI/secure/images';

$.extend(app, {
    pics:{
        icons:{
            reload: app.pics.main+'/Reload.png',
            trash: app.pics.main+'/trash_icon.png'
        }
    },
    ui:{
        EditDialog: function(sId, mSettings){
            var settingsIndex = typeof(sId)=='object'? 0: 1; // settings index, need to find settings object in the arugments for the c'tor
            mergeDiff(arguments[settingsIndex], {
                followActionEnabled:false,
                updateActionEnabled: false,
                favoriteActionEnabled: false,
                flagActionEnabled:false,
                openButtonVisible:false
            });
            return new sap.ui.ux3.ThingInspector(sId, mSettings);
        },
        input_validation:{
            specialChars: "!@#$%^&*()+=-[]\\\';,./{}|\":<>?",
            validators:{
                notEmpty: function(){
                    if(isEmpty(this.getValue())){
                        throw new ValidationError('Please enter a value for "'+this.x_GetInputTitle('this input')+'".');
                    }
                    return true;
                },
                noSpecialChars: function(){
                    var value = this.getValue(), valLength = value.length || 0;
                    for (var i = 0; i < valLength; i++) {
                        if (sop.ui.input_validation.specialChars.indexOf(value.charAt(i)) != -1) {
                            throw new ValidationError(this.x_GetInputTitle()+" cannot contain any special characters, e.g:!@#$%^\&*()+=-[]\\\\\\\';,.\x2F{}|\\\":\x3C\x3E?~");
                        }
                    }
                    return true;
                },
                lengthBetween: function(min, max){
                    var value = this.getValue();
                    var valueLen = value.toString().length;
                    if(valueLen<min || valueLen>max){
                        throw new ValidationError(this.x_GetInputTitle()+" must be between "+min+" and "+max+".");
                    }
                    return true;
                },
                aName: function(){
                    // TODO: starts with letter?
                    sop.ui.input_validation.validators.lengthBetween.call(this,3,100);
                    //sop.ui.input_validation.validators.notEmpty.call(this);
                    sop.ui.input_validation.validators.noSpecialChars.call(this);
                },
                aDesc: function(){
                    sop.ui.input_validation.validators.lengthBetween.call(this,3,300);
                }
            }
        },
        forms:{
            help:{
                name: 'Enter an alphanumeric value. The name can contain spaces and "_")'
            },
            getHelp: function(fieldType){
                var help = sop.ui.forms.help[fieldType];
                var helpProp = fieldType;
                if(help===undefined){
                    helpProp = fieldType.split('_')[1];
                }
                return sop.ui.forms.help[helpProp];
            }
        }
    },
    regex:{
        //specialChars: "!@#$%^&*()+=-[]\\\';,./{}|\":<>?"
    }
});

declareName('sop.view');
$.extend(sop.view, {
    helpers: {
        dateValue: function(sPath){
            return { path: sPath, type: sop.view.types.Date() };
        },
        showResponseMsg: function(data){
            switch(data.status){
//                case 'SUCCESS':
//                    switch(data.statusReason){
//                        case 'INFO':
//                            iName = 'SUCCESS';
//                            break;
//                    }
//                    break;
                case 'FATAL ERROR':
                    iName = 'ERROR';
                    break;
                default:
                    iName = data.status;
            }
            if(!!data.statusReason.message){
                sui.MsgBoxShow(
                    data.statusReason.message,
                    sap.ui.commons.MessageBox.Icon[iName],
                    data.statusReason.description,
                    [sap.ui.commons.MessageBox.Action.OK]
                );
            }
        }
    }, // END sop.view.helpers
    types: {
        Date: function(oFormatOptions, oConstraints){
            return new sap.ui.model.type.Date(
                $.extend({source: {pattern: "yyyyMMdd"}, pattern: sui.LocaleData().getDatePattern('medium')}, oFormatOptions),
                oConstraints
            );
        }
    } // END sop.view.types
} );;
