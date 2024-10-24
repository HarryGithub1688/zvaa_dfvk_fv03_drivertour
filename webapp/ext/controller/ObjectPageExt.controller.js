sap.ui.define([], function () {
	return sap.ui.controller("hab.zvaadfvk00002.ext.controller.ObjectPageExt", {
        globalVar: null,
        globalCheck: false,
		
		onInit: function () {
            //this.getView().byId("UserTourIdentification::PersNo::Field").setTextLabel(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("FVK-Nr"));
            this.getView().byId("UserTourIdentification::PersNo::GroupElement").setLabel(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("FVK-Nr"));
        },
		
		onAfterRendering: function () {
            //cambios LFM// agregamos el nombre completo segun el modelo al campo PersNo al editarlo
            //this.customFilterObjectPagePersNo();
		},

        //cambios LFM// agregamos el nombre completo segun el modelo al campo PersNo al editarlo -> replace the smartfield for custom input
        customFilterObjectPagePersNo: function () {
            var oForm = this.getView().byId("UserTourIdentification::Form");
            oForm.attachEditToggled(function (evn) {
                setTimeout(function (evn) {

                    var oForm = this.getView().byId("UserTourIdentification::Form");
                    var formGroup = this.getView().byId("UserTourIdentification::FormGroup");
                    var persNoGroupElm = this.getView().byId("UserTourIdentification::PersNo::GroupElement");
                    var persNoField = this.getView().byId("UserTourIdentification::PersNo::Field");
                    var persNoLabel = this.getView().byId("UserTourIdentification::PersNo::Field-label");
                    var persNoInput = this.getView().byId("UserTourIdentification::PersNo::Field-input");

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

                    /* customPersNoInput.attachChange(function (evn) {
                        debugger
                    }.bind(this)); */

                    customPersNoInput.attachValueHelpRequest(function (evn) {
                        persNoInput.fireValueHelpRequest();

                        setTimeout(function (evn) {

                            var valueHelpDialog = this.getView().byId("UserTourIdentification::PersNo::Field-input-valueHelpDialog");
                            valueHelpDialog.attachBeforeClose(function (evn) {

                                var oTable = this.getView().byId("UserTourIdentification::PersNo::Field-input-valueHelpDialog-table");
                                var index = oTable.getSelectedIndex();
                                if (index >= 0) {
                                    var selectedRowPath = oTable.getRows()[index].getBindingContext().sPath;
                                    var selectedValue = this.getView().getModel().getProperty(selectedRowPath);
                                    var formatValue = selectedValue.FullName + " (" + selectedValue.PersNo + ")";
                                    var deepPath = this.getView().byId("UserTourIdentification::Form").getBindingContext().sPath;
                                    customPersNoInput.setValue(formatValue);
                                    this.getView().getModel().setProperty(deepPath + "/PersNo", selectedValue.PersNo);
                                    this.getView().getModel().setProperty(deepPath + "/FullName", selectedValue.FullName);
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
                        var deepPath = this.getView().byId("UserTourIdentification::Form").getBindingContext().sPath;
                        customPersNoInput.setValue(formatValue);
                        persNoInput.setValue(selectedValue.PersNo);
                        this.getView().getModel().setProperty(deepPath + "/PersNo", selectedValue.PersNo);
                        this.getView().getModel().setProperty(deepPath + "/FullName", selectedValue.FullName);
                    }.bind(this));

                    if (oForm.getEditable()) {
                        persNoGroupElm.setVisible(false);
                        customPersNoGroupElm.setVisible(true);
                        customPersNoInput.setValue(persNoField.getValue());
                    } else {
                        persNoGroupElm.setVisible(true);
                        customPersNoGroupElm.setVisible(false);
                    }

                    this.getView().byId("save").attachPress(function (evn) {
                        this.getView().getModel().read("/ZVR_VAA_DFVK_DRIVER", {
                            success: function (data) {
                                var deepPath = this.getView().byId("UserTourIdentification::Form").getBindingContext().sPath;
                                var checkValue = true;
                                for (var i = 0; i < data.results.length; i++) {
                                    var formatValue = data.results[i].FullName + " (" + data.results[i].PersNo + ")";
                                    if (customPersNoInput.getValue() === formatValue) {
                                        persNoInput.setValue(customPersNoInput.getValue());
                                        checkValue = false;
                                        break;
                                    }
                                }

                                if (checkValue) {
                                    persNoInput.setValue("");
                                    customPersNoInput.setValue("");
                                    this.getView().getModel().setProperty(deepPath + "/PersNo", "");
                                    this.getView().getModel().setProperty(deepPath + "/FullName", "");
                                }
                            }.bind(this),
                            error: function (error) {
                                console.log(error);
                            }.bind(this)
                        });
                    }.bind(this));

                }.bind(this), 500);
            }.bind(this));
        }
		
	});
});

/*

*/