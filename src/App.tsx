import React, { useState, useEffect, useMemo } from "react";
import { 
  Save, 
  Search, 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  X,
  Check,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FACULTIES, 
  EMPLOYMENT_STATUS, 
  MILITARY_STATUS, 
  JOB_TYPES, 
  SPECIAL_SKILLS, 
  BUSINESS_TYPES, 
  SATISFACTION, 
  SEARCH_DURATION, 
  UNEMPLOYED_REASONS, 
  JOB_SEARCH_PROBLEMS, 
  DATA_DISCLOSURE, 
  EDU_LEVELS, 
  STUDY_REASONS, 
  STUDY_PROBLEMS, 
  COUNTRIES 
} from "./constants";
import { JOB_POSITION_CODES } from "./jobCodes";
import { GraduateData } from "./types";
import NetlifyConnect from "./components/NetlifyConnect";

// --- Components ---

const SearchableSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "เลือก...",
  required = true 
}: { 
  label: string; 
  options: { id: string; label: string }[]; 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter(opt => 
      opt.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className="relative mb-10 group">
      <label className="block text-base font-bold text-slate-700 tracking-tighter mb-4 px-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div 
        className={`w-full p-5 bg-white border rounded-3xl shadow-sm cursor-pointer flex justify-between items-center transition-all duration-300 ${isOpen ? 'border-slate-900 ring-4 ring-slate-100 shadow-lg' : 'border-slate-200 hover:border-slate-400 hover:shadow-md'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`tracking-tighter ${selectedOption ? "text-slate-900 font-bold text-lg" : "text-slate-400 font-medium"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className={`p-2 rounded-xl transition-all duration-300 ${isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
          <ChevronDown size={20} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-slate-900/5 backdrop-blur-[1px]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] max-h-[400px] overflow-hidden flex flex-col ring-1 ring-black/5"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-5 py-3 text-base bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 transition-all font-bold tracking-tighter placeholder:text-slate-300"
                    placeholder="ค้นหา..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 py-2 custom-scrollbar">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(opt => (
                    <div 
                      key={opt.id}
                      className={`px-6 py-4 text-base cursor-pointer flex items-center gap-4 transition-all duration-200 ${value === opt.id ? 'bg-slate-900 text-white font-black' : 'text-slate-700 hover:bg-slate-50'}`}
                      onClick={() => {
                        onChange(opt.id);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <span className={`font-mono text-[10px] font-black px-2 py-1 rounded-lg min-w-[3.5rem] text-center tracking-normal ${value === opt.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{opt.id}</span>
                      <span className="flex-1 tracking-tighter">{opt.label}</span>
                      {value === opt.id && (
                        <Check size={16} className="text-emerald-400" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 text-base font-medium tracking-tighter italic">ไม่พบข้อมูล</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const FormSection = ({ title, icon: Icon, children, id }: { title: string; icon: any; children: React.ReactNode; id?: string }) => (
  <section id={id} className="mb-10 md:mb-20 bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative group hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500">
    <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full -mr-40 -mt-40 blur-[100px] opacity-30 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none"></div>
    <div className="flex items-center gap-4 md:gap-8 mb-10 md:mb-16 relative z-10">
      <div className="p-4 md:p-6 bg-slate-900 text-white rounded-2xl md:rounded-[2rem] shadow-2xl shadow-slate-200 transition-all duration-500 scale-100 md:scale-110">
        <Icon size={24} className="md:w-8 md:h-8" />
      </div>
      <div>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter font-display leading-tight">{title}</h2>
        <div className="h-1 w-12 md:h-1.5 md:w-16 bg-slate-900 mt-2 md:mt-4 rounded-full opacity-10 group-hover:w-24 group-hover:opacity-30 transition-all duration-700"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6 relative z-10">
      {children}
    </div>
  </section>
);

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [searchId, setSearchId] = useState("");
  
  const initialFormData: GraduateData = {
    student_id: "",
    faculty: "",
    department: "",
    gender: "",
    military_status: "",
    employment_status: "",
    job_type: "",
    job_type_other: "",
    special_skill: "",
    special_skill_other: "",
    job_position_code: "",
    organization_name: "",
    business_type: "",
    org_address_no: "",
    org_moo: "",
    org_building: "",
    org_soi: "",
    org_road: "",
    org_subdistrict: "",
    org_country: "TH",
    org_zipcode: "",
    org_phone: "",
    org_fax: "",
    org_email: "",
    avg_income: "",
    job_satisfaction: "",
    job_satisfaction_other: "",
    job_search_duration: "",
    job_match: "",
    knowledge_application: "",
    unemployed_reason: "",
    unemployed_reason_other: "",
    job_search_problems: "[]",
    job_search_problems_other: "",
    work_location_pref: "",
    work_country_pref: "",
    work_position_pref: "",
    skill_development_needs: "",
    data_disclosure_consent: "",
    further_study_intent: "",
    further_study_level: "",
    further_study_is_same_field: "",
    further_study_field: "",
    further_study_inst_type: "",
    further_study_reason: "",
    further_study_reason_other: "",
    further_study_problem: "",
    further_study_problem_other: "",
    need_english: "",
    need_computer: "",
    need_accounting: "",
    need_internet: "",
    need_practice: "",
    need_research: "",
    need_other: "",
    need_chinese: "",
    need_asean: "",
    need_other_detail: "",
    suggestion_curriculum: "",
    suggestion_teaching: "",
    suggestion_activity: "",
    created_at: ""
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<GraduateData>(initialFormData);

  // --- Effects ---

  useEffect(() => {
    if (message && message.type === "error") {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // --- Handlers ---

  const handleInputChange = (field: keyof GraduateData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    if (!searchId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/graduate/${searchId}`);
      const result = await res.json();
      if (result.success) {
        setFormData(result.data);
        setMessage({ type: "success", text: "พบข้อมูลประวัติเดิมของคุณแล้ว" });
      } else {
        setMessage({ type: "error", text: "ไม่พบข้อมูลรหัสนักศึกษานี้" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการค้นหา" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_id) {
      setMessage({ type: "error", text: "กรุณากรอกรหัสนักศึกษา" });
      return;
    }

    setLoading(true);
    const now = new Date();
    const dateStr = `${now.getFullYear() + 543}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const payload = { ...formData, created_at: dateStr };

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        setShowSuccessModal(true);
        setMessage(null);
      } else {
        setMessage({ type: "error", text: result.error || "เกิดข้อผิดพลาดในการบันทึก" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์" });
    } finally {
      setLoading(false);
    }
  };

  // --- Derived State ---

  const currentFaculty = FACULTIES.find(f => f.name === formData.faculty);
  const departments = currentFaculty ? currentFaculty.departments : [];

  const isEmployed = ["1", "2", "5", "6", "7"].includes(formData.employment_status);
  const isUnemployed = ["3", "4"].includes(formData.employment_status);

  return (
    <div className="min-h-screen font-sans selection:bg-slate-900 selection:text-white relative overflow-x-hidden">
      {/* Background Blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      <div className="bg-blob bg-blob-4" />
      <div className="bg-blob bg-blob-5" />

      {/* Header */}
      <header className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 bg-white rounded-full shadow-2xl shadow-slate-200 border border-slate-100 mb-10"
          >
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">ระบบสำรวจภาวะการมีงานทำ</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-8xl font-black text-slate-900 mb-6 md:mb-8 tracking-tighter leading-[1.1] md:leading-[0.9] font-display"
          >
            แบบสำรวจ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] via-[#3b82f6] to-[#800020]">การมีงานทำ</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed tracking-tighter"
          >
            ร่วมเป็นส่วนหนึ่งในการพัฒนาคุณภาพการศึกษาและสร้างเครือข่ายศิษย์เก่าที่เข้มแข็ง <br />
            <span className="text-slate-900 font-black">ข้อมูลของคุณมีค่าต่อเราเสมอ</span>
          </motion.p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-32 relative z-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          <FormSection title="ข้อมูลพื้นฐาน" icon={User}>
            <div className="mb-10">
              <label className="block text-base font-bold text-slate-700 tracking-tighter mb-4 px-1">รหัสประจำตัวนักศึกษา <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required
                placeholder="เช่น 6012345678"
                className="w-full p-5 bg-white border border-slate-200 rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                value={formData.student_id}
                onChange={(e) => handleInputChange("student_id", e.target.value)}
              />
            </div>
            <SearchableSelect 
              label="คณะ" 
              options={FACULTIES.map(f => ({ id: f.name, label: f.name }))}
              value={formData.faculty}
              onChange={(val) => {
                handleInputChange("faculty", val);
                handleInputChange("department", "");
              }}
              required
            />
            <SearchableSelect 
              label="สาขาวิชา" 
              options={departments.map(d => ({ id: d, label: d }))}
              value={formData.department}
              onChange={(val) => handleInputChange("department", val)}
              required
            />
            <div className="mb-6 md:mb-10">
              <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">เพศ <span className="text-rose-500">*</span></label>
              <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                {["ชาย", "หญิง"].map(g => (
                  <button
                    key={g}
                    type="button"
                    required
                    onClick={() => handleInputChange("gender", g)}
                    className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-black transition-all duration-500 ${formData.gender === g ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <SearchableSelect 
              label="สถานภาพของการทำงาน" 
              options={EMPLOYMENT_STATUS}
              value={formData.employment_status}
              onChange={(val) => handleInputChange("employment_status", val)}
              required
            />
            {formData.gender === "ชาย" && (
              <SearchableSelect 
                label="สถานะการเกณฑ์ทหาร" 
                options={MILITARY_STATUS}
                value={formData.military_status}
                onChange={(val) => handleInputChange("military_status", val)}
              />
            )}
          </FormSection>

                {/* 3. ข้อมูลสำหรับผู้มีงานทำ */}
                {isEmployed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <FormSection title="รายละเอียดงานที่ทำ" icon={Briefcase}>
                      <SearchableSelect 
                        label="ประเภทงานที่ทำ" 
                        options={JOB_TYPES}
                        value={formData.job_type}
                        onChange={(val) => handleInputChange("job_type", val)}
                        required
                      />
                      {formData.job_type === "00" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ระบุประเภทงานเพิ่มเติม <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.job_type_other}
                            onChange={(e) => handleInputChange("job_type_other", e.target.value)}
                            placeholder="ระบุประเภทงาน..."
                          />
                        </div>
                      )}
                      <SearchableSelect 
                        label="ความสามารถพิเศษ" 
                        options={SPECIAL_SKILLS}
                        value={formData.special_skill}
                        onChange={(val) => handleInputChange("special_skill", val)}
                        required
                      />
                      {formData.special_skill === "00" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ความสามารถพิเศษ ระบุข้อความเพิ่มเติม <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.special_skill_other}
                            onChange={(e) => handleInputChange("special_skill_other", e.target.value)}
                            placeholder="ระบุความสามารถพิเศษ..."
                          />
                        </div>
                      )}
                      <SearchableSelect 
                        label="รหัสตำแหน่งงาน" 
                        options={JOB_POSITION_CODES}
                        value={formData.job_position_code}
                        onChange={(val) => handleInputChange("job_position_code", val)}
                        required
                      />
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ชื่อหน่วยงาน <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                          value={formData.organization_name}
                          onChange={(e) => handleInputChange("organization_name", e.target.value)}
                          placeholder="ระบุชื่อหน่วยงาน..."
                        />
                      </div>
                      <SearchableSelect 
                        label="ประเภทกิจการ" 
                        options={BUSINESS_TYPES}
                        value={formData.business_type}
                        onChange={(val) => handleInputChange("business_type", val)}
                        required
                      />
                    </FormSection>

                    <FormSection title="ที่ตั้งหน่วยงาน" icon={FileText}>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">เลขที่ตั้ง <span className="text-rose-500">*</span></label>
                        <input type="text" required className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_address_no} onChange={(e) => handleInputChange("org_address_no", e.target.value)} placeholder="เลขที่..." />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">หมู่ที่</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_moo} onChange={(e) => handleInputChange("org_moo", e.target.value)} placeholder="หมู่ที่..." />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ชื่ออาคาร/ชั้น/นิคม</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_building} onChange={(e) => handleInputChange("org_building", e.target.value)} placeholder="อาคาร..." />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ซอย</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_soi} onChange={(e) => handleInputChange("org_soi", e.target.value)} placeholder="ซอย..." />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ถนน</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_road} onChange={(e) => handleInputChange("org_road", e.target.value)} placeholder="ถนน..." />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ตำบล/แขวง <span className="text-rose-500">*</span></label>
                        <input type="text" required className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_subdistrict} onChange={(e) => handleInputChange("org_subdistrict", e.target.value)} placeholder="ตำบล..." />
                      </div>
                      <SearchableSelect label="ประเทศที่ทำงาน" options={COUNTRIES} value={formData.org_country} onChange={(val) => handleInputChange("org_country", val)} required />
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">รหัสไปรษณีย์ <span className="text-rose-500">*</span></label>
                        <input type="text" required className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_zipcode} onChange={(e) => handleInputChange("org_zipcode", e.target.value)} placeholder="รหัสไปรษณีย์..." />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">หมายเลขโทรศัพท์หน่วยงาน</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_phone} onChange={(e) => handleInputChange("org_phone", e.target.value)} placeholder="โทรศัพท์..." />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">หมายเลขโทรสาร</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_fax} onChange={(e) => handleInputChange("org_fax", e.target.value)} placeholder="โทรสาร..." />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">อีเมลหน่วยงาน</label>
                        <input type="email" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_email} onChange={(e) => handleInputChange("org_email", e.target.value)} placeholder="อีเมล..." />
                      </div>
                    </FormSection>

                    <FormSection title="ข้อมูลรายได้และความพึงพอใจ" icon={Briefcase}>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">รายได้เฉลี่ยต่อเดือน (บาท) <span className="text-rose-500">*</span></label>
                        <input 
                          type="number" 
                          required
                          className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                          value={formData.avg_income}
                          onChange={(e) => handleInputChange("avg_income", e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <SearchableSelect 
                        label="ความพอใจต่องานที่ทำ" 
                        options={SATISFACTION}
                        value={formData.job_satisfaction}
                        onChange={(val) => handleInputChange("job_satisfaction", val)}
                        required
                      />
                      {formData.job_satisfaction === "00" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ความพอใจต่องานที่ทำ ระบุข้อความเพิ่มเติม <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.job_satisfaction_other}
                            onChange={(e) => handleInputChange("job_satisfaction_other", e.target.value)}
                            placeholder="ระบุความพอใจ..."
                          />
                        </div>
                      )}
                      <SearchableSelect 
                        label="ระยะเวลาการหางานทำ" 
                        options={SEARCH_DURATION}
                        value={formData.job_search_duration}
                        onChange={(val) => handleInputChange("job_search_duration", val)}
                        required
                      />
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">งานที่ทำตรงกับที่สำเร็จการศึกษา <span className="text-rose-500">*</span></label>
                        <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                          {[ {id:"1", l:"ตรง"}, {id:"2", l:"ไม่ตรง"} ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              required
                              onClick={() => handleInputChange("job_match", opt.id)}
                              className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-black transition-all duration-500 ${formData.job_match === opt.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              {opt.l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">การนำความรู้ที่เรียนมาประยุกต์ใช้ <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <select 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm appearance-none"
                            value={formData.knowledge_application}
                            onChange={(e) => handleInputChange("knowledge_application", e.target.value)}
                          >
                            <option value="">เลือก...</option>
                            <option value="01">มากที่สุด</option>
                            <option value="02">มาก</option>
                            <option value="03">ปานกลาง</option>
                            <option value="04">น้อย</option>
                            <option value="05">น้อยที่สุด</option>
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={24} />
                        </div>
                      </div>
                    </FormSection>
                  </motion.div>
                )}

                {/* 4. ข้อมูลสำหรับผู้ไม่มีงานทำ */}
                {isUnemployed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <FormSection title="รายละเอียดผู้ที่ยังไม่มีงานทำ" icon={AlertCircle}>
                      <SearchableSelect 
                        label="สาเหตุที่ยังไม่ทำงาน" 
                        options={UNEMPLOYED_REASONS}
                        value={formData.unemployed_reason}
                        onChange={(val) => handleInputChange("unemployed_reason", val)}
                        required
                      />
                      {formData.unemployed_reason === "0" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ระบุสาเหตุเพิ่มเติม <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.unemployed_reason_other}
                            onChange={(e) => handleInputChange("unemployed_reason_other", e.target.value)}
                            placeholder="ระบุสาเหตุ..."
                          />
                        </div>
                      )}
                      <div className="col-span-full mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-4 md:mb-6 px-1">ปัญหาในการหางานทำ (เลือกได้หลายคำตอบ) <span className="text-rose-500">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {JOB_SEARCH_PROBLEMS.map(prob => (
                            <label 
                              key={prob.id} 
                              className={`flex items-center gap-4 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 transition-all cursor-pointer group ${JSON.parse(formData.job_search_problems || "[]").includes(prob.id) ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200 scale-[1.02]' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                            >
                              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all ${JSON.parse(formData.job_search_problems || "[]").includes(prob.id) ? 'bg-emerald-400 border-emerald-400' : 'border-slate-200 group-hover:border-slate-400'}`}>
                                {JSON.parse(formData.job_search_problems || "[]").includes(prob.id) && <Check size={16} className="text-slate-900 font-black" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={JSON.parse(formData.job_search_problems || "[]").includes(prob.id)}
                                onChange={(e) => {
                                  const current = JSON.parse(formData.job_search_problems || "[]");
                                  const next = e.target.checked ? [...current, prob.id] : current.filter((id: string) => id !== prob.id);
                                  handleInputChange("job_search_problems", JSON.stringify(next));
                                }}
                              />
                              <span className="text-base md:text-lg font-bold tracking-tighter">{prob.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {JSON.parse(formData.job_search_problems || "[]").includes("00") && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ระบุปัญหาเพิ่มเติม <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.job_search_problems_other}
                            onChange={(e) => handleInputChange("job_search_problems_other", e.target.value)}
                            placeholder="ระบุปัญหา..."
                          />
                        </div>
                      )}
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ความต้องการทำงาน <span className="text-rose-500">*</span></label>
                        <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                          {[ {id:"01", l:"ทำงานในประเทศ"}, {id:"02", l:"ทำงานต่างประเทศ"} ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              required
                              onClick={() => handleInputChange("work_location_pref", opt.id)}
                              className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-black transition-all duration-500 ${formData.work_location_pref === opt.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              {opt.l}
                            </button>
                          ))}
                        </div>
                      </div>
                      {formData.work_location_pref === "02" && (
                        <SearchableSelect label="ประเทศที่ต้องการทำงาน" options={COUNTRIES} value={formData.work_country_pref} onChange={(val) => handleInputChange("work_country_pref", val)} required />
                      )}
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ตำแหน่งที่ต้องการทำงาน <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                          value={formData.work_position_pref}
                          onChange={(e) => handleInputChange("work_position_pref", e.target.value)}
                          placeholder="ระบุตำแหน่ง..."
                        />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ความต้องการพัฒนาทักษะ <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                          value={formData.skill_development_needs}
                          onChange={(e) => handleInputChange("skill_development_needs", e.target.value)}
                          placeholder="ระบุทักษะที่ต้องการพัฒนา..."
                        />
                      </div>
                      <div className="col-span-full">
                        <SearchableSelect label="แสดงความประสงค์ในการเปิดเผยข้อมูลแก่นายจ้าง" options={DATA_DISCLOSURE} value={formData.data_disclosure_consent} onChange={(val) => handleInputChange("data_disclosure_consent", val)} required />
                      </div>
                    </FormSection>
                  </motion.div>
                )}

                {/* 5. ความต้องการศึกษาต่อ */}
                <FormSection title="ความต้องการศึกษาต่อ" icon={GraduationCap}>
                  <div className="mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ความต้องการศึกษาต่อของบัณฑิต <span className="text-rose-500">*</span></label>
                    <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                      {[ {id:"1", l:"ต้องการ"}, {id:"2", l:"ไม่ต้องการ"} ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          required
                          onClick={() => handleInputChange("further_study_intent", opt.id)}
                          className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-black transition-all duration-500 ${formData.further_study_intent === opt.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {opt.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {formData.further_study_intent === "1" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6">
                      <SearchableSelect label="ระดับการศึกษาที่ต้องการ" options={EDU_LEVELS} value={formData.further_study_level} onChange={(val) => handleInputChange("further_study_level", val)} required />
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">สาขาที่ต้องการศึกษาต่อเป็นสาขาเดิมหรือไม่ <span className="text-rose-500">*</span></label>
                        <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                          {[ {id:"1", l:"สาขาเดิม"}, {id:"2", l:"สาขาใหม่"} ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              required
                              onClick={() => handleInputChange("further_study_is_same_field", opt.id)}
                              className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-black transition-all duration-500 ${formData.further_study_is_same_field === opt.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              {opt.l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">สาขาที่ต้องการศึกษาต่อ/กำลังศึกษาต่อ <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                          value={formData.further_study_field}
                          onChange={(e) => handleInputChange("further_study_field", e.target.value)}
                          placeholder="ระบุสาขาวิชา..."
                        />
                      </div>
                      <SearchableSelect 
                        label="ประเภทสถาบันที่กำลังศึกษาต่อ" 
                        options={[ {id:"1", label:"รัฐบาล"}, {id:"2", label:"เอกชน"}, {id:"3", label:"ต่างประเทศ"} ]} 
                        value={formData.further_study_inst_type} 
                        onChange={(val) => handleInputChange("further_study_inst_type", val)} 
                        required
                      />
                      <SearchableSelect label="เหตุผลที่กำลังศึกษาต่อ" options={STUDY_REASONS} value={formData.further_study_reason} onChange={(val) => handleInputChange("further_study_reason", val)} required />
                      {formData.further_study_reason === "0" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ระบุเหตุผลเพิ่มเติม <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.further_study_reason_other}
                            onChange={(e) => handleInputChange("further_study_reason_other", e.target.value)}
                            placeholder="ระบุเหตุผล..."
                          />
                        </div>
                      )}
                      <SearchableSelect label="ปัญหาในการศึกษาต่อ" options={STUDY_PROBLEMS} value={formData.further_study_problem} onChange={(val) => handleInputChange("further_study_problem", val)} required />
                      {formData.further_study_problem === "00" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ระบุปัญหาเพิ่มเติม <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.further_study_problem_other}
                            onChange={(e) => handleInputChange("further_study_problem_other", e.target.value)}
                            placeholder="ระบุปัญหา..."
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </FormSection>

                {/* 6. ความเห็นเพิ่มเติม */}
                <FormSection title="ทักษะที่ต้องการพัฒนาและข้อเสนอแนะ" icon={MessageSquare}>
                  <div className="col-span-full mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-4 md:mb-6 px-1">ความรู้ความสามารถที่ต้องการให้มหาวิทยาลัยเพิ่มเติม <span className="text-rose-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { id: "need_english", label: "ภาษาอังกฤษ" },
                        { id: "need_computer", label: "คอมพิวเตอร์" },
                        { id: "need_accounting", label: "บัญชี" },
                        { id: "need_internet", label: "อินเทอร์เน็ต" },
                        { id: "need_practice", label: "ฝึกปฏิบัติจริง" },
                        { id: "need_research", label: "เทคนิคการวิจัย" },
                        { id: "need_other", label: "ด้านอื่น ๆ" },
                        { id: "need_chinese", label: "ภาษาจีน" },
                        { id: "need_asean", label: "ภาษาในอาเซียน" },
                      ].map(item => (
                        <label 
                          key={item.id} 
                          className={`flex items-center gap-4 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 transition-all cursor-pointer group ${formData[item.id as keyof GraduateData] === "1" ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200 scale-[1.02]' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all ${formData[item.id as keyof GraduateData] === "1" ? 'bg-emerald-400 border-emerald-400' : 'border-slate-200 group-hover:border-slate-400'}`}>
                            {formData[item.id as keyof GraduateData] === "1" && <Check size={16} className="text-slate-900 font-black" />}
                          </div>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={formData[item.id as keyof GraduateData] === "1"}
                            onChange={(e) => handleInputChange(item.id as keyof GraduateData, e.target.checked ? "1" : "")}
                          />
                          <span className="text-base md:text-lg font-bold tracking-tighter">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.need_other === "1" && (
                    <div className="col-span-full mb-6 md:mb-10">
                      <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ระบุความรู้ด้านอื่น ๆ เพิ่มเติม <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                        value={formData.need_other_detail}
                        onChange={(e) => handleInputChange("need_other_detail", e.target.value)}
                        placeholder="ระบุรายละเอียด..."
                      />
                    </div>
                  )}
                  <div className="col-span-full mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ข้อเสนอแนะเกี่ยวกับหลักสูตร</label>
                    <textarea 
                      className="w-full p-4 md:p-6 bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm h-32 md:h-40 resize-none placeholder:text-slate-300"
                      value={formData.suggestion_curriculum}
                      onChange={(e) => handleInputChange("suggestion_curriculum", e.target.value)}
                      placeholder="พิมพ์ข้อเสนอแนะ..."
                    />
                  </div>
                  <div className="col-span-full mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ข้อเสนอแนะเกี่ยวกับการเรียนการสอน</label>
                    <textarea 
                      className="w-full p-4 md:p-6 bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm h-32 md:h-40 resize-none placeholder:text-slate-300"
                      value={formData.suggestion_teaching}
                      onChange={(e) => handleInputChange("suggestion_teaching", e.target.value)}
                      placeholder="พิมพ์ข้อเสนอแนะ..."
                    />
                  </div>
                  <div className="col-span-full mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">ข้อเสนอแนะเกี่ยวกับกิจกรรมพัฒนาการศึกษา</label>
                    <textarea 
                      className="w-full p-4 md:p-6 bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm h-32 md:h-40 resize-none placeholder:text-slate-300"
                      value={formData.suggestion_activity}
                      onChange={(e) => handleInputChange("suggestion_activity", e.target.value)}
                      placeholder="พิมพ์ข้อเสนอแนะ..."
                    />
                  </div>
                </FormSection>

                {/* Submit Button */}
                <div className="flex flex-col items-center gap-10 pt-10">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="group relative px-20 py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl tracking-tighter shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e] via-[#3b82f6] to-[#800020] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <span className="relative z-10 flex items-center gap-4">
                      {loading ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูลแบบสำรวจ"}
                      {!loading && <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform duration-300" />}
                    </span>
                  </button>
                  
                  <p className="text-slate-400 font-medium tracking-tighter flex items-center gap-3">
                    <AlertCircle size={18} />
                    กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดบันทึก
                  </p>
                </div>
              </form>

              {/* Search/Edit Section - Hidden for general users as requested */}
              {/* 
              <div className="mt-40 pt-32 border-t border-slate-100">
                ...
              </div>
              */}

              {/* Netlify Integration */}
              <NetlifyConnect />
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl"
              onClick={() => setShowSuccessModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-xl bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <div className="p-16 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#22c55e] via-[#3b82f6] to-[#800020] rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 rotate-12 shadow-2xl shadow-slate-200">
                  <Check size={64} className="text-white" />
                </div>
                <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter font-display">บันทึกข้อมูลสำเร็จ</h2>
                <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12 tracking-tighter">
                  ขอบคุณที่ให้ข้อมูลที่เป็นประโยชน์ <br />
                  ข้อมูลของคุณถูกบันทึกลงในระบบเรียบร้อยแล้ว
                </p>
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-8 bg-slate-900 text-white font-black text-2xl rounded-[2rem] shadow-2xl shadow-slate-200 hover:bg-black transition-all tracking-tighter"
                >
                  ตกลง
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Messages */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-8 py-6 rounded-[2rem] shadow-2xl border-2 ${message.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}
          >
            {message.type === 'success' ? <Check size={28} /> : <AlertCircle size={28} />}
            <p className="font-black text-xl tracking-tighter">{message.text}</p>
            <button onClick={() => setMessage(null)} className="ml-6 hover:opacity-70 bg-white/20 p-2 rounded-xl transition-colors"><X size={20} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="max-w-6xl mx-auto px-4 mt-12 text-center text-slate-400 text-xs pb-10">
        <p>© {new Date().getFullYear() + 543} ระบบติดตามการได้งานทำของบัณฑิต - มหาวิทยาลัย</p>
        <p className="mt-1">ข้อมูลทั้งหมดจะถูกเก็บเป็นความลับและใช้เพื่อการพัฒนาหลักสูตรเท่านั้น</p>
      </footer>
    </div>
  );
}
