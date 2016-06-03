/**
 * Collection Hook
 */
School.Collection.Class.after.update(function (userId, doc, fieldNames, modifier, options) {
    var self = this;
    Meteor.defer(function () {
        modifier.$set = modifier.$set || {};
        if (modifier.$set.courseId && modifier.$set.courseId != self.previous.courseId) {
            School.Collection.Register.update({
                courseId: self.previous.courseId
            }, {
                $set: {courseId: modifier.$set.courseId},
                multi: true
            });
        }
    })
});
