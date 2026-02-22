import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import {
  Search, Plus, Filter, Eye, Edit2, Copy, Star, CheckCircle,
  AlertTriangle, Clock, X, ChevronLeft, ChevronRight, Users, Loader2, Archive
} from 'lucide-react';
import type { Supplier } from './data';
import { suppliersApi } from './api';
import { appToast } from './AppToast';
import { SupplierMap } from './SupplierMap';
import { FormField, FormSelect, rules } from './FormField';
import { computeAutoNotesFromSummary, noteLevelStyles } from './supplierNotes';
import type { SupplierSummary } from './supplierNotes';

interface NewSupplierForm {
  name: string;
  category: string;
  region: string;
  phone: string;
}

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

  // ─── Live data from API ───
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, SupplierSummary>>({});

  // ─── New supplier form state ───
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { register, handleSubmit, formState: { errors, dirtyFields, isValid }, reset: resetSupplierForm } = useForm<NewSupplierForm>({
    mode: 'onChange',
    defaultValues: { name: '', category: 'תחבורה', region: 'צפון', phone: '' },
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, summaryData] = await Promise.all([
        suppliersApi.list(),
        suppliersApi.summaries().catch(err => {
          console.warn('[SupplierBank] Failed to load summaries:', err);
          return {} as Record<string, SupplierSummary>;
        }),
      ]);
      setSuppliers(data);
      setSummaries(summaryData);
    } catch (err) {
      console.error('[SupplierBank] Failed to load suppliers:', err);
      setError('שגיאה בטעינת ספקים');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onSubmitSupplier = async (data: NewSupplierForm) => {
    try {
      setSaving(true);
      await suppliersApi.create({
        name: data.name.trim(),
        category: data.category,
        region: data.region,
        phone: data.phone.trim(),
      });
      appToast.success('הספק נוסף בהצלחה למאגר', 'ניתן כעת לשייך אותו לפרויקטים');
      setShowAddSupplier(false);
      resetSupplierForm();
      fetchSuppliers();
    } catch (err) {
      console.error('[SupplierBank] Failed to create supplier:', err);
      appToast.error('שגיאה ביצירת ספק', String(err));
    } finally {
      setSaving(false);
    }
  };


  const filtered = suppliers.filter(s => {
    // Filter out archived suppliers
    if (s.category === 'ארכיון') return false;
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
    setCurrentPage(1);
  };

  const activeSuppliers = suppliers.filter(s => s.category !== 'ארכיון');
  const archivedCount = suppliers.filter(s => s.category === 'ארכיון').length;
  const totalSuppliers = activeSuppliers.length;
  const verifiedCount = activeSuppliers.filter(s => s.verificationStatus === 'verified').length;
  const pendingCount = activeSuppliers.filter(s => s.verificationStatus === 'pending').length;
  const docsIssues = activeSuppliers.filter(s => {
    const notes = computeAutoNotesFromSummary(s, summaries[s.id]);
    return notes.some(n => n.level === 'critical' || n.level === 'warning');
  }).length;

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
        <div className="flex items-center gap-3">
          {archivedCount > 0 && (
            <button
              onClick={() => navigate('/suppliers/archive')}
              className="flex items-center gap-2 border border-[#e7e1da] text-[#8d785e] hover:text-[#181510] hover:border-[#b8a990] px-4 py-2.5 rounded-xl transition-all text-[14px]"
              style={{ fontWeight: 600 }}
            >
              <Archive size={16} />
              ארכיון ({archivedCount})
            </button>
          )}
          <button
            onClick={() => setShowAddSupplier(true)}
            className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-[#ff8c00]/20 transition-all text-[14px]"
            style={{ fontWeight: 600 }}
          >
            <Plus size={16} />
            הוספת ספק חדש
          </button>
        </div>
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
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#e7e1da] shadow-sm mb-5">
          <Loader2 size={32} className="animate-spin text-[#ff8c00] mb-3" />
          <p className="text-[14px] text-[#8d785e]">טוען ספקים...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#e7e1da] shadow-sm mb-5">
          <AlertTriangle size={32} className="text-[#ef4444] mb-3" />
          <p className="text-[14px] text-[#ef4444]">{error}</p>
          <button onClick={fetchSuppliers} className="mt-3 text-[13px] text-[#ff8c00] hover:text-[#e67e00]" style={{ fontWeight: 600 }}>נסה שוב</button>
        </div>
      ) : (
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
              {filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((supplier) => (
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
                  <td className="p-3 text-[12px]">
                    {(() => {
                      const notes = computeAutoNotesFromSummary(supplier, summaries[supplier.id]);
                      if (notes.length === 0) return <span className="text-[#b8a990]">-</span>;
                      const first = notes[0];
                      const styles = noteLevelStyles(first.level);
                      return (
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
                          <span className={`${styles.text} leading-tight`} style={{ fontWeight: 500 }}>{first.text}</span>
                          {notes.length > 1 && (
                            <span className="text-[10px] text-[#b8a990] bg-[#f5f3f0] px-1.5 py-0.5 rounded-full shrink-0" style={{ fontWeight: 600 }}>
                              +{notes.length - 1}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/suppliers/${supplier.id}`)} className="p-1.5 text-[#8d785e] hover:text-[#ff8c00] hover:bg-[#ff8c00]/10 rounded-lg transition-all"><Eye size={15} /></button>
                      <button onClick={() => navigate(`/suppliers/${supplier.id}`)} className="p-1.5 text-[#8d785e] hover:text-[#ff8c00] hover:bg-[#ff8c00]/10 rounded-lg transition-all"><Edit2 size={15} /></button>
                      <button onClick={() => {
                        const text = `${supplier.name}\nקטגוריה: ${supplier.category}\nאזור: ${supplier.region}\nטלפון: ${supplier.phone}\nדירוג: ${supplier.rating}`;
                        navigator.clipboard.writeText(text).then(() => {
                          appToast.info('הספק הועתק', `פרטי "${supplier.name}" הועתקו ללוח`);
                        }).catch(() => appToast.info('הספק הועתק', 'פרטי הספק הועתקו ללוח'));
                      }} className="p-1.5 text-[#8d785e] hover:text-[#181510] hover:bg-[#ece8e3] rounded-lg transition-all"><Copy size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3 bg-[#f5f3f0] border-t border-[#e7e1da]">
          <span className="text-[12px] text-[#8d785e]">
            מציג {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} מתוך {filtered.length} ספקים
          </span>
          {(() => {
            const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
            return (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-white transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-[12px] transition-colors ${
                      currentPage === page
                        ? 'bg-[#ff8c00] text-white'
                        : 'text-[#8d785e] hover:bg-white'
                    }`}
                    style={{ fontWeight: currentPage === page ? 600 : 400 }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-white transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>
              </div>
            );
          })()}
        </div>
      </div>
      )}

      {/* ══════════ Supplier Map ══════════ */}
      <div className="mt-6">
        <SupplierMap />
      </div>

      {/* Add supplier modal */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddSupplier(false); resetSupplierForm(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>הוספת ספק חדש</h2>
              <button onClick={() => { setShowAddSupplier(false); resetSupplierForm(); }} className="text-[#8d785e] hover:text-[#181510]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmitSupplier)} className="space-y-3">
              <FormField
                label="שם הספק"
                required
                error={errors.name}
                isDirty={dirtyFields.name}
                placeholder="שם הספק"
                {...register('name', rules.requiredMin('שם הספק', 2))}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormSelect
                  label="קטגוריה"
                  error={errors.category}
                  isDirty={dirtyFields.category}
                  {...register('category')}
                >
                  {categories.filter(c => c !== 'כל הקטגוריות').map(c => <option key={c}>{c}</option>)}
                </FormSelect>
                <FormSelect
                  label="אזור"
                  error={errors.region}
                  isDirty={dirtyFields.region}
                  {...register('region')}
                >
                  {regions.filter(r => r !== 'כל הארץ').map(r => <option key={r}>{r}</option>)}
                </FormSelect>
              </div>
              <FormField
                label="טלפון"
                placeholder="05X-XXXXXXX"
                error={errors.phone}
                isDirty={dirtyFields.phone}
                {...register('phone', rules.israeliPhone(false))}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !isValid}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : 'הוסף ספק'}
                </button>
                <button type="button" onClick={() => { setShowAddSupplier(false); resetSupplierForm(); }} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">ביטול</button>
              </div>
            </form>
            <div className="border-t border-[#e7e1da] mt-4 pt-4 flex gap-2">
              <button onClick={() => { setShowAddSupplier(false); resetSupplierForm(); navigate('/suppliers/import'); }} className="text-[13px] text-[#ff8c00] hover:text-[#e67e00]" style={{ fontWeight: 600 }}>
                ייבוא מאקסל →
              </button>
              <span className="text-[#c4b89a]">|</span>
              <button onClick={() => { setShowAddSupplier(false); resetSupplierForm(); navigate('/suppliers/classify'); }} className="text-[13px] text-[#ff8c00] hover:text-[#e67e00]" style={{ fontWeight: 600 }}>
                אשף סיווג →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}