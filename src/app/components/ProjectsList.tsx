import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Search, Plus, FolderOpen, Calendar, Users, MapPin,
  DollarSign, ChevronLeft
} from 'lucide-react';
import { projects } from './data';
import { appToast } from './AppToast';

export function ProjectsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('status') || 'הכל';
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');

  const statusOptions = ['הכל', 'ליד חדש', 'בניית הצעה', 'הצעה נשלחה', 'אושר', 'מחיר בהערכה'];

  const filtered = projects.filter(p => {
    const matchesStatus = statusFilter === 'הכל' || p.status === statusFilter;
    const matchesSearch = !search || p.name.includes(search) || p.company.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-6 mx-auto font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff8c00]/10 rounded-xl flex items-center justify-center">
            <FolderOpen size={20} className="text-[#ff8c00]" />
          </div>
          <h1 className="text-[26px] text-[#181510]" style={{ fontWeight: 700 }}>פרויקטים</h1>
        </div>
        <button
          onClick={() => { appToast.success('פרויקט חדש נוצר!', 'מעביר לעריכת הפרויקט...'); navigate('/projects/4829-24'); }}
          className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-[#ff8c00]/20 transition-all text-[14px]"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} /> פרויקט חדש
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d785e]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-[#e7e1da] rounded-lg pr-9 pl-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
            placeholder="חיפוש פרויקט..."
          />
        </div>
        <div className="flex gap-1 bg-white border border-[#e7e1da] rounded-lg p-1">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-[12px] transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#181510] text-white'
                  : 'text-[#8d785e] hover:bg-[#f5f3f0]'
              }`}
              style={{ fontWeight: statusFilter === status ? 600 : 400 }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(project => (
          <button
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-white rounded-xl border border-[#e7e1da] p-5 text-right hover:shadow-lg hover:border-[#d4cdc3] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[11px] px-2.5 py-1 rounded-full"
                style={{ backgroundColor: project.statusColor + '15', color: project.statusColor, fontWeight: 600 }}
              >
                {project.status}
              </span>
              <span className="text-[11px] text-[#8d785e]">#{project.id}</span>
            </div>
            <h3 className="text-[16px] text-[#181510] mb-1 group-hover:text-[#ff8c00] transition-colors" style={{ fontWeight: 600 }}>{project.name}</h3>
            <p className="text-[12px] text-[#8d785e] mb-3">{project.company}</p>
            <div className="flex flex-wrap gap-3 text-[12px] text-[#8d785e]">
              <span className="flex items-center gap-1"><Users size={12} /> {project.participants}</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {project.region}</span>
              {project.totalPrice > 0 && (
                <span className="flex items-center gap-1"><DollarSign size={12} /> ₪{project.totalPrice.toLocaleString()}</span>
              )}
            </div>
            {project.profitMargin > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#ece8e3] rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${project.profitMargin}%` }} />
                </div>
                <span className="text-[11px] text-green-600" style={{ fontWeight: 600 }}>{project.profitMargin}%</span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-end text-[12px] text-[#ff8c00] opacity-0 group-hover:opacity-100 transition-opacity">
              פתח פרויקט <ChevronLeft size={12} />
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-[40px] mb-3">📁</div>
          <p className="text-[16px] text-[#8d785e]">לא נמצאו פרויקטים</p>
          <p className="text-[13px] text-[#8d785e] mt-1">נסה לשנות את הסינון או ליצור פרויקט חדש</p>
        </div>
      )}
    </div>
  );
}