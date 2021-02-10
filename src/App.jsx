import * as React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {Provider as AccountProvider} from './account'
import Home from './Home'
import AuthSpotify from './AuthSpotify'
import YoutubeSearch from './YoutubeSearch'

export default function App() {
  return (
    <AccountProvider>
      <Router>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/auth-spotify' exact>
          <AuthSpotify />
        </Route>
        <Route path='/youtube' exact>
          <YoutubeSearch />
        </Route>
      </Router>
    </AccountProvider>
  )
}
