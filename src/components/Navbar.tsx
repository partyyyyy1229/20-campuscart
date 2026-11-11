import { UtensilsCrossed, Moon, Sun, ShoppingBag, Clock, Sparkles, Receipt, QrCode } from 'lucide-react'

interface NavbarProps {
  activeTab: 'menu' | 'orders' | 'split' | 'payment'
  setActiveTab: (tab: 'menu' | 'orders' | 'split' | 'payment') => void
  isDark: boolean
  toggleDark: () => void
  cartCount: number
  cartTotal: number
  activeOrdersCount: number
}

export function Navbar({
  activeTab,
  setActiveTab,
  isDark,
  toggleDark,
  cartCount,
  cartTotal,
  activeOrdersCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#090d16]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 dark:bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  CampusCart
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Midnight Canteens Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                TIET Patiala Night Canteens, Pre-Ordering & Roommate Split Hub
              </p>
            </div>
          </div>

          {/* Tab Navigation Switcher */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'menu'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Canteens & Menu
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition-all relative ${
                activeTab === 'orders'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Order Timeline
              {activeOrdersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-600 text-white font-mono">
                  {activeOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'split'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Room Split-Bill
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'payment'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              UPI QR Terminal
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Cart Trigger */}
            <button
              onClick={() => setActiveTab('split')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{cartCount} items</span>
              <span>•</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-200/60 dark:border-slate-800/60">
          {(['menu', 'orders', 'split', 'payment'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                activeTab === tab
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab === 'menu' && 'Menu'}
              {tab === 'orders' && `Timeline (${activeOrdersCount})`}
              {tab === 'split' && `Split Cart (${cartCount})`}
              {tab === 'payment' && 'UPI Terminal'}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
