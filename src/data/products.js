
// src/data/products.js
import { ref } from 'vue'

// Fallback image when product images fail to load
const fallbackImage = require('@/assets/images/products/placeholder.png')

// Try to load an image with fallback
const loadImage = (path) => {
  try {
    return require(`@/assets/images/products/${path}`)
  } catch (e) {
    console.warn(`Image not found: ${path}, using fallback`)
    return fallbackImage
  }
}

// Products data with fallbacks
export const products = [
  {
    id: 'tshirt',
    name: 'Premium T-Shirt',
    description: 'Comfortable cotton t-shirt with customizable options',
    basePrice: 29.99,
    category: 'clothing',
    image: loadImage('clothing/tshirt-base.png'),
    options: {
      colors: [
        { id: 'black', name: 'Black', price: 0, image: loadImage('clothing/tshirt-black.png') },
        { id: 'blue', name: 'Blue', price: 0, image: loadImage('clothing/tshirt-blue.png') },
        { id: 'red', name: 'Red', price: 2, image: loadImage('clothing/tshirt-red.png') }
      ],
      materials: [
        { id: 'cotton', name: 'Standard Cotton', price: 0 },
        { id: 'organic', name: 'Organic Cotton', price: 5 },
        { id: 'premium', name: 'Premium Blend', price: 10 }
      ],
      features: [
        { id: 'pocket', name: 'Chest Pocket', price: 3 },
        { id: 'vneck', name: 'V-Neck Style', price: 2 },
        { id: 'print', name: 'Custom Print', price: 8 }
      ]
    }
  },
  {
    id: 'suit',
    name: 'Business Suit',
    description: 'Professional suit for business and formal occasions',
    basePrice: 299.99,
    category: 'suits',
    image: loadImage('suits/suit-base.png'),
    options: {
      colors: [
        { id: 'navy', name: 'Navy Blue', price: 0, image: loadImage('suits/suit-navy.png') },
        { id: 'black', name: 'Classic Black', price: 0, image: loadImage('suits/suit-black.png') },
        { id: 'grey', name: 'Charcoal Grey', price: 20, image: loadImage('suits/suit-grey.png') }
      ],
      materials: [
        { id: 'polyester', name: 'Polyester Blend', price: 0 },
        { id: 'wool', name: 'Wool', price: 50 },
        { id: 'cashmere', name: 'Cashmere Blend', price: 100 }
      ],
      features: [
        { id: 'slim', name: 'Slim Fit', price: 0 },
        { id: 'classic', name: 'Classic Fit', price: 0 },
        { id: 'double', name: 'Double Breasted', price: 30 },
        { id: 'vent', name: 'Double Vent', price: 20 }
      ]
    }
  },
  {
    id: 'shoes',
    name: 'Leather Shoes',
    description: 'Handcrafted leather shoes for any occasion',
    basePrice: 149.99,
    category: 'shoes',
    image: loadImage('shoes/shoes-base.png'),
    options: {
      colors: [
        { id: 'black', name: 'Black', price: 0, image: loadImage('shoes/shoes-black.png') },
        { id: 'brown', name: 'Brown', price: 0, image: loadImage('shoes/shoes-brown.png') },
        { id: 'tan', name: 'Tan', price: 10, image: loadImage('shoes/shoes-tan.png') }
      ],
      materials: [
        { id: 'synthetic', name: 'Synthetic Leather', price: 0 },
        { id: 'genuine', name: 'Genuine Leather', price: 30 },
        { id: 'fullgrain', name: 'Full Grain Leather', price: 60 }
      ],
      features: [
        { id: 'laces', name: 'Standard Laces', price: 0 },
        { id: 'slip', name: 'Slip-On', price: 10 },
        { id: 'cushion', name: 'Extra Cushioning', price: 15 },
        { id: 'waterproof', name: 'Waterproof Treatment', price: 25 }
      ]
    }
  }
]

// Reactive products list for reactivity in components
export const productsList = ref(products)

// Get a product by ID with fallback
export const getProductById = (productId) => {
  const product = products.find(p => p.id === productId)
  if (!product) {
    console.warn(`Product not found: ${productId}, returning first product as fallback`)
    return products[0] // Fallback to first product
  }
  return product
}

export default {
  products,
  productsList,
  getProductById
}
