import React, { useState, useEffect, useMemo, memo } from "react";
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
  ArrowRight,
  ChevronDown as ChevronDownIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, translations } from "./translations";
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
  STUDY_INST_TYPES,
  COUNTRIES 
} from "./constants";
import { JOB_POSITION_CODES } from "./jobCodes";
import { GraduateData } from "./types";

// --- Components ---

const OptionItem = memo(({ 
  opt, 
  value, 
  onChange, 
  setIsOpen, 
  setSearchTerm,
  lang
}: { 
  opt: { id: string; label: string; label_en?: string }; 
  value: string; 
  onChange: (val: string) => void;
  setIsOpen: (val: boolean) => void;
  setSearchTerm: (val: string) => void;
  lang: Language;
}) => (
  <div 
    className={`px-6 py-4 text-base cursor-pointer flex items-center gap-4 transition-colors duration-150 ${value === opt.id ? 'bg-slate-900 text-white font-black' : 'text-slate-700 hover:bg-slate-50'}`}
    onClick={() => {
      onChange(opt.id);
      setIsOpen(false);
      setSearchTerm("");
    }}
  >
    {opt.id !== (lang === 'en' ? (opt.label_en || opt.label) : opt.label) && (
      <span className={`font-mono text-[10px] font-black px-2 py-1 rounded-lg min-w-[3.5rem] text-center tracking-normal ${value === opt.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{opt.id}</span>
    )}
    <span className="flex-1 tracking-tighter">{lang === 'en' ? (opt.label_en || opt.label) : opt.label}</span>
    {value === opt.id && (
      <Check size={16} className="text-emerald-400" />
    )}
  </div>
));

const SearchableSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder,
  required = true,
  lang
}: { 
  label: string; 
  options: { id: string; label: string; label_en?: string }[]; 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  lang: Language;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const t = translations[lang];

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter(opt => {
      const label = lang === 'en' ? (opt.label_en || opt.label) : opt.label;
      return opt.id.toLowerCase().includes(lowerSearch) || 
             label.toLowerCase().includes(lowerSearch);
    });
  }, [options, searchTerm, lang]);

  const selectedOption = useMemo(() => options.find(opt => opt.id === value), [options, value]);

  return (
    <div className={`relative mb-10 group ${isOpen ? 'z-[100]' : 'z-0'}`}>
      <label className="block text-base font-bold text-slate-700 tracking-tighter mb-4 px-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div 
        className={`w-full p-5 bg-white border rounded-3xl shadow-sm cursor-pointer flex justify-between items-center transition-all duration-200 ${isOpen ? 'border-slate-900 ring-4 ring-slate-100 shadow-lg' : 'border-slate-200 hover:border-slate-400 hover:shadow-md'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`tracking-tighter ${selectedOption ? "text-slate-900 font-bold text-lg" : "text-slate-400 font-medium"}`}>
          {selectedOption ? (lang === 'en' ? (selectedOption.label_en || selectedOption.label) : selectedOption.label) : (placeholder || t.select)}
        </span>
        <div className={`p-2 rounded-xl transition-all duration-200 ${isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
          <ChevronDown size={20} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[110] bg-slate-900/5" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-[120] w-full mt-2 bg-white border border-slate-200 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] max-h-[400px] overflow-hidden flex flex-col ring-1 ring-black/5"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-5 py-3 text-base bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 transition-all font-bold tracking-tighter placeholder:text-slate-300"
                    placeholder={t.search_placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 py-2 custom-scrollbar overscroll-contain">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(opt => (
                    <OptionItem 
                      key={opt.id} 
                      opt={opt} 
                      value={value} 
                      onChange={onChange} 
                      setIsOpen={setIsOpen} 
                      setSearchTerm={setSearchTerm} 
                      lang={lang}
                    />
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 text-base font-medium tracking-tighter italic">{t.no_data}</div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6 relative">
      {children}
    </div>
  </section>
);

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>("th");
  const t = translations[lang];
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
        setMessage({ type: "success", text: t.search_found });
      } else {
        setMessage({ type: "error", text: t.search_not_found });
      }
    } catch (error) {
      setMessage({ type: "error", text: t.error_search });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_id) {
      setMessage({ type: "error", text: t.fill_id });
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
        setMessage({ type: "error", text: result.error || t.error_save });
      }
    } catch (error) {
      setMessage({ type: "error", text: t.error_conn });
    } finally {
      setLoading(false);
    }
  };

  // --- Derived State ---

  const currentFaculty = FACULTIES.find(f => f.name === formData.faculty);
  const departments = currentFaculty ? currentFaculty.departments.map(d => ({ id: d.th, label: d.th, label_en: d.en })) : [];

  const isEmployed = ["1", "2", "5", "6", "7"].includes(formData.employment_status);
  const isUnemployed = ["3", "4"].includes(formData.employment_status);

  return (
    <div className="min-h-screen font-sans selection:bg-slate-900 selection:text-white relative overflow-x-hidden">
      {/* Language Switcher */}
      <div className="fixed top-3 right-3 md:top-6 md:right-6 z-[200]">
        <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-1 md:p-1.5 rounded-xl md:rounded-2xl shadow-xl flex gap-1">
          {(["th", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-black transition-all duration-300 ${lang === l ? 'bg-slate-900 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

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
            className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 mb-10"
          >
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{t.title}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] -mt-1">{t.university}</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-8xl font-black text-slate-900 mb-6 md:mb-8 tracking-tighter leading-[1.3] md:leading-[1.1] font-display text-center"
          >
            {t.survey_title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] via-[#3b82f6] to-[#800020]">{t.employment_status_title}</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto font-medium leading-relaxed tracking-tighter text-center"
          >
            <span className="block md:inline">{t.subtitle}</span>
            <div className="flex flex-col items-center justify-center text-slate-900 font-black mt-2">
              <span>{t.value_statement}</span>
              <div className="flex flex-col items-center -space-y-4 mt-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      opacity: [0.1, 1, 0.1],
                      y: [0, 8, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    <ChevronDownIcon size={32} strokeWidth={3} className="text-slate-900/40" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-32 relative z-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          <FormSection title={t.basic_info} icon={User}>
            <div className="mb-10">
              <label className="block text-base font-bold text-slate-700 tracking-tighter mb-4 px-1">{t.student_id} <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required
                placeholder={t.student_id_placeholder}
                className="w-full p-5 bg-white border border-slate-200 rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                value={formData.student_id}
                onChange={(e) => handleInputChange("student_id", e.target.value)}
              />
            </div>
            <SearchableSelect 
              label={t.faculty} 
              options={FACULTIES.map(f => ({ id: f.name, label: f.name, label_en: f.name_en }))}
              value={formData.faculty}
              onChange={(val) => {
                handleInputChange("faculty", val);
                handleInputChange("department", "");
              }}
              required
              lang={lang}
            />
            <SearchableSelect 
              label={t.department} 
              options={departments}
              value={formData.department}
              onChange={(val) => handleInputChange("department", val)}
              required
              lang={lang}
            />
            <div className="mb-6 md:mb-10">
              <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.gender} <span className="text-rose-500">*</span></label>
              <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                {[ {id: "ชาย", label: t.male}, {id: "หญิง", label: t.female} ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    required
                    onClick={() => handleInputChange("gender", opt.id)}
                    className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-black transition-all duration-500 ${formData.gender === opt.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <SearchableSelect 
              label={t.employment_status} 
              options={EMPLOYMENT_STATUS}
              value={formData.employment_status}
              onChange={(val) => handleInputChange("employment_status", val)}
              required
              lang={lang}
            />
            {formData.gender === "ชาย" && (
              <SearchableSelect 
                label={t.military_status} 
                options={MILITARY_STATUS}
                value={formData.military_status}
                onChange={(val) => handleInputChange("military_status", val)}
                lang={lang}
              />
            )}
          </FormSection>

                {/* 3. ข้อมูลสำหรับผู้มีงานทำ */}
                {isEmployed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <FormSection title={t.job_details} icon={Briefcase}>
                      <SearchableSelect 
                        label={t.job_type} 
                        options={JOB_TYPES}
                        value={formData.job_type}
                        onChange={(val) => handleInputChange("job_type", val)}
                        required
                        lang={lang}
                      />
                      {formData.job_type === "00" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.job_type_other} <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.job_type_other}
                            onChange={(e) => handleInputChange("job_type_other", e.target.value)}
                            placeholder={t.job_type_other_placeholder}
                          />
                        </div>
                      )}
                      <SearchableSelect 
                        label={t.special_skill} 
                        options={SPECIAL_SKILLS}
                        value={formData.special_skill}
                        onChange={(val) => handleInputChange("special_skill", val)}
                        required
                        lang={lang}
                      />
                      {formData.special_skill === "00" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.special_skill_other} <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.special_skill_other}
                            onChange={(e) => handleInputChange("special_skill_other", e.target.value)}
                            placeholder={t.special_skill_other_placeholder}
                          />
                        </div>
                      )}
                      <SearchableSelect 
                        label={t.job_position_code} 
                        options={JOB_POSITION_CODES}
                        value={formData.job_position_code}
                        onChange={(val) => handleInputChange("job_position_code", val)}
                        required
                        lang={lang}
                      />
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.organization_name} <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                          value={formData.organization_name}
                          onChange={(e) => handleInputChange("organization_name", e.target.value)}
                          placeholder={t.organization_name_placeholder}
                        />
                      </div>
                      <SearchableSelect 
                        label={t.business_type} 
                        options={BUSINESS_TYPES}
                        value={formData.business_type}
                        onChange={(val) => handleInputChange("business_type", val)}
                        required
                        lang={lang}
                      />
                    </FormSection>

                    <FormSection title={t.org_address} icon={FileText}>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_address_no} <span className="text-rose-500">*</span></label>
                        <input type="text" required className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_address_no} onChange={(e) => handleInputChange("org_address_no", e.target.value)} placeholder={t.org_address_no_placeholder} />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_moo}</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_moo} onChange={(e) => handleInputChange("org_moo", e.target.value)} placeholder={t.org_moo_placeholder} />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_building}</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_building} onChange={(e) => handleInputChange("org_building", e.target.value)} placeholder={t.org_building_placeholder} />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_soi}</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_soi} onChange={(e) => handleInputChange("org_soi", e.target.value)} placeholder={t.org_soi_placeholder} />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_road}</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_road} onChange={(e) => handleInputChange("org_road", e.target.value)} placeholder={t.org_road_placeholder} />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_subdistrict} <span className="text-rose-500">*</span></label>
                        <input type="text" required className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_subdistrict} onChange={(e) => handleInputChange("org_subdistrict", e.target.value)} placeholder={t.org_subdistrict_placeholder} />
                      </div>
                      <SearchableSelect label={t.org_country} options={COUNTRIES} value={formData.org_country} onChange={(val) => handleInputChange("org_country", val)} required lang={lang} />
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_zipcode} <span className="text-rose-500">*</span></label>
                        <input type="text" required className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_zipcode} onChange={(e) => handleInputChange("org_zipcode", e.target.value)} placeholder={t.org_zipcode_placeholder} />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_phone}</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_phone} onChange={(e) => handleInputChange("org_phone", e.target.value)} placeholder={t.org_phone_placeholder} />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_fax}</label>
                        <input type="text" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_fax} onChange={(e) => handleInputChange("org_fax", e.target.value)} placeholder={t.org_fax_placeholder} />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.org_email}</label>
                        <input type="email" className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300" value={formData.org_email} onChange={(e) => handleInputChange("org_email", e.target.value)} placeholder={t.org_email_placeholder} />
                      </div>
                    </FormSection>

                    <FormSection title={t.income_satisfaction} icon={Briefcase}>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.avg_income} <span className="text-rose-500">*</span></label>
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
                        label={t.job_satisfaction} 
                        options={SATISFACTION}
                        value={formData.job_satisfaction}
                        onChange={(val) => handleInputChange("job_satisfaction", val)}
                        required
                        lang={lang}
                      />
                      {formData.job_satisfaction === "00" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.job_satisfaction_other} <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.job_satisfaction_other}
                            onChange={(e) => handleInputChange("job_satisfaction_other", e.target.value)}
                            placeholder={t.job_satisfaction_other_placeholder}
                          />
                        </div>
                      )}
                      <SearchableSelect 
                        label={t.job_search_duration} 
                        options={SEARCH_DURATION}
                        value={formData.job_search_duration}
                        onChange={(val) => handleInputChange("job_search_duration", val)}
                        required
                        lang={lang}
                      />
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.job_match} <span className="text-rose-500">*</span></label>
                        <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                          {[ {id:"1", l:t.match}, {id:"2", l:t.not_match} ].map(opt => (
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
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.knowledge_application} <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <select 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm appearance-none"
                            value={formData.knowledge_application}
                            onChange={(e) => handleInputChange("knowledge_application", e.target.value)}
                          >
                            <option value="">{t.select}</option>
                            <option value="01">{t.very_much}</option>
                            <option value="02">{t.much}</option>
                            <option value="03">{t.moderate}</option>
                            <option value="04">{t.little}</option>
                            <option value="05">{t.very_little}</option>
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
                    <FormSection title={t.unemployed_details} icon={AlertCircle}>
                      <SearchableSelect 
                        label={t.unemployed_reason} 
                        options={UNEMPLOYED_REASONS}
                        value={formData.unemployed_reason}
                        onChange={(val) => handleInputChange("unemployed_reason", val)}
                        required
                        lang={lang}
                      />
                      {formData.unemployed_reason === "0" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.unemployed_reason_other} <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.unemployed_reason_other}
                            onChange={(e) => handleInputChange("unemployed_reason_other", e.target.value)}
                            placeholder={t.unemployed_reason_other_placeholder}
                          />
                        </div>
                      )}
                      <div className="col-span-full mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-4 md:mb-6 px-1">{t.job_search_problems} <span className="text-rose-500">*</span></label>
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
                              <span className="text-base md:text-lg font-bold tracking-tighter">{lang === 'en' ? (prob.label_en || prob.label) : prob.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {JSON.parse(formData.job_search_problems || "[]").includes("00") && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.job_search_problems_other} <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.job_search_problems_other}
                            onChange={(e) => handleInputChange("job_search_problems_other", e.target.value)}
                            placeholder={t.job_search_problems_other_placeholder}
                          />
                        </div>
                      )}
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.work_location_pref} <span className="text-rose-500">*</span></label>
                        <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                          {[ {id:"01", l:t.work_domestic}, {id:"02", l:t.work_abroad} ].map(opt => (
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
                        <SearchableSelect label={t.work_country_pref} options={COUNTRIES} value={formData.work_country_pref} onChange={(val) => handleInputChange("work_country_pref", val)} required lang={lang} />
                      )}
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.work_position_pref} <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                          value={formData.work_position_pref}
                          onChange={(e) => handleInputChange("work_position_pref", e.target.value)}
                          placeholder={t.work_position_pref_placeholder}
                        />
                      </div>
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.skill_development_needs} <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                          value={formData.skill_development_needs}
                          onChange={(e) => handleInputChange("skill_development_needs", e.target.value)}
                          placeholder={t.skill_development_needs_placeholder}
                        />
                      </div>
                      <div className="col-span-full">
                        <SearchableSelect label={t.data_disclosure_consent} options={DATA_DISCLOSURE} value={formData.data_disclosure_consent} onChange={(val) => handleInputChange("data_disclosure_consent", val)} required lang={lang} />
                      </div>
                    </FormSection>
                  </motion.div>
                )}

                {/* 5. ความต้องการศึกษาต่อ */}
                <FormSection title={t.further_study_intent_title} icon={GraduationCap}>
                  <div className="mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.further_study_intent} <span className="text-rose-500">*</span></label>
                    <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                      {[ {id:"1", l:t.yes}, {id:"2", l:t.no} ].map(opt => (
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
                      <SearchableSelect label={t.further_study_level} options={EDU_LEVELS} value={formData.further_study_level} onChange={(val) => handleInputChange("further_study_level", val)} required lang={lang} />
                      <div className="mb-6 md:mb-10">
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.further_study_is_same_field} <span className="text-rose-500">*</span></label>
                        <div className="flex gap-3 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-2xl md:rounded-[2rem] w-fit">
                          {[ {id:"1", l:t.same_field}, {id:"2", l:t.new_field} ].map(opt => (
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
                        <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.further_study_field} <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                          value={formData.further_study_field}
                          onChange={(e) => handleInputChange("further_study_field", e.target.value)}
                          placeholder={t.further_study_field_placeholder}
                        />
                      </div>
                      <SearchableSelect 
                        label={t.further_study_inst_type} 
                        options={STUDY_INST_TYPES} 
                        value={formData.further_study_inst_type} 
                        onChange={(val) => handleInputChange("further_study_inst_type", val)} 
                        required
                        lang={lang}
                      />
                      <SearchableSelect 
                        label={t.further_study_reason} 
                        options={STUDY_REASONS} 
                        value={formData.further_study_reason} 
                        onChange={(val) => handleInputChange("further_study_reason", val)} 
                        required 
                        lang={lang}
                      />
                      {formData.further_study_reason === "0" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.further_study_reason_other} <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.further_study_reason_other}
                            onChange={(e) => handleInputChange("further_study_reason_other", e.target.value)}
                            placeholder={t.further_study_reason_other_placeholder}
                          />
                        </div>
                      )}
                      <SearchableSelect 
                        label={t.further_study_problem} 
                        options={STUDY_PROBLEMS} 
                        value={formData.further_study_problem} 
                        onChange={(val) => handleInputChange("further_study_problem", val)} 
                        required 
                        lang={lang}
                      />
                      {formData.further_study_problem === "00" && (
                        <div className="mb-6 md:mb-10">
                          <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.further_study_problem_other} <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                            value={formData.further_study_problem_other}
                            onChange={(e) => handleInputChange("further_study_problem_other", e.target.value)}
                            placeholder={t.further_study_problem_other_placeholder}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </FormSection>

                {/* 6. ความเห็นเพิ่มเติม */}
                <FormSection title={t.skills_suggestions} icon={MessageSquare}>
                  <div className="col-span-full mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-4 md:mb-6 px-1">{t.skills_needed_title} <span className="text-rose-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { id: "need_english", label: t.english },
                        { id: "need_computer", label: t.computer },
                        { id: "need_accounting", label: t.accounting },
                        { id: "need_internet", label: t.internet },
                        { id: "need_practice", label: t.practice },
                        { id: "need_research", label: t.research },
                        { id: "need_other", label: t.other },
                        { id: "need_chinese", label: t.chinese },
                        { id: "need_asean", label: t.asean },
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
                      <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.skills_other_label} <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-4 md:p-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm placeholder:text-slate-300"
                        value={formData.need_other_detail}
                        onChange={(e) => handleInputChange("need_other_detail", e.target.value)}
                        placeholder={t.skills_other_placeholder}
                      />
                    </div>
                  )}
                  <div className="col-span-full mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.suggestion_curriculum_label}</label>
                    <textarea 
                      className="w-full p-4 md:p-6 bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm h-32 md:h-40 resize-none placeholder:text-slate-300"
                      value={formData.suggestion_curriculum}
                      onChange={(e) => handleInputChange("suggestion_curriculum", e.target.value)}
                      placeholder={t.suggestion_placeholder}
                    />
                  </div>
                  <div className="col-span-full mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.suggestion_teaching_label}</label>
                    <textarea 
                      className="w-full p-4 md:p-6 bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm h-32 md:h-40 resize-none placeholder:text-slate-300"
                      value={formData.suggestion_teaching}
                      onChange={(e) => handleInputChange("suggestion_teaching", e.target.value)}
                      placeholder={t.suggestion_placeholder}
                    />
                  </div>
                  <div className="col-span-full mb-6 md:mb-10">
                    <label className="block text-base font-bold text-slate-700 tracking-tighter mb-3 md:mb-4 px-1">{t.suggestion_activity_label}</label>
                    <textarea 
                      className="w-full p-4 md:p-6 bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] focus:ring-8 focus:ring-slate-100 focus:border-slate-900 transition-all outline-none font-bold text-lg tracking-tighter shadow-sm h-32 md:h-40 resize-none placeholder:text-slate-300"
                      value={formData.suggestion_activity}
                      onChange={(e) => handleInputChange("suggestion_activity", e.target.value)}
                      placeholder={t.suggestion_placeholder}
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
                      {loading ? t.saving : t.submit}
                      {!loading && <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform duration-300" />}
                    </span>
                  </button>
                  
                  <p className="text-slate-400 font-medium tracking-tighter flex items-center gap-3">
                    <AlertCircle size={18} />
                    {t.check_info}
                  </p>
                </div>
              </form>

              {/* Search/Edit Section - Hidden for general users as requested */}
              {/* 
              <div className="mt-40 pt-32 border-t border-slate-100">
                ...
              </div>
              */}
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
                <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter font-display">{t.success_title}</h2>
                <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12 tracking-tighter">
                  {t.success_msg_1} <br />
                  {t.success_msg_2}
                </p>
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-8 bg-slate-900 text-white font-black text-2xl rounded-[2rem] shadow-2xl shadow-slate-200 hover:bg-black transition-all tracking-tighter"
                >
                  {t.ok}
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
        <p>© {lang === 'th' ? new Date().getFullYear() + 543 : new Date().getFullYear()} {t.footer_copy}</p>
        <p className="mt-1">{t.footer_desc}</p>
      </footer>
    </div>
  );
}
