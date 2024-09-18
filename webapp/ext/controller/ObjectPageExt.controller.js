sap.ui.define([], function () {
	return sap.ui.controller("hab.zvaadfvk00002.ext.controller.ObjectPageExt", {
        globalVar: null,
        globalCheck: false,
		
		onInit: function () {
            //this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field").setTextLabel(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("FVK-Nr"));
            this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::GroupElement").setLabel(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("FVK-Nr"));
        },
		
		onAfterRendering: function () {
            //cambios LFM// agregamos el nombre completo segun el modelo al campo PersNo al editarlo
            this.customFilterObjectPagePersNo();
		},

        //cambios LFM// agregamos el nombre completo segun el modelo al campo PersNo al editarlo -> replace the smartfield for custom input
        customFilterObjectPagePersNo: function () {
            var oForm = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::Form");
            oForm.attachEditToggled(function (evn) {
                setTimeout(function (evn) {

                    var oForm = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::Form");
                    var formGroup = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::FormGroup");
                    var persNoGroupElm = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::GroupElement");
                    var persNoField = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field");
                    var persNoLabel = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field-label");
                    var persNoInput = this.getView().byId("hab.zvaadfvk00002::sap.suite.ui.generic.template.ObjectPage.view.Details::DriverTour--UserTourIdentification::PersNo::Field-input");

                    //persNoLabel.setText(this.getView().getModel("i18n").getProperty("FVK-Nr"));
                    
                    if (this.getView().byId("customPersNoGroupElm") === undefined) {
                        var customPersNoGroupElm = new sap.ui.comp.smartform.GroupElement({id: this.getView().createId("customPersNoGroupElm")});
                    } else {
                        var customPersNoGroupElm = this.getView().byId("customPersNoGroupElm");
                    }

                    if (sap.ui.getCore().getElementById("customPersNoInput") === undefined) {
                        var customPersNoInput = sap.ui.xmlfragment("hab.zvaadfvk00002.ext.fragment.PersNoCustomField", this);
                        customPersNoInput._getSuggestionsPopover()._oPopover.setContentWidth("30cm");
                    } else {
                        var customPersNoInput = sap.ui.getCore().getElementById("customPersNoInput");
                    } 

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
                                    customPersNoInput.setValue(formatValue);
                                }

                            }.bind(this));

                        }.bind(this), 500);

                    }.bind(this));

                    /* customPersNoInput.attachSuggest(function (evn) {
                        evn.getSource()._getSuggestionsPopover()._oPopover.setContentWidth("30cm");
                    }.bind(this)); */

                    customPersNoInput.attachSuggestionItemSelected(function (evn) {
                        var selectedRowPath = evn.mParameters.selectedRow.getBindingContext().sPath;
                        var selectedValue = this.getView().getModel().getProperty(selectedRowPath);
                        var formatValue = selectedValue.FullName + " (" + selectedValue.PersNo + ")";
                        customPersNoInput.setValue(formatValue);
                        persNoInput.setValue(selectedValue.PersNo);
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
        }
		
	});
});


/*

customFilterObjectPagePersNo1: function () {

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

customFilterObjectPagePersNo2: function () {
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

*/