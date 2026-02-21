import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight, Upload, CheckCircle, Eye, FileSpreadsheet,
  AlertTriangle, Download, Edit2
} from 'lucide-react';

const steps = [
  { id: 1, label: 'העלאת קובץ', icon: Upload },
  { id: 2, label: 'מיפוי שדות', icon: FileSpreadsheet },
  { id: 3, label: 'תצוגה מקדימה', icon: Eye },
  { id: 4, label: 'סיום ייבוא', icon: CheckCircle },
];

const previewData = [
  { id: '1', name: 'גן אירועים קיסריה', category: 'אולמות וגנים', status: 'valid', duplicate: false },
  { id: '2', name: 'קייטרינג סעמים', category: 'קייטרינג', status: 'duplicate', duplicate: true },
  { id: '3', name: 'די.ג\'יי רועי כהן', category: 'מוזיקה', status: 'valid', duplicate: false },
  { id: '4', name: 'סטודיו צילום "רגעים"', category: 'צילום', status: 'duplicate', duplicate: true },
];

const fieldMappings = [
  { field: 'שם הספק *', column: 'A) Supplier_Name' },
  { field: 'קטגוריה', column: 'B) Category' },
  { field: 'טלפון', column: 'C) Mobile_Phone' },
  { field: 'אימייל', column: 'D) Email_Address' },
];

export function ImportWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);
  const [duplicateAction, setDuplicateAction] = useState<Record<string, string>>({});

  const handleDuplicateAction = (id: string, action: string) => {
    setDuplicateAction(prev => ({ ...prev, [id]: action }));
  };

  return (
    <div className="min-h-full bg-[#f8f7f5] font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#e7e1da] px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/suppliers')} className="text-[#8d785e] hover:text-[#181510] transition-colors">
            <ArrowRight size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff8c00]/10 rounded-lg flex items-center justify-center">
              <FileSpreadsheet size={16} className="text-[#ff8c00]" />
            </div>
            <h1 className="text-[22px] text-[#181510]" style={{ fontWeight: 700 }}>ייבוא ספקים מאקסל</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto p-4 lg:p-6 space-y-6">
        {/* Description */}
        <div className="text-center">
          <p className="text-[14px] text-[#8d785e]">ייבאו את רשימת הספקים שלכם בקלות ובמהירות</p>
          <button className="text-[13px] text-[#8d785e] flex items-center gap-1 mx-auto mt-2 hover:text-[#ff8c00] transition-colors">
            <Download size={13} /> הורד תבנית לדוגמה (CSV)
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-0 max-w-xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isComplete = step.id < currentStep;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-[#ff8c00] text-white shadow-lg shadow-[#ff8c00]/20' :
                    isComplete ? 'bg-green-500 text-white' :
                    'bg-[#ddd6cb] text-[#8d785e]'
                  }`}>
                    {isComplete ? <CheckCircle size={18} /> : <Icon size={18} />}
                  </div>
                  <span className={`text-[11px] ${isActive ? 'text-[#ff8c00]' : 'text-[#8d785e]'}`} style={{ fontWeight: isActive ? 600 : 400 }}>{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step.id < currentStep ? 'bg-green-400' : 'bg-[#ddd6cb]'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Field mapping */}
          <div className="bg-white rounded-2xl border border-[#e7e1da] p-5 shadow-sm">
            <h3 className="text-[16px] text-[#181510] flex items-center gap-2 mb-1" style={{ fontWeight: 700 }}>
              <span className="text-[#ff8c00]">≡</span> מיפוי שדות מהאקסל
            </h3>
            <p className="text-[12px] text-[#8d785e] mb-4">התאימו את עמודות האקסל לשדות המערכת שלנו</p>
            <div className="space-y-3">
              {fieldMappings.map(mapping => (
                <div key={mapping.field}>
                  <label className="text-[12px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>{mapping.field}</label>
                  <select className="w-full border border-[#e7e1da] rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]">
                    <option>{mapping.column}</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-[#ff8c00] hover:bg-[#e67e00] text-white py-2.5 rounded-xl text-[14px] transition-colors" style={{ fontWeight: 600 }}>
              בצע בדיקת כפילויות
            </button>
          </div>

          {/* Preview table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e7e1da] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] text-[#181510] flex items-center gap-2" style={{ fontWeight: 700 }}>
                <span className="text-[#ff8c00]">📋</span> תצוגה מקדימה וזיהוי כפילויות
              </h3>
              <span className="text-[12px] text-[#8d785e] bg-[#f5f3f0] px-2.5 py-1 rounded-full">נמצאו 142 שורות</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f5f3f0] border-b border-[#e7e1da]">
                    {['שם ספק', 'קטגוריה', 'סטטוס', 'פעולות'].map(h => (
                      <th key={h} className="p-3 text-right text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map(item => (
                    <tr key={item.id} className="border-b border-[#ece8e3]">
                      <td className="p-3 text-[13px] text-[#181510]" style={{ fontWeight: 500 }}>{item.name}</td>
                      <td className="p-3 text-[13px] text-[#8d785e]">{item.category}</td>
                      <td className="p-3">
                        {item.status === 'valid' ? (
                          <span className="flex items-center gap-1 text-[12px] text-green-600" style={{ fontWeight: 600 }}>
                            <CheckCircle size={13} /> תקין
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[12px] text-yellow-600" style={{ fontWeight: 600 }}>
                            <AlertTriangle size={13} /> חשד לכפילות
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {item.duplicate ? (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleDuplicateAction(item.id, 'merge')}
                              className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                                duplicateAction[item.id] === 'merge' ? 'bg-[#ff8c00] text-white border-[#ff8c00]' : 'border-[#ff8c00] text-[#ff8c00] hover:bg-[#ff8c00]/5'
                              }`}
                              style={{ fontWeight: 600 }}
                            >
                              מזג
                            </button>
                            <button
                              onClick={() => handleDuplicateAction(item.id, 'ignore')}
                              className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                                duplicateAction[item.id] === 'ignore' ? 'bg-[#181510] text-white border-[#181510]' : 'border-[#e7e1da] text-[#8d785e] hover:bg-[#f5f3f0]'
                              }`}
                              style={{ fontWeight: 600 }}
                            >
                              התעלם
                            </button>
                          </div>
                        ) : (
                          <button className="text-[#8d785e] hover:text-[#181510]"><Edit2 size={14} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e7e1da]">
              <span className="text-[12px] text-[#8d785e]">מציג 1-4 מתוך 142 שורות</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-md flex items-center justify-center bg-[#ff8c00] text-white text-[12px]" style={{ fontWeight: 600 }}>1</button>
                <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-[#ece8e3] text-[12px]">2</button>
                <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-[#ece8e3] text-[12px]">3</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-4 border border-[#e7e1da]">
          <button onClick={() => setCurrentStep(1)} className="flex items-center gap-1 text-[14px] text-[#8d785e] hover:text-[#181510] transition-colors">
            ← חזרה להעלאת קובץ
          </button>
          <div className="flex gap-3">
            <button className="text-[14px] text-[#ff8c00] border border-[#ff8c00] px-5 py-2 rounded-xl hover:bg-[#ff8c00]/5 transition-colors" style={{ fontWeight: 600 }}>
              דלג על כפילויות וייבא
            </button>
            <button
              onClick={() => { setCurrentStep(4); }}
              className="flex items-center gap-2 text-[14px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-5 py-2 rounded-xl shadow-sm transition-colors"
              style={{ fontWeight: 600 }}
            >
              <Upload size={14} /> ייבא הכל (142 ספקים)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[12px] text-[#8d785e] py-4">
          © 2024 מערכת ניהול ספקים למפיקי אירועים. כל הזכויות שמורות.
        </div>
      </div>
    </div>
  );
}