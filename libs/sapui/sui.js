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

        //viewObj.type = oView.type || sap.ui.core.mvc.ViewType.JS;
        $.extend(viewObj, {type: sap.ui.core.mvc.ViewType.JS, height:'100%'});

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
    	return new sap.ui.ux3.ToolPopup (sId, mSettings);
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
        var settingsIndex = typeof(sId)=='object'? 0: 1;
        var mlRows = arguments[settingsIndex] && arguments[settingsIndex].rows;

        if(isNotEmpty(mlRows)){
            mlRows = $.map(mlRows, function(o){
                var row = !!o.getCells? o: sui.MLRow({cells: sui.MakeMLCells.apply(null, $.isArray(o)?o:[o])});
                return row;
            });
            arguments[settingsIndex].rows = mlRows;
        }
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
    Title:function (sId, mSettings) {
        return new sap.ui.commons.Title(sId, mSettings);
    },
    Form:function (sId, mSettings) {
        return new sap.ui.commons.Form(sId, mSettings);
    },
    FormContainer:function (sId, mSettings) {
        return new sap.ui.commons.form.FormContainer(sId, mSettings);
    },
    FormElement:function (sId, mSettings) {
        return new sap.ui.commons.form.FormElement(sId, mSettings);
    },
    GridLayout:function (sId, mSettings) {
        return new sap.ui.commons.form.GridLayout(sId, mSettings);
    },
    GridElementData:function (sId, mSettings) {
        return new sap.ui.commons.form.GridElementData(sId, mSettings);
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

        if(!!arguments[settingsIndex].navItems){
            arguments[settingsIndex].worksetItems = sui.makeShellWorkSetItems(arguments[settingsIndex].navItems);
            delFromObjPath(arguments[settingsIndex],'navItems');
        }
        if(!oSettings.worksetItemSelected){
            arguments[settingsIndex].worksetItemSelected = function (oEvent) {
                var key = oEvent.getParameter("key");
                __ignoreHashChange = true;
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
        var settingsIndex = typeof(sId)=='object'? 0: 1;
        var settings = arguments[settingsIndex];
        var title = settings && settings.title;

        if(title && typeof(title)==='string') arguments[settingsIndex].title = sui.Title({text:title});
        return new sap.ui.commons.Panel (sId, mSettings);
    },
    SplitterV: function(sId, mSettings){
        var settingsIndex = typeof(sId)=='object'? 0: 1; // settings index, need to find settings object in the arugments for the c'tor
        arguments[settingsIndex].splitterOrientation = sap.ui.commons.Orientation.Vertical;
        return new sap.ui.commons.Splitter(sId, mSettings);
    },
    SplitterH: function(sId, mSettings){
        var settingsIndex = typeof(sId)=='object'? 0: 1; // settings index, need to find settings object in the arugments for the c'tor
        arguments[settingsIndex].splitterOrientation = sap.ui.commons.Orientation.Horizontal;
        return new sap.ui.commons.Splitter(sId, mSettings);
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
}());