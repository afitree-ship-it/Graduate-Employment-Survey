/**
 * Google Apps Script for Graduate Employment Application
 * ระบบบันทึกข้อมูลและแยกแผ่นงานคณะอัตโนมัติ
 */

// 1. รายชื่อคณะ (ต้องตรงกับในแอป)
var FACULTY_NAMES = [
  "คณะอิสลามศึกษาและนิติศาสตร์",
  "คณะศิลปศาสตร์และสังคมศาสตร์",
  "คณะวิทยาศาสตร์และเทคโนโลยี",
  "คณะศึกษาศาสตร์"
];

// 2. ชื่อแผ่นงานหลัก
var MAIN_SHEET_NAME = "ข้อมูลทั้งหมด";

// 3. คีย์ข้อมูลภาษาอังกฤษ (ลำดับต้องตรงกับหัวตาราง)
var DATA_KEYS = [
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

// 4. หัวตารางภาษาไทย
var THAI_HEADERS = [
  "รหัสประจำตัวนักศึกษา", "คณะ", "สาขาวิชา", "เพศ", "สถานะการเกณฑ์ทหาร", 
  "สถานภาพของการทำงาน", "ประเภทงานที่ทำ", "ระบุประเภทงานเพิ่มเติม", "ความสามารถพิเศษ", "ความสามารถพิเศษ ระบุข้อความเพิ่มเติม", 
  "รหัสตำแหน่งงาน", "ชื่อหน่วยงาน", "ประเภทกิจการ", "เลขที่ตั้ง", "หมู่ที่", 
  "ชื่ออาคาร/ชั้น/นิคม", "ซอย", "ถนน", "ตำบล/แขวง", "ประเทศที่ทำงาน", "รหัสไปรษณีย์", 
  "หมายเลขโทรศัพท์หน่วยงาน", "หมายเลขโทรสาร", "อีเมลหน่วยงาน", "รายได้เฉลี่ยต่อเดือน (บาท)", "ความพอใจต่องานที่ทำ", "ความพอใจต่องานที่ทำ ระบุข้อความเพิ่มเติม", 
  "ระยะเวลาการหางานทำ", "งานที่ทำตรงกับที่สำเร็จการศึกษา", "การนำความรู้ที่เรียนมาประยุกต์ใช้", "สาเหตุที่ยังไม่ทำงาน", 
  "ระบุสาเหตุเพิ่มเติม", "ปัญหาในการหางานทำ", "ระบุปัญหาเพิ่มเติม", 
  "ความต้องการทำงาน", "ประเทศที่ต้องการทำงาน", "ตำแหน่งที่ต้องการทำงาน", "ความต้องการพัฒนาทักษะ", 
  "แสดงความประสงค์ในการเปิดเผยข้อมูลแก่นายจ้าง", "ความต้องการศึกษาต่อของบัณฑิต", "ระดับการศึกษาที่ต้องการ", 
  "สาขาที่ต้องการศึกษาต่อเป็นสาขาเดิมหรือไม่", "ระบุสาขาวิชาที่ต้องการศึกษาต่อ", "ประเภทสถาบันที่กำลังศึกษาต่อ", 
  "เหตุผลที่กำลังศึกษาต่อ", "ระบุเหตุผลเพิ่มเติม", "ปัญหาในการศึกษาต่อ", 
  "ระบุปัญหาเพิ่มเติม", "ทักษะภาษาอังกฤษ", "ทักษะคอมพิวเตอร์", "ทักษะการบัญชี", 
  "ทักษะอินเทอร์เน็ต", "ทักษะการฝึกงาน", "ทักษะการวิจัย", "ทักษะอื่นๆ", "ทักษะภาษาจีน", 
  "ทักษะภาษาอาเซียน", "รายละเอียดทักษะอื่นๆ", "ข้อเสนอแนะด้านหลักสูตร", "ข้อเสนอแนะด้านการเรียนการสอน", 
  "ข้อเสนอแนะด้านกิจกรรมนักศึกษา", "วันที่บันทึกข้อมูล"
];

/**
 * SETUP: ฟังก์ชันเริ่มต้นสร้างแผ่นงานทั้งหมด
 * ให้กดปุ่ม "เรียกใช้" (Run) ฟังก์ชันนี้ก่อนเริ่มใช้งาน
 */
function initSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // สร้างแผ่นงานหลัก
  var mainSheet = ss.getSheetByName(MAIN_SHEET_NAME) || ss.getSheetByName("Sheet1");
  if (!mainSheet) {
    mainSheet = ss.insertSheet(MAIN_SHEET_NAME);
  } else {
    mainSheet.setName(MAIN_SHEET_NAME);
  }
  formatSheet(mainSheet);

  // สร้างแผ่นงานคณะ
  FACULTY_NAMES.forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    formatSheet(sheet);
  });
  
  Logger.log("ตั้งค่าแผ่นงานเสร็จสมบูรณ์!");
}

function formatSheet(sheet) {
  sheet.clear();
  sheet.appendRow(THAI_HEADERS);
  sheet.setFrozenRows(1);
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.getRange(1, 1, 1, THAI_HEADERS.length).createFilter();
  sheet.autoResizeColumns(1, THAI_HEADERS.length);
}

/**
 * SYNC: ฟังก์ชันดึงข้อมูลจากแผ่นงานหลักไปกระจายลงคณะ (ใช้กรณีมีข้อมูลค้าง)
 * กด "เรียกใช้" ฟังก์ชันนี้เพื่อจัดระเบียบข้อมูลใหม่ทั้งหมด
 */
function syncAllData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName(MAIN_SHEET_NAME);
  if (!mainSheet) return;

  var data = mainSheet.getDataRange().getValues();
  if (data.length <= 1) return;

  // ล้างข้อมูลในแผ่นงานคณะก่อน (ยกเว้นหัวตาราง)
  FACULTY_NAMES.forEach(function(name) {
    var s = ss.getSheetByName(name);
    if (s && s.getLastRow() > 1) {
      s.getRange(2, 1, s.getLastRow() - 1, THAI_HEADERS.length).clearContent();
    }
  });

  // กระจายข้อมูลใหม่
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var faculty = row[1]; // คอลัมน์ที่ 2 คือคณะ
    var targetSheet = ss.getSheetByName(faculty);
    if (targetSheet) {
      targetSheet.appendRow(row);
    }
  }
  Logger.log("ซิงค์ข้อมูลลงคณะเรียบร้อยแล้ว!");
}

/**
 * GET: ดึงข้อมูล
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName(MAIN_SHEET_NAME);
  var result = {};

  if (mainSheet) {
    var data = mainSheet.getDataRange().getValues();
    if (data.length > 1) {
      var headers = data[0];
      for (var i = 1; i < data.length; i++) {
        var rowData = {};
        var sId = data[i][0];
        if (!sId) continue;
        for (var j = 0; j < headers.length; j++) {
          var keyIndex = THAI_HEADERS.indexOf(headers[j]);
          var key = keyIndex !== -1 ? DATA_KEYS[keyIndex] : headers[j];
          rowData[key] = data[i][j];
        }
        result[sId] = rowData;
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST: บันทึกข้อมูล
 */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawData;

  try {
    rawData = JSON.parse(e.postData.contents);
  } catch (err) {
    return createResponse("Error: Invalid JSON");
  }

  var updates = Array.isArray(rawData) ? rawData : [rawData];
  
  updates.forEach(function(params) {
    var studentId = params.student_id;
    if (!studentId) return;

    var facultyName = (params.faculty && params.faculty.trim()) ? params.faculty.trim() : "Other";
    var rowValues = DATA_KEYS.map(function(h) {
      return (params[h] !== undefined && params[h] !== null) ? params[h] : "";
    });

    // 1. บันทึกลงแผ่นงานหลัก
    var mainSheet = ss.getSheetByName(MAIN_SHEET_NAME);
    updateOrAppend(mainSheet, studentId, rowValues);

    // 2. บันทึกลงแผ่นงานคณะ
    var targetSheet = ss.getSheetByName(facultyName);
    if (targetSheet) {
      // ลบจากคณะอื่นก่อน (กันซ้ำ)
      FACULTY_NAMES.forEach(function(name) {
        if (name !== facultyName) {
          var s = ss.getSheetByName(name);
          if (s) deleteRecord(s, studentId);
        }
      });
      // อัปเดตในคณะที่ถูกต้อง
      updateOrAppend(targetSheet, studentId, rowValues);
    }
  });

  return createResponse("Success");
}

function updateOrAppend(sheet, studentId, rowValues) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString() === studentId.toString()) {
      sheet.getRange(i + 1, 1, 1, rowValues.length).setValues([rowValues]);
      return;
    }
  }
  sheet.appendRow(rowValues);
}

function deleteRecord(sheet, studentId) {
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][0] && data[i][0].toString() === studentId.toString()) {
      sheet.deleteRow(i + 1);
    }
  }
}

function createResponse(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
