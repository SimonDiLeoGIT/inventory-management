import { BrowserRouter } from 'react-router-dom';
import Router from './Router/Router';
import { AuthProvider } from './Context/AuthProvider';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
