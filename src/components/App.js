import React from 'react'
import Route from 'react-router-dom/Route'
import Helmet from 'react-helmet'
import Switch from 'react-router-dom/Switch'
import Home from './Home'
import './../assets/css/index.css'
import './../assets/css/login.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'semantic-ui-css/components/dimmer.min.css'
import 'semantic-ui-css/components/loader.min.css'
import 'semantic-ui-css/components/segment.min.css'
import 'semantic-ui-css/components/message.min.css'

const App = () => (
  <div id='app'>
    <Helmet>
      <title>Know Your Neighbourhood | MyNeighbourhood</title>
      <meta name='description' content='We give you a snapshot of your neighbourhood' />
      <meta property='og:title' content='Know Your Neighbourhood | MyNeighbourhood' />
      <meta property='og:description' content='MyNeighbourhood' />
    </Helmet>
    <Switch>
      <Route exact path='/' component={Home} />
    </Switch>
  </div>
)

export default App
