sap.ui.define([], function () {
	return sap.ui.controller("hab.zvaadfvk00002.ext.controller.ListReportExt", {
		
		onInit: function () {
			this.newFilterDate();
		},
		
		onAfterRendering: function () {
		},

		newFilterDate: function () {
			var listReport = this.getView().byId("listReport");
			var listReportFilter = this.getView().byId("listReportFilter");
			
			listReport.attachEventOnce("beforeRebindTable", function (evn) {
				var dateFilter = this.getView().byId("listReportFilter-filterItemControl_BASIC-DeliveryDate");
				if (new Date().getHours() > 19) {
					var today = new Date();
					today.setDate(new Date().getDate()+1);
				} else {
					var today = new Date();
				}
				//var formatValue = today.toDateString().split(" ")[2] + " " + today.toDateString().split(" ")[1] + ". " + today.toDateString().split(" ")[3];
				var formatValue = today.toLocaleDateString().replaceAll("/", ".");

				listReportFilter.getControlByKey("DeliveryDate").setValue(formatValue);
				setTimeout(function () {
					listReportFilter.fireSearch();
				}.bind(this), 100);
				
				listReportFilter.getControlByKey("DeliveryDate").attachAfterValueHelpOpen(function (evn) {
					evn.getSource()._getCalendar().setIntervalSelection(false);
					evn.getSource()._getCalendar().attachSelect(function (evn) {
						var value = evn.getSource().getSelectedDates()[0].getStartDate();
						evn.getSource().exit();
						evn.getSource().getParent().close();
						listReportFilter.setFilterData({"DeliveryDate": {value: value}});
					}.bind(this))
				}.bind(this));
			}.bind(this));

			setTimeout(function () {
				listReport.rebindTable();
			}.bind(this), 100);
		}

	});
});

/*


initialise
: 
(2) [{…}, {…}]
uiStateChange
: 
[{…}]
_change

listReportFilter.attachInitialized(function (evn) {
	var dateFilter = this.getView().byId("listReportFilter-filterItemControl_BASIC-DeliveryDate");

	if (new Date().getHours() > 19) {
		var today = new Date();
		today.setDate(new Date().getDate()+1);
		//var oFilter = new sap.ui.model.Filter("DeliveryDate", sap.ui.model.FilterOperator.Contains, today);
	} else {
		var today = new Date();
		//var oFilter = new sap.ui.model.Filter("DeliveryDate", sap.ui.model.FilterOperator.Contains, today);
	}
	var formatValue = today.toDateString().split(" ")[1] + " " + today.toDateString().split(" ")[2] + ", " + today.toDateString().split(" ")[3];
	
	//listReportFilter.getControlByKey("DeliveryDate").setValue({type: 'sap.ui.model.type.DateTime', formatOptions: {'UTC': true, style: 'medium'}});
	//listReportFilter.getControlByKey("DeliveryDate").setValue(formatValue);
	//listReportFilter.setFilterData({"DeliveryDate": {value: today}});
	//listReportFilter.setFilterData({"DeliveryDate": {high: today, low: today}});

	listReportFilter.getControlByKey("DeliveryDate").attachAfterValueHelpOpen(function (evn) {
		evn.getSource()._getCalendar().setIntervalSelection(false);
		evn.getSource()._getCalendar().attachSelect(function (evn) {
			var value = evn.getSource().getSelectedDates()[0].getStartDate();
			evn.getSource().exit();
			evn.getSource().getParent().close();
			listReportFilter.setFilterData({"DeliveryDate": {value: value}});
		}.bind(this))
	}.bind(this));
}.bind(this));
*/