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

        var oLayout1 = new sap.ui.commons.form.GridLayout();
        //var oLayout2 = new sap.ui.commons.form.ResponsiveLayout();
        var oForm1 = new sap.ui.commons.form.Form("F1",{
            title: new sap.ui.commons.Title({text: "Address Data", tooltip: "Title tooltip"}),
            layout: oLayout1,
            formContainers: [
                new sap.ui.commons.form.FormContainer("F1C1",{
                    title: "Person data",
                    formElements: [
                        new sap.ui.commons.form.FormElement({
                            fields: [new sap.ui.commons.Image({src: "images/male.jpg", width: "100px",
                                layoutData: new sap.ui.core.VariantLayoutData({
                                    multipleLayoutData: [new sap.ui.commons.layout.ResponsiveFlowLayoutData({minWidth: 110}),
                                        new sap.ui.commons.form.GridElementData({hCells: "2", vCells: 5})]
                                })
                            })
                            ],
                            layoutData: new sap.ui.commons.layout.ResponsiveFlowLayoutData({weight: 4, margin: false})
                        }),
                        new sap.ui.commons.form.FormElement({
                            label: new sap.ui.commons.Label({text:"Name",
                                layoutData: new sap.ui.core.VariantLayoutData({
                                    multipleLayoutData: [new sap.ui.commons.layout.ResponsiveFlowLayoutData({weight: 1}),
                                        new sap.ui.commons.form.GridElementData({hCells: "1"})]
                                })
                            }),
                            fields: [new sap.ui.commons.TextField({value: "Max", layoutData: new sap.ui.commons.layout.ResponsiveFlowLayoutData({weight: 4})}),
                                new sap.ui.commons.TextField({value: "Mustermann", layoutData: new sap.ui.commons.layout.ResponsiveFlowLayoutData({weight: 5})})
                            ],
                            layoutData: new sap.ui.commons.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
                        }),
                        new sap.ui.commons.form.FormElement({
                            label: new sap.ui.commons.Label({text:"Date of Birth",
                                layoutData: new sap.ui.core.VariantLayoutData({
                                    multipleLayoutData: [new sap.ui.commons.layout.ResponsiveFlowLayoutData({weight: 1}),
                                        new sap.ui.commons.form.GridElementData({hCells: "1"})]
                                })
                            }),
                            fields: [new sap.ui.commons.DatePicker({yyyymmdd: "19990909",
                                layoutData: new sap.ui.core.VariantLayoutData({
                                    multipleLayoutData: [new sap.ui.commons.layout.ResponsiveFlowLayoutData({weight: 4}),
                                        new sap.ui.commons.form.GridElementData({hCells: "3"})]
                                })
                            })
                            ],
                            layoutData: new sap.ui.commons.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
                        }),
                        new sap.ui.commons.form.FormElement({
                            label: new sap.ui.commons.Label({text:"Gender",
                                layoutData: new sap.ui.core.VariantLayoutData({
                                    multipleLayoutData: [new sap.ui.commons.layout.ResponsiveFlowLayoutData({weight: 1}),
                                        new sap.ui.commons.form.GridElementData({hCells: "1"})]
                                })
                            }),
                            fields: [new sap.ui.commons.RadioButtonGroup({
                                items: [new sap.ui.core.Item({text: "male"}),
                                    new sap.ui.core.Item({text: "female"})],
                                layoutData: new sap.ui.core.VariantLayoutData({
                                    multipleLayoutData: [new sap.ui.commons.layout.ResponsiveFlowLayoutData({weight: 4}),
                                        new sap.ui.commons.form.GridElementData({vCells: 2})]
                                })
                            })]
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