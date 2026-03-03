/**
 * Google Apps Script for Graduate Employment Application
 * Adapted to handle data synchronization in order.
 */

var HEADERS = [
  "student_id", "faculty", "department", "gender", "military_status", 
  "employment_status", "job_type", "job_type_other", "special_skill", "special_skill_other", 
  "job_position_code", "organization_name", "business_type", "org_address_no", "org_moo", 
  "org_building", "org_soi", "org_road", "org_subdistrict", "org_country", "org_zipcode", 
  "org_phone", "org_fax", "org_email", "avg_income", "job_satisfaction", "job_satisfaction_other", 
  "job_search_duration", "job_match", "knowledge_application", "unemployed_reason", 
  "unemployed_reason_other", "job_search_problems", "job_search_problems_other", 
  "work_location_pref", "work_country_pref", "work_position_pref", "skill_development_needs", 
  "data_disclosure_consent", "further_study_intent", "further_study_level", 
  "further_study_is_same_field", "further_study_field", "further_study_inst_type", 
  "further_study_reason", "further_study_reason_other", "further_study_problem", 
  "further_study_problem_other", "need_english", "need_computer", "need_accounting", 
  "need_internet", "need_practice", "need_research", "need_other", "need_chinese", 
  "need_asean", "need_other_detail", "suggestion_curriculum", "suggestion_teaching", 
  "suggestion_activity", "created_at"
];

/**
 * GET: Retrieve all graduate data
 */
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var result = {};

  if (data.length > 1) {
    var headers = data[0];
    for (var i = 1; i < data.length; i++) {
      var rowData = {};
      var sId = data[i][0]; // student_id is first column
      if (!sId) continue;

      for (var j = 0; j < headers.length; j++) {
        rowData[headers[j]] = data[i][j];
      }
      result[sId] = rowData;
    }
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST: Save or Update graduate data
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rawData;

  try {
    rawData = JSON.parse(e.postData.contents);
  } catch (err) {
    return createResponse("Error: Invalid JSON");
  }

  // Support both single object or array of objects
  var updates = Array.isArray(rawData) ? rawData : [rawData];
  
  // Ensure headers exist
  if (sheet.getLastColumn() === 0) {
    sheet.appendRow(HEADERS);
  }

  var sheetData = sheet.getDataRange().getValues();
  var headerRow = sheetData[0];

  updates.forEach(function(params) {
    var found = false;
    var studentId = params.student_id;
    if (!studentId) return;

    // Map data to row values based on HEADERS order
    var rowValues = HEADERS.map(function(h) {
      return (params[h] !== undefined && params[h] !== null) ? params[h] : "";
    });

    // Search for existing student_id (Column 1)
    for (var i = 1; i < sheetData.length; i++) {
      if (sheetData[i][0].toString() === studentId.toString()) {
        sheet.getRange(i + 1, 1, 1, rowValues.length).setValues([rowValues]);
        sheetData[i] = rowValues; // Update local copy
        found = true;
        break;
      }
    }

    // Append if not found
    if (!found) {
      sheet.appendRow(rowValues);
      sheetData.push(rowValues);
    }
  });

  return createResponse("Success");
}

function createResponse(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
