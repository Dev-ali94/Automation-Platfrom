import {CalendarDays, CalendarDaysIcon,LayoutDashboardIcon,SparklesIcon,UserIcon} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";



const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Connected Account",
      path: "/account",
      icon: UserIcon,
    },
    {
      name: "Post Scheduler",
      path: "/schedular",
      icon: CalendarDaysIcon,
    },
    {
      name: "Ai Composer",
      path: "/ai-composer",
      icon: SparklesIcon,
    }
  ];
  const {logout,user}={
    logout:()=>{
      window.location.href="/"
    },
    user:{name:"John Doe",email:"john.doe@example.com"}
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0E] border-r border-zinc-800 flex flex-col
      transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Logo */}
      <div className="px-6 py-4.5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
            <CalendarDays className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">Scheduler</h1>
            <p className="text-xs text-zinc-500">Social Management</p>
          </div>
        </div>
      </div>

      {/* Menu Label */}
      <div className="px-6 pt-6 pb-3">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
          Menu
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3
              transition-all duration-300
              ${
                isActive
                  ? "bg-orange-500/15 border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/5"
                  : "border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              <item.icon
                className={`h-5 w-5 transition-colors duration-300
                ${isActive ? "text-orange-400": "text-zinc-500 group-hover:text-orange-400"}`}
                />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
        {/* Footer */}
        <div className='p-4 border-t border-zinc-800'>
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900 transition-colors">
            <div className="size-8 rounded-full bg-orange-500/30  flex items-center justify-center text-zinc-100 text-xs font-medium shrink-0">{user.name.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xs text-zinc-100 truncate">{user?.name}</h1>
             <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
          </div>
        </div>
    </aside>
  );
};

export default Sidebar;