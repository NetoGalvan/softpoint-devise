import './index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppRoutes } from '@/routes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;