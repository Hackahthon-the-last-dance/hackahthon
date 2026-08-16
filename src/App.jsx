import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { I18nProvider } from './context/I18nContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { WellnessProvider } from './context/WellnessContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import PageSuspenseFallback from './components/shared/PageSuspenseFallback.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Habits = lazy(() => import('./pages/Habits.jsx'));
const Reminders = lazy(() => import('./pages/Reminders.jsx'));
const Progress = lazy(() => import('./pages/Progress.jsx'));
const Store = lazy(() => import('./pages/Store.jsx'));
const Product = lazy(() => import('./pages/Product.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Emergency = lazy(() => import('./pages/Emergency.jsx'));
const Seller = lazy(() => import('./pages/Seller.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function Providers({ children }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <WellnessProvider>
            <CartProvider>{children}</CartProvider>
          </WellnessProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Suspense fallback={<PageSuspenseFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/store" element={<Store />} />
              <Route path="/store/:id" element={<Product />} />
              <Route path="/seller/:sellerId" element={<Seller />} />
              <Route path="/cart" element={<Cart />} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
              <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Providers>
  );
}
