import { useState } from 'react'
import {
  Search,
  Plus,
  Minus,
  Sparkles,
  Star,
  Check,
  Flame,
  Clock,
  MapPin,
  Utensils,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react'
import { CanteenOutlet, MenuItem, CartItem, CanteenId } from '../types'

interface CanteenMenuProps {
  canteens: CanteenOutlet[]
  menuItems: MenuItem[]
  cart: CartItem[]
  onAddToCart: (item: MenuItem, customizations: string[]) => void
  onUpdateCartQuantity: (cartItemId: string, delta: number) => void
  onViewCart?: () => void
}

export function CanteenMenu({
  canteens,
  menuItems,
  cart,
  onAddToCart,
  onUpdateCartQuantity,
  onViewCart,
}: CanteenMenuProps) {
  const [selectedCanteenId, setSelectedCanteenId] = useState<CanteenId>('jaggi')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [vegOnly, setVegOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null)
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([])

  const currentCanteen = canteens.find((c) => c.id === selectedCanteenId) || canteens[0]

  const filteredItems = menuItems.filter((item) => {
    const matchesCanteen = item.canteenId === selectedCanteenId
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesVeg = !vegOnly || item.isVeg
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCanteen && matchesCategory && matchesVeg && matchesSearch
  })

  const handleOpenCustomization = (item: MenuItem) => {
    if (item.customizations && item.customizations.length > 0) {
      setCustomizingItem(item)
      setSelectedCustomizations([])
    } else {
      onAddToCart(item, [])
    }
  }

  const handleConfirmCustomization = () => {
    if (customizingItem) {
      onAddToCart(customizingItem, selectedCustomizations)
      setCustomizingItem(null)
      setSelectedCustomizations([])
    }
  }

  const toggleCustomization = (name: string) => {
    setSelectedCustomizations((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    )
  }

  return (
    <div className="space-y-6">
      {/* Canteen Outlets Switcher */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">
          {canteens.map((canteen) => (
            <button
              key={canteen.id}
              onClick={() => setSelectedCanteenId(canteen.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                selectedCanteenId === canteen.id
                  ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500/30'
                  : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <img
                src={canteen.image}
                alt={canteen.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {canteen.name}
                  </h4>
                  <span className="text-[10px] font-mono text-amber-500 font-bold">
                    ★ {canteen.rating}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  ~{canteen.prepTimeMinutes}m prep • Open till {canteen.openUntil}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Canteen Info Banner */}
      <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {currentCanteen.name}
            </h3>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {currentCanteen.specialty}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentCanteen.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            ● {currentCanteen.status.toUpperCase()}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 dark:text-slate-300">
            Min Order: ₹{currentCanteen.minOrder}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search Maggi, Patties, Cold Coffee, Rolls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Veg Only Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Veg Only
            </span>
          </label>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const cartOccurrences = cart.filter((c) => c.menuItem.id === item.id)
          const totalQty = cartOccurrences.reduce((acc, c) => acc + c.quantity, 0)

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {/* Veg/Non-veg icon indicator */}
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center p-0.5 ${
                        item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-500">
                    ★ {item.rating}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 leading-snug">
                  {item.name}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Price and Add CTA */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="font-mono font-extrabold text-base text-slate-900 dark:text-white">
                  ₹{item.price.toFixed(2)}
                </span>

                {totalQty > 0 ? (
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2 py-1 rounded-xl">
                    <button
                      onClick={() => {
                        const target = cartOccurrences[0]
                        if (target) onUpdateCartQuantity(target.cartItemId, -1)
                      }}
                      className="text-amber-700 dark:text-amber-300 hover:text-amber-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-xs text-amber-900 dark:text-amber-200">
                      {totalQty}
                    </span>
                    <button
                      onClick={() => handleOpenCustomization(item)}
                      className="text-amber-700 dark:text-amber-300 hover:text-amber-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenCustomization(item)}
                    className="py-1.5 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Customization Drawer / Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Customize {customizingItem.name}
            </h4>
            <p className="text-xs text-slate-500">Select any extra toppings or cheese melts:</p>

            <div className="space-y-2">
              {customizingItem.customizations?.map((cust) => {
                const isSelected = selectedCustomizations.includes(cust.name)
                return (
                  <label
                    key={cust.name}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 font-semibold'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCustomization(cust.name)}
                      />
                      <span>{cust.name}</span>
                    </div>
                    <span className="font-mono text-amber-600 dark:text-amber-400">
                      +₹{cust.extraPrice}
                    </span>
                  </label>
                )
              })}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleConfirmCustomization}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => setCustomizingItem(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && onViewCart && (
        <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-amber-600 dark:bg-amber-500 text-white shadow-xl flex items-center justify-between animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">
                {cart.reduce((a, c) => a + c.quantity, 0)} Items Selected • ₹
                {cart.reduce((a, c) => a + c.itemTotal, 0).toFixed(2)}
              </span>
              <span className="text-xs text-amber-100">
                Ready for Roommate Split or Instant UPI Checkout
              </span>
            </div>
          </div>
          <button
            onClick={onViewCart}
            className="px-4 py-2 rounded-xl bg-white text-amber-900 font-bold text-xs shadow-md hover:bg-amber-50 transition-colors flex items-center gap-1.5"
          >
            <span>Split & Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
