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

			listReport.attachEventOnce("dataReceived", function (evn) {
				var dateFilter = this.getView().byId("listReportFilter-filterItemControl_BASIC-DeliveryDate");
				if (new Date().getHours() > 19) {
					var today = new Date();
					today.setDate(new Date().getDate()+1);
				} else {
					var today = new Date();
				}
				var formatValue = today.toDateString().split(" ")[1] + " " + today.toDateString().split(" ")[2] + ", " + today.toDateString().split(" ")[3];

				listReportFilter.getControlByKey("DeliveryDate").setValue(formatValue);
				listReportFilter.fireSearch();
				
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
		}

	});
});

/*
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