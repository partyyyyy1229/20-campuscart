import { UtensilsCrossed, Clock, Flame, ShoppingBag, CheckCircle2 } from 'lucide-react'

interface BentoStatsProps {
  activeCanteensCount: number
  avgPrepTimeMinutes: number
  midnightOrdersPlaced: number
  cartTotal: number
}

export function BentoStats({
  activeCanteensCount,
  avgPrepTimeMinutes,
  midnightOrdersPlaced,
  cartTotal,
}: BentoStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Tile 1: Active Midnight Outlets */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <span>Active Midnight Canteens</span>
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {activeCanteensCount} / 6
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Open till 3:30 AM
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Jaggi, GAD, CC, Chai Point & Frankie Corner
        </p>
      </div>

      {/* Tile 2: Avg Tawa-to-Counter Prep Time */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <span>Avg. Kitchen Prep Speed</span>
          <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Flame className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {avgPrepTimeMinutes} mins
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Hot & Fresh
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Zero line waiting — arrive when token is called
        </p>
      </div>

      {/* Tile 3: Orders Placed Tonight */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <span>Campus Orders Tonight</span>
          <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {midnightOrdersPlaced}
          </span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            Active session
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Hostels J, M, PG, N & I delivery runs
        </p>
      </div>

      {/* Tile 4: Active Cart Value */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <span>Current Cart Total</span>
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ₹{cartTotal.toFixed(2)}
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Ready to split
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Even split or item-wise roommate allocations
        </p>
      </div>
    </div>
  )
}
