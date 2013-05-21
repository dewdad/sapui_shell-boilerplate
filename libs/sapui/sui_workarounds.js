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

// *********************************************** This section is for Hacks/Improvements? *********************************************//