import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './Home'
import AuthSpotify from './AuthSpotify'

export default function App() {
  return (
    <Router>
      <Route path='/' exact>
        <Home />
      </Route>
      <Route path='/auth-spotify' exact>
        <AuthSpotify />
      </Route>
    </Router>
  )
}
