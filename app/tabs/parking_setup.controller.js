sap.ui.controller("app.tabs.parking_setup", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.getView().setModel(sui.JSModel({
            "root": {
                "name": "root",
                "companies": [
                    {
                        "name": "Amdocs",
                        "facilities": [
                            {
                                "name": "Raanana Building 1",
                                "address": "Hapnina 2, Raanana, Israel",
                                "coords": [],
                                "lots": [
                                    {
                                        "name": "subsubitem1"
                                    },
                                    {
                                        "name": "subsubitem2"
                                    }
                                ]
                            },
                            {
                                "name": "Haifa Building 2",
                                "address": "Matam Scientific Indusries Center, Haifa, Israel",
                                "coords": [],
                                "lots": [
                                    {
                                        "name": "west lot"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "SAP",
                        "facilities": [
                            {
                                "name": "Ranana Building 1",
                                "address": "HaTidhar 15, Raanana, Israel",
                                "coords": [],
                                "lots": [
                                    {
                                        "name": "north lot",
                                        "max_spots": 100,
                                        "currently_occupied": 44,
                                        "entrances": [
                                            {
                                                "name": "HaTidhar St.",
                                                "gates": [
                                                    {
                                                        "name": "north-in",
                                                        "direction": "in",
                                                        "url":"http://link.to.gate.controller"
                                                    },
                                                    {
                                                        "name": "north-out",
                                                        "direction": "out",
                                                        "url":"http://link.to.gate.controller"
                                                    }
                                                ]
                                            }
                                        ],
                                        "areas": [
                                            {
                                                "name": "parking 1"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "east lot",
                                        "max_spots": 400,
                                        "entrances": [
                                            {
                                                "name": "HaTaasya St.",
                                                "gates": [
                                                    {
                                                        "name": "east-in",
                                                        "direction": "in",
                                                        "url":"http://link.to.gate.controller"
                                                    },
                                                    {
                                                        "name": "east-out",
                                                        "direction": "out",
                                                        "url":"http://link.to.gate.controller"
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "Imagine St.",
                                                "gates": [
                                                    {
                                                        "name": "imagine-in",
                                                        "direction": "in",
                                                        "url":"http://link.to.gate.controller"
                                                    },
                                                    {
                                                        "name": "imagine-out",
                                                        "direction": "out",
                                                        "url":"http://link.to.gate.controller"
                                                    }
                                                ]
                                            }
                                        ],
                                        "areas": [
                                            {
                                                "name": "parking 0",
                                                "capacity": 100
                                            },
                                            {
                                                "name": "parking 2",
                                                "capacity": 100
                                            },
                                            {
                                                "name": "parking 3",
                                                "capacity": 180
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }));
    }

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     */
//   onBeforeRendering: function() {
//
//   },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
//   onAfterRendering: function() {
//
//   },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     */
//   onExit: function() {
//
//   }

});