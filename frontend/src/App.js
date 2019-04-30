import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch , Redirect} from 'react-router-dom'
import AuthPage from './pages/auth'
import EventPage from './pages/events'
import BookingPage from './pages/bookings'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from='/' to='/auth' exact/>
        <Route path='/auth' component={AuthPage} />
        <Route path='/events' component={EventPage} />
        <Route path='/bookings' component={BookingPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
