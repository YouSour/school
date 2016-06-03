// Schema
School.Schema.TransportReport = new SimpleSchema({
    branch: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForReport.branch();
            }
        },
        optional: true
    },
    item: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.ListForReport.transportItem();
            }
        },
        optional: true
    },
    date: {
        type: String,
        defaultValue: function () {
            var start = moment().startOf('month').format('YYYY-MM-DD');
            var current = moment().format('YYYY-MM-DD');
            return start + ' To ' + current;
        }
    },
    exchange: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return School.List.exchange();
            }
        }
    }
});