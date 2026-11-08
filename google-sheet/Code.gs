/**
 * Vertex Web Studio - enquiry form -> Google Sheet
 * Paste this into Extensions > Apps Script of the Google Sheet that should
 * store enquiries, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone). See README.md in this folder.
 */
var SHEET_NAME = 'Enquiries';
var NOTIFY_EMAIL = 'infovertexwebstudio@gmail.com'; // set to '' to disable email from the script
var HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Project details', 'Source page'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var p = (e && e.parameter) || {};
    if (p.website) return out_({ok: true}); // honeypot: silently ignore bots
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
    var row = [
      new Date(), clean_(p.name), clean_(p.email), clean_(p.phone),
      clean_(p.company), clean_(p.service), clean_(p.details), clean_(p.page)
    ];
    sh.appendRow(row);
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: clean_(p.email),
        subject: 'New enquiry (sheet): ' + clean_(p.service),
        body: HEADERS.map(function (h, i) { return h + ': ' + row[i]; }).join('\n')
      });
    }
    return out_({ok: true});
  } catch (err) {
    return out_({ok: false, error: String(err)});
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() { return out_({ok: true, message: 'Vertex enquiry endpoint is live.'}); }

// Prevent spreadsheet formula injection (=, +, -, @ at the start of a cell).
function clean_(v) {
  v = (v == null ? '' : String(v)).trim().slice(0, 5000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
