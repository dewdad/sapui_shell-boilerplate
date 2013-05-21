sap.ui.jsview("js.tabs.tab1", {

    getControllerName : function() {
        return "js.tabs.tab1";
    },

    createContent : function(oController) {
        return new sap.ui.commons.TextView({text: 'tab1'});
    }
});