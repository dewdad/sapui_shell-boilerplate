sap.ui.jsview("app.tabs.parking_setup", {

    getControllerName : function() {
        return "app.tabs.parking_setup";
    },

    createContent : function(oController) {
        var thisView = this;
        var oTree = sui.Tree(this.createId('tree'), {
            /*title:"", width:"100%",*/
            height:"99%",
            showHearderIcons:true,
            showHorizontalScrollbar:false,
            minHeight: "600px"
        });

        oTree.bindAggregation("nodes", {
            path: "/root",
            template: sui.TreeNode({
                text:'{name}',
                expanded: false,
                //icon: '{icon}',
                icon:{
                    path:"name",
                    formatter: function(fValue) {
                        var type = this.getBindingContext().getPath().match(new RegExp("[^\/]+\(?=\/[^\/]+$\)"))[0];
                        if(type=="companies"){
                            return app.pics.icons.dir+fValue.toLowerCase()+".png";
                        }else{
                            return app.pics.icons.getIcon(type);
                        }
                    }
                },
                selected: function(oEvent){
                    var context = this.getBindingContext();
                    var cPath = context.getPath();
                    var contextParts = cPath.split('/');
                    var type = type = contextParts[contextParts.length-2];
                    var pane = thisView.panes[type];

                    formContainer.removeAllContent();
                    formContainer.addContent(pane);

                    pane.bindElement(cPath);
                }
            }),
            parameters: {
                arrayNames : ["companies","facilities","lots","entrances","areas","gates"]
            }
        });

        var formContainer = sui.MLCell();
        var parkingContainer = sui.SplitterV({
            firstPaneContent:[oTree],
            secondPaneContent:[
                sui.MatrixLayout({widths:['18px', 'auto'], rows:[[sui.MLCell(), formContainer]]})
            ],
            splitterPosition: '25%',
            minSizeSecondPane:"70%"
        });

        return parkingContainer;
        //return new sap.ui.commons.TextView({text: 'tab1'});
    },
    panes: (function(){
        var companyForm = sui.MatrixLayout({width:'auto'});
        companyForm.x_FormLabelField("Name:",sui.TxtFld({value:'{name}', width:'200px'}));

        var facilityForm = sui.MatrixLayout({width:'auto'});
        facilityForm.x_FormLabelField("Name:",sui.TxtFld({value:'{name}', width:'200px'}));
        facilityForm.x_FormLabelField("Address:",sui.TxtFld({value:'{address}', width:'200px'}));

        var lotForm = sui.MatrixLayout({width:'auto'});
        lotForm.x_FormLabelField("Name:",sui.TxtFld({value:'{name}', width:'200px'}));
        lotForm.x_FormLabelField("Address:",sui.TxtFld({value:'{address}', width:'200px'}));
        lotForm.x_FormLabelField("Max Spots:",sui.TxtFld({value:'{max_spots}', width:'80px'}));
        lotForm.x_FormLabelField("Currently Occupied:",sui.TxtFld({value:'{currently_occupied}', width:'80px'}));
        lotForm.x_FormLabelField("Max Reservations:",sui.TxtFld({value:'{max_reservations}', width:'80px'}));

        return {
            companies:sui.Panel({title: "COMPANY", content:[companyForm], showCollapseIcon:false}),
            facilities: sui.Panel({title: "FACILITY", content:[facilityForm], showCollapseIcon:false}) ,
            lots: sui.Panel({title: "LOT", content:[lotForm], showCollapseIcon:false})
        };
    }())
});