import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowRight, Eye, CheckSquare, FileText, Star, Plus,
  Bus, Target, Globe, Edit2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { appToast } from './AppToast';

const KAYAK_IMG = 'https://images.unsplash.com/photo-1550515710-9324b8e4262e?w=800';
const BUS_IMG = 'https://images.unsplash.com/photo-1765739099920-81a456008253?w=800';
const VINEYARD_IMG = 'https://images.unsplash.com/photo-1762330465953-75478d918896?w=800';

const tabs = [
  { id: 'components', label: 'רכיבים וספקים' },
  { id: 'pricing', label: 'תמחור ורווח יעד' },
  { id: 'timeline', label: 'לו"ז הפעילות' },
];

export function QuoteEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('components');
  const [profitWeights, setProfitWeights] = useState({ transport: 2, activity: 4 });
  const [selectedAlternative, setSelectedAlternative] = useState('a1');
  const [showPreview, setShowPreview] = useState(false);
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState('');

  const transportCost = 7500;
  const activityBaseCost = 28800;

  const getSellingPrice = (cost: number, weight: number) => {
    const margin = 0.05 + (weight * 0.05);
    return Math.round(cost * (1 + margin));
  };

  const transportSelling = getSellingPrice(transportCost, profitWeights.transport);
  const activitySelling = getSellingPrice(activityBaseCost, profitWeights.activity);
  const totalCost = transportCost + activityBaseCost;
  const totalSelling = transportSelling + activitySelling;
  const totalProfit = totalSelling - totalCost;
  const profitPercent = Math.round((totalProfit / totalSelling) * 100);

  const timeline = [
    { time: '08:00', title: 'יציאה ואיסוף', desc: 'נקודת מפגש: חניון הבימה מיני גלילות. חלוקת ערכות בוקר.', icon: '🚌' },
    { time: '10:30', title: 'פעילות בוקר - רייזרים', desc: 'הגעה למתחם רייזרים בגוף. מדריך בטיחות ויציאה למסלול!', icon: '🎯' },
    { time: '13:00', title: 'ארוחת צהריים', desc: 'ארוחת בשרים כשרה למהדרין במסעדת "החווה".', icon: '🍽️' },
  ];

  return (
    <div className="p-4 lg:p-6 mx-auto font-['Assistant',sans-serif]" dir="rtl">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#8d785e] hover:text-[#181510] transition-colors">
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-[22px] text-[#181510]" style={{ fontWeight: 700 }}>פרויקט: נופש שנתי גליל עליון</h1>
            <p className="text-[12px] text-[#8d785e]">מזהה פרויקט: #{id} &bull; 24</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/quote/${id}`)}
            className="flex items-center gap-2 text-[13px] text-[#6b5d45] border border-[#e7e1da] px-3 py-2 rounded-lg hover:bg-[#f5f3f0] transition-colors"
          >
            <Eye size={15} />
            תצוגה מקדימה ללקוח
          </button>
          <button
            onClick={() => appToast.success('בדיקה הושלמה', 'ההצעה תקינה ומוכנה לשליחה ללקוח')}
            className="flex items-center gap-2 text-[13px] text-[#6b5d45] border border-[#e7e1da] px-3 py-2 rounded-lg hover:bg-[#f5f3f0] transition-colors">
            <CheckSquare size={15} />
            בדיקה לפני שליחה
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 text-[13px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-4 py-2 rounded-lg shadow-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            <FileText size={15} />
            צור גרסת הצעה
          </button>
        </div>
      </div>

      {/* Project info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'סטטוס', value: 'בניית הצעה', color: '#ff8c00' },
          { label: 'חברה', value: 'סייבר-גלובל', icon: '🏢' },
          { label: 'משתתפים', value: '120 איש', icon: '👥' },
          { label: 'אזור', value: 'גליל עליון', icon: '📍' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-3.5 border border-[#e7e1da] text-center">
            <div className="text-[11px] text-[#8d785e] mb-1">{card.icon} {card.label}</div>
            <div className="text-[15px] text-[#181510]" style={{ fontWeight: 600, color: card.color || '#181510' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div className="bg-gradient-to-l from-[#181510] to-[#2a2518] rounded-xl p-4 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-[11px] text-[#c4b89a]">מחיר לאדם</div>
            <div className="text-[22px] text-white" style={{ fontWeight: 700 }}>₪{Math.round(totalSelling / 120)}</div>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <div className="text-[11px] text-[#c4b89a]">מחיר כולל (משוער)</div>
            <div className="text-[22px] text-white" style={{ fontWeight: 700 }}>₪{totalSelling.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#ff8c00]/20 px-4 py-2 rounded-lg">
          <div className="text-center">
            <div className="text-[11px] text-[#ffb74d]">רווח יעד מוערך</div>
            <div className="text-[20px] text-[#ff8c00]" style={{ fontWeight: 700 }}>{profitPercent}%</div>
          </div>
          <TrendingUpIcon />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[#ece8e3] rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md text-[13px] transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#181510] shadow-sm'
                : 'text-[#8d785e] hover:text-[#181510]'
            }`}
            style={{ fontWeight: activeTab === tab.id ? 700 : 700 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Components Tab */}
      {activeTab === 'components' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] text-[#181510] flex items-center gap-2" style={{ fontWeight: 700 }}>
              📦 רכיבים וספקים
            </h2>
            <button
              onClick={() => setShowAddComponent(true)}
              className="text-[13px] text-[#ff8c00] flex items-center gap-1 hover:text-[#e67e00]"
              style={{ fontWeight: 600 }}
            >
              <Plus size={14} />
              הוספת רכיב חדש
            </button>
          </div>

          {/* Transport */}
          <div className="bg-white rounded-xl border border-[#e7e1da] overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-[#f5f3f0] border-b border-[#e7e1da]">
              <div className="flex items-center gap-2">
                <Bus size={16} className="text-[#8d785e]" />
                <span className="text-[15px] text-[#181510]" style={{ fontWeight: 600 }}>תחבורה</span>
              </div>
              <span className="text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>✓ מאושר</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ff8c00]/10 rounded-lg flex items-center justify-center text-[18px]">🚌</div>
                  <div>
                    <div className="text-[15px] text-[#181510]" style={{ fontWeight: 600 }}>אוטובוסים הגליל</div>
                    <div className="text-[12px] text-[#8d785e]">3 אוטובוסים ממוגנים, איסוף מהמרכז</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-[#8d785e] hover:text-[#ff8c00] transition-colors"><Edit2 size={15} /></button>
                  <div className="text-left">
                    <div className="text-[11px] text-[#8d785e]">עלות</div>
                    <div className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>₪{transportCost.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-xl border border-[#e7e1da] overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-[#f5f3f0] border-b border-[#e7e1da]">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-[#8d785e]" />
                <span className="text-[15px] text-[#181510]" style={{ fontWeight: 600 }}>פעילות בוקר</span>
              </div>
              <span className="text-[11px] text-[#ff8c00] bg-[#ff8c00]/10 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>♦ שונתה</span>
            </div>
            <div className="p-4">
              <div className="text-[13px] text-[#8d785e] mb-3">חלופות לבחירה:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'a1', name: 'רייזרס בגוף', desc: 'מתחם ג׳ונגל/רייזרים', cost: 240, img: KAYAK_IMG, badge: 'מומלץ' },
                  { id: 'a2', name: 'קייקי הגליל', desc: 'מתחם פעילות/רייזרים', cost: 110, img: BUS_IMG },
                  { id: 'a3', name: 'ספק מהאינטרנט', desc: 'מתחם ביער/בגוף', cost: 180, img: null },
                ].map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => setSelectedAlternative(alt.id)}
                    className={`relative rounded-xl border-2 overflow-hidden transition-all text-right ${
                      selectedAlternative === alt.id
                        ? 'border-[#ff8c00] shadow-lg shadow-[#ff8c00]/15'
                        : 'border-[#e7e1da] hover:border-[#d4cdc3]'
                    }`}
                  >
                    {alt.badge && (
                      <span className="absolute top-2 right-2 z-10 text-[10px] bg-[#ff8c00] text-white px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{alt.badge}</span>
                    )}
                    <div className="h-20 bg-[#f5f3f0] overflow-hidden">
                      {alt.img ? (
                        <ImageWithFallback src={alt.img} alt={alt.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Globe size={24} className="text-[#c4b89a]" /></div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>{alt.name}</div>
                      <div className="text-[11px] text-[#8d785e]">{alt.desc}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-[#8d785e]">עלות לאדם</span>
                        <span className="text-[14px] text-[#181510]" style={{ fontWeight: 700 }}>₪{alt.cost}</span>
                      </div>
                    </div>
                    {selectedAlternative === alt.id && (
                      <div className="absolute top-2 left-2 w-5 h-5 bg-[#ff8c00] rounded-full flex items-center justify-center">
                        <span className="text-white text-[12px]">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inline supplier search */}
          <button
            onClick={() => setShowAddSupplier(true)}
            className="w-full border-2 border-dashed border-[#e7e1da] rounded-xl p-4 text-[#8d785e] hover:border-[#ff8c00] hover:text-[#ff8c00] transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            <span className="text-[13px]" style={{ fontWeight: 600 }}>הוסף רכיב נוסף (ארוחה, לינה, פעילות...)</span>
          </button>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-5">
          <h2 className="text-[18px] text-[#181510] flex items-center gap-2" style={{ fontWeight: 700 }}>
            💰 תמחור ורווח יעד
          </h2>

          <div className="bg-white rounded-xl border border-[#e7e1da] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f3f0] border-b border-[#e7e1da] text-[12px] text-[#8d785e]">
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>רכיב</th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>עלות (ספק)</th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>מחיר מכירה</th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>רווח</th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>משקל רווח</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e7e1da]">
                  <td className="p-3 text-[14px]" style={{ fontWeight: 500 }}>תחבורה</td>
                  <td className="p-3 text-[14px] text-[#6b5d45]">₪{transportCost.toLocaleString()}</td>
                  <td className="p-3 text-[14px]" style={{ fontWeight: 600 }}>₪{transportSelling.toLocaleString()}</td>
                  <td className="p-3 text-[14px] text-green-600" style={{ fontWeight: 600 }}>₪{(transportSelling - transportCost).toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((w) => (
                        <button
                          key={w}
                          onClick={() => setProfitWeights(p => ({ ...p, transport: w }))}
                          className="transition-colors"
                        >
                          <Star size={16} fill={w <= profitWeights.transport ? '#ff8c00' : 'none'} className={w <= profitWeights.transport ? 'text-[#ff8c00]' : 'text-[#ddd6cb]'} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-[#e7e1da]">
                  <td className="p-3 text-[14px]" style={{ fontWeight: 500 }}>פעילות בוקר</td>
                  <td className="p-3 text-[14px] text-[#6b5d45]">₪{activityBaseCost.toLocaleString()}</td>
                  <td className="p-3 text-[14px]" style={{ fontWeight: 600 }}>₪{activitySelling.toLocaleString()}</td>
                  <td className="p-3 text-[14px] text-green-600" style={{ fontWeight: 600 }}>₪{(activitySelling - activityBaseCost).toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((w) => (
                        <button
                          key={w}
                          onClick={() => setProfitWeights(p => ({ ...p, activity: w }))}
                          className="transition-colors"
                        >
                          <Star size={16} fill={w <= profitWeights.activity ? '#ff8c00' : 'none'} className={w <= profitWeights.activity ? 'text-[#ff8c00]' : 'text-[#ddd6cb]'} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-[#181510] text-white">
                  <td className="p-3 text-[14px]" style={{ fontWeight: 600 }}>סה"כ פרויקט</td>
                  <td className="p-3 text-[14px]">₪{totalCost.toLocaleString()}</td>
                  <td className="p-3 text-[14px]" style={{ fontWeight: 700 }}>₪{totalSelling.toLocaleString()}</td>
                  <td className="p-3 text-[14px] text-green-400" style={{ fontWeight: 700 }}>₪{totalProfit.toLocaleString()} ({profitPercent}%)</td>
                  <td className="p-3 text-[14px] text-[#c4b89a]">ממוצע: {((profitWeights.transport + profitWeights.activity) / 2).toFixed(1)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="space-y-5">
          <h2 className="text-[18px] text-[#181510] flex items-center gap-2" style={{ fontWeight: 700 }}>
            🕐 לו"ז הפעילות
          </h2>
          <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
            <div className="space-y-0">
              {timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#ff8c00]/10 flex items-center justify-center text-[18px]">{event.icon}</div>
                    {idx < timeline.length - 1 && <div className="w-0.5 flex-1 bg-[#e7e1da] my-1" />}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] text-[#181510]" style={{ fontWeight: 700 }}>{event.time}</span>
                      <span className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>&bull; {event.title}</span>
                    </div>
                    <p className="text-[13px] text-[#8d785e]">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => appToast.success('הטיוטה נשמרה בהצלחה', 'ניתן להמשיך לערוך בכל עת')}
          className="bg-[#181510] hover:bg-[#2a2518] text-white px-6 py-2.5 rounded-xl text-[14px] transition-colors" style={{ fontWeight: 600 }}>
          שמור טיוטה
        </button>
        <button
          onClick={() => appToast.neutral('השינויים בוטלו', 'הנתונים חזרו למצב האחרון ששמרת')}
          className="text-[#8d785e] border border-[#e7e1da] px-6 py-2.5 rounded-xl text-[14px] hover:bg-[#f5f3f0] transition-colors">
          ביטול שינויים
        </button>
      </div>

      {/* Create version modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-[20px] text-[#181510] mb-3" style={{ fontWeight: 700 }}>יצירת גרסת הצעה</h3>
            <p className="text-[14px] text-[#8d785e] mb-4">הגרסה הנוכחית תינעל ויווצר קישור לשליחה ללקוח.</p>
            <div className="bg-[#f5f3f0] rounded-xl p-4 mb-4">
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-[#8d785e]">גרסה:</span>
                <span className="text-[#181510]" style={{ fontWeight: 600 }}>V1.0</span>
              </div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-[#8d785e]">סה"כ:</span>
                <span className="text-[#181510]" style={{ fontWeight: 600 }}>₪{totalSelling.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#8d785e]">רווחיות:</span>
                <span className="text-green-600" style={{ fontWeight: 600 }}>{profitPercent}%</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowPreview(false); appToast.success('גרסת הצעה V1.0 נוצרה בהצלחה!', 'מעביר לתצוגת לקוח...'); setTimeout(() => navigate(`/quote/${id}`), 1200); }}
                className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] text-white py-2.5 rounded-xl transition-colors"
                style={{ fontWeight: 600 }}
              >
                צור ושלח ללקוח
              </button>
              <button onClick={() => setShowPreview(false)} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">ביטול</button>
            </div>
          </div>
        </div>
      )}

      {/* Add component modal */}
      {showAddComponent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddComponent(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-[20px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>הוספת רכיב חדש</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🚌', label: 'תחבורה' },
                { icon: '🏨', label: 'לינה' },
                { icon: '🎯', label: 'פעילות' },
                { icon: '🍽️', label: 'ארוחה' },
                { icon: '🎤', label: 'בידור' },
                { icon: '📦', label: 'אחר' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setShowAddComponent(false)}
                  className="flex items-center gap-3 p-3 border border-[#e7e1da] rounded-xl hover:border-[#ff8c00] hover:bg-[#ff8c00]/5 transition-all"
                >
                  <span className="text-[20px]">{item.icon}</span>
                  <span className="text-[14px] text-[#181510]" style={{ fontWeight: 500 }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inline add supplier modal */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddSupplier(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-[20px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>חיפוש ספק מהמאגר</h3>
            <input
              value={supplierSearch}
              onChange={e => setSupplierSearch(e.target.value)}
              className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
              placeholder="חפש ספק לפי שם, קטגוריה או אזור..."
            />
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[
                { name: 'אוטובוסים הגליל', cat: 'תחבורה', icon: '🚌' },
                { name: 'קייטרינג סאמי המזרח', cat: 'מזון', icon: '🍽️' },
                { name: 'יקב רמת נפתלי', cat: 'אטרקציות', icon: '🍷' },
              ].filter(s => s.name.includes(supplierSearch) || !supplierSearch).map(s => (
                <button
                  key={s.name}
                  onClick={() => setShowAddSupplier(false)}
                  className="w-full flex items-center gap-3 p-3 border border-[#e7e1da] rounded-lg hover:bg-[#ff8c00]/5 hover:border-[#ff8c00] transition-all text-right"
                >
                  <span className="text-[18px]">{s.icon}</span>
                  <div>
                    <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{s.name}</div>
                    <div className="text-[12px] text-[#8d785e]">{s.cat}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-[#e7e1da] pt-3 mt-3">
              <button
                onClick={() => { setShowAddSupplier(false); navigate('/suppliers?new=true'); }}
                className="text-[13px] text-[#ff8c00] flex items-center gap-1"
                style={{ fontWeight: 600 }}
              >
                <Plus size={14} />
                הוסף ספק חדש למאגר
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}