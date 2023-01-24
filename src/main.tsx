import React, { Suspense } from 'react'
import { Provider } from 'jotai'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import './config/aws'
import { AuthPreloader } from './jotai/auth'
import './jotai/storage'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <Suspense fallback={"Loading..."}>
        <AuthPreloader />
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>,
)
