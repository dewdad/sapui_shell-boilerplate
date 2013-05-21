declareName('sop.lib.dal');
// {resourceName, defaultAggrPath, idProperty, modelName}
sop.lib.dal.DataObject = function(args) {
    if(typeof (args)==='string')
        args = {resourceName: args};
    this._resourceName = args.resourceName;
    this._modelName = args.modelName || args.resourceName;
    this._idProperty = args.idProperty || 'id';
    this._recordsPath = args.defaultAggrPath || args.recordsPath || '';
//    if(!!this._recordsPath && this._recordsPath.search(/^\//ig)<0){
//        this._recordsPath = '/'+this._recordsPath;
//    }
};
// properties
sop.lib.dal.DataObject.prototype._dataRoot = 'data';

sop.lib.dal.DataObject.prototype.getIdProperty = function(){return this._idProperty;};
sop.lib.dal.DataObject.prototype.getResourceName = function(){return this._resourceName;};
sop.lib.dal.DataObject.prototype.getModelName = function(){return this._modelName;};
sop.lib.dal.DataObject.prototype.getRecordsPath = function(){return this._recordsPath;};
sop.lib.dal.DataObject.prototype.getDataRoot = function() {return this._dataRoot;};

// methods
sop.lib.dal.DataObject.prototype.get = function(args) {
    args = args || {};
	// define path
	var dao = args.dao = this;

	// define success callback
	var viewSuccess = args.success || false;
	var fnSuccess = function(data) {
		// bind view to model
        dao.bindViewToModel(args, data);
		if (!!viewSuccess) {
			viewSuccess.call(args.context, data);
		}
	};
	args.success = fnSuccess;
	// call GET
	sop.lib.dal.restService.get(args);
};

sop.lib.dal.DataObject.prototype.addUpdate = function(args) {
	//args.action = (!!args.id) ? "UPDATE" : "CREATE";
	var dao = args.dao = this;

    // define success callback
    var viewSuccess = args.success || false;
    var fnSuccess = function(data) {
        // bind view to model
        dao.bindViewToModel(args, data);
        if (!!viewSuccess) {
            viewSuccess.call(args.context, data);
        }
    };
    args.success = fnSuccess;

    // See if an Id property can be extracted from the root, and if so add  it as an argument
    if(!args.id && !!args.data && !!args.data[this.getIdProperty()]){
        args.id = args.data[this.getIdProperty()];
    }

	// call ADDUPDATE
	sop.lib.dal.restService.addUpdate(args);
};

sop.lib.dal.DataObject.prototype.deleteAction = function(args) {
	args.dao = this;

	// call DELETE
	sop.lib.dal.restService.deleteAction(args);
};

sop.lib.dal.DataObject.prototype.getCached = function(args) {
    args = args || {};

    var dao = this;
	var async = args.async || false;
	var model = sop.lib.dal.modelPersistence.getModel(this.getModelName());
    var modelData = model.oData;
	var record = null, result = null;

	if (jQuery.isFunction(args.success)) {
		async = true;
	}
	
	//find the record in the model by id
	if (isNotEmpty(modelData) && !!args.id ) {
		result = ArrayItemByKey(model.oData['data'], this.getIdProperty(), args.id);
        if(!!result) record = result.item;
	}
	
	//if model is empty or the record does not exist in cache
	if (isEmpty(modelData) || (!!args.id && (!record || this.partialInstance(record)))) {
		// call get function
		this.get(args);
	} else { // data is cached
		if (async) {
			var data = model.getData()['data'];
            dao.bindViewToModel(args, record || data);
			if (!!args.id) {
				args.success.call(args.context || this, record);
			} else {
				args.success.call(args.context || this, data);
			}
		}
	}

	if (!async) {
		return model;
	}
};

sop.lib.dal.DataObject.prototype.doAction = function(args) {
    sop.lib.dal.restService.doAction(args);
};

/**
 * takes an instance of the dao and checks for completion
 * @abstract
 * @returns {boolean} true of the instance is partial/incomplete false otherwise
 */
sop.lib.dal.DataObject.prototype.partialInstance = function(instance){ return false;};

sop.lib.dal.DataObject.prototype.bindViewToModel = function(args, data) {
    if(!args.view) return;
	var view = sui.getUI(args.view);
	if (view) {
        var dalModel = sop.lib.dal.modelPersistence.getModel(this.getModelName());
        var viewModel = view.getModel();
        var isDalProxy = viewModel && viewModel.getDataSource().model===dalModel;

        // bindAggregation or bindElement
        view.unbindContext();
        // if the view has no model or the model is a proxy of one of the DAL models
		if (Object.keys(view.oModels).length<1 || isDalProxy){
            if(!data[this.getIdProperty()]){

                view.bindElement('/data');
                view.setModel(dalModel);

                if($.isArray(getObjProperty(dalModel.oData[this.getDataRoot()], this.getRecordsPath(), '/')))
                    view.x_BindRecordsAggregation(this.getRecordsPath());
            }
            else{//(!!args.id && (Object.keys(view.oModels).length<1 || !!args.proxy)){
                //TODO have the view be able to pass in a name for the model to be created here
                var result = findByKey(dalModel.oData['data'], this.getIdProperty(), args.id);
                var isNestedInstance  = !!result && validate.isInt(result.index); // nested data in the DAL
                var proxyModel = null;

                if(!isNestedInstance){
                    if(isDalProxy){
                        viewModel.revert();
                    }else{
                        proxyModel = sop.models[this.getModelName()].proxy();
                    }
                }
                else{
                    proxyModel = sop.models[this.getModelName()].proxy('/data/'+result.index);
                }
                if(!!proxyModel && viewModel !== proxyModel){
                    view.setModel(proxyModel);
                }
                view.bindElement('/data');
            }
        }
	}
};