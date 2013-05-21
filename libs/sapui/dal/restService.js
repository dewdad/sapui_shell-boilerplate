declareName('sop.lib.dal.restService');
sop.ajax_history = [];

sop.lib.dal.restService = {

	_protocol : window.location.protocol,
	_requestHeaders : {
		SOP_locale : "en_US_",
		SOP_withMetadata : false
	},
	_server : window.location.host.split(":")[0],
	getServiceUri : function(){
		return this._protocol + "//" + window.location.host
			+ "/sap/sop/jam/CollaborationServices.xsjs";
		},

	// {action, postData, resourceName, dao, async, type, success, error, getParams
	// cache... (all properties supported by jQuery.Ajax)}
	request : function(pArgs) {
		var data = {}, oArgs = pArgs;
		// remove our extending properties from oArgs so we can use it as the
		// $.ajax config object
		var extArgs = extractTemplate(oArgs, {
			action : '',
			resourceName : '',
            modelName: '',
			dao:''
		}, true);
		
		if (oArgs.data) {
            if(!!getFromObjPath(extArgs,'dao._processPost')){ // DAO want to process POST data for the request
                oArgs.data = extArgs.dao._processPost( oArgs.data);
            }
		}

        // default resourceName and modelName from dao
        extArgs.resourceName = extArgs.resourceName || extArgs.dao.getResourceName();
        extArgs.modelName = extArgs.modelName || extArgs.dao.getModelName();

		var successHandler = oArgs.success;
		var errorHandler = oArgs.error;
        var handlerContext = oArgs.context || extArgs.dao;
		
		//var url = this.getServiceUri()+ extArgs.resourceName;
        var params = [];
        if(extArgs.hasOwnProperty('resourceName'))
            params.push('objName='+encodeURI(extArgs.resourceName));
        if(extArgs.hasOwnProperty('action'))
            params.push('action='+encodeURI(extArgs.action));
		if(!!oArgs.id)
            params.push('id='+encodeURI(oArgs.id));

		// Build AJAX config object
		var AjaxObj = {
			url : this.getServiceUri() + (!!params.length? '?'+params.join('&'):''),
			data : isEmpty(oArgs.data) ? null : JSON.stringify(oArgs.data),
			converters : {
				"text json" : function(jsonString) {
					var response = JSON.parse(jsonString);
					sop.ajax_history.push({
						type : 'response',
						value : response
					});
					return response.body;
				}
			},
			success : function(data){
                if(!!getFromObjPath(extArgs,'dao._processResponse')){ // DAO want to process POST data for the request
                    extArgs.dao._processResponse(data, this);
                }
                if(!!getFromObjPath(window,'sop.lib.dal.modelPersistence.update') && !!extArgs.dao){
                    sop.lib.dal.modelPersistence.update(
                        oArgs.id,
                        extArgs.dao,
                        data,
                        oArgs.type
                    );
                }
				if($.isFunction(successHandler)){
					successHandler.call(handlerContext, data);
				}
			}, // [optional]
			// error: isEmpty(params.error)?null:params.error, // []
			error : function(xhr, status, error) {
				//errorHandling_manager.restResponseError(response);
				if ($.isFunction(errorHandler)) {
					errorHandler.apply(handlerContext, arguments);
				}
			},
			dataType : 'json'
		};
		
		// The right argument will overwrite the left
		mergeDiff(AjaxObj, oArgs );
        if(!AjaxObj.type && !!AjaxObj.data) AjaxObj.type = 'POST';

		sop.ajax_history.push({
			type : 'request',
			value : AjaxObj
		});

		// If ajax prefilter is defined on the DataObject we use it to prepare
		// data for the backend before send, or prepare data for view binding
		// upon recieve
//		if (!!getFromObjPath(extArgs,'dao.ajaxPrefilter'))
//			oArgs = extArgs.dao.ajaxPrefilter(AjaxObj, oArgs);

		$.ajax(AjaxObj);
	},
	// args {id : [string], success : func, sync : bool }
	get : function(args) {
		this.request(args);
	},
	addUpdate : function(args) {
		this.request(args);
	},
	deleteAction : function(args) {
        args.type = "DELETE";
		this.request(args);
	},
	doAction : function() {
		this.request(args);
	}
};