# 🗂️ Project Structure

```
src/
└── src
    ├── GlobalRedux
    │   ├── provider.tsx
    │   └── store.ts
    ├── GlobalRedux.zip
    ├── app
    │   ├── (auth)
    │   │   ├── confirm-account
    │   │   │   └── page.tsx
    │   │   ├── forget-password
    │   │   │   └── page.tsx
    │   │   ├── login
    │   │   │   └── page.tsx
    │   │   ├── new-password
    │   │   │   └── page.tsx
    │   │   ├── otp
    │   │   │   └── page.tsx
    │   │   └── signup
    │   │       └── page.tsx
    │   ├── Dashboard
    │   │   └── dashboard.tsx
    │   ├── add-note
    │   │   └── page.tsx
    │   ├── archive
    │   │   ├── bus
    │   │   │   └── page.tsx
    │   │   ├── driver
    │   │   │   └── page.tsx
    │   │   ├── employee
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   ├── parent
    │   │   │   └── page.tsx
    │   │   ├── store
    │   │   │   ├── digital-resource
    │   │   │   │   └── page.tsx
    │   │   │   ├── equipment
    │   │   │   │   └── page.tsx
    │   │   │   ├── facilities
    │   │   │   │   └── page.tsx
    │   │   │   ├── instructional-materials
    │   │   │   │   └── page.tsx
    │   │   │   └── textbooks
    │   │   │       └── page.tsx
    │   │   ├── student
    │   │   │   └── page.tsx
    │   │   ├── teacher
    │   │   │   └── page.tsx
    │   │   └── worker
    │   │       └── page.tsx
    │   ├── attendances
    │   │   ├── driver-attendance
    │   │   │   └── page.tsx
    │   │   ├── employee-attendance
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   ├── student-attendance
    │   │   │   └── page.tsx
    │   │   ├── teacher-attendance
    │   │   │   └── page.tsx
    │   │   └── worker-attendance
    │   │       └── page.tsx
    │   ├── bus-sender
    │   │   └── page.tsx
    │   ├── bus-tracking
    │   │   └── page.tsx
    │   ├── chat
    │   │   └── page.tsx
    │   ├── course
    │   │   ├── course-management
    │   │   │   ├── [courseId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-course
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   └── resource
    │   ├── document-management
    │   │   ├── certificate
    │   │   │   ├── [certificateID]
    │   │   │   │   └── page.tsx
    │   │   │   ├── achievement
    │   │   │   │   ├── [achievementId]
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-new-achievement
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-new-certificate
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-new-participation
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-new-professional
    │   │   │   │   └── page.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── participation
    │   │   │   │   ├── [participationID]
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx
    │   │   │   └── professional-development
    │   │   │       ├── [professionalID]
    │   │   │       │   └── page.tsx
    │   │   │       └── page.tsx
    │   │   ├── enrollment
    │   │   │   ├── date
    │   │   │   │   └── page.tsx
    │   │   │   └── status
    │   │   │       └── page.tsx
    │   │   ├── other
    │   │   │   ├── disciplinary
    │   │   │   │   ├── add-disciplinary
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── legal
    │   │   │   │   ├── LegalComponent.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── medical
    │   │   │   │   ├── add-medical
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── view
    │   │   │   │       └── [id]
    │   │   │   │           └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   └── transcript
    │   │       ├── [courseId]
    │   │       │   └── page.tsx
    │   │       ├── page.tsx
    │   │       └── points
    │   │           ├── [pointId]
    │   │           │   └── page.tsx
    │   │           └── page.tsx
    │   ├── educational-affairs
    │   │   ├── events
    │   │   │   ├── [eventId]
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── exams
    │   │   │   ├── [examId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-exam
    │   │   │   │   └── page.tsx
    │   │   │   ├── exam-result
    │   │   │   │   └── [examResId]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── grades
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   └── schedule
    │   │       ├── [eventId]
    │   │       │   └── page.tsx
    │   │       ├── add-schedule
    │   │       │   └── page.tsx
    │   │       ├── class
    │   │       │   └── page.tsx
    │   │       └── page.tsx
    │   ├── favicon.ico
    │   ├── features
    │   │   └── page.tsx
    │   ├── financial-management
    │   │   ├── activity
    │   │   │   ├── add-activity
    │   │   │   │   └── page.tsx
    │   │   │   ├── edit-activity
    │   │   │   │   └── [id]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── bank
    │   │   │   └── page.tsx
    │   │   ├── budget
    │   │   │   └── page.tsx
    │   │   ├── fees-management
    │   │   │   ├── [invoiceId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── new-invoice
    │   │   │   │   └── page.tsx
    │   │   │   ├── new-scholarship
    │   │   │   │   └── page.tsx
    │   │   │   ├── page.tsx
    │   │   │   └── scholarship
    │   │   │       ├── [scholarshipId]
    │   │   │       │   └── page.tsx
    │   │   │       └── page.tsx
    │   │   ├── material
    │   │   │   ├── add-material
    │   │   │   │   └── page.tsx
    │   │   │   ├── edit-material
    │   │   │   │   └── [id]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   ├── taxes
    │   │   │   ├── [taxesId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-taxes
    │   │   │   │   └── page.tsx
    │   │   │   ├── invoices
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── transport
    │   │   │   ├── add-transport
    │   │   │   │   └── page.tsx
    │   │   │   ├── edit-transport
    │   │   │   │   └── [id]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── tuition
    │   │   │   ├── add-tuition
    │   │   │   │   └── page.tsx
    │   │   │   ├── edit-tuition
    │   │   │   │   └── [id]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   └── uniform
    │   │       ├── add-uniform
    │   │       │   └── page.tsx
    │   │       ├── edit-uniform
    │   │       │   └── [id]
    │   │       │       └── page.tsx
    │   │       └── page.tsx
    │   ├── globals.css
    │   ├── infrastructure
    │   │   ├── bus
    │   │   │   ├── add-new-bus
    │   │   │   │   └── page.tsx
    │   │   │   ├── edit-bus
    │   │   │   │   └── [busId]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── classes
    │   │   │   ├── add-class
    │   │   │   │   └── page.tsx
    │   │   │   ├── class-details
    │   │   │   │   └── [classId]
    │   │   │   │       └── page.tsx
    │   │   │   ├── edit-class
    │   │   │   │   └── [classId]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── lab
    │   │   │   ├── [labId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-lab
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── library
    │   │   │   ├── add-library
    │   │   │   │   └── page.tsx
    │   │   │   ├── edit-library
    │   │   │   │   └── [id]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── office
    │   │   │   ├── [officeId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-office
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   └── store
    │   │       ├── digital-resource
    │   │       │   ├── add-digital
    │   │       │   │   └── page.tsx
    │   │       │   ├── edit-digital
    │   │       │   │   └── [id]
    │   │       │   │       └── page.tsx
    │   │       │   └── page.tsx
    │   │       ├── equipment
    │   │       │   ├── add-equipment
    │   │       │   │   └── page.tsx
    │   │       │   ├── edit-equipment
    │   │       │   │   └── [id]
    │   │       │   │       └── page.tsx
    │   │       │   └── page.tsx
    │   │       ├── facilities
    │   │       │   ├── add-facilities
    │   │       │   │   └── page.tsx
    │   │       │   ├── edit-facilities
    │   │       │   │   └── [id]
    │   │       │   │       └── page.tsx
    │   │       │   └── page.tsx
    │   │       ├── instructional-materials
    │   │       │   ├── add-instructional
    │   │       │   │   └── page.tsx
    │   │       │   ├── edit-instructional
    │   │       │   │   └── [id]
    │   │       │   │       └── page.tsx
    │   │       │   └── page.tsx
    │   │       └── textbooks
    │   │           ├── add-textbooks
    │   │           │   └── page.tsx
    │   │           ├── edit-textbooks
    │   │           │   └── [id]
    │   │           │       └── page.tsx
    │   │           └── page.tsx
    │   ├── insight
    │   │   ├── class
    │   │   │   └── page.tsx
    │   │   ├── ml-exam
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   └── school
    │   │       └── page.tsx
    │   ├── layout.tsx
    │   ├── notifies
    │   │   ├── page.tsx
    │   │   └── send-notifications
    │   │       └── page.tsx
    │   ├── organization-setting
    │   │   ├── annual
    │   │   │   ├── add-new-annual
    │   │   │   │   └── page.tsx
    │   │   │   ├── edit-annual
    │   │   │   │   └── [id]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── complaint
    │   │   │   ├── page.tsx
    │   │   │   └── parent
    │   │   │       └── page.tsx
    │   │   ├── department
    │   │   │   ├── [departmentId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-department
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── edit-school-logo
    │   │   │   └── page.tsx
    │   │   ├── exams
    │   │   │   ├── add-exam
    │   │   │   │   └── page.tsx
    │   │   │   ├── edit-exam
    │   │   │   │   └── [examId]
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   ├── payment
    │   │   │   └── page.tsx
    │   │   ├── permissions
    │   │   │   ├── add
    │   │   │   │   ├── employee
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── department-permission
    │   │   │   │   ├── [departmentId]
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx
    │   │   │   └── employee-permission
    │   │   │       ├── [empolyeeId]
    │   │   │       │   └── page.tsx
    │   │   │       └── page.tsx
    │   │   ├── position
    │   │   │   ├── [positionId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-position
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── reports
    │   │   │   └── page.tsx
    │   │   ├── semester
    │   │   │   ├── [semesterId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── add-semester
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   └── suggestions
    │   │       └── page.tsx
    │   ├── page.tsx
    │   ├── post-management
    │   │   ├── [postId]
    │   │   │   └── page.tsx
    │   │   ├── add-new-post
    │   │   │   └── page.tsx
    │   │   ├── news
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   └── reviews
    │   │       └── page.tsx
    │   ├── profile
    │   │   ├── page.tsx
    │   │   └── password
    │   │       └── page.tsx
    │   ├── providers
    │   │   └── themeProvider.tsx
    │   ├── search
    │   │   ├── employee
    │   │   │   └── page.tsx
    │   │   ├── fees
    │   │   │   └── page.tsx
    │   │   ├── infrastructure
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   ├── teacher
    │   │   │   └── page.tsx
    │   │   └── worker
    │   │       └── page.tsx
    │   └── user-management
    │       ├── driver
    │       │   ├── add-new-driver
    │       │   │   └── page.tsx
    │       │   ├── edit-driver
    │       │   │   └── [driverId]
    │       │   │       └── page.tsx
    │       │   ├── page.tsx
    │       │   └── view-driver
    │       │       └── [driverId]
    │       │           └── page.tsx
    │       ├── employee
    │       │   ├── add-new-employee
    │       │   │   └── page.tsx
    │       │   ├── edit-employee
    │       │   │   └── [employeeId]
    │       │   │       └── page.tsx
    │       │   ├── page.tsx
    │       │   └── view-employee
    │       │       └── [employeeId]
    │       │           └── page.tsx
    │       ├── page.tsx
    │       ├── parent
    │       │   ├── add-new-parent
    │       │   │   └── page.tsx
    │       │   ├── edit-parent
    │       │   │   └── [parentId]
    │       │   │       └── page.tsx
    │       │   ├── page.tsx
    │       │   └── view-parent
    │       │       └── [parentId]
    │       │           └── page.tsx
    │       ├── student
    │       │   ├── add-new-student
    │       │   │   └── page.tsx
    │       │   ├── edit-student
    │       │   │   └── [studentId]
    │       │   │       └── page.tsx
    │       │   ├── graduated
    │       │   │   └── page.tsx
    │       │   ├── page.tsx
    │       │   └── view-student
    │       │       └── [studentId]
    │       │           └── page.tsx
    │       ├── teacher
    │       │   ├── add-new-teacher
    │       │   │   └── page.tsx
    │       │   ├── edit-teacher
    │       │   │   └── [teacherId]
    │       │   │       └── page.tsx
    │       │   ├── page.tsx
    │       │   └── view-teacher
    │       │       └── [teacherId]
    │       │           └── page.tsx
    │       └── worker
    │           ├── add-new-worker
    │           │   └── page.tsx
    │           ├── edit-worker
    │           │   └── [workerId]
    │           │       └── page.tsx
    │           ├── page.tsx
    │           └── view-worker
    │               └── [workerId]
    │                   └── page.tsx
    ├── app.zip
    ├── components
    │   ├── AttendCard.tsx
    │   ├── BaseURL.ts
    │   ├── Box.tsx
    │   ├── BreadCrumbs.test.tsx
    │   ├── BreadCrumbs.tsx
    │   ├── Calendar.test.tsx
    │   ├── CardBackComponent.tsx
    │   ├── CardFrontComponent.tsx
    │   ├── Comment.tsx
    │   ├── Container.tsx
    │   ├── Dialog.tsx
    │   ├── ExpirePage.tsx
    │   ├── GradeReportCard.tsx
    │   ├── ImageComponent.test.tsx
    │   ├── ImageSrc.tsx
    │   ├── Input.tsx
    │   ├── MapComponent.tsx
    │   ├── MessageBubble.tsx
    │   ├── Modal.test.tsx
    │   ├── Notifications.tsx
    │   ├── Pagination.test.tsx
    │   ├── PermissionGuard.tsx
    │   ├── PhoneNumberInput.tsx
    │   ├── SeeMoreButton.tsx
    │   ├── Sheet.test.tsx
    │   ├── Skeleton.tsx
    │   ├── Switch.tsx
    │   ├── Table.tsx
    │   ├── Text.tsx
    │   ├── TimePacker.tsx
    │   ├── TimePicker.test.tsx
    │   ├── TimeTable.tsx
    │   ├── calendar.tsx
    │   ├── card.test.tsx
    │   ├── card.tsx
    │   ├── chat.tsx
    │   ├── circleProgress.tsx
    │   ├── cometchat.ts
    │   ├── cometchatUser.ts
    │   ├── driverInfo.tsx
    │   ├── dynamicPartition.tsx
    │   ├── employeeInfo.tsx
    │   ├── exams.tsx
    │   ├── loginChat.tsx
    │   ├── model.tsx
    │   ├── multiSelect.tsx
    │   ├── navBar.tsx
    │   ├── navBarRouts.tsx
    │   ├── pagination.tsx
    │   ├── parentInfo.tsx
    │   ├── registerChat.tsx
    │   ├── select.tsx
    │   ├── sheet.tsx
    │   ├── soon.tsx
    │   ├── spinner.tsx
    │   ├── studentInfo.tsx
    │   ├── teacherInfo.tsx
    │   ├── textEditor.tsx
    │   ├── timeLine.tsx
    │   ├── ui
    │   │   ├── card.tsx
    │   │   └── chart.tsx
    │   └── workerInfo.tsx
    ├── components.zip
    ├── features
    │   ├── Acadimic
    │   │   ├── courseApi.ts
    │   │   ├── examsApi.ts
    │   │   └── scheduleApi.ts
    │   ├── Document-Management
    │   │   ├── achievementApi.ts
    │   │   ├── certificatesApi.ts
    │   │   ├── disciplinaryApi.ts
    │   │   ├── enrollmentApi.ts
    │   │   ├── otherOfficialDocumentsApi.ts
    │   │   ├── participationApi.ts
    │   │   └── professionalApi.ts
    │   ├── Financial
    │   │   ├── activityApi.ts
    │   │   ├── bankApi.ts
    │   │   ├── budgetApi.ts
    │   │   ├── feesApi.ts
    │   │   ├── paymentApi.ts
    │   │   ├── paymentDueDateApi.ts
    │   │   ├── taxesApi.ts
    │   │   └── transportApi.ts
    │   ├── Infrastructure
    │   │   ├── busApi.ts
    │   │   ├── classApi.ts
    │   │   ├── labApi.ts
    │   │   ├── officeApi.ts
    │   │   ├── roomApi.ts
    │   │   └── storeApi.ts
    │   ├── Organization-Setteings
    │   │   ├── annualApi.ts
    │   │   ├── complainApi.ts
    │   │   ├── departmentApi.ts
    │   │   ├── departmentPermissionApi.ts
    │   │   ├── employeePermissionApi.ts
    │   │   ├── positionApi.ts
    │   │   ├── reportApi.ts
    │   │   └── semesterApi.ts
    │   ├── User-Management
    │   │   ├── driverApi.ts
    │   │   ├── employeeApi.ts
    │   │   ├── parentApi.ts
    │   │   ├── studentApi.ts
    │   │   ├── teacherApi.ts
    │   │   └── workerApi.ts
    │   ├── attendance
    │   │   └── attendanceApi.ts
    │   ├── boolyanSlice.ts
    │   ├── chat
    │   │   └── chatApi.ts
    │   ├── communication
    │   │   ├── notficationsApi.ts
    │   │   └── postApi.ts
    │   ├── dashboard
    │   │   └── dashboardApi.ts
    │   ├── events
    │   │   └── eventsApi.ts
    │   ├── language
    │   │   └── languageSlice.ts
    │   ├── loginApi.ts
    │   ├── school
    │   │   └── schoolLogo.ts
    │   ├── signupApi.ts
    │   └── userSlice.ts
    ├── features.zip
    ├── hooks
    │   ├── useGetAllNotifications.ts
    │   ├── useNotifications.ts
    │   ├── useRealChat.ts
    │   └── useRealTimeAllChats.ts
    ├── hooks.zip
    ├── lib
    │   └── utils.ts
    └── middleware.ts
```