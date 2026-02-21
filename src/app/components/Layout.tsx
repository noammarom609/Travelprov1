import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router';
import {
  LayoutDashboard, FolderOpen, Users, Calendar, Settings,
  Search, HelpCircle, Bell, Menu, X, Plus, UserCircle, FileText
} from 'lucide-react';
import imgAvatar from "figma:asset/3e33ffb968ecb98f421cfb68a6d08fed3e8bf007.png";
import imgLogo from "figma:asset/b655d2164f14a54b258c6a8a069f10a88a1c4640.png";
import { Breadcrumbs } from './Breadcrumbs';
import { appToast } from './AppToast';

const mainNavItems = [
  { path: '/', label: 'דשבורד', icon: LayoutDashboard },
  { path: '/projects', label: 'פרויקטים', icon: FolderOpen },
  { path: '/suppliers', label: 'בנק ספקים', icon: Users },
  { path: '/clients', label: 'לקוחות', icon: UserCircle },
  { path: '/documents', label: 'מסמכים', icon: FileText },
  { path: '/calendar', label: 'יומן', icon: Calendar },
];

const bottomNavItems = [
  { path: '/settings', label: 'הגדרות', icon: Settings },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  // Don't show layout for client quote pages
  if (location.pathname.startsWith('/quote/') || location.pathname === '/prd') {
    return <Outlet />;
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div dir="rtl" className="flex h-screen bg-[#f8f7f5] font-['Assistant',sans-serif]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50 w-[256px] bg-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        flex flex-col border-l border-[#e7e1da]
      `}>
        {/* Logo */}
        <div className="border-b border-[#f5f3f0]">
          <div className="flex items-center gap-3 px-6 py-6 cursor-pointer" onClick={() => navigate('/')}>
            <img src={imgLogo} alt="יום כיף - ערן לוי" className="w-10 h-10 rounded-lg object-contain shrink-0" />
            <div>
              <div className="text-[18px] text-[#181510]" style={{ fontWeight: 700 }}>יום כיף</div>
              <div className="text-[12px] text-[#8d785e]">ערן לוי - הפקת אירועים</div>
            </div>
          </div>
          {/* Mobile close button */}
          <button className="lg:hidden absolute top-5 left-4 text-[#8d785e]" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-4 flex flex-col">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all
                    ${active
                      ? 'bg-[rgba(255,140,0,0.1)] text-[#ff8c00]'
                      : 'text-[#181510] hover:bg-[#f5f3f0]'
                    }
                  `}
                  style={{ fontWeight: active ? 600 : 400 }}
                  dir="rtl"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom nav - settings */}
          <div className="border-t border-[#f5f3f0] pt-4">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all
                    ${active
                      ? 'bg-[rgba(255,140,0,0.1)] text-[#ff8c00]'
                      : 'text-[#181510] hover:bg-[#f5f3f0]'
                    }
                  `}
                  style={{ fontWeight: active ? 600 : 400 }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User + New project */}
        <div className="bg-[#fcfbf9] border-t border-[#f5f3f0] p-4 space-y-4">
          {/* User profile */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border-2 border-white shadow-sm"
              style={{ backgroundImage: `url('${imgAvatar}')` }}
            />
            <div>
              <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>ערן לוי</div>
              <div className="text-[12px] text-[#8d785e]">מפיק ראשי</div>
            </div>
          </div>

          {/* New project button */}
          <button
            onClick={() => setShowNewProject(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white py-2.5 rounded-lg shadow-sm transition-all"
            style={{ fontWeight: 600 }}
          >
            <span className="text-[16px]">+ פרויקט חדש</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#e7e1da] flex items-center px-4 lg:px-8 shrink-0 gap-4">
          {/* Mobile menu button */}
          <button className="lg:hidden text-[#181510] shrink-0" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          {/* Flexible spacer — pushes search to center */}
          <div className="flex-1" />

          {/* Search — centered */}
          <div className="w-full max-w-[448px]">
            <div className="relative">
              <input
                type="text"
                placeholder="חיפוש פרויקטים, ספקים או לקוחות..."
                className="w-full bg-[#f5f3f0] border-0 rounded-lg px-4 py-2 pr-10 text-[14px] text-[#181510] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
              />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d785e]" />
            </div>
          </div>

          {/* Flexible spacer */}
          <div className="flex-1" />

          {/* Left side icons */}
          <div className="flex items-center gap-1 shrink-0">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f5f3f0] transition-colors text-[#181510]">
              <HelpCircle size={20} />
            </button>
            <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f5f3f0] transition-colors text-[#181510]">
              <Bell size={20} />
              <span className="absolute top-2.5 left-2.5 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {/* New project modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4" onClick={() => setShowNewProject(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h2 className="text-[22px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>פרויקט חדש</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>שם הפרויקט</label>
                <input className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]" placeholder="למשל: נופש שנתי חברת XYZ" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>לקוח</label>
                  <input className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]" placeholder="שם החברה" />
                </div>
                <div>
                  <label className="text-[13px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>מספר משתתפים</label>
                  <input type="number" className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]" placeholder="120" />
                </div>
              </div>
              <div>
                <label className="text-[13px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>אזור</label>
                <select className="w-full border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-white">
                  <option>גליל עליון</option>
                  <option>מרכז</option>
                  <option>ירושלים</option>
                  <option>דרום</option>
                  <option>אילת</option>
                  <option>גולן</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowNewProject(false); appToast.success('פרויקט חדש נוצר בהצלחה!', 'תוכל להתחיל להוסיף רכיבים וספקים'); navigate('/projects/4829-24'); }}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] text-white py-2.5 rounded-lg transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  צור פרויקט
                </button>
                <button
                  onClick={() => setShowNewProject(false)}
                  className="px-6 text-[#181510] hover:bg-[#f5f3f0] py-2.5 rounded-lg transition-colors border border-[#e7e1da]"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}