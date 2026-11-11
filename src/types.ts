export type CanteenId = 'jaggi' | 'gad' | 'cc' | 'chaipoint' | 'frankie' | 'nightowl'

export interface CanteenOutlet {
  id: CanteenId
  name: string
  tagline: string
  location: string
  openUntil: string
  status: 'open' | 'busy' | 'closing_soon'
  prepTimeMinutes: number
  rating: number
  minOrder: number
  specialty: string
  image: string
}

export interface MenuItem {
  id: string
  canteenId: CanteenId
  name: string
  category: 'Midnight Cravings' | 'Rolls & Frankies' | 'Main Meals' | 'Maggi & Quick Bites' | 'Beverages'
  price: number
  isVeg: boolean
  rating: number
  description: string
  customizations?: {
    name: string
    extraPrice: number
  }[]
}

export interface CartItem {
  cartItemId: string
  menuItem: MenuItem
  quantity: number
  selectedCustomizations: string[]
  assignedToRoommate: string
  itemTotal: number
}

export interface OrderTimeline {
  id: string
  tokenNumber: string
  canteenName: string
  items: CartItem[]
  subtotal: number
  packagingFee: number
  grandTotal: number
  pickupCounter: string
  status: 'placed' | 'tawa_firing' | 'packaging' | 'ready_for_pickup' | 'delivered'
  etaMinutes: number
  placedAt: string
  roommateSplits: {
    name: string
    shareAmount: number
  }[]
}
