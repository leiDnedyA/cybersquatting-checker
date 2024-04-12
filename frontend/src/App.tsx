import DomainSearchPage from './pages/DomainSearchPage'
import LoginDialog from './components/LoginDialog'
import { useState } from 'react';

async function checkIfAuthenticated() {
  const response = await fetch('/login/test_auth');
  if (response.ok) {
    return true;
  }
  return false;
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  console.log(document.cookie);

  return (
    <>
      <LoginDialog
        open={ document.cookie.length === 0 }
        onClose={() => {}}
      />
      <DomainSearchPage />
    </>
  )
}

export default App
