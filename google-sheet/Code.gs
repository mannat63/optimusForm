/**
 * Optimus ERP registration -> Google Sheets
 *
 * HOW TO USE (one-time setup):
 * 1. Create a new Google Sheet (this will store the registrations).
 * 2. In that sheet: Extensions -> Apps Script.
 * 3. Delete any starter code, paste EVERYTHING in this file, and Save.
 * 4. Click Deploy -> New deployment -> type "Web app".
 *      - Description:      Optimus ERP
 *      - Execute as:       Me
 *      - Who has access:   Anyone
 * 5. Click Deploy, authorize the permissions it asks for.
 * 6. Copy the "Web app" URL (ends with /exec).
 * 7. Paste that URL into SHEET_WEBAPP_URL in src/App.jsx.
 *
 * The first submission auto-creates the header row.
 */

const SHEET_NAME = "Registrations";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Roll",
        "Email",
        "Programme",
        "Major",
        "Minor",
        "Agree",
      ]);
    }

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.roll || "",
      data.email || "",
      data.programme || "",
      data.major || "",
      data.minor || "",
      data.agree ? "Yes" : "No",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
