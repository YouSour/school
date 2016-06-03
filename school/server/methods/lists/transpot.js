Meteor.methods({
  school_transpotByStudentList: function(studentId) {
    var list = [];

    School.Collection.Transport.find({
        studentId: studentId
      }, {
        sort: {
          transportDate: -1
        }
      })
      .forEach(function(obj) {
        list.push({
          label: 'ID: ' + obj._id + ' | ' +
            'Transport Date: ' + moment(obj.transportDate)
            .format(
              'YYYY-MM-DD') + ' | Item: ' + obj._item.name +
            ' | Zone:' + obj._item.zone,
          value: obj._id
        });
      });
    return list;
  }
});
