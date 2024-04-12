import DomainSearchPage from './pages/DomainSearchPage'
import LoginDialog from './components/LoginDialog'

function App() {

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
