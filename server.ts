import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import cookieSession from "cookie-session";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("employment.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS graduates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE,
    faculty TEXT,
    department TEXT,
    grad_year TEXT,
    gender TEXT,
    military_status TEXT,
    employment_status TEXT,
    job_type TEXT,
    job_type_other TEXT,
    special_skill TEXT,
    special_skill_other TEXT,
    job_position_code TEXT,
    organization_name TEXT,
    business_type TEXT,
    org_address_no TEXT,
    org_moo TEXT,
    org_building TEXT,
    org_soi TEXT,
    org_road TEXT,
    org_subdistrict TEXT,
    org_country TEXT,
    org_zipcode TEXT,
    org_phone TEXT,
    org_fax TEXT,
    org_email TEXT,
    avg_income TEXT,
    job_satisfaction TEXT,
    job_satisfaction_other TEXT,
    job_search_duration TEXT,
    job_match TEXT,
    knowledge_application TEXT,
    unemployed_reason TEXT,
    unemployed_reason_other TEXT,
    job_search_problems TEXT,
    job_search_problems_other TEXT,
    work_location_pref TEXT,
    work_country_pref TEXT,
    work_position_pref TEXT,
    skill_development_needs TEXT,
    data_disclosure_consent TEXT,
    further_study_intent TEXT,
    further_study_level TEXT,
    further_study_is_same_field TEXT,
    further_study_field TEXT,
    further_study_inst_type TEXT,
    further_study_reason TEXT,
    further_study_reason_other TEXT,
    further_study_problem TEXT,
    further_study_problem_other TEXT,
    need_english TEXT,
    need_computer TEXT,
    need_accounting TEXT,
    need_internet TEXT,
    need_practice TEXT,
    need_research TEXT,
    need_other TEXT,
    need_chinese TEXT,
    need_asean TEXT,
    need_other_detail TEXT,
    suggestion_curriculum TEXT,
    suggestion_teaching TEXT,
    suggestion_activity TEXT,
    created_at TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Session configuration for iframe context
  app.use(cookieSession({
    name: 'session',
    keys: ['netlify-secret-key'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  }));

  // Netlify OAuth Routes
  app.get("/api/auth/netlify/url", (req, res) => {
    const clientId = process.env.NETLIFY_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ error: "NETLIFY_CLIENT_ID not configured" });
    }

    // Use the App URL from the environment
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    const redirectUri = `${appUrl}/api/auth/netlify/callback`;
    
    const url = `https://app.netlify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
    res.json({ url });
  });

  app.get("/api/auth/netlify/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Missing code");
    }

    try {
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
      const redirectUri = `${appUrl}/api/auth/netlify/callback`;

      const response = await axios.post("https://api.netlify.com/oauth/token", {
        grant_type: "authorization_code",
        client_id: process.env.NETLIFY_CLIENT_ID,
        client_secret: process.env.NETLIFY_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      });

      if (req.session) {
        req.session.netlify_token = response.data.access_token;
      }

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'netlify' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>เชื่อมต่อ Netlify สำเร็จ! กำลังปิดหน้าต่างนี้...</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Netlify OAuth error:", error.response?.data || error.message);
      res.status(500).send("Authentication failed");
    }
  });

  app.get("/api/netlify/user", async (req, res) => {
    const token = req.session?.netlify_token;
    if (!token) return res.status(401).json({ error: "Not connected" });

    try {
      const response = await axios.get("https://api.netlify.com/api/v1/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/netlify/sites", async (req, res) => {
    const token = req.session?.netlify_token;
    if (!token) return res.status(401).json({ error: "Not connected" });

    try {
      const response = await axios.get("https://api.netlify.com/api/v1/sites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/netlify/logout", (req, res) => {
    if (req.session) {
      req.session.netlify_token = null;
    }
    res.json({ success: true });
  });

  // API Routes
  app.post("/api/save", async (req, res) => {
    const data = req.body;
    const studentId = data.student_id;

    if (!studentId) {
      return res.status(400).json({ success: false, error: "Student ID is required" });
    }

    try {
      // Filter data to only include valid columns
      const validColumns = [
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

      const filteredData: any = {};
      validColumns.forEach(col => {
        if (data[col] !== undefined) {
          filteredData[col] = data[col];
        }
      });

      const existing = db.prepare("SELECT student_id FROM graduates WHERE student_id = ?").get(studentId);
      
      const columns = Object.keys(filteredData);
      const placeholders = columns.map(() => "?").join(",");
      const values = Object.values(filteredData);

      if (existing) {
        const setClause = columns.map(col => `${col} = ?`).join(",");
        db.prepare(`UPDATE graduates SET ${setClause} WHERE student_id = ?`).run(...values, studentId);
      } else {
        db.prepare(`INSERT INTO graduates (${columns.join(",")}) VALUES (${placeholders})`).run(...values);
      }

      // Forward to Google Sheets if URL is provided
      const googleSheetUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
      console.log("Attempting to forward to Google Sheets. URL exists:", !!googleSheetUrl);
      
      if (googleSheetUrl) {
        try {
          const response = await fetch(googleSheetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredData),
            redirect: 'follow'
          });
          const resultText = await response.text();
          console.log("Google Sheets response status:", response.status);
          console.log("Google Sheets response body:", resultText);
        } catch (err) {
          console.error("Failed to forward to Google Sheets:", err);
        }
      }

      res.json({ success: true, message: existing ? "อัปเดตข้อมูลเรียบร้อยแล้ว" : "บันทึกข้อมูลเรียบร้อยแล้ว" });
    } catch (error: any) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/graduate/:studentId", (req, res) => {
    const { studentId } = req.params;
    const row = db.prepare("SELECT * FROM graduates WHERE student_id = ?").get(studentId);
    if (row) {
      res.json({ success: true, data: row });
    } else {
      res.status(404).json({ success: false, message: "Not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
