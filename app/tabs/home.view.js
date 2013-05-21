sap.ui.jsview("app.tabs.home", {

      getControllerName : function() {
         return "app.tabs.home";
      },

      createContent : function(oController) {
          return new sap.ui.commons.TextView({text: 'Home'});
      }

});
