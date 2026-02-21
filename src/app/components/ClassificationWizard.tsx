import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight, Settings, HelpCircle, Archive,
  SkipForward, ArrowLeft, Keyboard
} from 'lucide-react';
import { supplierQueue } from './data';
import { appToast } from './AppToast';

const tags = ['B2B', 'שנתי', 'דחוף'];

export function ClassificationWizard() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('שיווק ופרסום');
  const [selectedSubCategory, setSelectedSubCategory] = useState('רכש מדיה');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState(45);
  const totalCount = 100;

  const currentSupplier = {
    name: 'אלפא שיווק בע"מ',
    code: '987321',
    date: '12/05/2024',
    phone: '050-1234567',
    address: 'רחוב הנביאים 22, תל אביב',
    originalCategory: '"כללי - אקסל"',
    aiSuggestion: 'שיווק,תל אביב - ייתכן שמדובר בספק שירותי מדיה.',
    keywords: ['שיווק', 'תל אביב'],
  };

  const handleApprove = () => {
    setProcessedCount(prev => prev + 1);
    setCurrentIndex(prev => prev + 1);
    appToast.success('הספק סווג בהצלחה!', `${selectedCategory} › ${selectedSubCategory}`);
  };

  const handleSkip = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const stats = {
    speed: '12 ספקים/שעה',
    workTime: '01:24:00',
  };

  return (
    <div className="min-h-full bg-[#f8f7f5] font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#e7e1da] px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/suppliers')} className="text-[#8d785e] hover:text-[#181510] transition-colors">
              <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff8c00]/10 rounded-lg flex items-center justify-center">
                <span className="text-[16px]">🔬</span>
              </div>
              <h1 className="text-[22px] text-[#181510]" style={{ fontWeight: 700 }}>אשף סיווג ספקים מרוכז</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[12px] text-[#8d785e]">{processedCount} מתוך {totalCount} ספקים</span>
              <span className="text-[12px] text-[#ff8c00] mr-2" style={{ fontWeight: 600 }}>{Math.round((processedCount / totalCount) * 100)}% הושלמו</span>
            </div>
            <div className="w-32 h-2 bg-[#ddd6cb] rounded-full overflow-hidden">
              <div className="h-full bg-[#ff8c00] rounded-full transition-all duration-500" style={{ width: `${(processedCount / totalCount) * 100}%` }} />
            </div>
            <button className="p-2 text-[#8d785e] hover:text-[#181510] transition-colors"><Settings size={18} /></button>
            <button className="p-2 text-[#8d785e] hover:text-[#181510] transition-colors"><HelpCircle size={18} /></button>
          </div>
        </div>
      </div>

      <div className="mx-auto p-4 lg:p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-5">
            {/* Supplier card */}
            <div className="bg-white rounded-2xl border border-[#e7e1da] shadow-sm overflow-hidden">
              <div className="bg-gradient-to-l from-[#fff7ed] to-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] text-green-600 bg-green-50 px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>ספק נוכחי</span>
                  <span className="text-[12px] text-[#8d785e]">תאריך: {currentSupplier.date}</span>
                </div>
                <h2 className="text-[24px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>{currentSupplier.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[11px] text-[#8d785e] mb-0.5">מזהה ספק (מקורי)</div>
                    <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{currentSupplier.code}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8d785e] mb-0.5">טלפון</div>
                    <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{currentSupplier.phone}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8d785e] mb-0.5">כתובת</div>
                    <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{currentSupplier.address}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8d785e] mb-0.5">קטגוריה מקורית</div>
                    <div className="text-[14px] text-[#8d785e]">{currentSupplier.originalCategory}</div>
                  </div>
                </div>
              </div>

              {/* AI suggestion */}
              <div className="mx-5 my-4 bg-[#ff8c00]/5 border border-[#ff8c00]/30 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">💡</span>
                  <p className="text-[13px] text-[#6b5d45]">
                    זיהוי מילות מפתח: <strong>{currentSupplier.keywords.join(', ')}</strong> — ייתכן שמדובר בספק שירותי מדיה.
                  </p>
                </div>
              </div>

              {/* Classification fields */}
              <div className="p-5 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] text-[#181510] mb-1.5 block" style={{ fontWeight: 600 }}>קטגוריה ראשית</label>
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
                    >
                      <option>שיווק ופרסום</option>
                      <option>תחבורה</option>
                      <option>מזון וקייטרינג</option>
                      <option>אטרקציות</option>
                      <option>לינה</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[13px] text-[#181510] mb-1.5 block" style={{ fontWeight: 600 }}>תת-קטגוריה</label>
                    <select
                      value={selectedSubCategory}
                      onChange={e => setSelectedSubCategory(e.target.value)}
                      className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
                    >
                      <option>רכש מדיה</option>
                      <option>ייעוץ שיווקי</option>
                      <option>עיצוב גרפי</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[13px] text-[#181510] mb-2 block" style={{ fontWeight: 600 }}>תגיות (בחירה מרובה)</label>
                  <div className="flex gap-2">
                    <span className="text-[11px] text-[#8d785e] mt-1">מומלץ:</span>
                    {tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-[12px] px-3 py-1 rounded-full border transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-[#ff8c00] text-white border-[#ff8c00]'
                            : 'border-[#e7e1da] text-[#8d785e] hover:border-[#ff8c00] hover:text-[#ff8c00]'
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-4 border border-[#e7e1da]">
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-[13px] text-[#8d785e] hover:text-[#181510] transition-colors">
                  <Archive size={14} /> העבר לארכיון
                </button>
                <button onClick={handleSkip} className="flex items-center gap-1.5 text-[13px] text-[#8d785e] hover:text-[#181510] transition-colors">
                  <SkipForward size={14} /> דלג לספק הבא
                </button>
              </div>
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 text-[14px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-6 py-2.5 rounded-xl shadow-sm transition-colors"
                style={{ fontWeight: 600 }}
              >
                אשר והמשך לבא
                <ArrowLeft size={15} />
              </button>
            </div>

            {/* Keyboard shortcut */}
            <div className="bg-[#fff7ed] border border-[#ff8c00]/30 rounded-xl p-3 flex items-center justify-center gap-2">
              <span className="text-[#ff8c00]"><Keyboard size={16} /></span>
              <span className="text-[13px] text-[#6b5d45]">
                טיפ למהירות: השתמש ב-<strong>Enter</strong> לאישור ומעבר לבא, <strong>Esc</strong> לדילוג.
              </span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Queue */}
            <div className="bg-white rounded-2xl border border-[#e7e1da] p-5 shadow-sm">
              <h3 className="text-[14px] text-[#181510] flex items-center gap-2 mb-3" style={{ fontWeight: 700 }}>
                📋 תור ספקים להסדרה
              </h3>
              <div className="space-y-2">
                {supplierQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-lg transition-all cursor-pointer ${
                      item.status === 'current'
                        ? 'bg-[#ff8c00] text-white'
                        : 'hover:bg-[#f5f3f0]'
                    }`}
                  >
                    <div className={`text-[13px] ${item.status === 'current' ? 'text-white' : 'text-[#181510]'}`} style={{ fontWeight: 600 }}>{item.name}</div>
                    <div className={`text-[11px] ${item.status === 'current' ? 'text-orange-100' : 'text-[#8d785e]'}`}>מזהה: {item.code}</div>
                  </div>
                ))}
              </div>
              <button className="text-[12px] text-[#ff8c00] mt-3" style={{ fontWeight: 600 }}>צפה בכל ה-55 שנותרו</button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-[#e7e1da] p-5 shadow-sm">
              <h3 className="text-[14px] text-[#181510] mb-3" style={{ fontWeight: 700 }}>סטטיסטיקת עבודה</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8d785e]">קצב סיווג</span>
                  <span className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>{stats.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8d785e]">זמן עבודה היום</span>
                  <span className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>{stats.workTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}