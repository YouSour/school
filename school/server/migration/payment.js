Meteor.methods({
  school_miPayment: function() {
    var paymentCollection = School.Collection.Payment;
    paymentCollection.find().forEach(function(obj) {
      // update
      paymentCollection.update({
          _id: obj._id
        }, {
          $set: {
            type: 'Normal'
          }
        },
        function(error) {
          if (!error) {
            console.log(obj._id);
          }
        });
    });
  }

});
