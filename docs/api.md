# 📘 API Endpoint Documentation with Descriptions


## 📁 `.`

### 📄 `boolyanSlice.ts`
- ⚠️ No endpoints found.

### 📄 `loginApi.ts`
- ⚠️ No endpoints found.

### 📄 `signupApi.ts`

- **Endpoint Name:** `getAllNationalitys`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/nationality`
  - **Type:** `query`

- **Endpoint Name:** `getAllCountryCode`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/country-code`
  - **Type:** `query`

- **Endpoint Name:** `getAllsubjects`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/subject`
  - **Type:** `query`

- **Endpoint Name:** `getAllReginionID`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/region/search?page=0&size=1000000&name`
  - **Type:** `query`

- **Endpoint Name:** `getAllRoles`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/employee-role`
  - **Type:** `query`

- **Endpoint Name:** `getAllLevels`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/study-level`
  - **Type:** `query`

- **Endpoint Name:** `getAllRegistrations`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/registration-type`
  - **Type:** `query`

- **Endpoint Name:** `getAllLanguages`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/language`
  - **Type:** `query`

### 📄 `userSlice.ts`
- ⚠️ No endpoints found.


## 📁 `Acadimic`

### 📄 `courseApi.ts`

- **Endpoint Name:** `getAllCourses`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/course/all?size=1000000&page=0`
  - **Type:** `query`

- **Endpoint Name:** `getAllGrades`
  - **Method:** `GET`
  - **URL:** `/api/v1/grade-report/student-report?studentId=${studentId}&semesterId=${semesterId}`
  - **Type:** `query`

### 📄 `examsApi.ts`

- **Endpoint Name:** `getAllExams`
  - **Method:** `GET`
  - **URL:** `/api/v1/academic/educationalAffairs/exams`
  - **Type:** `query`

### 📄 `scheduleApi.ts`

- **Endpoint Name:** `averageGradesAtSchool`
  - **Method:** `GET`
  - **URL:** `/api/v1/daily-exam/grade/average-grades-at-school?period=SEMESTER`
  - **Type:** `query`

- **Endpoint Name:** `averageAttendance`
  - **Method:** `GET`
  - **URL:** `/api/v1/aiInsights/average-attendance-at-school`
  - **Type:** `query`

- **Endpoint Name:** `topStudentsInClass`
  - **Method:** `GET`
  - **URL:** `/api/v1/ai-insights/top-student-in-classroom?classroom-id=${classRoom}`
  - **Type:** `query`


## 📁 `attendance`

### 📄 `attendanceApi.ts`

- **Endpoint Name:** `getAllEmpolyeesAttend`
  - **Method:** `GET`
  - **URL:** `/api/v1/employee-attendance/by-role?date=&role=${role}&size=${size}&page=${page}&employeeType=${employeeType}`
  - **Type:** `query`

- **Endpoint Name:** `getAllStudentsAttend`
  - **Method:** `GET`
  - **URL:** `/api/v1/student-attendance/all?date=&size=${size}&page=${page}`
  - **Type:** `query`

- **Endpoint Name:** `getAllSchools`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/school/basic-info?name&size=1000000&page=0`
  - **Type:** `query`

- **Endpoint Name:** `getDriversCount`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/drivers-count`
  - **Type:** `query`

- **Endpoint Name:** `getDriversAttend`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/drivers-attendance?status=PRESENT`
  - **Type:** `query`


## 📁 `chat`

### 📄 `chatApi.ts`

- **Endpoint Name:** `getAllChats`
  - **Method:** `GET`
  - **URL:** `/api/v1/chat/all`
  - **Type:** `query`


## 📁 `communication`

### 📄 `notficationsApi.ts`

- **Endpoint Name:** `getAllNotifications`
  - **Method:** `GET`
  - **URL:** `/api/v1/my-notification/all?size=${size}&page=${page}`
  - **Type:** `query`

### 📄 `postApi.ts`

- **Endpoint Name:** `getAllPosts`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/post/all?size=1000000&page=0`
  - **Type:** `query`

- **Endpoint Name:** `getAllAllPosts`
  - **Method:** `GET`
  - **URL:** `/api/v1/post/all?size=1000000&page=0`
  - **Type:** `query`


## 📁 `dashboard`

### 📄 `dashboardApi.ts`

- **Endpoint Name:** `getAllCurrentUser`
  - **Method:** `GET`
  - **URL:** `/api/v1/my-account/profile/employee`
  - **Type:** `query`

- **Endpoint Name:** `getAllEmployees`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/employees-count`
  - **Type:** `query`

- **Endpoint Name:** `getAllWorkers`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/workers-count`
  - **Type:** `query`

- **Endpoint Name:** `getAllStudents`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/students-count`
  - **Type:** `query`

- **Endpoint Name:** `getAllTeachers`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/teachers-count`
  - **Type:** `query`

- **Endpoint Name:** `getAllNotices`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/notice-board`
  - **Type:** `query`

- **Endpoint Name:** `getAllCountrys`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/country/all`
  - **Type:** `query`

- **Endpoint Name:** `getTeacherAttendence`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/teachers-attendance?status=PRESENT`
  - **Type:** `query`

- **Endpoint Name:** `getStudentAttendence`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/students-attendance?status=PRESENT`
  - **Type:** `query`

- **Endpoint Name:** `getEmployeeAttendence`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/employees-attendance?status=PRESENT`
  - **Type:** `query`

- **Endpoint Name:** `getEventsInMonth`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/month-event-count`
  - **Type:** `query`

- **Endpoint Name:** `getEventsInWeek`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/week-event-count`
  - **Type:** `query`

- **Endpoint Name:** `getWorkerAttendence`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/workers-attendance?status=PRESENT`
  - **Type:** `query`

- **Endpoint Name:** `getNotices`
  - **Method:** `GET`
  - **URL:** `/api/management/note/all?page=0&size=100000`
  - **Type:** `query`

- **Endpoint Name:** `getStudentPercentage`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/student-increase-percentage`
  - **Type:** `query`

- **Endpoint Name:** `getExpenses`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/school-finance?start-date=${start}&end-date=${end}`
  - **Type:** `query`


## 📁 `Document-Management`

### 📄 `achievementApi.ts`

- **Endpoint Name:** `getAllAchievements`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/certificate/achievement/all?size=10&page=0`
  - **Type:** `query`

### 📄 `certificatesApi.ts`

- **Endpoint Name:** `getAllCertificates`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/certificate/completion/all?size=1000000&page=0`
  - **Type:** `query`

### 📄 `disciplinaryApi.ts`

- **Endpoint Name:** `getAllDisciplinaryRecords`
  - **Method:** `GET`
  - **URL:** `/api/v1/disciplinary-Record/all/disciplinary-record`
  - **Type:** `query`

- **Endpoint Name:** `getViolationTypes`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/violation-type`
  - **Type:** `query`

- **Endpoint Name:** `getActionsTaken`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/actions-taken`
  - **Type:** `query`

### 📄 `enrollmentApi.ts`

- **Endpoint Name:** `getEnrollmentStatus`
  - **Method:** `GET`
  - **URL:** `/api/v1/Enrollment/status`
  - **Type:** `query`

- **Endpoint Name:** `getEnrollmentDate`
  - **Method:** `GET`
  - **URL:** `/api/v1/Enrollment/date`
  - **Type:** `query`

### 📄 `otherOfficialDocumentsApi.ts`

- **Endpoint Name:** `getIdCards`
  - **Method:** `GET`
  - **URL:** `/api/v1/shared/user/id-cards?role=${role}`
  - **Type:** `query`

- **Endpoint Name:** `getStudentsWithMedicalStatus`
  - **Method:** `GET`
  - **URL:** `/api/v1/student/medical-record/students-with-status`
  - **Type:** `query`

- **Endpoint Name:** `getMedicalRecordByStudentId`
  - **Method:** `GET`
  - **URL:** `/api/v1/student/medical-record/${studentId}`
  - **Type:** `query`

- **Endpoint Name:** `createMedicalRecord`
  - **Method:** `POST`
  - **URL:** `/api/v1/student/medical-record/new`
  - **Type:** `mutation`

- **Endpoint Name:** `updateFolderName`
  - **Method:** `PUT`
  - **URL:** `/api/v1/files/update-folder-name/${folderId}`
  - **Type:** `mutation`

### 📄 `participationApi.ts`

- **Endpoint Name:** `getAllParticipations`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/certificate/participation/all?size=1000000&page=0`
  - **Type:** `query`

### 📄 `professionalApi.ts`

- **Endpoint Name:** `getAllProfessionals`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/certificate/professional-development/all?size=1000000&page=0`
  - **Type:** `query`

- **Endpoint Name:** `getTypesOfCertificates`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/certificate-type`
  - **Type:** `query`


## 📁 `events`

### 📄 `eventsApi.ts`

- **Endpoint Name:** `getAllEvents`
  - **Method:** `GET`
  - **URL:** `/api/v1/event/all?size=1000000&page=0&getActive=1`
  - **Type:** `query`

- **Endpoint Name:** `getSchoolLogo`
  - **Method:** `GET`
  - **URL:** `/api/v1/school-logo/name-logo`
  - **Type:** `query`

- **Endpoint Name:** `getAllEventsDashboard`
  - **Method:** `GET`
  - **URL:** `/api/v1/dashboard/upcoming-events?size=3&page=0&getActive=1`
  - **Type:** `query`


## 📁 `Financial`

### 📄 `activityApi.ts`

- **Endpoint Name:** `getActivityTypes`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/activity-type`
  - **Type:** `query`

- **Endpoint Name:** `getAllActivities`
  - **Method:** `GET`
  - **URL:** `/api/v1/activity-cost/all`
  - **Type:** `query`

- **Endpoint Name:** `getUnusedActivities`
  - **Method:** `GET`
  - **URL:** `/api/v1/activity-cost/unused-types`
  - **Type:** `query`

### 📄 `bankApi.ts`

- **Endpoint Name:** `getAllBankAcounts`
  - **Method:** `GET`
  - **URL:** `/api/v1/bank-account/all?size=1000000&page=0&getActive=1`
  - **Type:** `query`

### 📄 `budgetApi.ts`

- **Endpoint Name:** `getBudgetSummary`
  - **Method:** `GET`
  - **URL:** `/api/v1/budget/summary`
  - **Type:** `query`

### 📄 `feesApi.ts`

- **Endpoint Name:** `getAllInvoices`
  - **Method:** `GET`
  - **URL:** `/api/v1/invoice/all?size=10&page=0&getActive=1`
  - **Type:** `query`

- **Endpoint Name:** `getAllScholarship`
  - **Method:** `GET`
  - **URL:** `/api/v1/scholarship/all`
  - **Type:** `query`

- **Endpoint Name:** `getAllInvoicesItems`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/invoice-item-type`
  - **Type:** `query`

- **Endpoint Name:** `getAllCurrency`
  - **Method:** `GET`
  - **URL:** `/api/v1/public/enumeration/currency`
  - **Type:** `query`

### 📄 `paymentApi.ts`

- **Endpoint Name:** `getFeesItemsByType`
  - **Method:** `GET`
  - **URL:** `/api/v1/fees-item/all?type=${type}`
  - **Type:** `query`

- **Endpoint Name:** `getFeesItemById`
  - **Method:** `GET`
  - **URL:** `/api/v1/fees-item/update/${id}`
  - **Type:** `query`

### 📄 `paymentDueDateApi.ts`

- **Endpoint Name:** `getAllPayments`
  - **Method:** `GET`
  - **URL:** `/api/v1/fees-due-dates`
  - **Type:** `query`

### 📄 `taxesApi.ts`

- **Endpoint Name:** `getAllTaxes`
  - **Method:** `GET`
  - **URL:** `/api/v1/school-tax/all`
  - **Type:** `query`

- **Endpoint Name:** `getAllFessTaxes`
  - **Method:** `GET`
  - **URL:** `/api/v1/fees-taxes`
  - **Type:** `query`

### 📄 `transportApi.ts`

- **Endpoint Name:** `getAllBusCosts`
  - **Method:** `GET`
  - **URL:** `/api/v1/bus-cost/all`
  - **Type:** `query`

- **Endpoint Name:** `getBusCostByRegionId`
  - **Method:** `GET`
  - **URL:** `/api/v1/bus-cost/update?regionId=${regionId}`
  - **Type:** `query`


## 📁 `Infrastructure`

### 📄 `busApi.ts`
- ⚠️ No endpoints found.

### 📄 `classApi.ts`

- **Endpoint Name:** `getAllClasss`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/classroom/all?size=1000000&page=0&semesterId=`
  - **Type:** `query`

### 📄 `labApi.ts`

- **Endpoint Name:** `getAllLabs`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/lab/all?size=10&page=0&semesterId`
  - **Type:** `query`

### 📄 `officeApi.ts`

- **Endpoint Name:** `getAllOffices`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/office/all?size=10&page=0&semesterId`
  - **Type:** `query`

### 📄 `roomApi.ts`

- **Endpoint Name:** `getAllRooms`
  - **Method:** `GET`
  - **URL:** `/api/v1/room/by-category?category=LIBRARY`
  - **Type:** `query`

### 📄 `storeApi.ts`

- **Endpoint Name:** `getAllResources`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/resource/all?resourceType=${resourceType}&archived=${archive}`
  - **Type:** `query`


## 📁 `language`

### 📄 `languageSlice.ts`
- ⚠️ No endpoints found.


## 📁 `Organization-Setteings`

### 📄 `annualApi.ts`

- **Endpoint Name:** `getAllAnnualLeaves`
  - **Method:** `GET`
  - **URL:** `/api/v1/annual-leave/all`
  - **Type:** `query`

### 📄 `complainApi.ts`

- **Endpoint Name:** `getAllComplains`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/complain/all?size=1000000&page=0&deleted=false&type=${type}&approved=${approved}`
  - **Type:** `query`

### 📄 `departmentApi.ts`

- **Endpoint Name:** `getAllDepartments`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/department/all?size=1000000&page=0`
  - **Type:** `query`

### 📄 `departmentPermissionApi.ts`

- **Endpoint Name:** `getAllDepartmentPermissionPermissions`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/permission/department/all?size=1000000&page=0`
  - **Type:** `query`

### 📄 `employeePermissionApi.ts`

- **Endpoint Name:** `getAllEmployeePermissions`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/permission/employee/all?size=1000000&page=0`
  - **Type:** `query`

- **Endpoint Name:** `getAllCategories`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/permission/employee/permission_categories`
  - **Type:** `query`

### 📄 `positionApi.ts`

- **Endpoint Name:** `getAllPositions`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/position/all?size=1000000&page=0`
  - **Type:** `query`

### 📄 `reportApi.ts`
- ⚠️ No endpoints found.

### 📄 `semesterApi.ts`

- **Endpoint Name:** `getAllSemesters`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/semester/all?size=1000000&page=0`
  - **Type:** `query`

- **Endpoint Name:** `getAllAcadimicYear`
  - **Method:** `GET`
  - **URL:** `/api/v1/student-study/Academic-YEAR`
  - **Type:** `query`


## 📁 `school`

### 📄 `schoolLogo.ts`

- **Endpoint Name:** `getSchoolLogoName`
  - **Method:** `GET`
  - **URL:** `/api/v1/school-logo/name-logo`
  - **Type:** `query`


## 📁 `User-Management`

### 📄 `driverApi.ts`

- **Endpoint Name:** `getAllPositions`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/position/all?size=1000000&page=0`
  - **Type:** `query`

- **Endpoint Name:** `getAllDrivers`
  - **Method:** `GET`
  - **URL:** `api/v1/management/employee/all?size=${size}&page=${page}&type=DRIVER&archived=${archived}`
  - **Type:** `query`

### 📄 `employeeApi.ts`

- **Endpoint Name:** `getAllEmployees`
  - **Method:** `GET`
  - **URL:** `api/v1/management/employee/all?size=${size}&page=${page}&type=EMPLOYEE&archived=${archived}`
  - **Type:** `query`

### 📄 `parentApi.ts`

- **Endpoint Name:** `getAllParents`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/parent/all?size=${size}&page=${page}&archived=${archived}`
  - **Type:** `query`

### 📄 `studentApi.ts`

- **Endpoint Name:** `getAllStudents`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/student/all?size=${size}&page=${page}&archived=${archived}&graduated=${graduated}&genders=${gender}&classroom-names=${classRoom}`
  - **Type:** `query`

- **Endpoint Name:** `exportStudentsFile`
  - **Method:** `GET`
  - **URL:** `/api/v1/export/student/excel?size=${size}&page=${page}&archived=${archived}&graduated=${graduated}`
  - **Type:** `query`

- **Endpoint Name:** `getStudentExams`
  - **Method:** `GET`
  - **URL:** `/api/v1/student-study/schedule-at-date-for-admin-to-student?date=${date}&studentId=${id}`
  - **Type:** `query`

### 📄 `teacherApi.ts`

- **Endpoint Name:** `getAllTeachers`
  - **Method:** `GET`
  - **URL:** `/api/v1/management/teacher/all?size=${size}&page=${page}&archived=${archived}`
  - **Type:** `query`

- **Endpoint Name:** `getAllUsersChat`
  - **Method:** `GET`
  - **URL:** `/api/v1/shared/user/all?size=1000000&page=0`
  - **Type:** `query`

### 📄 `workerApi.ts`

- **Endpoint Name:** `getAllWorkers`
  - **Method:** `GET`
  - **URL:** `api/v1/management/employee/all?size=${size}&page=${page}&type=WORKER&archived=${archived}`
  - **Type:** `query`
