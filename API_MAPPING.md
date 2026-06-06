# Backend API ↔ Frontend mapping

All services live in `src/api/services/` and are exported from `src/api/index.ts`.

| Backend | Service | UI |
|---------|---------|-----|
| **Auth** `/api/auth/*` | `authService` | login, register, forgot/reset, verify email |
| **User** `/api/user/*` | `userService` | profile, settings, admin users/staff |
| **Public** `/api/public/*` | `publicService` | home, channeling, book appointment |
| **Doctors** `/api/doctors/*` | `doctorService` | admin doctors, doctor home `/me` |
| **Departments** `/api/departments/*` | `departmentService` | admin departments |
| **Appointments** `/api/appointments/*` | `appointmentService` | book, my, schedule, confirm, reschedule |
| **Reception** `/api/reception/*` | `receptionService` | walk-in, patients, create appt, today |
| **Patients** `/api/patients/*` | `patientService` | resolve patient id for bills/reports |
| **Pharmacy** `/api/pharmacy/*` | `pharmacyService` | pharmacist inventory |
| **Bills** `/api/bills/*` | `billService` | billing screens |
| **Payments** `/api/payments/*` | `paymentService` | PayHere checkout & status |
| **Medical reports** `/api/medical-reports/*` | `medicalReportService` | reports upload/download/delete |
| **Files** `/api/files/*` | `fileService` | optional uploads (profile uses `/user/update`) |

PayHere notify URL is server-only (`POST /api/payments/payhere/notify`).
