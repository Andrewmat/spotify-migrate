import * as React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {Provider as AccountProvider} from '@/spotify/spotifyAccount'
import Home from '@/pages/Home'
import AuthSpotify from '@/pages/AuthSpotify'
import YoutubeSearch from '@/pages/YoutubeSearch'
import Import from '@/pages/Import'

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
        <Route path='/import' exact>
          <Import />
        </Route>
      </Router>
    </AccountProvider>
  )
}
