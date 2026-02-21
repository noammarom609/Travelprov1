import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowRight, CheckCircle, Edit2, Phone, Mail, Globe,
  MapPin, FileText, AlertTriangle, Plus
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { appToast } from './AppToast';

const VINEYARD_IMG = 'https://images.unsplash.com/photo-1762330465953-75478d918896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW5leWFyZCUyMGdyYXBlJTIwaGlsbHNpZGUlMjBncmVlbnxlbnwxfHx8fDE3NzE0NjgyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080';
const CHEESE_IMG = 'https://images.unsplash.com/photo-1706512998255-c2d2dcf2ace9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3aW5lJTIwdGFzdGluZyUyMGJvdXRpcXVlfGVufDF8fHx8MTc3MTQ2ODIzN3ww&ixlib=rb-4.1.0&q=80&w=1080';
const EVENT_IMG = 'https://images.unsplash.com/photo-1673081752959-addbc864f678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMHByaXZhdGUlMjBkaW5uZXJ8ZW58MXx8fHwxNzcxNDY4MjQzfDA&ixlib=rb-4.1.0&q=80&w=1080';

const tabItems = [
  { id: 'info', label: 'מידע כללי' },
  { id: 'products', label: 'מוצרים ושירותים' },
  { id: 'docs', label: 'מסמכים' },
  { id: 'contacts', label: 'אנשי קשר' },
  { id: 'history', label: 'היסטוריה' },
];

export function SupplierDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('info');
  const [showAddContact, setShowAddContact] = useState(false);

  const contacts = [
    { name: 'יצחק ברוך', role: 'בעלים ומנכ"ל', initials: 'יב', phone: '054-1234567', email: 'yitzhak@ramatnaftali.co.il', primary: true },
    { name: 'מיכל לוי', role: 'מנהלת אירועים ושיווק', initials: 'מל', phone: '050-7654321', email: 'michal@ramatnaftali.co.il', primary: false },
  ];

  const products = [
    { name: 'סיור ביקב וטעימות יין', price: 120, desc: 'סיור מודרך בכרמים ובחביות, הדגמת תהליך הייצור. מדריך מקצועי עם הסבר על תהליך ייצור היין.', img: VINEYARD_IMG },
    { name: 'פלטת גבינות גליליות', price: 85, desc: 'מבחר גבינות מחלבות בוטיק בגליל. לוח מהדרין, זיתים ותוספות נלוות.', img: CHEESE_IMG },
    { name: 'אירועי חברה בוטיק', price: 5000, desc: 'אירוח פרטי עד 50 איש. ארוחת שף בתנור אבן, הופעה מוזיקלית חיה ואווירה אינטימית.', img: EVENT_IMG, badge: 'PRIVATE EVENT' },
  ];

  const documents = [
    { name: 'רישיון עסק', expiry: '01/01/2026', status: 'valid' as const },
    { name: 'תעודת כשרות', expiry: '15/09/2024', status: 'warning' as const },
    { name: 'ביטוח צד ג\'', expiry: '01/05/2024', status: 'expired' as const },
  ];

  const history = [
    { date: '10:45', time: 'היום', type: 'call', title: 'שיחת טלפון נכנסת', desc: 'עדכון מחירים לאירועי חברה. ברבעון 4.' },
    { date: '14:20', time: 'היום', type: 'email', title: 'מייל יוצא', desc: 'בקשה לקבלת הצעת מחיר לפרויקט "קוקה קולה 2024".' },
    { date: '12', time: 'ינואר 2024', type: 'doc', title: 'העלאת מסמך', desc: 'תעודת כשרות מעודכנת הועלתה למערכת.' },
  ];

  return (
    <div className="p-4 lg:p-6 mx-auto font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/suppliers')} className="text-[#8d785e] hover:text-[#181510] transition-colors">
            <ArrowRight size={20} />
          </button>
          <div className="w-12 h-12 bg-[#ff8c00]/10 rounded-xl flex items-center justify-center">
            <span className="text-[24px]">🍷</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] text-[#181510]" style={{ fontWeight: 700 }}>יקב רמת נפתלי</h1>
              <span className="flex items-center gap-1 text-[12px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                <CheckCircle size={12} /> מאומת
              </span>
            </div>
            <p className="text-[13px] text-[#8d785e]">🍷 יקבים וסיורי יין &bull; גליל עליון</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[13px] text-[#6b5d45] border border-[#e7e1da] px-3 py-2 rounded-lg hover:bg-[#f5f3f0] transition-colors">
            <Edit2 size={14} /> עריכה
          </button>
          <button className="flex items-center gap-1.5 text-[13px] text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded-lg transition-colors" style={{ fontWeight: 600 }}>
            <CheckCircle size={14} /> אימות ספק
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[#ece8e3] rounded-lg p-1 overflow-x-auto">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-2 px-4 rounded-md text-[13px] transition-all ${
              activeTab === tab.id ? 'bg-white text-[#181510] shadow-sm' : 'text-[#8d785e] hover:text-[#181510]'
            }`}
            style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
          >
            {tab.id === 'docs' && documents.some(d => d.status === 'expired') && <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-1" />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Contacts */}
            <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>אנשי קשר</h3>
                <button onClick={() => setShowAddContact(true)} className="text-[12px] text-[#ff8c00] flex items-center gap-1" style={{ fontWeight: 600 }}>
                  <Plus size={13} /> הוספת איש קשר
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {contacts.map(contact => (
                  <div key={contact.name} className="border border-[#e7e1da] rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] text-white ${contact.primary ? 'bg-green-500' : 'bg-[#ff8c00]'}`} style={{ fontWeight: 600 }}>
                        {contact.initials}
                      </div>
                      <div>
                        <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{contact.name}</div>
                        <div className="text-[11px] text-[#8d785e]">{contact.role}</div>
                      </div>
                      {contact.primary && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full mr-auto" style={{ fontWeight: 600 }}>ראשי</span>}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[12px] text-[#8d785e]">
                        <Phone size={12} /> {contact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-[#8d785e]">
                        <Mail size={12} /> {contact.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>מוצרים ושירותים</h3>
                <button className="text-[12px] text-[#ff8c00]" style={{ fontWeight: 600 }}>צפייה בכל המוצרים (6)</button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {products.map(product => (
                  <div key={product.name} className="border border-[#e7e1da] rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="h-28 bg-[#f5f3f0] relative overflow-hidden">
                      <ImageWithFallback src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {product.badge && (
                        <span className="absolute top-2 right-2 text-[9px] bg-[#181510] text-white px-2 py-0.5 rounded-md" style={{ fontWeight: 600 }}>{product.badge}</span>
                      )}
                      <span className="absolute bottom-2 left-2 text-[11px] bg-white/90 backdrop-blur-sm text-[#181510] px-2 py-0.5 rounded-md" style={{ fontWeight: 700 }}>
                        ₪{product.price.toLocaleString()}{product.price < 200 ? '/אדם' : ''}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>{product.name}</div>
                      <div className="text-[11px] text-[#8d785e] mt-1 line-clamp-2">{product.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-5">
            {/* Location */}
            <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
              <h3 className="text-[14px] text-[#181510] mb-3" style={{ fontWeight: 700 }}>מיקום ומידע נוסף</h3>
              <div className="bg-[#f5f3f0] rounded-lg h-32 mb-3 flex items-center justify-center text-[#8d785e]">
                <MapPin size={24} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[13px] text-[#8d785e]">
                  <MapPin size={13} /> מושב רמת נפתלי, גליל עליון
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#ff8c00]">
                  <Globe size={13} /> www.ramatnaftali.com
                </div>
              </div>
            </div>

            {/* Documents summary */}
            <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
              <h3 className="text-[14px] text-[#181510] mb-3" style={{ fontWeight: 700 }}>מסמכים ותקינות</h3>
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.name} className={`flex items-center justify-between p-2.5 rounded-lg border ${
                    doc.status === 'expired' ? 'bg-red-50 border-red-200' :
                    doc.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {doc.status === 'valid' && <CheckCircle size={14} className="text-green-500" />}
                      {doc.status === 'warning' && <AlertTriangle size={14} className="text-yellow-500" />}
                      {doc.status === 'expired' && <AlertTriangle size={14} className="text-red-500" />}
                      <span className="text-[12px] text-[#181510]" style={{ fontWeight: 500 }}>{doc.name}</span>
                    </div>
                    <span className={`text-[11px] ${doc.status === 'expired' ? 'text-red-500' : doc.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} style={{ fontWeight: 600 }}>
                      {doc.expiry}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent communication */}
            <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
              <h3 className="text-[14px] text-[#181510] mb-3" style={{ fontWeight: 700 }}>תקשורת אחרונה</h3>
              <div className="space-y-3">
                {history.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${item.type === 'call' ? 'bg-red-400' : item.type === 'email' ? 'bg-[#ff8c00]' : 'bg-green-400'}`} />
                    <div>
                      <div className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>{item.title}</div>
                      <div className="text-[11px] text-[#8d785e] mt-0.5">{item.desc}</div>
                      <div className="text-[10px] text-[#c4b89a] mt-0.5">{item.date} &bull; {item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Docs Tab */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-xl border border-[#e7e1da] p-5 space-y-3">
          <h3 className="text-[16px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>מסמכים ותקינות</h3>
          {documents.map(doc => (
            <div key={doc.name} className={`flex items-center justify-between p-4 rounded-xl border ${
              doc.status === 'expired' ? 'bg-red-50 border-red-200' :
              doc.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3">
                <FileText size={18} className={doc.status === 'expired' ? 'text-red-500' : doc.status === 'warning' ? 'text-yellow-500' : 'text-green-500'} />
                <div>
                  <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{doc.name}</div>
                  <div className="text-[12px] text-[#8d785e]">תוקף: {doc.expiry}</div>
                </div>
              </div>
              <span className={`text-[12px] px-3 py-1 rounded-full ${
                doc.status === 'expired' ? 'bg-red-100 text-red-600' :
                doc.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`} style={{ fontWeight: 600 }}>
                {doc.status === 'valid' ? 'תקין' : doc.status === 'warning' ? 'קרוב לפקיעה' : 'פג תוקף'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
          <h3 className="text-[16px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>מוצרים ושירותים</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.name} className="border border-[#e7e1da] rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-36 bg-[#f5f3f0] relative overflow-hidden">
                  <ImageWithFallback src={product.img} alt={product.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[12px] bg-white/90 backdrop-blur-sm text-[#181510] px-2 py-0.5 rounded-md" style={{ fontWeight: 700 }}>
                    ₪{product.price.toLocaleString()}{product.price < 200 ? '/אדם' : ''}
                  </span>
                </div>
                <div className="p-4">
                  <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{product.name}</div>
                  <div className="text-[12px] text-[#8d785e] mt-1">{product.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>אנשי קשר</h3>
            <button onClick={() => setShowAddContact(true)} className="text-[13px] text-[#ff8c00] flex items-center gap-1" style={{ fontWeight: 600 }}>
              <Plus size={14} /> הוספת איש קשר
            </button>
          </div>
          <div className="space-y-3">
            {contacts.map(contact => (
              <div key={contact.name} className="flex items-center justify-between p-4 border border-[#e7e1da] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] text-white ${contact.primary ? 'bg-green-500' : 'bg-[#ff8c00]'}`} style={{ fontWeight: 600 }}>
                    {contact.initials}
                  </div>
                  <div>
                    <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{contact.name}</div>
                    <div className="text-[12px] text-[#8d785e]">{contact.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[#8d785e]">
                  <span className="flex items-center gap-1"><Phone size={12} />{contact.phone}</span>
                  <span className="flex items-center gap-1"><Mail size={12} />{contact.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
          <h3 className="text-[16px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>היסטוריית תקשורת</h3>
          <div className="space-y-4">
            {history.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 border border-[#e7e1da] rounded-xl">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'call' ? 'bg-red-50 text-red-500' : item.type === 'email' ? 'bg-[#ff8c00]/10 text-[#ff8c00]' : 'bg-green-50 text-green-500'}`}>
                  {item.type === 'call' ? <Phone size={16} /> : item.type === 'email' ? <Mail size={16} /> : <FileText size={16} />}
                </div>
                <div>
                  <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{item.title}</div>
                  <div className="text-[12px] text-[#8d785e] mt-0.5">{item.desc}</div>
                  <div className="text-[11px] text-[#c4b89a] mt-1">{item.date} &bull; {item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add contact modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddContact(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-[20px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>הוספת איש קשר</h3>
            <div className="space-y-3">
              <input className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]" placeholder="שם מלא" />
              <input className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]" placeholder="תפקיד" />
              <input className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]" placeholder="טלפון" />
              <input className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]" placeholder="אימייל" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAddContact(false); appToast.success('איש הקשר נוסף בהצלחה', 'פרטיו נשמרו בכרטיס הספק'); }} className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] text-white py-2.5 rounded-xl transition-colors" style={{ fontWeight: 600 }}>שמור</button>
                <button onClick={() => setShowAddContact(false)} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">ביטול</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}