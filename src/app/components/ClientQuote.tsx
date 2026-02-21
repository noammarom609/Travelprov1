import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronDown, ChevronUp, Check, ArrowRight, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const PLANT_IMG = 'https://images.unsplash.com/photo-1555758826-ce21b7e51ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHBsYW50JTIwbGVhdmVzJTIwZ3JlZW58ZW58MXx8fHwxNzcxMzgwNzUzfDA&ixlib=rb-4.1.0&q=80&w=1080';
const VINEYARD_IMG = 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
const LUNCH_IMG = 'https://images.unsplash.com/photo-1566670829023-5badae05aa7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwbHVuY2glMjByZXN0YXVyYW50JTIwdGFibGV8ZW58MXx8fHwxNzcxNDY4MjM2fDA&ixlib=rb-4.1.0&q=80&w=1080';
const VAN_IMG = 'https://images.unsplash.com/photo-1760954661834-fca0f39ead42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdmFuJTIwcm9hZCUyMHRyaXAlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzcxNDY4MjQyfDA&ixlib=rb-4.1.0&q=80&w=1080';

export function ClientQuote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(null);
  const [expandedActivities, setExpandedActivities] = useState<Record<number, boolean>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

  const timeline = [
    { time: '09:00-12:00', title: 'סיור כרמים וטעימות', emoji: '🍷' },
    { time: '13:00-14:00', title: 'ארוחת צהריים גורמה', emoji: '🍽️' },
    { time: '15:00-18:00', title: 'הסעות VIP וסיום היום', emoji: '🚌' },
  ];

  const activities = [
    {
      title: 'סיור כרמים, טעימות יין וגבינות בוטיק',
      subtitle: 'החוויה הגלילית האולטימטיבית',
      img: VINEYARD_IMG,
      provider: 'יקב רמת נפתלי',
      bullets: [
        'סיור מודרך בכרם עין רפאל בגליל העליון, עם מדריך שמכיר כל גפן ואבן במקום.',
        'נכנסים ללב הכרם — נופים עוצרי נשימה, אדמה אדומה וסיפורים מרתקים.',
        'טעימות מקצועיות של 5 סוגי יין מהייקב, עם הסבר על תהליך הייצור.',
        'פלטת גבינות בוטיק מחלבות גליליות, זיתים ולחם טרי מהטאבון.',
        'צילום קבוצתי בנקודת תצפית פנורמית על הגליל.',
      ],
    },
    {
      title: 'ארוחת צהריים גורמה בטבע',
      subtitle: 'חוויה קולינרית גלילית',
      img: LUNCH_IMG,
      provider: 'מסעדת "החווה הגלילית"',
      bullets: [
        'ארוחה במסעדת חווה ציורית בלב הטבע, שולחנות מוצלים מתחת לעצי אלון.',
        'תפריט שף עשיר: סלטי חווה טריים, בשרים על הגריל ותבשילים ביתיים.',
        'כל המנות מוכנות ממרכיבים מקומיים וטריים מהמשק.',
        'אופציות מותאמות לכשר, צמחוני וטבעוני.',
      ],
    },
    {
      title: 'הסעות VIP ולוגיסטיקה מלאה',
      subtitle: 'ROYAL TRANSPORT',
      img: VAN_IMG,
      provider: 'ROYAL TRANSPORT',
      bullets: [
        'איסוף מאורגן מ-3 נקודות מפגש מרכזיות (ת"א, חיפה, נתניה).',
        '3 אוטובוסים מפוארים עם מושבים מרופדים, Wi-Fi ומיזוג אוויר.',
        'מנהלת לוגיסטית מלווה את הקבוצה לאורך כל הדרך.',
        'זמן נסיעה משוער: כשעה וחצי עם עצירת ביניים לקפה.',
      ],
    },
  ];

  const tips = [
    { title: 'קחו כובעים וקרם הגנה', desc: 'בגליל העליון ישנן כ-14 שעות שמש ביום בעונת הקיץ. מומלץ להצטייד בכובע, קרם הגנה ובקבוק מים.' },
    { title: 'הגיעו עם נעליים נוחות', desc: 'הסיור בכרמים מתבצע על שבילים לא סלולים. נעלי ספורט או נעליים סגורות מומלצות.' },
  ];

  const toggleActivity = (idx: number) => {
    setExpandedActivities(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-white font-['Assistant',sans-serif]" dir="rtl">
      {/* Top nav */}
      <div className="bg-white border-b border-[#e7e1da] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[13px] text-[#8d785e] hover:text-[#181510] bg-[#f5f3f0] hover:bg-[#ece8e3] pl-3 pr-2 py-1.5 rounded-lg transition-colors"
            style={{ fontWeight: 600 }}
          >
            חזרה לפרויקט
            <ArrowRight size={15} />
          </button>
          <div className="w-px h-6 bg-[#e7e1da]" />
          <div className="w-8 h-8 bg-[#ff8c00] rounded-lg flex items-center justify-center">
            <span className="text-white text-[14px]">✈</span>
          </div>
          <span className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>TravelPro</span>
        </div>
        <div className="text-[13px] text-[#8d785e] hidden sm:block">הצעת מחיר | נופש שנתי גליל עליון</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVersions(true)}
            className="text-[12px] text-[#8d785e] border border-[#e7e1da] px-3 py-1.5 rounded-lg hover:bg-[#f5f3f0] transition-colors"
          >
            גרסאות
          </button>
          <button className="text-[12px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-3 py-1.5 rounded-lg transition-colors" style={{ fontWeight: 600 }}>
            🖨 הדפס
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <ImageWithFallback src={PLANT_IMG} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-right">
          <span className="text-[12px] text-[#ffb74d] tracking-wider" style={{ fontWeight: 600 }}>החוויה הגלילית שלכם</span>
          <h1 className="text-[32px] md:text-[44px] text-white mt-2 max-w-lg" style={{ fontWeight: 700, lineHeight: 1.2 }}>
            החוויה הגלילית שלכם מתחילה כאן
          </h1>
          <p className="text-[14px] text-white/80 mt-3 max-w-md">
            יום נופש מושלם בגליל העליון: סיור ביקב, טעימות יין, ארוחת שף בטבע והסעות מפנקות. חוויה שתיזכר לאורך זמן.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-10">
        {/* Quick timeline */}
        <div>
          <h2 className="text-[22px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>⏰ לו"ז מקוצר</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {timeline.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setExpandedTimeline(expandedTimeline === idx ? null : idx)}
                className="flex items-center gap-3 p-4 border-2 border-[#ff8c00]/20 rounded-xl hover:border-[#ff8c00] transition-all bg-white"
              >
                <span className="text-[20px]">{item.emoji}</span>
                <div className="text-right">
                  <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{item.title}</div>
                  <div className="text-[12px] text-[#ff8c00]" style={{ fontWeight: 600 }}>{item.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div>
          <h2 className="text-[22px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>📋 פירוט הפעילויות</h2>
          <div className="space-y-5">
            {activities.map((activity, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#e7e1da] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-80 h-56 md:h-auto bg-[#f5f3f0] shrink-0 overflow-hidden">
                    <ImageWithFallback src={activity.img} alt={activity.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-5">
                    {activity.subtitle && <div className="text-[11px] text-[#ff8c00] mb-1" style={{ fontWeight: 600 }}>{activity.subtitle}</div>}
                    <h3 className="text-[18px] text-[#181510] mb-2" style={{ fontWeight: 700 }}>{activity.title}</h3>
                    <div className={`space-y-1 ${!expandedActivities[idx] ? 'max-h-20 overflow-hidden relative' : ''}`}>
                      {activity.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-2 text-[13px] text-[#8d785e]">
                          <span className="text-[#ff8c00] shrink-0">•</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                      {!expandedActivities[idx] && (
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
                      )}
                    </div>
                    <button
                      onClick={() => toggleActivity(idx)}
                      className="text-[12px] text-[#ff8c00] flex items-center gap-1 mt-2"
                      style={{ fontWeight: 600 }}
                    >
                      {expandedActivities[idx] ? 'הצג פחות' : 'קרא עוד'}
                      {expandedActivities[idx] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                    {activity.provider && (
                      <div className="mt-3 text-[11px] text-[#8d785e]">ספק: {activity.provider}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h2 className="text-[22px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>💡 חשוב לדעת</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tips.map((tip, idx) => (
              <div key={idx} className="bg-[#fff7ed] border border-[#ff8c00]/20 rounded-xl p-4">
                <div className="text-[14px] text-[#181510] mb-1" style={{ fontWeight: 600 }}>{tip.title}</div>
                <div className="text-[12px] text-[#8d785e]">{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Price summary */}
        <div className="bg-gradient-to-l from-[#181510] to-[#2a2518] rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] text-white" style={{ fontWeight: 700 }}>סיכום הצעת מחיר</h2>
              <p className="text-[13px] text-[#c4b89a] mt-1">החבילה המומלצת על 50 משתתפים</p>
            </div>
            <div className="flex items-end gap-6">
              <div className="text-center">
                <div className="text-[11px] text-[#c4b89a]">מחיר לאדם</div>
                <div className="text-[20px] text-white" style={{ fontWeight: 700 }}>₪850</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-[#c4b89a]">מחיר כולל</div>
                <div className="text-[32px] text-[#ff8c00]" style={{ fontWeight: 700 }}>₪42,500</div>
                <div className="text-[11px] text-[#c4b89a]">כולל מע"מ על בסיס 50 משתתפים</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            {!confirmed ? (
              <button
                onClick={() => setConfirmed(true)}
                className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white px-8 py-3 rounded-xl shadow-lg shadow-[#ff8c00]/20 transition-all"
                style={{ fontWeight: 700 }}
              >
                <Check size={18} /> אישור הזמנה
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-xl">
                <Check size={18} />
                <span style={{ fontWeight: 700 }}>ההזמנה אושרה! המפיק יקבל התראה.</span>
              </div>
            )}
            <button className="flex items-center gap-2 text-[#c4b89a] border border-[#c4b89a]/40 px-6 py-3 rounded-xl hover:bg-white/5 transition-colors">
              <Share2 size={16} /> שיתוף
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#181510] text-white py-8 mt-10">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff8c00] rounded-lg flex items-center justify-center">
                <span className="text-white text-[14px]">✈</span>
              </div>
              <span className="text-[16px]" style={{ fontWeight: 700 }}>TravelPro</span>
            </div>
            <div className="text-[12px] text-[#8d785e]">
              © 2024 TravelPro Productions
            </div>
            <div className="flex gap-4 text-[12px] text-[#8d785e]">
              <span>info@travelpro.co.il</span>
              <span>073-123-4567</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-[12px] text-[#8d785e]">
            <button className="hover:text-white transition-colors">תנאי שימוש</button>
            <button className="hover:text-white transition-colors">מדיניות פרטיות</button>
            <button className="hover:text-white transition-colors">אודות</button>
          </div>
        </div>
      </footer>

      {/* Versions modal */}
      {showVersions && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowVersions(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-[20px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>גרסאות הצעה</h3>
            <div className="space-y-2">
              {[
                { version: 'V1.0', date: '15.03.2024', price: '₪42,500', status: 'נוכחית', active: true },
                { version: 'V0.9', date: '12.03.2024', price: '₪45,000', status: 'ארכיון', active: false },
                { version: 'V0.8', date: '10.03.2024', price: '₪48,000', status: 'ארכיון', active: false },
              ].map(v => (
                <div key={v.version} className={`flex items-center justify-between p-3 rounded-xl border ${v.active ? 'border-[#ff8c00] bg-[#ff8c00]/5' : 'border-[#e7e1da]'}`}>
                  <div>
                    <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{v.version}</div>
                    <div className="text-[12px] text-[#8d785e]">{v.date} &bull; {v.price}</div>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${v.active ? 'bg-[#ff8c00] text-white' : 'bg-[#f5f3f0] text-[#8d785e]'}`} style={{ fontWeight: 600 }}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowVersions(false)} className="w-full mt-4 text-[14px] text-[#8d785e] border border-[#e7e1da] py-2 rounded-xl hover:bg-[#f5f3f0] transition-colors">סגור</button>
          </div>
        </div>
      )}
    </div>
  );
}
