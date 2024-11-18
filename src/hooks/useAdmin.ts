import { useAuth } from '../context/AuthContext';

export const useAdmin = () => {
  const { user } = useAuth();
  return user?.role === "admin";
};