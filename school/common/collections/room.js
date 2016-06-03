// Collection
School.Collection.Room = new Mongo.Collection("school_room");

// Schema
School.Schema.Room = new SimpleSchema({
    name: {
        type: String,
        max: 250,
        custom: function () {
            var data = School.Collection.Room.find({
                name: this.value,
                cpanel_branchId: this.field('cpanel_branchId').value
            });
            if (data.count() > 0) {
                return "uniqueRoomName";
            }
        }
    },
    number: {
        type: Number,
        label: "Number of student"
    },
    cpanel_branchId: {
        type: String
    }
});

// Attach schema
School.Collection.Room.attachSchema(School.Schema.Room);

// Custom message
SimpleSchema.messages({
    "uniqueRoomName": "[label] must be unique by branch."
});
