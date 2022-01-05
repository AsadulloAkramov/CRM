require('dotenv').config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT,
  SMS_SERVICE: {
    url: process.env.SMS_SERVICE_URL,
    login: process.env.SMS_SERVICE_LOGIN,
    password: process.env.SMS_SERVICE_PASSWORD,
    authorization: process.env.SMS_SERVICE_AUTHORIZATION,
    originator: process.env.SMS_SERVICE_ORIGINATOR
  },
  BOT: {
    url: process.env.BOT_SERVER_URL,
    accessToken: process.env.BOT_SERVER_ACCESS_TOKEN,
    token: process.env.BOT_TOKEN
  },
  POSTGRES: {
    host: process.env.POSTGRES_DB_HOST,
    port: process.env.POSTGRES_DB_PORT,
    user: process.env.POSTGRES_DB_USER,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB_NAME
  },
  MONGODB: {
    url: process.env.MONGODB_URL
  },
  JWT: {
    key: process.env.JWT_SECRET_KEY,
    expiration: process.env.JWT_EXPIRATION
  },
  MODULES: {
    regions: 'Viloyatlar',
    branches: 'Filiallar',
    courses: 'Kurslar',
    users: 'Foydalanuvchilar',
    modules: 'Modullar',
    roles: 'Rollar',
    permissions: 'Ruxsatlar',
    rooms: 'Honalar',
    teachers: 'Ustozlar',
    groups: 'Guruhlar',
    students: "O'quvchilar",
    lessons: 'Darslar',
    attendances: 'Davomatlar',
    studentsMark: "O'quvchilarni baholash",
    attendancesNotification: 'Davomat bildirishnomalari',
    settings: 'Sozlamalar',
    operators: 'Operatorlar',
    deposits: 'Depozit',
    studentsGroupsHistory: "O'quvchilarning guruhlardagi tarixi",
    candidates: 'Kurs uchun nomzodlar',
    payments: "To'lovlar",
    suggestions: 'Takliflar',
    requirements: 'Talablar',
    requirementTopics: 'Talab mavzusi',
    suggestionStatusHistories: 'Taklif statuslari tarixi',
    requirementStatusHistories: 'Talab statuslari tarixi',
    feedbacks: "O'qituvchilar uchun berilgan baholar ",
    feedbacksForTeacherHistories: "O'qituvchilar uchun berilgan baholar tarixi",
    paymentsStatus: 'Toʻlovlar statusi',
    prices: 'Narxlar',
    leads: 'Lidlar',
    interestedUsers: 'Qiziquvchilar',
    leadsStatus: 'Lidlar statusi',
    tasks: 'Vazifalar',
    contactLeadHistories: 'Lid bilan aloqa tarixi',
    leadInterestedCourses: 'Lidni qiziqqan kurslari',
    contactHistory: 'Aloqa tarixi',
    studentsStatus: "O'quvchilar statusi",
    allTasks: 'Barcha vazifalar',
    example: 'Example',
    admins: 'Adminstratorlar',
    assistants: 'Assistantlar',
    finance: 'Moliya'
  },
  ROLES: {
    superAdmin: 'Super Admin',
    admin: 'Administration',
    teacher: 'Ustoz',
    assistant: 'Assistant'
  }
};
