import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandProvider } from './context/BrandContext';
import { UserProvider } from './context/UserContext';
import { LocationProvider } from './context/LocationContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ListingDetails from './pages/ListingDetails';
import Dashboard from './pages/Dashboard';
import NewListing from './pages/NewListing';
import AdminBagManager from './pages/AdminBagManager';
import AdminUserManager from './pages/AdminUserManager';
import AdminListingManager from './pages/AdminListingManager';
import AdminConfig from './pages/AdminConfig';
import OwnerProfile from './pages/HostProfile';
import UserProfile from './pages/UserProfile';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import EmailVerificationBanner from './components/EmailVerificationBanner';

const MainLayout = () => (
  <>
    <Header />
    <EmailVerificationBanner />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <BrandProvider>
            <LocationProvider>
              <Routes>
                {/* Auth Routes */}
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />

                {/* Main Layout Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/listing/:id" element={<ListingDetails />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/listings/new" element={<NewListing />} />
                  <Route path="/owner/:id" element={<OwnerProfile />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route 
                    path="/admin/bags" 
                    element={
                      <AdminRoute>
                        <AdminBagManager />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <AdminRoute>
                        <AdminUserManager />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/listings" 
                    element={
                      <AdminRoute>
                        <AdminListingManager />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/config" 
                    element={
                      <AdminRoute>
                        <AdminConfig />
                      </AdminRoute>
                    } 
                  />
                </Route>
              </Routes>
            </LocationProvider>
          </BrandProvider>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;