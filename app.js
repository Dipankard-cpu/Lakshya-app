const defaultUpdates = [
  { title: "Admission counselling starts this week", meta: "New students can visit the office from 10 AM to 5 PM." },
  { title: "Board exam special batch announced", meta: "Class X and XII crash course seats are limited." },
  { title: "Routine updated for weekend batch", meta: "Saturday mathematics class starts at 4 PM." },
];

const defaultRoutine = [
  { day: "Monday", subject: "Mathematics", time: "5:00 PM - 6:30 PM", teacher: "D. Sir" },
  { day: "Tuesday", subject: "Physics", time: "5:00 PM - 6:30 PM", teacher: "A. Sir" },
  { day: "Wednesday", subject: "Chemistry", time: "5:00 PM - 6:30 PM", teacher: "R. Ma'am" },
  { day: "Thursday", subject: "English", time: "6:00 PM - 7:00 PM", teacher: "S. Ma'am" },
  { day: "Friday", subject: "Computer", time: "4:30 PM - 5:30 PM", teacher: "K. Sir" },
  { day: "Saturday", subject: "Mock Test", time: "3:00 PM - 5:00 PM", teacher: "Exam Desk" },
];

const defaultCourses = [
  "Class IX Foundation",
  "Class X Board Prep",
  "Class XI Science",
  "Class XII Science",
  "Spoken English",
  "Computer Basics",
];

const defaultLiveClass = {
  title: "Physics: Motion & Graphs",
  meta: "Next live class",
  url: "",
};

const admissionForm = document.querySelector("#admissionForm");
const studentLoginForm = document.querySelector("#studentLoginForm");
const studentPanel = document.querySelector("#studentPanel");
const updatesList = document.querySelector("#updatesList");
const routineTable = document.querySelector("#routineTable");
const applicationsList = document.querySelector("#applicationsList");
const applicationCount = document.querySelector("#applicationCount");
const studentBadge = document.querySelector("#studentBadge");
const clearApplications = document.querySelector("#clearApplications");
const joinClass = document.querySelector("#joinClass");
const classMessage = document.querySelector("#classMessage");
const todayOnly = document.querySelector("#todayOnly");
const liveClassTitle = document.querySelector("#liveClassTitle");
const liveClassMeta = document.querySelector("#liveClassMeta");
const staffLoginForm = document.querySelector("#staffLoginForm");
const adminTools = document.querySelector("#adminTools");
const adminStatus = document.querySelector("#adminStatus");
const adminLogout = document.querySelector("#adminLogout");
const staffLogout = document.querySelector("#staffLogout");
const updateForm = document.querySelector("#updateForm");
const routineForm = document.querySelector("#routineForm");
const classLinkForm = document.querySelector("#classLinkForm");
const sheetConfigForm = document.querySelector("#sheetConfigForm");
const sheetStatus = document.querySelector("#sheetStatus");
const teacherForm = document.querySelector("#teacherForm");
const teacherList = document.querySelector("#teacherList");
const courseForm = document.querySelector("#courseForm");
const courseList = document.querySelector("#courseList");
const courseSelect = document.querySelector("#courseSelect");
const staffView = document.querySelector("#staffView");
const staffModeText = document.querySelector("#staffModeText");
const studentDetailsTable = document.querySelector("#studentDetailsTable");
const exportStudents = document.querySelector("#exportStudents");
const attendanceForm = document.querySelector("#attendanceForm");
const attendanceStudentSelect = document.querySelector("#attendanceStudentSelect");
const attendanceList = document.querySelector("#attendanceList");
const attendanceCount = document.querySelector("#attendanceCount");
const studentEditForm = document.querySelector("#studentEditForm");
const cancelStudentEdit = document.querySelector("#cancelStudentEdit");
const editCourseSelect = document.querySelector("#editCourseSelect");
const staffActivityPanel = document.querySelector("#staffActivityPanel");
const pages = Array.from(document.querySelectorAll("[data-page]"));
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));

const storageKey = "studentPortalApplications";
const updatesKey = "studentPortalUpdates";
const routineKey = "studentPortalRoutine";
const liveClassKey = "studentPortalLiveClass";
const sheetUrlKey = "studentPortalSheetUrl";
const adminSessionKey = "studentPortalAdmin";
const staffRoleKey = "studentPortalStaffRole";
const teachersKey = "studentPortalTeachers";
const coursesKey = "studentPortalCourses";
const attendanceKey = "studentPortalAttendance";
const studentSessionKey = "studentPortalStudentId";
const staffActivityKey = "studentPortalStaffActivity";
const adminId = "DIPANKAR1";
const adminPassword = "Dip@123";

function readStore(key, fallback) {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getApplications() {
  return readStore(storageKey, []);
}

function saveApplications(applications) {
  writeStore(storageKey, applications);
}

function getUpdates() {
  return readStore(updatesKey, defaultUpdates);
}

function getRoutine() {
  return readStore(routineKey, defaultRoutine);
}

function getCourses() {
  return readStore(coursesKey, defaultCourses);
}

function getTeachers() {
  return readStore(teachersKey, []);
}

function getAttendance() {
  return readStore(attendanceKey, []);
}

function getStaffActivity() {
  return readStore(staffActivityKey, []);
}

function getLiveClass() {
  return readStore(liveClassKey, defaultLiveClass);
}

function getStaffRole() {
  return localStorage.getItem(staffRoleKey) || "";
}

function isAdminLoggedIn() {
  return localStorage.getItem(adminSessionKey) === "true";
}

function isStaffLoggedIn() {
  return Boolean(getStaffRole());
}

function getNextStudentId() {
  const ids = getApplications().map((app) => Number(app.studentId)).filter(Number.isFinite);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function findStudent(studentId) {
  return getApplications().find((app) => String(app.studentId) === String(studentId));
}


function showPage(pageId = "home") {
  const validPage = pages.some((page) => page.dataset.page === pageId) ? pageId : "home";
  pages.forEach((page) => page.classList.toggle("active", page.dataset.page === validPage));
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.nav === validPage));
  if (location.hash !== `#${validPage}`) {
    history.replaceState(null, "", `#${validPage}`);
  }
}


// generateStudentQR(student.studentId); hide kora holo


function renderCourses() {
  const courses = getCourses();
  courseSelect.innerHTML = `<option value="">Select course</option>${courses.map((course) => `<option>${escapeHtml(course)}</option>`).join("")}`;
  editCourseSelect.innerHTML = courses.map((course) => `<option>${escapeHtml(course)}</option>`).join("");
  courseList.innerHTML = courses
    .map(
      (course, index) => `
        <div class="mini-row">
          <span>${escapeHtml(course)}</span>
          ${isAdminLoggedIn() ? `<button class="text-button" type="button" data-course-delete="${index}">Remove</button>` : ""}
        </div>
      `
    )
    .join("");
}

function renderTeachers() {
  const teachers = getTeachers();
  teacherList.innerHTML = teachers.length
    ? teachers
        .map(
          (teacher, index) => `
            <div class="mini-row">
              <span>${escapeHtml(teacher.name)} · ${escapeHtml(teacher.teacherId)}</span>
              <button class="text-button" type="button" data-teacher-delete="${index}">Remove</button>
            </div>
          `
        )
        .join("")
    : `<p class="helper-text">No teacher added yet.</p>`;
}

function renderUpdates() {
  updatesList.innerHTML = getUpdates()
    .map(
      (update) => `
        <div class="update-item">
          <strong>${escapeHtml(update.title)}</strong>
          <span>${escapeHtml(update.meta)}</span>
        </div>
      `
    )
    .join("");
}

function renderRoutine(onlyToday = todayOnly.dataset.active === "true") {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const items = getRoutine()
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => !onlyToday || item.day === todayName);
  const visibleItems = items.length ? items : [{ day: todayName, subject: "No class", time: "Rest day", teacher: "Office" }];

  routineTable.innerHTML = visibleItems
    .map(
      (item) => `
        <div class="routine-card ${item.day === todayName ? "today" : ""}">
          <strong>${escapeHtml(item.day)} · ${escapeHtml(item.subject)}</strong>
          <span>${escapeHtml(item.time)}</span>
          <span>${escapeHtml(item.teacher)}</span>
          ${isAdminLoggedIn() && Number.isInteger(item.originalIndex) ? `<button class="text-button" type="button" data-routine-delete="${item.originalIndex}">Remove</button>` : ""}
        </div>
      `
    )
    .join("");
}

function renderApplications() {
  const applications = getApplications();
  applicationCount.textContent = `${applications.length} Applied`;

  if (!applications.length) {
    applicationsList.innerHTML = `<div class="empty-state full">এখনও কোনো admission form জমা হয়নি।</div>`;
    renderAttendanceStudents();
    renderStudentDetails();
    return;
  }

  applicationsList.innerHTML = applications
    .map(
      (app) => `
        <div class="application-card">
          <strong>ID ${escapeHtml(app.studentId)} · ${escapeHtml(app.studentName)}</strong>
          <span>${escapeHtml(app.course)} · ${escapeHtml(app.batch)}</span>
          <span>${escapeHtml(app.phone)}</span>
          <span>Joined: ${escapeHtml(app.joiningDate)}</span>
          <span>${app.sheetSynced ? "Google Sheet synced" : "Saved locally"}</span>
        </div>
      `
    )
    .join("");

  renderAttendanceStudents();
  renderStudentDetails();
}

function renderStudentSession() {
  const studentId = localStorage.getItem(studentSessionKey);
  const student = studentId ? findStudent(studentId) : null;
  studentBadge.textContent = student ? `${student.studentName} · ID ${student.studentId}` : "Guest Mode";
  studentPanel.hidden = !student;
  studentPanel.innerHTML = student ? renderIdCard(student) : "";
}

function renderIdCard(student) {
  const photo = student.photoData
    ? `<img src="${student.photoData}" alt="${escapeHtml(student.studentName)} photo" />`
    : `<div class="id-placeholder">${escapeHtml(student.studentName.charAt(0) || "S")}</div>`;

  return `
    <div class="id-card">
      <div class="id-photo">${photo}</div>
      <div>
        <p class="eyebrow">Student ID Card</p>
        <h3>${escapeHtml(student.studentName)}</h3>
        <p>ID No: ${escapeHtml(student.studentId)}</p>
        <p>Course: ${escapeHtml(student.course)}</p>
        <p>Joining: ${escapeHtml(student.joiningDate)}</p>
      </div>
    </div>
    <div class="id-actions">
      <button class="button secondary print-id" type="button">Print ID Card</button>
      <button class="button primary download-id" type="button">Download ID Card</button>
    </div>
  `;
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function downloadIdCard(student) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 540;
  const ctx = canvas.getContext("2d");
  const image = await loadImage(student.photoData);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e8f7f1";
  ctx.fillRect(0, 0, canvas.width, 120);
  ctx.fillStyle = "#118c64";
  ctx.fillRect(0, 0, 18, canvas.height);

  ctx.fillStyle = "#14213d";
  ctx.font = "bold 42px Arial";
  ctx.fillText("STUDENT ID CARD", 58, 78);
  ctx.font = "24px Arial";
  ctx.fillText("DIPANKAR Learning Center", 58, 110);

  ctx.strokeStyle = "#dbe4ee";
  ctx.lineWidth = 3;
  ctx.strokeRect(58, 160, 210, 260);

  if (image) {
    ctx.drawImage(image, 58, 160, 210, 260);
  } else {
    ctx.fillStyle = "#ecf9f4";
    ctx.fillRect(58, 160, 210, 260);
    ctx.fillStyle = "#087050";
    ctx.font = "bold 96px Arial";
    ctx.textAlign = "center";
    ctx.fillText((student.studentName || "S").charAt(0), 163, 320);
    ctx.textAlign = "left";
  }

  ctx.fillStyle = "#14213d";
  ctx.font = "bold 38px Arial";
  ctx.fillText(student.studentName || "-", 310, 190);
  ctx.font = "28px Arial";
  ctx.fillText(`ID No: ${student.studentId || "-"}`, 310, 250);
  ctx.fillText(`Course: ${student.course || "-"}`, 310, 305);
  ctx.fillText(`Joining Date: ${student.joiningDate || "-"}`, 310, 360);
  ctx.fillStyle = "#627083";
  ctx.font = "22px Arial";
  ctx.fillText("This card is generated from the student portal.", 310, 430);

  const link = document.createElement("a");
  link.download = `student-id-${student.studentId || "card"}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function renderLiveClass() {
  const liveClass = getLiveClass();
  liveClassTitle.textContent = liveClass.title || "Next live class";
  liveClassMeta.textContent = liveClass.meta || "Link will be added soon";
  classMessage.textContent = liveClass.url ? "" : "Admin live class link add করলে Join Class কাজ করবে।";
}

function renderAdmin() {
  const role = getStaffRole();
  const loggedIn = isStaffLoggedIn();
  const admin = isAdminLoggedIn();
  adminTools.hidden = !admin;
  staffView.hidden = !loggedIn;
  staffLoginForm.hidden = loggedIn;
  attendanceForm.hidden = !admin;
  clearApplications.hidden = !admin;
  studentEditForm.hidden = true;
  staffActivityPanel.hidden = !admin;
  adminStatus.textContent = loggedIn ? (admin ? "Admin" : "Teacher View") : "Locked";
  staffModeText.textContent = admin ? "Admin can edit everything and view all student details." : "Teacher view-only mode: no add, edit, delete, attendance marking, or settings access.";
  sheetConfigForm.querySelector('[name="sheetUrl"]').value = localStorage.getItem(sheetUrlKey) || "";
  sheetStatus.textContent = localStorage.getItem(sheetUrlKey) ? "Google Sheets connection saved." : "Not connected yet.";
  renderCourses();
  renderTeachers();
  renderRoutine();
  renderStudentDetails();
  renderAttendance();
  renderStaffActivity();
}

function renderStudentDetails() {
  if (!studentDetailsTable || !isStaffLoggedIn()) return;

  const applications = getApplications();
  if (!applications.length) {
    studentDetailsTable.innerHTML = `<div class="empty-state">No student records yet.</div>`;
    return;
  }

  const rows = applications
    .map(
      (app) => `
        <tr>
          <td>${renderStudentPhotoThumb(app)}</td>
          <td>${escapeHtml(app.studentId)}</td>
          <td>${escapeHtml(app.studentName)}</td>
          <td>${escapeHtml(app.guardianName)}</td>
          <td>${escapeHtml(app.phone)}</td>
          <td>${escapeHtml(app.course)}</td>
          <td>${escapeHtml(app.batch)}</td>
          <td>${escapeHtml(app.joiningDate)}</td>
          <td>${escapeHtml(app.address)}</td>
          ${isAdminLoggedIn() ? `<td><button class="text-button" type="button" data-student-edit="${escapeHtml(app.studentId)}">Edit</button><button class="text-button danger" type="button" data-student-delete="${escapeHtml(app.studentId)}">Delete</button></td>` : ""}
        </tr>
      `
    )
    .join("");

  studentDetailsTable.innerHTML = `
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>ID</th>
            <th>Name</th>
            <th>Guardian</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Batch</th>
            <th>Joining</th>
            <th>Address</th>
            ${isAdminLoggedIn() ? "<th>Actions</th>" : ""}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderStudentPhotoThumb(app) {
  if (app.photoData) {
    return `<img class="student-thumb" src="${app.photoData}" alt="${escapeHtml(app.studentName)} photo" />`;
  }
  return `<div class="student-thumb placeholder">${escapeHtml((app.studentName || "S").charAt(0))}</div>`;
}

function renderStaffActivity() {
  if (!staffActivityPanel || !isAdminLoggedIn()) return;
  const activity = getStaffActivity();

  if (!activity.length) {
    staffActivityPanel.innerHTML = `<div class="empty-state">No staff login attendance yet.</div>`;
    return;
  }

  staffActivityPanel.innerHTML = `
    <div class="panel-heading tight">
      <div>
        <p class="eyebrow">Admin Only</p>
        <h2>Staff Login Attendance</h2>
      </div>
    </div>
    <div class="attendance-list compact">
      ${activity
        .map(
          (item) => `
            <div class="attendance-card">
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.role)} · ${escapeHtml(item.loginId)}</span>
              <span>${escapeHtml(item.time)}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function recordStaffLogin({ role, loginId, name }) {
  const record = {
    role,
    loginId,
    name,
    time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
  };
  writeStore(staffActivityKey, [record, ...getStaffActivity()].slice(0, 50));
}

function startStudentEdit(studentId) {
  if (!isAdminLoggedIn()) return;
  const student = findStudent(studentId);
  if (!student) return;

  studentEditForm.hidden = false;
  studentEditForm.querySelector('[name="studentId"]').value = student.studentId || "";
  studentEditForm.querySelector('[name="studentName"]').value = student.studentName || "";
  studentEditForm.querySelector('[name="guardianName"]').value = student.guardianName || "";
  studentEditForm.querySelector('[name="phone"]').value = student.phone || "";
  studentEditForm.querySelector('[name="email"]').value = student.email || "";
  studentEditForm.querySelector('[name="course"]').value = student.course || "";
  studentEditForm.querySelector('[name="batch"]').value = student.batch || "Morning";
  studentEditForm.querySelector('[name="joiningDate"]').value = student.joiningDate || "";
  studentEditForm.querySelector('[name="address"]').value = student.address || "";
  studentEditForm.querySelector('[name="notes"]').value = student.notes || "";
  studentEditForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteStudent(studentId) {

  if(blockManagerDelete()) return;
  if (!isAdminLoggedIn()) return;
  const applications = getApplications().filter((app) => String(app.studentId) !== String(studentId));
  const attendance = getAttendance().filter((record) => String(record.studentId) !== String(studentId));
  saveApplications(applications);
  writeStore(attendanceKey, attendance);
  if (localStorage.getItem(studentSessionKey) === String(studentId)) {
    localStorage.removeItem(studentSessionKey);
  }
  renderApplications();
  renderStudentSession();
  renderAttendance();
}

function renderAttendanceStudents() {
  const applications = getApplications();
  attendanceStudentSelect.innerHTML = applications.length
    ? applications.map((app) => `<option value="${escapeHtml(app.studentId)}">ID ${escapeHtml(app.studentId)} · ${escapeHtml(app.studentName)}</option>`).join("")
    : `<option value="">No students yet</option>`;
}

function renderAttendance() {
  const records = getAttendance();
  attendanceCount.textContent = `${records.length} Records`;

  if (!records.length) {
    attendanceList.innerHTML = `<div class="empty-state">No attendance records yet.</div>`;
    return;
  }

  attendanceList.innerHTML = records
    .map((record) => {
      const student = findStudent(record.studentId);
      return `
        <div class="attendance-card">
          <strong>${escapeHtml(record.date)} · ${escapeHtml(record.status)}</strong>
          <span>ID ${escapeHtml(record.studentId)} · ${escapeHtml(student?.studentName || "Student")}</span>
          <span>Course: ${escapeHtml(student?.course || "-")}</span>
        </div>
      `;
    })
    .join("");
}

async function syncAdmissionToSheet(application) {
  const sheetUrl = localStorage.getItem(sheetUrlKey);

  if (!sheetUrl) return { synced: false };

  try {
    await fetch(sheetUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(application),
    });
    return { synced: true };
  } catch (error) {
    return { synced: false };
  }
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

admissionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(admissionForm);
  const application = Object.fromEntries(formData.entries());
  application.studentId = getNextStudentId();
  application.photoData = await fileToDataUrl(admissionForm.photo.files[0]);
  delete application.photo;
  application.submittedAt = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const syncResult = await syncAdmissionToSheet(application);
  application.sheetSynced = syncResult.synced;

  saveApplications([application, ...getApplications()]);
  localStorage.setItem(studentSessionKey, String(application.studentId));
  admissionForm.reset();
  renderApplications();
  renderStudentSession();
  showPage("student");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

studentLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const studentId = new FormData(studentLoginForm).get("studentId");
  const student = findStudent(studentId);
  if (!student) {
    studentPanel.hidden = false;
    studentPanel.innerHTML = `<div class="empty-state">এই ID দিয়ে কোনো student পাওয়া যায়নি।</div>`;
    return;
  }
  localStorage.setItem(studentSessionKey, String(student.studentId));
  studentLoginForm.reset();
  renderStudentSession();
});

studentPanel.addEventListener("click", (event) => {
  const student = findStudent(localStorage.getItem(studentSessionKey));
  if (!student) return;

  if (event.target.closest(".print-id")) {
    window.print();
  }
  if (event.target.closest(".download-id")) {
    downloadIdCard(student);
  }
});

clearApplications.addEventListener("click", () => {
  if (!isAdminLoggedIn()) return;
  localStorage.removeItem(storageKey);
  localStorage.removeItem(studentSessionKey);
  localStorage.removeItem(attendanceKey);
  renderApplications();
  renderStudentSession();
  renderAttendance();
});

joinClass.addEventListener("click", () => {
  const liveClass = getLiveClass();
  if (!liveClass.url) {
    classMessage.textContent = "Live class link এখনও add করা হয়নি।";
    return;
  }
  window.open(liveClass.url, "_blank", "noopener,noreferrer");
});

todayOnly.addEventListener("click", () => {
  const pressed = todayOnly.dataset.active === "true";
  todayOnly.dataset.active = String(!pressed);
  todayOnly.textContent = pressed ? "Today" : "All Days";
  renderRoutine(!pressed);
});

staffLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(staffLoginForm).entries());
  const adminLogin = data.loginId === adminId && data.password === adminPassword;
  const teacher = getTeachers().find((item) => item.teacherId === data.loginId && item.password === data.password);

  if (!adminLogin && !teacher) {
    adminStatus.textContent = "Wrong login";
    return;
  }

  localStorage.setItem(staffRoleKey, adminLogin ? "admin" : "teacher");
  if (adminLogin) localStorage.setItem(adminSessionKey, "true");
  if (!adminLogin) localStorage.removeItem(adminSessionKey);
  recordStaffLogin({
    role: adminLogin ? "Admin" : "Teacher",
    loginId: data.loginId,
    name: adminLogin ? "DIPANKAR1" : teacher.name,
  });
  staffLoginForm.reset();
  renderAdmin();
});

function logoutStaff() {
  localStorage.removeItem(staffRoleKey);
  localStorage.removeItem(adminSessionKey);
  renderAdmin();
}

adminLogout.addEventListener("click", logoutStaff);
staffLogout.addEventListener("click", logoutStaff);

sheetConfigForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdminLoggedIn()) return;
  const sheetUrl = new FormData(sheetConfigForm).get("sheetUrl").trim();
  if (sheetUrl) localStorage.setItem(sheetUrlKey, sheetUrl);
  else localStorage.removeItem(sheetUrlKey);
  renderAdmin();
});

teacherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdminLoggedIn()) return;
  const teacher = Object.fromEntries(new FormData(teacherForm).entries());
  writeStore(teachersKey, [...getTeachers(), teacher]);
  teacherForm.reset();
  renderTeachers();
});

teacherList.addEventListener("click", (event) => {
  if (!isAdminLoggedIn()) return;
  const button = event.target.closest("[data-teacher-delete]");
  if (!button) return;
  const teachers = getTeachers();
  teachers.splice(Number(button.dataset.teacherDelete), 1);
  writeStore(teachersKey, teachers);
  renderTeachers();
});

courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdminLoggedIn()) return;
  const course = new FormData(courseForm).get("course").trim();
  if (!course) return;
  writeStore(coursesKey, [...getCourses(), course]);
  courseForm.reset();
  renderCourses();
});

courseList.addEventListener("click", (event) => {
  if (!isAdminLoggedIn()) return;
  const button = event.target.closest("[data-course-delete]");
  if (!button) return;
  const courses = getCourses();
  courses.splice(Number(button.dataset.courseDelete), 1);
  writeStore(coursesKey, courses);
  renderCourses();
});

updateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdminLoggedIn()) return;
  const update = Object.fromEntries(new FormData(updateForm).entries());
  writeStore(updatesKey, [update, ...getUpdates()]);
  updateForm.reset();
  renderUpdates();
});

routineForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdminLoggedIn()) return;
  const routineItem = Object.fromEntries(new FormData(routineForm).entries());
  writeStore(routineKey, [...getRoutine(), routineItem]);
  routineForm.reset();
  renderRoutine();
});

routineTable.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-routine-delete]");
  if (!deleteButton || !isAdminLoggedIn()) return;
  const routine = getRoutine();
  routine.splice(Number(deleteButton.dataset.routineDelete), 1);
  writeStore(routineKey, routine);
  renderRoutine();
});

classLinkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdminLoggedIn()) return;
  const liveClass = Object.fromEntries(new FormData(classLinkForm).entries());
  writeStore(liveClassKey, liveClass);
  classLinkForm.reset();
  renderLiveClass();
});

attendanceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdminLoggedIn()) return;
  const record = Object.fromEntries(new FormData(attendanceForm).entries());
  writeStore(attendanceKey, [record, ...getAttendance()]);
  attendanceForm.reset();
  renderAttendance();
});

exportStudents.addEventListener("click", () => {
  const rows = [
    ["Student ID", "Name", "Guardian", "Phone", "Email", "Course", "Batch", "Joining Date", "Address", "Notes"],
    ...getApplications().map((app) => [
      app.studentId,
      app.studentName,
      app.guardianName,
      app.phone,
      app.email,
      app.course,
      app.batch,
      app.joiningDate,
      app.address,
      app.notes,
    ]),
  ];
  downloadCsv("student-details.csv", rows);
});

studentDetailsTable.addEventListener("click", (event) => {
  if (!isAdminLoggedIn()) return;
  const editButton = event.target.closest("[data-student-edit]");
  const deleteButton = event.target.closest("[data-student-delete]");

  if (editButton) {
    startStudentEdit(editButton.dataset.studentEdit);
  }

  if (deleteButton) {

    if(blockManagerDelete()) return;

    deleteStudent(deleteButton.dataset.studentDelete);
  }
});

studentEditForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdminLoggedIn()) return;

  const data = Object.fromEntries(new FormData(studentEditForm).entries());
  const applications = getApplications();
  const index = applications.findIndex((app) => String(app.studentId) === String(data.studentId));
  if (index === -1) return;

  const photoData = await fileToDataUrl(studentEditForm.querySelector('[name="photo"]').files[0]);
  delete data.photo;
  applications[index] = {
    ...applications[index],
    ...data,
    photoData: photoData || applications[index].photoData || "",
  };
  saveApplications(applications);
  studentEditForm.reset();
  studentEditForm.hidden = true;
  renderApplications();
  renderStudentSession();
  renderAttendance();
});

cancelStudentEdit.addEventListener("click", () => {
  studentEditForm.reset();
  studentEditForm.hidden = true;
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.nav);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

window.addEventListener("hashchange", () => {
  showPage(location.hash.replace("#", "") || "home");
});

admissionForm.joiningDate.valueAsDate = new Date();
attendanceForm.date.valueAsDate = new Date();
renderCourses();
renderUpdates();
renderRoutine();
renderApplications();
renderStudentSession();
renderLiveClass();
renderAdmin();
showPage(location.hash.replace("#", "") || "home");


// ===============================
// LAKSHYA NEW MANAGEMENT FEATURES
// ===============================

const paymentKey = "lakshya-payments";
const expenseKey = "lakshya-expenses";
const teacherSalaryKey = "lakshya-teacher-salary";

function addPayment(studentId, amount, month) {

  const payments = JSON.parse(localStorage.getItem(paymentKey) || "[]");

  payments.unshift({
    studentId,
    amount,
    month,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem(paymentKey, JSON.stringify(payments));

  renderOverview();
}

function addExpense(title, amount) {

  const expenses = JSON.parse(localStorage.getItem(expenseKey) || "[]");

  expenses.unshift({
    title,
    amount,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem(expenseKey, JSON.stringify(expenses));

  renderOverview();
}

function renderOverview() {

  const payments = JSON.parse(localStorage.getItem(paymentKey) || "[]");
  const expenses = JSON.parse(localStorage.getItem(expenseKey) || "[]");

  const income = payments.reduce((a,b)=>a + Number(b.amount),0);
  const expense = expenses.reduce((a,b)=>a + Number(b.amount),0);

  const profit = income - expense;

  const box = document.querySelector("#overviewPanel");

  if(box){
      box.innerHTML = `
        <div class="card">
          <h3>Total Income : ₹${income}</h3>
          <h3>Total Expense : ₹${expense}</h3>
          <h3>Net Profit : ₹${profit}</h3>
        </div>
      `;
  }
}

function calculateTeacherSalary() {

  const teachers = JSON.parse(localStorage.getItem("lakshya-teachers") || "[]");

  return teachers.map((teacher) => {

    const totalSalary =
      Number(teacher.salaryPerBatch || 0) *
      Number(teacher.totalBatch || 0);

    return {
      name: teacher.teacherName || "Teacher",
      totalBatch: teacher.totalBatch || 0,
      salary: totalSalary
    };
  });
}

function renderSalarySheet() {

  const data = calculateTeacherSalary();

  const box = document.querySelector("#salarySheet");

  if(box){

    box.innerHTML = data.map(item => `
      <div class="card">
        <h4>${item.name}</h4>
        <p>Total Batch : ${item.totalBatch}</p>
        <p>Salary : ₹${item.salary}</p>
      </div>
    `).join("");
  }
}

document.addEventListener("submit", (e) => {

  if(e.target.id === "paymentForm"){

      e.preventDefault();

      const form = new FormData(e.target);

      addPayment(
        form.get("studentId"),
        form.get("amount"),
        form.get("month")
      );

      alert("Payment Saved");

      e.target.reset();
  }

  if(e.target.id === "expenseForm"){

      e.preventDefault();

      const form = new FormData(e.target);

      addExpense(
        form.get("title"),
        form.get("amount")
      );

      alert("Expense Saved");

      e.target.reset();
  }
});

window.addEventListener("load", () => {
  renderOverview();
  renderSalarySheet();
});



// ===============================
// MANAGER ROLE SYSTEM
// ===============================

const managerAccounts = [
  {
    username: "manager",
    password: "1234",
    role: "manager",
    name: "Office Manager"
  }
];

function isManagerLoggedIn() {

   const user = JSON.parse(
      localStorage.getItem("staff-user") || "{}"
   );

   return user.role === "manager";
}

function blockManagerDelete(){

   if(isManagerLoggedIn()){

      alert("Manager cannot delete data");

      return true;
   }

   return false;
}



// =======================
// STAFF MANAGEMENT SYSTEM
// =======================

const staffKey = "lakshya-staffs";

function renderStaff(){

  const staffs = JSON.parse(
    localStorage.getItem(staffKey) || "[]"
  );

  const box = document.querySelector("#staffList");

  if(!box) return;

  box.innerHTML = staffs.map(staff => `
    <div class="card">
      <h4>${staff.name}</h4>
      <p>ID : ${staff.staffId}</p>
      <p>Role : ${staff.role}</p>
      <p>Password : ${staff.password}</p>
    </div>
  `).join("");
}

document.addEventListener("submit", (e) => {

  if(e.target.id === "staffForm"){

    e.preventDefault();

    const form = new FormData(e.target);

    const staffs = JSON.parse(
      localStorage.getItem(staffKey) || "[]"
    );

    staffs.unshift({
      name: form.get("name"),
      staffId: form.get("staffId"),
      password: form.get("password"),
      role: form.get("role")
    });

    localStorage.setItem(
      staffKey,
      JSON.stringify(staffs)
    );

    alert("Staff Added Successfully");

    e.target.reset();

    renderStaff();
  }
});

window.addEventListener("load", renderStaff);



// =====================================
// ROLE BASED ACCESS CONTROL SYSTEM
// =====================================

function getCurrentUser(){
   return JSON.parse(
      localStorage.getItem("staff-user") || "{}"
   );
}

function isAdmin(){
   return getCurrentUser().role === "admin";
}

function isManager(){
   return getCurrentUser().role === "manager";
}

function isTeacher(){
   return getCurrentUser().role === "teacher";
}

function protectOverview(){

   const overview = document.querySelector("#overviewPanel");

   if(overview && !isAdmin()){
      overview.innerHTML = "<h3>Only Admin Can View Overview</h3>";
   }
}

function protectDeleteButtons(){

   if(isAdmin()) return;

   document.querySelectorAll("[data-delete]").forEach(btn=>{
      btn.style.display = "none";
   });
}

window.addEventListener("load", ()=>{
   protectOverview();
   protectDeleteButtons();
});



// =====================================
// STAFF + TEACHER SALARY SYSTEM
// =====================================

const staffSalaryKey = "lakshya-staff-salary";

function renderTeacherSalaryOverview(){

   const teachers = JSON.parse(
      localStorage.getItem("lakshya-teachers") || "[]"
   );

   const box = document.querySelector("#teacherSalaryOverview");

   if(!box) return;

   box.innerHTML = teachers.map(t=>{

      const salary =
        Number(t.salaryPerBatch || 0) *
        Number(t.totalBatch || 0);

      return `
         <div class="card">
            <h4>${t.teacherName || "Teacher"}</h4>
            <p>Total Batch : ${t.totalBatch || 0}</p>
            <p>Monthly Salary : ₹${salary}</p>
         </div>
      `;

   }).join("");
}

function renderStaffSalary(){

   const staffs = JSON.parse(
      localStorage.getItem(staffSalaryKey) || "[]"
   );

   const box = document.querySelector("#staffSalaryOverview");

   if(!box) return;

   box.innerHTML = staffs.map(s=>`
      <div class="card">
        <h4>${s.staffName}</h4>
        <p>Salary : ₹${s.salary}</p>
      </div>
   `).join("");
}

document.addEventListener("submit", (e)=>{

   if(e.target.id === "staffSalaryForm"){

      e.preventDefault();

      if(!isAdmin()){

         alert("Only Admin Can Add Salary");

         return;
      }

      const form = new FormData(e.target);

      const staffs = JSON.parse(
        localStorage.getItem(staffSalaryKey) || "[]"
      );

      staffs.unshift({
         staffName: form.get("staffName"),
         salary: form.get("salary")
      });

      localStorage.setItem(
         staffSalaryKey,
         JSON.stringify(staffs)
      );

      renderStaffSalary();

      e.target.reset();
   }
});

window.addEventListener("load", ()=>{

   renderTeacherSalaryOverview();

   renderStaffSalary();

});



// ====================================
// ADMIN ONLY STAFF MANAGEMENT ACCESS
// ====================================

function protectStaffManagement(){

   const sections = document.querySelectorAll("section");

   sections.forEach(section=>{

      const title = section.innerText || "";

      if(
         title.includes("Staff / Teacher Management") ||
         title.includes("Add View-only Teacher")
      ){

         if(!isAdmin()){

            section.style.display = "none";
         }
      }
   });
}

function renderStaff(){

  const staffs = JSON.parse(
    localStorage.getItem(staffKey) || "[]"
  );

  const box = document.querySelector("#staffList");

  if(!box) return;

  box.innerHTML = staffs.map((staff,index) => `
    <div class="card">
      <h4>${staff.name}</h4>
      <p>ID : ${staff.staffId}</p>
      <p>Role : ${staff.role}</p>

      ${
        isAdmin()
        ? `<button data-delete-staff="${index}">Delete</button>`
        : ""
      }
    </div>
  `).join("");
}

document.addEventListener("click", (e)=>{

   const deleteBtn = e.target.closest("[data-delete-staff]");

   if(deleteBtn){

      if(!isAdmin()){

         alert("Only Admin Can Delete Staff");

         return;
      }

      const staffs = JSON.parse(
        localStorage.getItem(staffKey) || "[]"
      );

      staffs.splice(
        Number(deleteBtn.dataset.deleteStaff),
        1
      );

      localStorage.setItem(
        staffKey,
        JSON.stringify(staffs)
      );

      renderStaff();

      alert("Staff Deleted");
   }
});

window.addEventListener("load", ()=>{

   protectStaffManagement();

   renderStaff();

});



// ==============================
// LOGIN + LOGOUT SYSTEM RESTORE
// ==============================

const defaultAccounts = [
  {
    username:"admin",
    password:"admin123",
    role:"admin"
  },
  {
    username:"manager",
    password:"1234",
    role:"manager"
  }
];

function updateCurrentUserBox(){

   const user = JSON.parse(
      localStorage.getItem("staff-user") || "{}"
   );

   const box = document.querySelector("#currentUserBox");

   if(!box) return;

   if(user.username){

      box.innerHTML = `
         <h4>Logged In As : ${user.username}</h4>
         <p>Role : ${user.role}</p>
      `;

   }else{

      box.innerHTML = "<p>No User Logged In</p>";
   }
}

document.addEventListener("submit",(e)=>{

   if(e.target.id === "loginForm"){

      e.preventDefault();

      const form = new FormData(e.target);

      const username = form.get("username");
      const password = form.get("password");

      let accounts = [...defaultAccounts];

      const staffs = JSON.parse(
         localStorage.getItem("lakshya-staffs") || "[]"
      );

      staffs.forEach(s=>{
         accounts.push({
            username:s.staffId,
            password:s.password,
            role:s.role
         });
      });

      const found = accounts.find(acc=>
         acc.username === username &&
         acc.password === password
      );

      if(found){

         localStorage.setItem(
            "staff-user",
            JSON.stringify(found)
         );

         alert("Login Successful");

         updateCurrentUserBox();

         location.reload();

      }else{

         alert("Wrong Username or Password");
      }
   }
});

document.addEventListener("click",(e)=>{

   if(e.target.id === "logoutBtn"){

      localStorage.removeItem("staff-user");

      alert("Logged Out");

      location.reload();
   }
});

window.addEventListener("load",()=>{
   updateCurrentUserBox();
});



// ====================================
// ADVANCED PAYMENT MANAGEMENT SYSTEM
// ====================================

function renderPaymentHistory(){

   const payments = JSON.parse(
      localStorage.getItem(paymentKey) || "[]"
   );

   const box = document.querySelector("#paymentHistoryList");

   if(!box) return;

   box.innerHTML = payments.map((p,index)=>`

      <div class="card">

         <h4>${p.studentId}</h4>

         <p>Amount : ₹${p.amount}</p>

         <p>Month : ${p.month}</p>

         <p>Date : ${p.date}</p>

         ${
            isAdmin()
            ? `
               <button data-edit-payment="${index}">
                 Edit
               </button>

               <button data-delete-payment="${index}">
                 Delete
               </button>
             `
            : ""
         }

      </div>

   `).join("");
}

document.addEventListener("click",(e)=>{

   const deleteBtn = e.target.closest("[data-delete-payment]");

   if(deleteBtn){

      if(!isAdmin()){

         alert("Only Admin Can Delete");

         return;
      }

      const payments = JSON.parse(
         localStorage.getItem(paymentKey) || "[]"
      );

      payments.splice(
         Number(deleteBtn.dataset.deletePayment),
         1
      );

      localStorage.setItem(
         paymentKey,
         JSON.stringify(payments)
      );

      renderPaymentHistory();

      renderOverview();
   }

   const editBtn = e.target.closest("[data-edit-payment]");

   if(editBtn){

      if(!isAdmin()){

         alert("Only Admin Can Edit");

         return;
      }

      const payments = JSON.parse(
         localStorage.getItem(paymentKey) || "[]"
      );

      const item =
        payments[Number(editBtn.dataset.editPayment)];

      const newAmount = prompt(
        "Enter New Amount",
        item.amount
      );

      if(newAmount){

         item.amount = newAmount;

         localStorage.setItem(
            paymentKey,
            JSON.stringify(payments)
         );

         renderPaymentHistory();

         renderOverview();
      }
   }
});



// =================================
// ENHANCED PAYMENT CSV EXPORT
// =================================

function downloadPaymentCSV(){

   const payments = JSON.parse(
      localStorage.getItem(paymentKey) || "[]"
   );

   const students = JSON.parse(
      localStorage.getItem("lakshya-students") || "[]"
   );

   let csv =
"Student ID,Student Name,Phone,Guardian Name,Batch,Amount,Month,Date\n";

   payments.forEach(payment=>{

      const student = students.find(
         s =>
         s.studentId == payment.studentId
      ) || {};

      csv +=
`${payment.studentId},
${student.studentName || ""},
${student.phone || ""},
${student.guardianName || ""},
${student.batch || ""},
${payment.amount},
${payment.month},
${payment.date}
`;
   });

   const blob = new Blob([csv], {
      type: "text/csv"
   });

   const url = URL.createObjectURL(blob);

   const a = document.createElement("a");

   a.href = url;

   a.download = "student-payment-report.csv";

   a.click();
}



window.addEventListener("load",()=>{

   renderPaymentHistory();

   const panel =
document.querySelector("#paymentHistoryList");

   if(panel && isAdmin()){

      const btn = document.createElement("button");

      btn.innerText = "Download Payment CSV";

      btn.onclick = downloadPaymentCSV;

      panel.before(btn);
   }

});



// =================================
// STUDENT PAYMENT CARD SYSTEM
// =================================

function canManagePayments(){

   return isAdmin() || isManager();
}

function renderStudentPaymentCard(studentId){

   const students = JSON.parse(
      localStorage.getItem("lakshya-students") || "[]"
   );

   const payments = JSON.parse(
      localStorage.getItem(paymentKey) || "[]"
   );

   const student = students.find(
      s => s.studentId == studentId
   );

   const box = document.querySelector("#studentPaymentCard");

   if(!box) return;

   if(!student){

      box.innerHTML = "<h3>Student Not Found</h3>";

      return;
   }

   const studentPayments = payments.filter(
      p => p.studentId == studentId
   );

   box.innerHTML = `

      <div class="card">

         <h2>${student.studentName || "Student"}</h2>

         <p>ID : ${student.studentId}</p>

         <p>Phone : ${student.phone || ""}</p>

         <p>Guardian : ${student.guardianName || ""}</p>

         <p>Batch : ${student.batch || ""}</p>

         <hr>

         <h3>Payment History</h3>

         ${studentPayments.map((p,index)=>`

            <div class="card">

               <p>Amount : ₹${p.amount}</p>

               <p>Month : ${p.month}</p>

               <p>Date : ${p.date}</p>

               ${
                 isAdmin()
                 ? `
                    <button data-edit-payment="${index}">
                    Edit
                    </button>

                    <button data-delete-payment="${index}">
                    Delete
                    </button>
                   `
                 : ""
               }

            </div>

         `).join("")}

         ${
            canManagePayments()
            ? `
               <button onclick="downloadSingleStudentPayment('${student.studentId}')">
               Download Payment Report
               </button>
              `
            : ""
         }

      </div>

   `;
}

document.addEventListener("submit",(e)=>{

   if(e.target.id === "studentSearchForm"){

      e.preventDefault();

      const form = new FormData(e.target);

      renderStudentPaymentCard(
         form.get("studentId")
      );
   }
});

function downloadSingleStudentPayment(studentId){

   const students = JSON.parse(
      localStorage.getItem("lakshya-students") || "[]"
   );

   const payments = JSON.parse(
      localStorage.getItem(paymentKey) || "[]"
   );

   const student = students.find(
      s => s.studentId == studentId
   ) || {};

   const studentPayments = payments.filter(
      p => p.studentId == studentId
   );

   let csv =
"Student ID,Student Name,Phone,Guardian,Batch,Amount,Month,Date\n";

   studentPayments.forEach(p=>{

      csv +=
`${student.studentId},
${student.studentName || ""},
${student.phone || ""},
${student.guardianName || ""},
${student.batch || ""},
${p.amount},
${p.month},
${p.date}\n`;

   });

   const blob = new Blob([csv], {
      type:"text/csv"
   });

   const url = URL.createObjectURL(blob);

   const a = document.createElement("a");

   a.href = url;

   a.download = `${student.studentId}-payment-report.csv`;

   a.click();
}

// =================================
// STRICT ADMIN DATA CONTROL
// =================================

document.addEventListener("click",(e)=>{

   const editBtn = e.target.closest("[data-edit-payment]");

   if(editBtn && !isAdmin()){

      alert("Only Admin Can Edit");

      return;
   }

   const deleteBtn = e.target.closest("[data-delete-payment]");

   if(deleteBtn && !isAdmin()){

      alert("Only Admin Can Delete");

      return;
   }
});



// =====================================
// FIX STUDENT PAYMENT SEARCH SYSTEM
// =====================================

function normalizeId(id){
   return String(id).trim().toLowerCase();
}

function renderStudentPaymentCard(studentId){

   const students = JSON.parse(
      localStorage.getItem("lakshya-students") || "[]"
   );

   const payments = JSON.parse(
      localStorage.getItem(paymentKey) || "[]"
   );

   const student = students.find(
      s => normalizeId(s.studentId) === normalizeId(studentId)
   );

   const box = document.querySelector("#studentPaymentCard");

   if(!box) return;

   if(!student){

      box.innerHTML = "<h3>Student Not Found</h3>";

      return;
   }

   const studentPayments = payments.filter(
      p => normalizeId(p.studentId) === normalizeId(studentId)
   );

   box.innerHTML = `

      <div class="card">

         <h2>${student.studentName || "Student"}</h2>

         <p>ID : ${student.studentId}</p>

         <p>Phone : ${student.phone || ""}</p>

         <p>Guardian : ${student.guardianName || ""}</p>

         <p>Batch : ${student.batch || ""}</p>

         <hr>

         <h3>Payment History</h3>

         ${studentPayments.length > 0
            ? studentPayments.map((p)=>`

               <div class="card">

                  <p>Amount : ₹${p.amount}</p>

                  <p>Month : ${p.month}</p>

                  <p>Date : ${p.date}</p>

               </div>

            `).join("")
            : "<p>No Payment History</p>"
         }

         <button onclick="downloadSingleStudentPayment('${student.studentId}')">
         Download Payment Report
         </button>

      </div>

   `;
}



// =====================================
// FINAL WORKING PAYMENT CARD SYSTEM
// =====================================

function searchStudentPaymentCard(){

   const input = document.querySelector("#paymentSearchInput");

   if(!input) return;

   const studentId = String(input.value).trim();

   const students = JSON.parse(
      localStorage.getItem("lakshya-students") || "[]"
   );

   const payments = JSON.parse(
      localStorage.getItem("lakshya-payments") || "[]"
   );

   const student = students.find(
      s => String(s.studentId).trim() === studentId
   );

   const box = document.querySelector("#studentPaymentCard");

   if(!student){

      box.innerHTML = "<h2>Student Not Found</h2>";

      return;
   }

   const history = payments.filter(
      p => String(p.studentId).trim() === studentId
   );

   box.innerHTML = `

      <div class="card">

         <h2>${student.studentName || "Student"}</h2>

         <p><b>ID:</b> ${student.studentId}</p>

         <p><b>Phone:</b> ${student.phone || ""}</p>

         <p><b>Guardian:</b> ${student.guardianName || ""}</p>

         <p><b>Batch:</b> ${student.batch || ""}</p>

         <hr>

         <h3>Payment History</h3>

         ${
            history.length > 0
            ? history.map(p=>`
               <div class="card">
                  <p>Amount : ₹${p.amount}</p>
                  <p>Month : ${p.month}</p>
                  <p>Date : ${p.date}</p>
               </div>
            `).join("")
            : "<p>No Payment History</p>"
         }

         <button onclick="downloadSingleStudentPayment('${student.studentId}')">
         Download Payment Report
         </button>

      </div>

   `;
}

document.addEventListener("click",(e)=>{

   if(e.target.id === "searchPaymentBtn"){

      searchStudentPaymentCard();
   }
});

//jkjhjhjhhjjhhjjh
// ===================================
// FIREBASE AUTO BACKUP SYSTEM 1st changes succesfull hoyeche
// ===================================

async function backupAllData() {

   const db = window.firebaseDB;

   if(!db) return;

   const allData = {

      students:
      JSON.parse(localStorage.getItem("lakshya-students") || "[]"),

      payments:
      JSON.parse(localStorage.getItem("lakshya-payments") || "[]"),

      attendance:
      JSON.parse(localStorage.getItem("lakshya-attendance") || "[]"),

      teachers:
      JSON.parse(localStorage.getItem("lakshya-teachers") || "[]")

   };

   await window.setDoc(
      window.doc(db, "backup", "mainData"),
      allData
   );

   console.log("Backup Completed");
}

setInterval(() => {

   backupAllData();

}, 10000);


// ============================
// QR CODE SYSTEM 2nd time changes
// ============================

function generateStudentQR(studentId) {

   const qrBox = document.querySelector("#studentQR");

   if(!qrBox) return;

   qrBox.innerHTML = "";

   QRCode.toCanvas(studentId, {
      width: 180
   }, function (err, canvas) {

      if(err) return;

      qrBox.appendChild(canvas);
   });
}

// ===================================
// FIREBASE AUTO BACKUP SYSTEM add kora holo qr er jonno
// ===================================

async function backupAllData() {

   const db = window.firebaseDB;

   if(!db) return;

   const allData = {

      students:
      JSON.parse(localStorage.getItem("lakshya-students") || "[]"),

      payments:
      JSON.parse(localStorage.getItem("lakshya-payments") || "[]"),

      attendance:
      JSON.parse(localStorage.getItem("lakshya-attendance") || "[]"),

      teachers:
      JSON.parse(localStorage.getItem("lakshya-teachers") || "[]")

   };

   await db.collection("backup")
      .doc("mainData")
      .set(allData);

   console.log("Backup Completed");
}

setInterval(() => {

   backupAllData();

}, 10000);
