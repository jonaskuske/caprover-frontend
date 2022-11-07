import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
    <React.Suspense fallback={null}>
        <App />
    </React.Suspense>,
    document.getElementById('root')!
)
