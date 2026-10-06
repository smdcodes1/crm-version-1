import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CRMProvider } from './context/CRMContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
     <CRMProvider>
        <Router>
          <App />
      </Router>
     </CRMProvider>
   </AuthProvider>
  </StrictMode>,
)
