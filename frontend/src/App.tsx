import DomainSearchPage from './pages/DomainSearchPage'
import LoginDialog from './components/LoginDialog'
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

async function checkIfAuthenticated() {
  const response = await fetch('/login/test_auth');
  console.log(await response.text())
  if (response.ok) {
    return true;
  }
  return false;
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      checkIfAuthenticated().then(result => {
        setAuthenticated(result);
        setLoading(false);
        })
    });

  return (
    <>

      { loading?
        <Box sx={{
          display: 'flex',
          width: '100%', 
          flexDirection: 'column', 
          alignItems: 'center',
          paddingTop: '45vh'
          }}>
          <CircularProgress />
        </Box>:
        <>
          {!authenticated ?
          <LoginDialog
            open={!authenticated}
            onClose={() => {}}
          /> :
          null }
          <DomainSearchPage />
        </> }

    </>
  )
}

export default App
