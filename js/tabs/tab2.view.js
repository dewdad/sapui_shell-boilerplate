sap.ui.jsview("app.tabs.tab2", {

    getControllerName : function() {
        return "app.tabs.tab2";
    },

    createContent : function(oController) {
        return new sap.ui.commons.TextView({text: 'tab2'});
    }

});