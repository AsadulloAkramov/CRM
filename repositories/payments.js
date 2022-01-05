const Payment = require('../mongodb/models/payment');

class PaymentsRepository {
  static async getPayments(page, limit) {
    try {
      const payments = await Payment.find()
        .skip((page - 1) * limit)
        .limit(limit);

      return payments;
    } catch (error) {
      throw new Error(`[PaymentsRepository]:[getPayments]:${error}`);
    }
  }

  static async addPayment(branchId, courseId, reciverUserId, payerUserId, type, amount, comment) {
    try {
      const payment = new Payment({
        branchId,
        courseId,
        reciverUserId,
        payerUserId,
        type,
        amount,
        comment
      });
      return await payment.save();
    } catch (error) {
      throw new Error(`[PaymentsRepository]:[addPayment]:${error}`);
    }
  }

  static async getPaidStudentsByCourseId(courseId) {
    try {
      const payments = await Payment.find({
        courseId
      });

      return payments;
    } catch (error) {
      throw new Error(`[PaymentsRepository]:[getPaidStudentsByCourseId]:${error}`);
    }
  }

  static async getPaidAmountByUserId(userId) {
    try {
      const payments = await Payment.find({ payerUserId: userId });

      return payments;
    } catch (error) {
      throw new Error(`[PaymentsRepository]:[getPaidAmountByUserId]:${error}`);
    }
  }
}

module.exports = PaymentsRepository;
