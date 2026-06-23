import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  size: number;
  color: string;
  quantity: number;
}

interface AppState {
  cart: CartItem[];
  wishlist: string[];
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  user: { name: string; email: string; avatar: string } | null;
  hasSeenOnboarding: boolean;
}

type Action =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; size: number; color: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: number; color: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'LOGIN'; payload: { name: string; email: string; avatar: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_ONBOARDING_SEEN' };

const initialState: AppState = {
  cart: [],
  wishlist: [],
  theme: 'light',
  isAuthenticated: false,
  user: null,
  hasSeenOnboarding: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.findIndex(
        i => i.product.id === action.payload.product.id &&
             i.size === action.payload.size &&
             i.color === action.payload.color
      );
      if (existing >= 0) {
        const cart = [...state.cart];
        cart[existing] = { ...cart[existing], quantity: cart[existing].quantity + action.payload.quantity };
        return { ...state, cart };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(
          i => !(i.product.id === action.payload.productId &&
                 i.size === action.payload.size &&
                 i.color === action.payload.color)
        ),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(i =>
          i.product.id === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color
            ? { ...i, quantity: action.payload.quantity }
            : i
        ).filter(i => i.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.payload)
          ? state.wishlist.filter(id => id !== action.payload)
          : [...state.wishlist, action.payload],
      };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'SET_ONBOARDING_SEEN':
      return { ...state, hasSeenOnboarding: true };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  cartCount: number;
  cartTotal: number;
  isInWishlist: (id: string) => boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: number, color: string) => void;
  toggleWishlist: (id: string) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isInWishlist = (id: string) => state.wishlist.includes(id);

  const addToCart = (item: CartItem) => dispatch({ type: 'ADD_TO_CART', payload: item });
  const removeFromCart = (productId: string, size: number, color: string) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, size, color } });
  const toggleWishlist = (id: string) => dispatch({ type: 'TOGGLE_WISHLIST', payload: id });
  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

  return (
    <AppContext.Provider value={{
      state, dispatch, cartCount, cartTotal,
      isInWishlist, addToCart, removeFromCart, toggleWishlist, toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa ser usado dentro de AppProvider');
  return ctx;
}
