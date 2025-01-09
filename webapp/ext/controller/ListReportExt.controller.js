sap.ui.define([], function () {
	return sap.ui.controller("hab.zvaadfvk00002.ext.controller.ListReportExt", {
		
		onInit: function () {
			this.newFilterDate();
			this.getOwnerComponent().getModel().setSizeLimit(1000);
		},
		
		onAfterRendering: function () {
		},

		newFilterDate: function () {
			var listReport = this.getView().byId("listReport");
			var listReportFilter = this.getView().byId("listReportFilter");
			
			listReport.attachEventOnce("beforeRebindTable", function (evn) {
				var dateFilter = this.getView().byId("listReportFilter-filterItemControl_BASIC-DeliveryDate");
				dateFilter.setPlaceholder(" ");
				if (new Date().getHours() > 19) {
					var today = new Date();
					today.setDate(new Date().getDate()+1);
				} else {
					var today = new Date();
				}
				var formatValue = sap.ui.core.format.DateFormat.getDateInstance().format(today);

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

*/