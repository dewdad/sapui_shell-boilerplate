declareName('sop.lib.dal.modelPersistence');
sop.lib.dal.modelPersistence = {
	_persistedModels : {},
	update : function(sId, oDAO, oData, actionType) {

        var sIdProperty = oDAO.getIdProperty();
        var sModelName = oDAO.getModelName();
        var sAggrPath = oDAO.getDataRoot()+'/'+oDAO.getRecordsPath();

		var modelObject = this.getModel(sModelName);

        // update persistence layer on delete action
        if(!!actionType && !!modelObject && actionType.search(/delete/gi)>-1){
            var rowIndex = findByKey(
                getObjProperty(modelObject.oData, sAggrPath, '/'),
                sIdProperty,
                sId).index;
            modelObject.removeFrom(sAggrPath+'/'+rowIndex);
        }else{

            if (!modelObject) {
                //if model does not exists, create new model.
                modelObject = sui.JSModel();
            }

            if (sId) {
                // update 1 record in the model
                modelObject.x_AddUpdateRow(oData, 'data', sIdProperty);
            } else {
                // update all the model oData
                var dataObject = modelObject.oData || {};
                //dataObject[sDataRoot] = oData;
    //            if(!!sDataRoot){
    //                setToValue(dataObject.data);
    //            }
                dataObject.data = oData;
                modelObject.setData(dataObject);
            }
            this.getModel()[sModelName] = modelObject;
        }
	},
	getModel : function(resourceName) {
		return !!resourceName? this._persistedModels[resourceName] || (this._persistedModels[resourceName] = sui.JSModel()): this._persistedModels;
	}
};

sop.models = sop.lib.dal.modelPersistence._persistedModels;