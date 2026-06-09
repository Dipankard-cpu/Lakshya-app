# Student Admission App

Open `index.html` in a browser to use the app.

## Included

- Admission form with local saved submissions
- Student profile registration
- Google Sheets submission connection through Apps Script
- Admin login for posting updates
- Routine editor with remove action
- Live class link management
- Student login with auto-generated numeric IDs
- Printable and downloadable student ID card with photo, name, ID, course, and joining date
- Attendance section with admin marking and teacher view-only access
- Editable admission course list
- Separate navigation pages for Home, Admission, Student ID, Updates, Routine, Attendance, and Staff
- Admin can edit/delete student details from the staff panel
- Student photos show in the student details table
- Admin-only staff login attendance shows the latest admin/teacher logins
- Responsive layout for mobile and desktop

## Admin

Default admin login:

- Login ID: `DIPANKAR1`
- Password: `Dip@123`

Teachers are added by the admin and can only view student details, routine, updates, and attendance. Teachers cannot add, edit, delete, mark attendance, or change settings.

## Google Sheets Setup

1. Create a Google Sheet and add a sheet tab named `Admissions`.
2. Add these headers: `Timestamp`, `Student ID`, `Name`, `Guardian`, `Phone`, `Email`, `Course`, `Batch`, `Joining Date`, `Address`, `Notes`, `Submitted At`, `Sync Status`.
3. Open Extensions > Apps Script.
4. Paste the code from `google-apps-script.gs`.
5. Deploy it as a Web App.
6. Paste the Web App URL into the admin panel.
