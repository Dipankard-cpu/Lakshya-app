function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Admissions");
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.studentId || "",
    data.studentName || "",
    data.guardianName || "",
    data.phone || "",
    data.email || "",
    data.course || "",
    data.batch || "",
    data.joiningDate || "",
    data.address || "",
    data.notes || "",
    data.submittedAt || "",
    data.sheetSynced ? "Synced" : "Local",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
