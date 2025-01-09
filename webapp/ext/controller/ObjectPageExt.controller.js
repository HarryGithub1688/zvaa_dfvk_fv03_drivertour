sap.ui.define([], function () {
    return sap.ui.controller("hab.zvaadfvk00002.ext.controller.ObjectPageExt", {
        globalVar: null,
        globalCheck: false,

        onInit: function () {
            //this.getView().byId("UserTourIdentification::PersNo::Field").setTextLabel(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("FVK-Nr"));
            this.getView().byId("UserTourIdentification::PersNo::GroupElement").setLabel(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("FVK-Nr"));
        
            //register on save event handler
            this.getView().byId("save").attachPress(async function() { 
                await this.onSaveEventHandler(); 
            }.bind(this));
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
            });
        },
     //On save changes event handler
        onSaveEventHandler: async function () {
            var oForm = this.getView().byId("UserTourIdentification::Form");
            var persNoInput = this.getView().byId("UserTourIdentification::PersNo::Field-input");
            var customPersNoInput = sap.ui.getCore().getElementById("customPersNoInput");
            var deepPath = oForm.getBindingContext().sPath;
            var oModel = this.getView().getModel();
            
            /*Check persNo input value (driver) -> check if an manually entered driver (persNo) exists in backend
              check shoud be applied only for a values entered manually, and not applied to value selected
              via value help*/
    
            //stop PersNo check processing if there is no PersNo entered
            if(!customPersNoInput.getValue()) {
                //clear persNo Input field
                persNoInput.setValue("");
                oModel.setProperty(deepPath + "/PersNo", "");
                oModel.setProperty(deepPath + "/FullName", "");
                return;
            }

            //get driver input string value
            var persNo = customPersNoInput.getValue();

            //stop PersNo check processing if PersNo is empty... 
            if(!persNo ) return;

            //...or equal 0
            if(!Number(persNo)) return;

            /*if the value has been selected via value help, no check required
            -> manual value input pass only a pers number (e.g. "1234")
            -> value input via value help selection pass a value in the following 
               string format 'first_name last_name (persNo)' - e.g. 'Max Mustermann (1234)'*/
            if(isNaN(Number(persNo))) return;

            //read driver odata resonse status code to check if persNo exists in backend
            const driverStatusCode = await this.getDriverStatusCode(oModel, persNo);
            
            //driver has not been found
            if(driverStatusCode !== "200"){
                persNoInput.setValue("");
                customPersNoInput.setValue("");
                oModel.setProperty(deepPath + "/PersNo", "");
                oModel.setProperty(deepPath + "/FullName", "");
            }
        },

        //OData call to read a driver based on persNo, and returns reponse code
        getDriverStatusCode: async function (oModel, persNo) {
            return new Promise((resolve, reject) => {
                var oParameters = {
                    PersNo: persNo
                }
                var sDriverPathKey = oModel.createKey("/ZVC_VAA_DFVK_FV03_DRIVER", oParameters);
                oModel.read(sDriverPathKey, {
                    success: (data, response) => {
                        resolve(response.statusCode);
                    },
                    error: (error) => {
                        resolve(error.statusCode);
                    }
                });
            })
        }

    });
});

/*

*/