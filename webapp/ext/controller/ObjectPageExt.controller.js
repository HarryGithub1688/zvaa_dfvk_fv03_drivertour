sap.ui.define([], function () {
	return sap.ui.controller("hab.zvaadfvk00002.ext.controller.ObjectPageExt", {
        globalVar: null,
        globalCheck: false,
		
		onInit: function () {},
		
		onAfterRendering: function () {
            //cambios LFM// agregamos el nombre completo segun el modelo al campo PersNo al editarlo
            this.customFilterObjectPagePersNoOld1();
		},

        //cambios LFM// agregamos el nombre completo segun el modelo al campo PersNo al editarlo
        customFilterObjectPagePersNoOld0: function () {
            var editBtn = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--edit");
            editBtn.attachPress(function (evn) {
                var changePersNoFormatFun = function () {
                    var persNoInput = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field-input");
                    persNoInput.attachChange(function (evn) {
                        var persNoField = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field");
                        var originalValue = persNoField.getValue();
                        this.globalVar = originalValue;
                        var fullName = persNoField.getModel().getProperty("/ZVR_VAA_DFVK_DRIVER('" + originalValue + "')/FullName");
                        if (fullName != undefined && fullName != "") {
                            var newValue = '' + fullName + ' (' + originalValue + ')';
                            persNoField.setValue(newValue);

                            //check function every 0,5 seconds until find the request data
                            var doThisWhenThisInfiniteLoopCheck = function () {
                                if (persNoField.getValue() != newValue) {
                                    setTimeout(function () {
                                        persNoField.setValue(newValue);
                                        doThisWhenThisInfiniteLoopCheck();
                                    }.bind(this), 500);
                                }
                            }.bind(this);
                            doThisWhenThisInfiniteLoopCheck();

                            this.globalCheck = true;
                        } else {
                            this.globalCheck = false;
                        }
                    }.bind(this));

                    var saveBtn = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--save");
                    saveBtn.attachPress(function (evn) {
                        if (this.globalCheck === true) {
                            var oModel = evn.getSource().getModel();
                            oModel.setProperty("/DriverTour(TourId='1101',DeliveryDate=datetime'2024-09-12T00%3A00%3A00')/PersNo", this.globalVar);

                            oModel.attachRequestSent(function (evn) {
                                if (this.globalCheck === true) {
                                    var persNoField = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field");
                                    var fullName = evn.getSource().getProperty("/ZVR_VAA_DFVK_DRIVER('" + this.globalVar + "')/FullName");
                                    var newValue = '' + fullName + ' (' + this.globalVar + ')';
                                    persNoField.setValue(newValue);
                                }
                            }.bind(this));
                        }
                    }.bind(this));
                }.bind(this);
                //check function every 0,5 seconds until find the requested data
                var doThisWhenThisInfiniteLoopCheck = function () {
                    var persNoInput = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field-input");
                    if (persNoInput === undefined) {
                        setTimeout(function () {
                            doThisWhenThisInfiniteLoopCheck();
                        }.bind(this), 500);
                    } else {
                        changePersNoFormatFun();
                    }
                }.bind(this);
                doThisWhenThisInfiniteLoopCheck();

            }.bind(this));
        },

        //cambios LFM// agregamos el nombre completo segun el modelo al campo PersNo al editarlo
        //Alternative Function -> this time we remplace the smartfield for custom input
        customFilterObjectPagePersNoOld1: function () {
            //var editBtn = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--edit");
            var oForm = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::Form");
            oForm.attachEditToggled(function (evn) {
                setTimeout(function (evn) {

                    var oForm = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::Form");
                    var formGroup = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::FormGroup");
                    var persNoGroupElm = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::GroupElement");
                    var persNoField = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field");
                    var persNoLabel = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field-label");
                    var persNoInput = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field-input");
                    var persNoSuggestPopover = persNoInput._oSuggPopover._oPopover;
                    
                    if (this.getView().byId("customPersNoGroupElm") === undefined) {
                        var customPersNoGroupElm = new sap.ui.comp.smartform.GroupElement({id: this.getView().createId("customPersNoGroupElm")});
                    } else {
                        var customPersNoGroupElm = this.getView().byId("customPersNoGroupElm");
                    }
                    if (this.getView().byId("customPersNoInput") === undefined) {
                        var customPersNoInput = new sap.m.Input({ id: this.getView().createId("customPersNoInput"), width: "100%", showValueHelp:true, showSuggestion:true, suggestionItems: "{/ZVR_VAA_DFVK_DRIVER}", suggestionItems: new sap.m.SuggestionItem({text:"{PersNo}"}) });
                    } else {
                        var customPersNoInput = this.getView().byId("customPersNoInput");
                    }

                    //missing suggest popover
                    /* sap.ui.getCore().getElementById("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field-input")._oSuggPopover._oPopover.openBy(customPersNoInput); */        

                    formGroup.addGroupElement(customPersNoGroupElm);
                    customPersNoGroupElm.addElement(customPersNoInput);
                    customPersNoGroupElm.setLabel(persNoLabel.getText());
                    customPersNoInput.setValue(persNoField.getValue());

                    customPersNoInput.attachValueHelpRequest(function (evn) {
                        persNoInput.fireValueHelpRequest();

                        setTimeout(function (evn) {

                            var valueHelpDialog = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field-input-valueHelpDialog");
                            valueHelpDialog.attachBeforeClose(function (evn) {

                                var oTable = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field-input-valueHelpDialog-table");
                                var index = oTable.getSelectedIndex();
                                if (index >= 0) {
                                    var selectedRowPath = oTable.getRows()[index].getBindingContext().sPath;
                                    var selectedValue = this.getView().getModel().getProperty(selectedRowPath);
                                    var formatValue = selectedValue.FullName + " (" + selectedValue.PersNo + ")";
                                    this.getView().byId("customPersNoInput").setValue(formatValue);
                                }

                            }.bind(this));

                        }.bind(this), 500);

                    }.bind(this));

                    if (oForm.getEditable()) {
                        persNoGroupElm.setVisible(false);
                        customPersNoGroupElm.setVisible(true);
                        customPersNoInput.setValue(persNoField.getValue());
                    } else {
                        persNoGroupElm.setVisible(true);
                        customPersNoGroupElm.setVisible(false);
                    }

                }.bind(this), 500);
            }.bind(this));
        },

        //cambios LFM// agregamos el nombre completo segun el modelo al campo PersNo al editarlo
        customFilterObjectPagePersNo: function () {

            var persNoField = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field");
            persNoField.attachChange(function (evn) {
                var oSource = evn.getSource();
                var oValue = oSource.getValue();
                var oModel = oSource.getModel();
                var oPath = oSource.getBindingContext().sPath;
                var valueFromModel = oModel.getProperty(oPath);
                for (var i = 0; i < valueFromModel.PersNo.split("").length; i++) {
                    if (valueFromModel.PersNo.split("")[i] != "0") {
                        var persNo = valueFromModel.PersNo.slice(i); 
                        break;
                    }
                };
                var fullName = oModel.getProperty("/ZVR_VAA_DFVK_DRIVER('"+ persNo +"')").FullName;
                var formatValue = '' + fullName + ' (' + persNo + ')';
                this.globalVar = persNo;

                if (fullName != undefined && fullName != "") {
                    setTimeout(function () {
                        oSource.setValue(formatValue);
                        oSource.getContent().setValue(formatValue);
                    }.bind(this), 500);
                    this.globalCheck = true;
                } else {
                    this.globalCheck = false;
                }

            }.bind(this));

            var saveBtn = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--save");
                saveBtn.attachPress(function (evn) {

                    var oModel = evn.getSource().getModel();

                    oModel.attachRequestSent(function (evn) {
                        if (this.globalCheck === true) {
                            var url = evn.mParameters.url.split("?sap")[0];
                            evn.getSource().setProperty("/" + url + "/PersNo", this.globalVar);
                        }
                    }.bind(this));

                    oModel.attachRequestCompleted(function (evn) {
                        //check the data has change and ensure input format
                    }.bind(this));
                    
            }.bind(this));
        }
		
	});
});