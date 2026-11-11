import { useState, useEffect } from 'react'
import {
  Clock,
  Flame,
  CheckCircle2,
  Package,
  ShoppingBag,
  Bell,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  RotateCw,
} from 'lucide-react'
import { OrderTimeline } from '../types'

interface LiveOrderTrackerProps {
  orders: OrderTimeline[]
  onAdvanceStage: (orderId: string) => void
}

const STAGES = [
  { key: 'placed', label: 'Order Placed', desc: 'Received & Queued at Canteen' },
  { key: 'tawa_firing', label: 'Tawa / Kitchen Firing', desc: 'Piping hot on grill / tandoor' },
  { key: 'packaging', label: 'Packaging & QC', desc: 'Eco containers & cutlery packed' },
  { key: 'ready_for_pickup', label: 'Ready for Counter Pickup', desc: 'Present token at pickup bay' },
  { key: 'delivered', label: 'Fulfilled & Collected', desc: 'Enjoy your midnight meal!' },
] as const

export function LiveOrderTracker({ orders, onAdvanceStage }: LiveOrderTrackerProps) {
  const [buzzerAlert, setBuzzerAlert] = useState<string | null>(null)

  const getStageIndex = (status: OrderTimeline['status']) => {
    switch (status) {
      case 'placed':
        return 0
      case 'tawa_firing':
        return 1
      case 'packaging':
        return 2
      case 'ready_for_pickup':
        return 3
      case 'delivered':
        return 4
    }
  }

  const handleSimulateAdvance = (order: OrderTimeline) => {
    onAdvanceStage(order.id)
    if (order.status === 'packaging') {
      setBuzzerAlert(`BZZZT! 🔔 Token #${order.tokenNumber} is READY at ${order.pickupCounter}!`)
      setTimeout(() => setBuzzerAlert(null), 6000)
    }
  }

  return (
    <div className="space-y-6">
      {buzzerAlert && (
        <div className="p-4 rounded-xl bg-amber-500 text-white flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 animate-spin" />
            <p className="font-bold text-sm tracking-wide">{buzzerAlert}</p>
          </div>
          <button
            onClick={() => setBuzzerAlert(null)}
            className="text-xs font-semibold px-2 py-1 rounded bg-amber-700 hover:bg-amber-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            Live Kitchen Firing & Token Pickup Status
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time telemetry from canteen kitchen displays. When your token turns green, head directly to the counter.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          Active Orders: {orders.filter((o) => o.status !== 'delivered').length}
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
          <UtensilsCrossed className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            No Active Midnight Orders
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Browse Jaggi Canteen, GAD, CC, or Chai Point from the menu tab and place an order.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStageIndex = getStageIndex(order.status)
            const isReady = order.status === 'ready_for_pickup'

            return (
              <div
                key={order.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isReady
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/30'
                    : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm'
                }`}
              >
                {/* Header with Token & Canteen */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    {/* Big Token Number */}
                    <div
                      className={`p-3 rounded-2xl text-center min-w-[110px] font-mono ${
                        isReady
                          ? 'bg-emerald-500 text-white animate-pulse'
                          : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-bold tracking-widest opacity-80">
                        Counter Token
                      </span>
                      <span className="text-xl font-extrabold tracking-wide">
                        {order.tokenNumber}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {order.canteenName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {order.pickupCounter} • {order.placedAt}
                      </p>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="text-[10px] uppercase text-slate-400 block">Total Billed</span>
                      <span className="font-extrabold text-base text-slate-900 dark:text-white">
                        ₹{order.grandTotal.toFixed(2)}
                      </span>
                    </div>

                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => handleSimulateAdvance(order)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs transition-colors flex items-center gap-1.5"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Simulate Next Stage ➔</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 5-Stage Stepper */}
                <div className="py-6">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {STAGES.map((st, idx) => {
                      const isCompleted = idx < currentStageIndex
                      const isCurrent = idx === currentStageIndex

                      return (
                        <div
                          key={st.key}
                          className={`p-3 rounded-xl border text-xs transition-all ${
                            isCurrent
                              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-1 ring-amber-500/40'
                              : isCompleted
                              ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                              : 'border-slate-200/60 dark:border-slate-800 opacity-50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isCurrent
                                  ? 'bg-amber-500 animate-ping'
                                  : isCompleted
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            />
                            <span className="font-mono text-[10px] font-bold uppercase text-slate-400">
                              Step {idx + 1}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white leading-tight">
                            {st.label}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {st.desc}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Ordered Items Pill list */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-white">Items:</span>
                    {order.items.map((i, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]"
                      >
                        {i.quantity}x {i.menuItem.name} ({i.assignedToRoommate})
                      </span>
                    ))}
                  </div>

                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {order.status === 'ready_for_pickup'
                      ? '★ READY AT COUNTER NOW'
                      : `~${order.etaMinutes} mins remaining`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
