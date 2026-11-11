import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { BentoStats } from './components/BentoStats'
import { CanteenMenu } from './components/CanteenMenu'
import { LiveOrderTracker } from './components/LiveOrderTracker'
import { RoommateSplitCalculator } from './components/RoommateSplitCalculator'
import { UpiPaymentModal } from './components/UpiPaymentModal'
import { CANTEENS, MENU_ITEMS, INITIAL_ORDERS } from './data/mockFoodData'
import { CanteenOutlet, MenuItem, CartItem, OrderTimeline } from './types'

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'split' | 'payment'>('menu')
  const [canteens] = useState<CanteenOutlet[]>(CANTEENS)
  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS)
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartItemId: 'c-init-1',
      menuItem: MENU_ITEMS[0], // Jaggi grilled paneer patty
      quantity: 2,
      selectedCustomizations: ['Extra Liquid Cheese Melt'],
      assignedToRoommate: 'Me',
      itemTotal: 130,
    },
    {
      cartItemId: 'c-init-2',
      menuItem: MENU_ITEMS[1], // Thick cold coffee
      quantity: 2,
      selectedCustomizations: [],
      assignedToRoommate: 'Aman',
      itemTotal: 140,
    },
  ])
  const [roommates, setRoommates] = useState<string[]>(['Me', 'Aman', 'Rohan'])
  const [orders, setOrders] = useState<OrderTimeline[]>(INITIAL_ORDERS)
  const [activeSplits, setActiveSplits] = useState<{ name: string; shareAmount: number }[]>([
    { name: 'Me', shareAmount: 137.5 },
    { name: 'Aman', shareAmount: 147.5 },
  ])

  // Sync dark class on document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDark = () => setIsDark((prev) => !prev)

  // Cart operations
  const handleAddToCart = (item: MenuItem, customizations: string[]) => {
    const extraPrice = customizations.reduce((acc, cName) => {
      const match = item.customizations?.find((c) => c.name === cName)
      return acc + (match ? match.extraPrice : 0)
    }, 0)

    const unitPrice = item.price + extraPrice

    setCart((prev) => {
      const existing = prev.find(
        (c) =>
          c.menuItem.id === item.id &&
          c.selectedCustomizations.sort().join(',') === customizations.sort().join(',')
      )

      if (existing) {
        return prev.map((c) =>
          c.cartItemId === existing.cartItemId
            ? {
                ...c,
                quantity: c.quantity + 1,
                itemTotal: (c.quantity + 1) * unitPrice,
              }
            : c
        )
      }

      const newItem: CartItem = {
        cartItemId: `cart-${Date.now()}-${Math.random()}`,
        menuItem: item,
        quantity: 1,
        selectedCustomizations: customizations,
        assignedToRoommate: roommates[0] || 'Me',
        itemTotal: unitPrice,
      }
      return [...prev, newItem]
    })
  }

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.cartItemId !== cartItemId) return c
          const newQty = c.quantity + delta
          if (newQty <= 0) return null
          const unitPrice = c.itemTotal / c.quantity
          return {
            ...c,
            quantity: newQty,
            itemTotal: newQty * unitPrice,
          }
        })
        .filter((c): c is CartItem => c !== null)
    )
  }

  const handleAssignItem = (cartItemId: string, roommateName: string) => {
    setCart((prev) =>
      prev.map((c) => (c.cartItemId === cartItemId ? { ...c, assignedToRoommate: roommateName } : c))
    )
  }

  const handleAddRoommate = (name: string) => {
    if (!roommates.includes(name)) {
      setRoommates((prev) => [...prev, name])
    }
  }

  const handleRemoveRoommate = (name: string) => {
    setRoommates((prev) => prev.filter((r) => r !== name))
  }

  const handleProceedToPayment = (splits: { name: string; shareAmount: number }[]) => {
    setActiveSplits(splits)
    setActiveTab('payment')
  }

  const handlePaymentSuccess = () => {
    const subtotal = cart.reduce((acc, c) => acc + c.itemTotal, 0)
    const grandTotal = subtotal + 15
    const tokenNum = `JAG-${Math.floor(10 + Math.random() * 90)}`

    const newOrder: OrderTimeline = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tokenNumber: tokenNum,
      canteenName: 'Jaggi Canteen',
      items: [...cart],
      subtotal,
      packagingFee: 15,
      grandTotal,
      pickupCounter: 'Jaggi Express Counter #1',
      status: 'placed',
      etaMinutes: 12,
      placedAt: 'Just now',
      roommateSplits: activeSplits,
    }

    setOrders((prev) => [newOrder, ...prev])
    setCart([]) // Clear cart
    setActiveTab('orders') // Show live timeline
  }

  const handleAdvanceStage = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        let next: OrderTimeline['status'] = o.status
        if (o.status === 'placed') next = 'tawa_firing'
        else if (o.status === 'tawa_firing') next = 'packaging'
        else if (o.status === 'packaging') next = 'ready_for_pickup'
        else if (o.status === 'ready_for_pickup') next = 'delivered'
        return {
          ...o,
          status: next,
          etaMinutes: Math.max(0, o.etaMinutes - 3),
        }
      })
    )
  }

  const cartCount = cart.reduce((acc, c) => acc + c.quantity, 0)
  const cartTotal = cart.reduce((acc, c) => acc + c.itemTotal, 0)
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDark={toggleDark}
        cartCount={cartCount}
        cartTotal={cartTotal}
        activeOrdersCount={activeOrdersCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BentoStats
          activeCanteensCount={canteens.length}
          avgPrepTimeMinutes={12}
          midnightOrdersPlaced={342}
          cartTotal={cartTotal}
        />

        {activeTab === 'menu' && (
          <CanteenMenu
            canteens={canteens}
            menuItems={menuItems}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onViewCart={() => setActiveTab('split')}
          />
        )}

        {activeTab === 'orders' && (
          <LiveOrderTracker
            orders={orders}
            onAdvanceStage={handleAdvanceStage}
          />
        )}

        {activeTab === 'split' && (
          <RoommateSplitCalculator
            cart={cart}
            roommates={roommates}
            onAddRoommate={handleAddRoommate}
            onRemoveRoommate={handleRemoveRoommate}
            onAssignItem={handleAssignItem}
            onUpdateQuantity={handleUpdateCartQuantity}
            onProceedToPayment={handleProceedToPayment}
          />
        )}

        {activeTab === 'payment' && (
          <UpiPaymentModal
            amount={cartTotal > 0 ? cartTotal + 15 : 285}
            canteenName="Jaggi Canteen"
            roommateSplits={activeSplits}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </main>
    </div>
  )
}
