/**
 * List
 */
School.ListStateForReport = new ReactiveObj();

School.ListForReport = {
    branch: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });
        Cpanel.Collection.Branch.find()
            .forEach(function (obj) {
                list.push({
                    label: obj.enName,
                    value: obj._id
                });
            });

        return list;
    },
    department: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });
        School.Collection.Department.find()
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.name + ' (' + obj.shortName +
                    ')',
                    value: obj._id
                });
            });

        return list;
    },
    courseByDepartment: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });

        var catId = School.ListStateForReport.get('department');
        if (!_.isUndefined(catId) && !_.isEmpty(catId)) {
            School.Collection.Course.find({
                    departmentId: catId
                })
                .forEach(function (obj) {
                    var label = obj._id + ' | ' + obj.name +
                        ' (' + obj._department.shortName + ')' +
                        ' | Term: ' + obj.term + ' Months (' +
                        numeral(obj.baseAmount).format('0,0.00') + ')';
                    list.push({
                        label: label,
                        value: obj._id
                    });
                });
        }

        return list;
    },
    classByDepartment: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });

        var courId = School.ListStateForReport.get('course');

        if (!_.isUndefined(courId) && !_.isEmpty(courId)) {
            School.Collection.Class.find({
                    courseId: courId
                })
                .forEach(function (obj) {
                    var label = obj._id + ' | ' + obj.name + ' | ' + 'Day Of Week : ' + obj.dayOfWeek + ' | ' + 'Time : ' + obj.time;

                    list.push({
                        label: label,
                        value: obj._id
                    });
                });
        }

        return list;
    },
    registerByDepartment: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });

        var classId = School.ListStateForReport.get('class');
        if (!_.isUndefined(classId) && !_.isEmpty(classId)) {
            School.Collection.Register.find({
                    classId: classId
                })
                .forEach(function (obj) {
                    var label = obj._id + ' | ' + 'Register Date : ' + moment(obj.registerDate).format('YYYY-MM-DD') + ' | ' + 'Student : ' + obj._student.khName + ' (' + obj._student.gender + ')';

                    list.push({
                        label: label,
                        value: obj._id
                    });
                });
        }

        return list;
    },
    newOld: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });
        list.push({
            label: "New",
            value: "N"
        });
        list.push({
            label: "Old",
            value: "O"
        });

        return list;
    },
    registerStatus: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });
        list.push({
            label: 'Active',
            value: 'Active'
        });
        list.push({
            label: 'Suspend',
            value: 'Suspend'
        });
        list.push({
            label: 'Dropout',
            value: 'Dropout'
        });

        return list;
    },
    registerStatusWithSelectOne: function () {
        var list = [];
        list.push({
            label: "(Select One)",
            value: ""
        });
        list.push({
            label: 'Active',
            value: 'Active'
        });
        list.push({
            label: 'Suspend',
            value: 'Suspend'
        });
        list.push({
            label: 'Dropout',
            value: 'Dropout'
        });

        return list;
    },
    osAmount: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });
        list.push({
            label: '> 0',
            value: '> 0'
        });
        list.push({
            label: '= 0',
            value: '= 0'
        });

        return list;
    },
    saleCategory: function () {
        var list = [];
        list.push({
            label: "(Select One)",
            value: ""
        });

        School.Collection.SaleCategory.find()
            .forEach(function (obj) {
                var label = obj._id + ' : ' + obj.name + ' (' + obj.shortName +
                    ')';
                list.push({
                    label: label,
                    value: obj._id
                });
            });

        return list;
    },
    saleCategorySelectAll: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });

        School.Collection.SaleCategory.find()
            .forEach(function (obj) {
                var label = obj._id + ' : ' + obj.name + ' (' + obj.shortName +
                    ')';
                list.push({
                    label: label,
                    value: obj._id
                });
            });

        return list;
    },
    staff: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });
        School.Collection.Staff.find()
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.name,
                    value: obj._id
                });
            });

        return list;
    },
    exchange: function () {
        var list = [];
        list.push({
            label: "(Select One)",
            value: ""
        });
        Cpanel.Collection.Exchange.find({}, {
                sort: {
                    exDate: -1
                }
            })
            .forEach(function (obj) {
                var label = moment(obj.exDate).format('YYYY-MM-DD') +
                    ' | Rates: ' + numeral(obj.rates.USD).format('0,0.00') + '$' +
                    ' = ' + numeral(obj.rates.KHR).format('0,0.00') + 'R' + ' = ' +
                    numeral(obj.rates.THB).format('0,0.00') + 'B';

                list.push({
                    label: label,
                    value: obj._id
                })
            });
        return list;
    },
    student: function () {
        var list = [];
        list.push({
            label: "(Select One)",
            value: ""
        });

        School.Collection.Student.find({
                cpanel_branchId: Session.get('currentBranch')
            })
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.khName,
                    value: obj._id
                })
            });
        return list;
    },
    registerByStudent: function () {
        var list = [];
        var studentId = Session.get('register');

        list.push({
            label: "(Select One)",
            value: ""
        });

        if (!_.isUndefined(studentId) && !_.isEmpty(studentId)) {
            School.Collection.Register.find({
                studentId: studentId,
                cpanel_branchId: Session.get('currentBranch')
            }, {
                sort: {
                    _id: -1
                }
            }).forEach(function (obj) {
                var classDoc = School.Collection.Class.findOne(obj.classId);
                var roomDoc = School.Collection.Room.findOne(classDoc.roomId);
                var courseDoc = School.Collection.Course.findOne(classDoc.courseId);
                var departmentDoc = School.Collection.Department.findOne(
                    courseDoc.departmentId);

                var label = 'Course: ' + courseDoc.name + ' (' + departmentDoc.shortName +
                    ') | Period: ' + courseDoc.period + ' months | Rome: ' +
                    roomDoc.name + ' | Day: ' + classDoc.dayOfWeek;
                //+ ' | Group: ' + classDoc.group;
                //+ ' | Time: ' + classDoc.time + ' | Date: ' + classDoc.startDate + ' To ' + classDoc.endDate;

                list.push({
                    label: label,
                    value: obj._id
                });
            });
        }

        return list;
    },
    transportItem: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });

        School.Collection.TransportItem.find()
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' : ' + obj.name + ' | Zone: ' + obj.zone,
                    value: obj._id
                });
            });

        return list;
    },
    type: function () {
        var list = [];
        list.push({
            label: "(All)",
            value: ""
        });
        list.push({
            label: 'Normal',
            value: 'Normal'
        });
        list.push({
            label: 'Waive',
            value: 'Waive'
        });

        return list;
    },
    viewType: function () {
        var list = [];
        list.push({
            label: "(Select One)",
            value: ""
        });
        list.push({
            label: "List",
            value: "list"
        });
        list.push({
            label: "Invoice",
            value: "invoice"
        });

        return list;
    }
};
