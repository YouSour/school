// List
School.ListForSale = {
    currency: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        Cpanel.Collection.Currency.find()
            .forEach(function (obj) {
                list.push({label: obj._id + ' (' + obj.symbol + ')', value: obj._id});
            });
        return list;
    },
    saleCategory: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        School.Collection.SaleCategory.find()
            .forEach(function (obj) {
                var label = obj._id + ' : ' + obj.name + ' (' + obj.shortName + ')';
                list.push({label: label, value: obj._id});
            });
        return list;
    },
    saleItem: function () {
        var list = [];

        // Category
        School.Collection.SaleCategory.find()
            .forEach(function (obj) {
                // Item
                var items = [];
                School.Collection.SaleItem.find({saleCategoryId: obj._id})
                    .forEach(function (obj) {
                        items.push({
                            label: obj._id + ' | ' + obj.name + ' | ' + numeral(obj.price).format('0,0.00'),
                            value: obj._id
                        });
                    });

                var department = obj._id + ' : ' + obj.name + ' (' + obj.shortName + ')';
                list.push({optgroup: department, options: items});
            });

        return list;
    },
    student: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        School.Collection.Student.find()
            .forEach(function (obj) {
                list.push({label: obj._id + ' | ' + obj.khName + ' | ' + obj.enName, value: obj._id});
            });
        return list;
    },
    zone: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        list.push({label: "Urban", value: 'U'});
        list.push({label: "Sub-Urban", value: 'S'});
        list.push({label: "Rural", value: 'R'});

        return list;
    },
    transportTermForSetting: function () {
        var list = [];
        //list.push({label: "(Select One)", value: ""});

        _.times(12, function (val) {
            val += 1;
            list.push({label: val + " Month(s)", value: val});
        });

        return list;
    },
    transportItem: function () {
        var list = [];
        //list.push({label: "(Select One)", value: ""});

        School.Collection.TransportItem.find()
            .forEach(function (obj) {
                list.push({label: obj._id + ' : ' + obj.name + ' | Zone: ' + obj.zone, value: obj._id});
            });

        return list;
    },
    transportTerm: function () {
        var term = {
            1: '1 Month',
            3: '3 Months',
            6: '6 Months',
            12: '12 Months'
        };
        var list = [];
        //list.push({label: "(Select One)", value: ""});

        var item = School.ListState.get(['transport', 'item']);
        if (!_.isUndefined(item) && !_.isEmpty(item)) {
            var itemDoc = School.Collection.TransportItem.findOne({_id: item});

            _.each(itemDoc.paymentMethod, function (obj) {
                list.push({label: term[obj.term], value: obj.term});
            });
        }

        return list;
    },
    transportService: function () {
        var list = [];
        //list.push({label: "(Select One)", value: ""});

        var item = School.ListState.get(['transport', 'item']);
        var term = School.ListState.get(['transport', 'term']);
        term = _.isUndefined(term) ? 0 : term;

        if (!_.isUndefined(item) && !_.isEmpty(item) && term > 0) {
            var methodDoc = School.Collection.TransportItem.findOne({_id: item});
            var service = _.find(methodDoc.paymentMethod, function (obj) {
                return obj.term == term;
            });

            _.each(service, function (val, key) {
                if (key != 'term') {
                    var label = s.titleize(s.humanize(key)) + ' : ' + numeral(val).format('0,0.00');
                    var valList = {};
                    valList.name = key;
                    valList.value = val;

                    list.push({label: label, value: JSON.stringify(valList)});
                }
            });
        }

        return list;
    }
};
