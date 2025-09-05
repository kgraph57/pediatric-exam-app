import { BarChart3, BookOpen, Bot, Home, Menu, X, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";

const navigationItems = [
  { id: 'dashboard', label: 'ダッシュボード', icon: Home },
  { id: 'practice', label: '問題演習', icon: BookOpen },
  { id: 'ai', label: 'AIアシスタント', icon: Bot },
  { id: 'progress', label: '進捗分析', icon: BarChart3 },
  { id: 'help', label: 'ヘルプ', icon: HelpCircle },
  { id: 'admin', label: '管理者', icon: Settings },
];

export function Navigation({ activeSection, onSectionChange, isSidebarOpen = true }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-[#262626] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <nav className={`hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#007AFF] text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 pt-16">
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#007AFF] text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}