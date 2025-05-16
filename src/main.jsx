import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'  // Redux Provider allows the Redux store to be accessible to all components
import { PersistGate } from 'redux-persist/integration/react' // PersistGate delays rendering of the app until Redux state is rehydrated from localStorage
import { store, persistor } from './redux/store'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
