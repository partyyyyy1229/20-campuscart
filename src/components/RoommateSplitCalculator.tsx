import { useState, useMemo } from 'react'
import {
  Users,
  Plus,
  Trash2,
  DollarSign,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Receipt,
  CheckCircle2,
} from 'lucide-react'
import { CartItem } from '../types'

interface RoommateSplitCalculatorProps {
  cart: CartItem[]
  roommates: string[]
  onAddRoommate: (name: string) => void
  onRemoveRoommate: (name: string) => void
  onAssignItem: (cartItemId: string, roommateName: string) => void
  onUpdateQuantity: (cartItemId: string, delta: number) => void
  onProceedToPayment: (splits: { name: string; shareAmount: number }[]) => void
}

export function RoommateSplitCalculator({
  cart,
  roommates,
  onAddRoommate,
  onRemoveRoommate,
  onAssignItem,
  onUpdateQuantity,
  onProceedToPayment,
}: RoommateSplitCalculatorProps) {
  const [newRoommateName, setNewRoommateName] = useState('')
  const [splitMode, setSplitMode] = useState<'itemized' | 'equal'>('itemized')

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.itemTotal, 0)
  }, [cart])

  const packagingFee = cart.length > 0 ? 15 : 0
  const grandTotal = subtotal + packagingFee

  // Calculate splits
  const calculatedSplits = useMemo(() => {
    if (cart.length === 0 || roommates.length === 0) return []

    if (splitMode === 'equal') {
      const share = Math.round((grandTotal / roommates.length) * 100) / 100
      return roommates.map((r) => ({
        name: r,
        shareAmount: share,
      }))
    }

    // Itemized mode: sum up items assigned to each person
    const shareMap: Record<string, number> = {}
    roommates.forEach((r) => {
      shareMap[r] = 0
    })

    cart.forEach((c) => {
      const assigned = c.assignedToRoommate || roommates[0] || 'Me'
      shareMap[assigned] = (shareMap[assigned] || 0) + c.itemTotal
    })

    // Distribute packaging fee equally
    const sharedPackaging = packagingFee / roommates.length

    return roommates.map((r) => ({
      name: r,
      shareAmount: Math.round(((shareMap[r] || 0) + sharedPackaging) * 100) / 100,
    }))
  }, [cart, roommates, splitMode, grandTotal, packagingFee])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoommateName.trim()) return
    onAddRoommate(newRoommateName.trim())
    setNewRoommateName('')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            Hostel Roommate Split-Bill Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assign each patty, Maggi, or roll to specific roommates or split the midnight feast equally.
          </p>
        </div>

        {/* Split mode switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setSplitMode('itemized')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              splitMode === 'itemized'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Itemized By Eater
          </button>
          <button
            onClick={() => setSplitMode('equal')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              splitMode === 'equal'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Equal Room Split
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Cart Items & Eater Assignment */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              Cart Items ({cart.length})
            </h4>

            {cart.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Your cart is empty. Add food from the Canteen Menu!
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.menuItem.name}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        ₹{item.menuItem.price} × {item.quantity}
                        {item.selectedCustomizations.length > 0 &&
                          ` (+${item.selectedCustomizations.join(', ')})`}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Assign Roommate Selector */}
                      {splitMode === 'itemized' && (
                        <div>
                          <select
                            value={item.assignedToRoommate}
                            onChange={(e) => onAssignItem(item.cartItemId, e.target.value)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-medium"
                          >
                            {roommates.map((r) => (
                              <option key={r} value={r}>
                                For: {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Quantity & Total */}
                      <div className="flex items-center gap-2 font-mono">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono font-bold text-slate-900 dark:text-white min-w-[60px] text-right">
                        ₹{item.itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Roommates & Split Summary */}
        <div className="lg:col-span-5 space-y-4">
          {/* Roommates Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              Roommates in Feast ({roommates.length})
            </h4>

            <form onSubmit={handleAdd} className="flex gap-2">
              <input
                type="text"
                placeholder="Add roommate (e.g. Kabir, Rohan)..."
                value={newRoommateName}
                onChange={(e) => setNewRoommateName(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
              >
                Add
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {roommates.map((r) => (
                <span
                  key={r}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{r}</span>
                  {roommates.length > 1 && (
                    <button
                      onClick={() => onRemoveRoommate(r)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Split Bill Receipt */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-500" />
              Individual Share Breakdown
            </h4>

            <div className="space-y-2 font-mono">
              {calculatedSplits.map((split) => (
                <div
                  key={split.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {split.name}
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    ₹{split.shareAmount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline font-mono font-bold">
              <span className="text-slate-900 dark:text-white">Grand Total (incl. packaging):</span>
              <span className="text-base text-slate-900 dark:text-white">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => onProceedToPayment(calculatedSplits)}
              disabled={cart.length === 0}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>Pay via UPI QR & Send to Kitchen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
