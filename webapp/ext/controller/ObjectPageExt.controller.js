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
            this.customFilterObjectPagePersNo();
        },

        //cambios LFM// agregamos el nombre completo segun el modelo al campo PersNo al editarlo -> replace the smartfield for custom input
        customFilterObjectPagePersNo: function () {
            var oForm = this.getView().byId("UserTourIdentification::Form");
            oForm.attachEditToggled((evn) => {
                //check if persNoInput and Label has load after 2 miliseconds, if not, check again untill it finish to load
                var checkPersNoInputLabel = () => setTimeout((evn) => {
                    var persNoLabel = this.getView().byId("UserTourIdentification::PersNo::Field-label");
                    var persNoInput = this.getView().byId("UserTourIdentification::PersNo::Field-input");
                    if (persNoLabel === undefined || persNoInput === undefined) {
                        checkPersNoInputLabel();
                    } else {
                        var oForm = this.getView().byId("UserTourIdentification::Form");
                        var formGroup = this.getView().byId("UserTourIdentification::FormGroup");
                        var persNoGroupElm = this.getView().byId("UserTourIdentification::PersNo::GroupElement");
                        var persNoField = this.getView().byId("UserTourIdentification::PersNo::Field");

                        //setting customGroup
                        if (this.getView().byId("customPersNoGroupElm") === undefined) {
                            var customPersNoGroupElm = new sap.ui.comp.smartform.GroupElement({ id: this.getView().createId("customPersNoGroupElm") });
                        } else {
                            var customPersNoGroupElm = this.getView().byId("customPersNoGroupElm");
                        }
                        //setting customInput
                        if (sap.ui.getCore().getElementById("customPersNoInput") === undefined) {
                            var customPersNoInput = sap.ui.xmlfragment("hab.zvaadfvk00002.ext.fragment.PersNoCustomField", this);
                            customPersNoInput._getSuggestionsPopover()._oPopover.setContentWidth("30cm");
                        } else {
                            var customPersNoInput = sap.ui.getCore().getElementById("customPersNoInput");
                        }
                        //adding elements
                        formGroup.addGroupElement(customPersNoGroupElm);
                        customPersNoGroupElm.addElement(customPersNoInput);
                        customPersNoGroupElm.setLabel(persNoLabel.getText());
                        customPersNoInput.setValue(persNoField.getValue());

                        //visibility toggle
                        if (oForm.getEditable()) {
                            persNoGroupElm.setVisible(false);
                            customPersNoGroupElm.setVisible(true);
                            customPersNoInput.setValue(persNoField.getValue());
                        } else {
                            persNoGroupElm.setVisible(true);
                            customPersNoGroupElm.setVisible(false);
                        }

                        //value help
                        customPersNoInput.attachValueHelpRequest((evn) => {
                            persNoInput.fireValueHelpRequest();
                            //check if valueHelpDialog has load after 2 miliseconds, if not, check again untill it finish to load
                            var checkValueHelpDialog = () => setTimeout((evn) => {
                                var valueHelpDialog = this.getView().byId("UserTourIdentification::PersNo::Field-input-valueHelpDialog");
                                if (valueHelpDialog === undefined) {
                                    checkValueHelpDialog();
                                } else {
                                    valueHelpDialog.attachBeforeClose((evn) => {
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
                                    });
                                }
                            }, 200);
                            checkValueHelpDialog();
                        });

                        //suggestions
                        customPersNoInput.attachSuggestionItemSelected((evn) => {
                            var selectedRowPath = evn.mParameters.selectedRow.getBindingContext().sPath;
                            var selectedValue = this.getView().getModel().getProperty(selectedRowPath);
                            var formatValue = selectedValue.FullName + " (" + selectedValue.PersNo + ")";
                            var deepPath = this.getView().byId("UserTourIdentification::Form").getBindingContext().sPath;
                            customPersNoInput.setValue(formatValue);
                            persNoInput.setValue(selectedValue.PersNo);
                            this.getView().getModel().setProperty(deepPath + "/PersNo", selectedValue.PersNo);
                            this.getView().getModel().setProperty(deepPath + "/FullName", selectedValue.FullName);
                        });
                    }
                }, 200);
                checkPersNoInputLabel();

                //get data
                new Promise((resolve, reject) => {
                    this.getView().getModel().read("/ZVR_VAA_DFVK_DRIVER", {
                        success: (data) => {
                            resolve(data);
                        },
                        error: (error) => {
                            //console.log(error);
                        }
                    });
                }).then((resolve) => {
                    this.data = resolve;

                    //on save changes
                    this.getView().byId("save").attachPress((evn) => {
                        var oForm = this.getView().byId("UserTourIdentification::Form");
                        var persNoInput = this.getView().byId("UserTourIdentification::PersNo::Field-input");
                        var customPersNoInput = sap.ui.getCore().getElementById("customPersNoInput");
                        var deepPath = oForm.getBindingContext().sPath;
                        var checkValue = true;
                        for (var i = 0, l = this.data.results.length; i < l; i++) {
                            var formatValue = this.data.results[i].FullName + " (" + this.data.results[i].PersNo + ")";
                            //if value match -> set value
                            if (customPersNoInput.getValue() === formatValue) {
                                persNoInput.setValue(customPersNoInput.getValue());
                                checkValue = false;
                                break;
                            }
                        }
                        //if doesnt match -> set empty
                        if (checkValue) {
                            persNoInput.setValue("");
                            customPersNoInput.setValue("");
                            this.getView().getModel().setProperty(deepPath + "/PersNo", "");
                            this.getView().getModel().setProperty(deepPath + "/FullName", "");
                        }
                    });
                });
            });
        }

    });
});

/*

*/