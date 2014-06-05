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
        hAlign : sui.HAlign.End,
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
        var sPath = sui.getBindingStr(sPath); // fix to string if context object
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
