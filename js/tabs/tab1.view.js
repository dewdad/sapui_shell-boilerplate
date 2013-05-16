sap.ui.jsview("app.tabs.tab1", {

    getControllerName : function() {
        return "app.tabs.tab1";
    },

    createContent : function(oController) {
        return new sap.ui.commons.TextView({text: 'tab1'});
    }

});