sap.ui.jsview("app.tabs.parking_setup", {

    getControllerName : function() {
        return "app.tabs.parking_setup";
    },

    createContent : function(oController) {
        var oTree = sui.Tree(this.createId('tree'), {
            /*title:"", width:"100%",*/
            height:"99%",
            showHearderIcons:true,
            showHorizontalScrollbar:false,
            minHeight: "600px"
        });

        oTree.bindAggregation("nodes", {
            path: "/root",
            template: sui.TreeNode({text:'{name}', expanded:true}),
            parameters: {
                // specify array names which should be displayed
                // if nothing is specified every array will be displayed
                // nested arrays where the parent is not in the list won't be displayed
                // if you don't have arrays in your data structure don't set this parameter at all
                arrayNames : ["companies","facilities","lots","entrances","areas"]
            }
        });

        //var oLayout1 = new sap.ui.commons.form.GridLayout();
        var oLayout1 = new sap.ui.commons.form.ResponsiveLayout();
        var formContainer;
        var gridFieldMedWidth = function(){return new sap.ui.commons.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})}
        //var gridFieldMedWidth = function(){return sui.GridElementData({hCells:"6"});};
        //var oLayout2 = new sap.ui.commons.form.ResponsiveLayout();
        var oForm1 = new sap.ui.commons.form.Form("F1",{
            /*title: new sap.ui.commons.Title({text: "Address Data", tooltip: "Title tooltip"}),*/
            layout: oLayout1,
            formContainers: [
                formContainer = sui.FormContainer("F1C1",{
                    title: "Person data",
                    formElements: [
                        new sap.ui.commons.form.FormElement({
                            label: new sap.ui.commons.Label({text:"Name:"}),
                            fields: [new sap.ui.commons.TextField({value: "Max"})],
                            layoutData:gridFieldMedWidth()
                        }),
                        new sap.ui.commons.form.FormElement({
                            label: new sap.ui.commons.Label({text:"Date of Birth"}),
                            fields: [new sap.ui.commons.DatePicker({yyyymmdd: "19990909"})],
                            layoutData:gridFieldMedWidth()
                        }),
                        new sap.ui.commons.form.FormElement({
                            label: new sap.ui.commons.Label({text:"Gender"}),
                            fields: [new sap.ui.commons.RadioButtonGroup({
                                items: [
                                    new sap.ui.core.Item({text: "male"}),
                                    new sap.ui.core.Item({text: "female"})
                                ]
                            })],
                            layoutData:gridFieldMedWidth()
                        })
                    ]
                })
            ]
        });
        /*formContainer.bindAggregation("content", "/company/properties", function(sId, oContext) {
            var value = oContext.getProperty("value");
            switch(typeof value) {
                case "string":
                    return new sap.ui.commons.TextField(sId, {
                        value: {
                            path: "value",
                            type: new sap.ui.model.type.String()
                        }
                    });
                case "number":
                    return new sap.ui.commons.TextField(sId, {
                        value: {
                            path: "value",
                            type: new sap.ui.model.type.Float()
                        }
                    });
                case "boolean":
                    return new sap.ui.commons.CheckBox(sId, {
                        checked: {
                            path: "value"
                        }
                    });
            }
        });*/

        return sui.SplitterV({
            firstPaneContent:[oTree],
            secondPaneContent:[oForm1],
            splitterPosition: '25%',
            minSizeSecondPane:"70%"
        });

        //return new sap.ui.commons.TextView({text: 'tab1'});
    }
});