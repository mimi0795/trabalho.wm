import { createBrowserRouter } from 'react-router';
import { Root } from './components/layout/Root';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmed } from './pages/OrderConfirmed';
import { Profile } from './pages/Profile';
import { ProfileDashboard } from './pages/ProfileDashboard';
import { Wishlist } from './pages/Wishlist';
import { SearchPage } from './pages/Search';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/onboarding',
    Component: Onboarding,
  },
  {
    path: '/auth/login',
    Component: Login,
  },
  {
    path: '/auth/register',
    Component: Register,
  },
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'catalog', Component: Catalog },
      { path: 'search', Component: SearchPage },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'order-confirmed', Component: OrderConfirmed },
      { path: 'profile', Component: Profile },
      { path: 'profile/:section', Component: ProfileDashboard },
      { path: 'wishlist', Component: Wishlist },
      { path: '*', Component: NotFound },
    ],
  },
]);
