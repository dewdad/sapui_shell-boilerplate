sap.ui.jsview("js.tabs.home", {

      getControllerName : function() {
         return "js.tabs.home";
      },

      createContent : function(oController) {
          return new sap.ui.commons.TextView({text: 'Home'});
      }

});
