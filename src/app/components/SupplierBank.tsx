import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, Plus, Filter, Eye, Edit2, Copy, Star, CheckCircle,
  AlertTriangle, Clock, X, ChevronLeft, ChevronRight, Users
} from 'lucide-react';
import { suppliers } from './data';
import { appToast } from './AppToast';
import { SupplierMap } from './SupplierMap';

const categories = ['כל הקטגוריות', 'תחבורה', 'מזון', 'אטרקציות', 'לינה', 'בידור'];
const regions = ['כל הארץ', 'צפון', 'מרכז', 'ירושלים', 'דרום'];
const statuses = ['הכל', 'מאומת', 'ממתין', 'לא מאומת'];

export function SupplierBank() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('כל הקטגוריות');
  const [selectedRegion, setSelectedRegion] = useState('כל הארץ');
  const [selectedStatus, setSelectedStatus] = useState('הכל');
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  const filtered = suppliers.filter(s => {
    const matchesSearch = !search || s.name.includes(search) || s.category.includes(search) || s.region.includes(search);
    const matchesCategory = selectedCategory === 'כל הקטגוריות' || s.category === selectedCategory;
    const matchesRegion = selectedRegion === 'כל הארץ' || s.region === selectedRegion;
    const matchesStatus = selectedStatus === 'הכל' ||
      (selectedStatus === 'מאומת' && s.verificationStatus === 'verified') ||
      (selectedStatus === 'ממתין' && s.verificationStatus === 'pending') ||
      (selectedStatus === 'לא מאומת' && s.verificationStatus === 'unverified');
    return matchesSearch && matchesCategory && matchesRegion && matchesStatus;
  });

  const clearFilters = () => {
    setSelectedCategory('כל הקטגוריות');
    setSelectedRegion('כל הארץ');
    setSelectedStatus('הכל');
    setSearch('');
  };

  const totalSuppliers = 128;
  const verifiedCount = 102;
  const pendingCount = 14;
  const docsIssues = 12;

  return (
    <div className="p-4 lg:p-6 mx-auto font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff8c00]/10 rounded-xl flex items-center justify-center">
            <span className="text-[20px]">🏛️</span>
          </div>
          <h1 className="text-[26px] text-[#181510]" style={{ fontWeight: 700 }}>בנק ספקים</h1>
        </div>
        <button
          onClick={() => setShowAddSupplier(true)}
          className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-[#ff8c00]/20 transition-all text-[14px]"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} />
          הוספת ספק חדש
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d785e]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-[#e7e1da] rounded-xl pr-10 pl-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] transition-all"
          placeholder="חיפוש ספקים, קטגוריות או אזורים..."
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-[160px]">
          <label className="text-[11px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>קטגוריה</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="text-[11px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>אזור פעילות</label>
          <select
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
          >
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="text-[11px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>סטטוס אימות</label>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
          >
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-[12px] text-[#8d785e] hover:text-[#ff8c00] border border-[#e7e1da] px-3 py-2 rounded-lg transition-colors"
          >
            <Filter size={13} />
            ניקוי מסננים
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e7e1da] shadow-sm overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f3f0] border-b border-[#e7e1da]">
                {['ספק', 'קטגוריה', 'אזור', 'דירוג', 'סטטוס אימות', 'הערות', 'פעולות'].map(h => (
                  <th key={h} className="p-3 text-right text-[12px] text-[#8d785e] whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((supplier) => (
                <tr key={supplier.id} className="border-b border-[#ece8e3] hover:bg-[#f5f3f0]/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px]" style={{ backgroundColor: supplier.categoryColor + '15' }}>
                        {supplier.icon}
                      </div>
                      <div>
                        <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{supplier.name}</div>
                        <div className="text-[11px] text-[#8d785e]">{supplier.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-[12px] px-2.5 py-1 rounded-full" style={{ backgroundColor: supplier.categoryColor + '15', color: supplier.categoryColor, fontWeight: 600 }}>
                      {supplier.category}
                    </span>
                  </td>
                  <td className="p-3 text-[13px] text-[#6b5d45]">{supplier.region}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>{supplier.rating}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={12} fill={s <= supplier.rating ? '#ff8c00' : 'none'} className={s <= supplier.rating ? 'text-[#ff8c00]' : 'text-[#ddd6cb]'} />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {supplier.verificationStatus === 'verified' && (
                      <span className="flex items-center gap-1 text-[12px] text-green-600" style={{ fontWeight: 600 }}>
                        <CheckCircle size={14} /> מאומת
                      </span>
                    )}
                    {supplier.verificationStatus === 'pending' && (
                      <span className="flex items-center gap-1 text-[12px] text-yellow-600" style={{ fontWeight: 600 }}>
                        <Clock size={14} /> ממתין
                      </span>
                    )}
                    {supplier.verificationStatus === 'unverified' && (
                      <span className="flex items-center gap-1 text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>
                        <AlertTriangle size={14} /> לא מאומת
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-[12px] text-[#8d785e]">
                    {supplier.notes !== '-' && (
                      <span className="text-red-500 flex items-center gap-1">
                        <AlertTriangle size={12} /> {supplier.notes}
                      </span>
                    )}
                    {supplier.notes === '-' && '-'}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/suppliers/${supplier.id}`)} className="p-1.5 text-[#8d785e] hover:text-[#ff8c00] hover:bg-[#ff8c00]/10 rounded-lg transition-all"><Eye size={15} /></button>
                      <button onClick={() => navigate(`/suppliers/${supplier.id}`)} className="p-1.5 text-[#8d785e] hover:text-[#ff8c00] hover:bg-[#ff8c00]/10 rounded-lg transition-all"><Edit2 size={15} /></button>
                      <button onClick={() => appToast.info('הספק הועתק', 'פרטי הספק הועתקו ללוח')} className="p-1.5 text-[#8d785e] hover:text-[#181510] hover:bg-[#ece8e3] rounded-lg transition-all"><Copy size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3 bg-[#f5f3f0] border-t border-[#e7e1da]">
          <span className="text-[12px] text-[#8d785e]">מציג {filtered.length} מתוך {totalSuppliers} ספקים</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-white transition-colors"><ChevronRight size={14} /></button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center bg-[#ff8c00] text-white text-[12px]" style={{ fontWeight: 600 }}>1</button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-white text-[12px] transition-colors">2</button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-white text-[12px] transition-colors">3</button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-white transition-colors"><ChevronLeft size={14} /></button>
          </div>
        </div>
      </div>

      {/* ══════════ Supplier Map ══════════ */}
      <div className="mt-6">
        <SupplierMap />
      </div>

      {/* Add supplier modal */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddSupplier(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>הוספת ספק חדש</h2>
              <button onClick={() => setShowAddSupplier(false)} className="text-[#8d785e] hover:text-[#181510]"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[13px] text-[#6b5d45] mb-1 block" style={{ fontWeight: 600 }}>שם הספק</label>
                <input className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] text-[#6b5d45] mb-1 block" style={{ fontWeight: 600 }}>קטגוריה</label>
                  <select className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]">
                    {categories.filter(c => c !== 'כל הקטגוריות').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] text-[#6b5d45] mb-1 block" style={{ fontWeight: 600 }}>אזור</label>
                  <select className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]">
                    {regions.filter(r => r !== 'כל הארץ').map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[13px] text-[#6b5d45] mb-1 block" style={{ fontWeight: 600 }}>טלפון</label>
                <input className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAddSupplier(false); appToast.success('הספק נוסף בהצלחה למאגר', 'ניתן כעת לשייך אותו לפרויקטים'); }} className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] text-white py-2.5 rounded-xl transition-colors" style={{ fontWeight: 600 }}>הוסף ספק</button>
                <button onClick={() => setShowAddSupplier(false)} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">ביטול</button>
              </div>
            </div>
            <div className="border-t border-[#e7e1da] mt-4 pt-4 flex gap-2">
              <button onClick={() => { setShowAddSupplier(false); navigate('/suppliers/import'); }} className="text-[13px] text-[#ff8c00] hover:text-[#e67e00]" style={{ fontWeight: 600 }}>
                ייבוא מאקסל →
              </button>
              <span className="text-[#c4b89a]">|</span>
              <button onClick={() => { setShowAddSupplier(false); navigate('/suppliers/classify'); }} className="text-[13px] text-[#ff8c00] hover:text-[#e67e00]" style={{ fontWeight: 600 }}>
                אשף סיווג →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}