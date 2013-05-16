sap.ui.jsview("js.tabs.tab2", {

    getControllerName : function() {
        return "js.tabs.tab2";
    },

    createContent : function(oController) {
        return new sap.ui.commons.TextView({text: 'tab2'});
    }
});