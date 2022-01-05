const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    modifierUserId: {
      type: Number
    },
    activityBaseType: {
      type: [String],
      enum: ['users', 'leads', 'students', 'teachers']
    },
    activityType: {
      type: String,
      enum: [
        'lead_changed_to_student',
        'attached_lead_interested_courses',
        'modified_first_name',
        'modified_last_name',
        'modified_region',
        'modified_phone_number',
        'modified_avatar',
        'inserted_lead',
        'lead_changed_status',
        'inserted_teacher'
      ]
    },
    modifiedUserId: Number,
    leadChangedToStudent: {
      modifiedUserId: Number,
      studentId: Number
    },
    attachedLeadInterestedCourses: {
      modifiedUserId: Number,
      interestedCourses: [Number]
    },
    modifiedFirstName: {
      modifiedUserId: Number,
      oldState: String,
      newState: String
    },
    modifiedLastName: {
      modifiedUserId: Number,
      oldState: String,
      newState: String
    },
    modifedAvatar: {
      modifiedUserId: Number,
      oldState: String,
      newState: String
    },
    modifedPhoneNumber: {
      modifiedUserId: Number,
      oldState: String,
      newState: String
    },
    insertedLead: {
      modifiedUserId: Number,
      comment: String
    },
    modifedRegion: {
      modifiedUserId: Number,
      oldState: String,
      newState: String
    },
    leadChangedStatus: {
      modifiedUserId: Number,
      oldState: Number,
      newState: Number
    },
    insertedTeacher: {
      modifiedUserId: Number,
      teacherId: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('user_activity', schema);
