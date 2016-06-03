Meteor.startup(function () {
    if (School.Collection.SaleCategory.find().count() == 0) {
        // Category
        var cateData = ['Book', 'Uniform'];
        _.each(cateData, function (cateVal) {
            var cateId = idGenerator.gen(School.Collection.SaleCategory, 3);
            School.Collection.SaleCategory.insert(
                {
                    _id: cateId,
                    name: cateVal,
                    shortName: cateVal + '-SN'
                }
            );

            // Item
            var itemData = ['Item A', 'Item B', 'Item C'];
            _.each(itemData, function (itemVal) {
                var itemId = idGenerator.genWithPrefix(School.Collection.SaleItem, cateId, 3);
                School.Collection.SaleItem.insert(
                    {
                        _id: itemId,
                        name: itemVal + '-' + cateVal,
                        currencyId: 'USD',
                        exchangeId: 'D3vKHcoMB39fBPr8R',
                        fromAmount: 15,
                        price: 15,
                        saleCategoryId: cateId
                    }
                );
            });
        });
    }
});