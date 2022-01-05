const UserActivityModel = require('../mongodb/models/userActivity');

class UserActivityRepository {
  static async getLeadInterestedCoursesByLeadId(modifiedUserId) {
    const courses = await UserActivityModel.find({
      'attachedLeadInterestedCourses.modifiedUserId': modifiedUserId
    });

    if (!courses) {
      return false;
    }

    return courses[0];
  }

  static async attachedLeadInterestedCourses(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    interestedCourses
  ) {
    try {
      const courses = await this.getLeadInterestedCoursesByLeadId(modifiedUserId);

      if (courses) {
        courses.attachedLeadInterestedCourses.interestedCourses.push(interestedCourses);

        await courses.save();
      } else {
        const change = new UserActivityModel({
          modifierUserId,
          activityBaseType,
          activityType,
          modifiedUserId,
          attachedLeadInterestedCourses: { modifiedUserId, interestedCourses }
        });

        await change.save();
        return change;
      }
      return courses;
    } catch (error) {
      throw new Error('UserActivityRepository [attachedLeadInterestedCourses] error: ', error);
    }
  }

  static async leadChangedToStudent(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    studentId
  ) {
    try {
      const change = new UserActivityModel({
        modifierUserId,
        activityBaseType,
        activityType,
        modifiedUserId,
        leadChangedToStudent: { modifiedUserId, studentId }
      });

      await change.save();
      return change;
    } catch (error) {
      throw new Error('UserActivityRepository [leadChangedToStudent] error: ', error);
    }
  }

  static async modifiedFirstName(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    oldState,
    newState
  ) {
    try {
      const change = new UserActivityModel({
        modifierUserId,
        activityBaseType,
        activityType,
        modifiedUserId,
        modifiedFirstName: { modifiedUserId, oldState, newState }
      });

      await change.save();
      return change;
    } catch (error) {
      throw new Error('UserActivityRepository [modifiedFirstName] error: ', error);
    }
  }

  static async modifiedLastName(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    oldState,
    newState
  ) {
    try {
      const change = new UserActivityModel({
        modifierUserId,
        activityBaseType,
        activityType,
        modifiedUserId,
        modifiedLastName: { modifiedUserId, oldState, newState }
      });

      await change.save();
      return change;
    } catch (error) {
      throw new Error('UserActivityRepository [modifiedLastName] error: ', error);
    }
  }

  static async modifedPhoneNumber(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    oldState,
    newState
  ) {
    try {
      const change = new UserActivityModel({
        modifierUserId,
        activityBaseType,
        activityType,
        modifiedUserId,
        modifedPhoneNumber: { modifiedUserId, oldState, newState }
      });

      await change.save();
      return change;
    } catch (error) {
      throw new Error('UserActivityRepository [modifedPhoneNumber] error: ', error);
    }
  }

  static async modifedAvatar(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    oldState,
    newState
  ) {
    try {
      const change = new UserActivityModel({
        modifierUserId,
        activityBaseType,
        activityType,
        modifiedUserId,
        modifedAvatar: { modifiedUserId, oldState, newState }
      });

      await change.save();
      return change;
    } catch (error) {
      throw new Error('UserActivityRepository [modifedAvatar] error: ', error);
    }
  }

  static async insertedLead(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    comment
  ) {
    try {
      const change = new UserActivityModel({
        modifierUserId,
        activityBaseType,
        activityType,
        modifiedUserId,
        insertedLead: { modifiedUserId, comment }
      });

      await change.save();
      return change;
    } catch (error) {
      throw new Error('UserActivityRepository [insertedLead] error: ', error);
    }
  }

  static async modifedRegion(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    oldState,
    newState
  ) {
    try {
      const change = new UserActivityModel({
        modifierUserId,
        activityBaseType,
        activityType,
        modifiedUserId,
        modifedRegion: { modifiedUserId, oldState, newState }
      });

      await change.save();
      return change;
    } catch (error) {
      throw new Error('UserActivityRepository [modifedRegion] error: ', error);
    }
  }

  static async leadChangedStatus(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    oldState,
    newState
  ) {
    try {
      const change = new UserActivityModel({
        modifierUserId,
        activityBaseType,
        activityType,
        modifiedUserId,
        leadChangedStatus: { modifiedUserId, oldState, newState }
      });

      await change.save();
      return change;
    } catch (error) {
      throw new Error('UserActivityRepository [leadChangedStatus] error: ', error);
    }
  }

  static async getLeadActivityByUserId(id) {
    try {
      const histories = await UserActivityModel.find({
        activityBaseType: {
          $in: ['users', 'leads']
        },
        modifiedUserId: id
      });

      return histories;
    } catch (error) {
      throw new Error('UserActivityRepository [getLeadActivityByUserId] error: ', error);
    }
  }

  static async getTeacherActivityByUserId(id) {
    try {
      const histories = await UserActivityModel.find({
        activityBaseType: {
          $in: ['users', 'teachers']
        },
        modifiedUserId: id
      });

      return histories;
    } catch (error) {
      throw new Error('UserActivityRepository [getTeacherActivityByUserId] error: ', error);
    }
  }

  static async insertedTeacher(
    modifierUserId,
    activityBaseType,
    activityType,
    modifiedUserId,
    teacherId
  ) {
    try {
      const change = new UserActivityModel({
        modifierUserId,
        activityBaseType,
        activityType,
        modifiedUserId,
        insertedTeacher: { modifiedUserId, teacherId }
      });

      await change.save();
      return change;
    } catch (error) {
      throw new Error('UserActivityRepository [insertedTeacher] error: ', error);
    }
  }
}

module.exports = UserActivityRepository;
