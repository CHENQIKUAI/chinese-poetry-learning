import React from 'react';
import {
   BrowserRouter as Router,
   Switch,
   Route,
} from "react-router-dom";
import Signup from "./pages/Signup/Signup"
import Home from "./pages/Home/Home"
import Signin from "./pages/Signin/Signin"
import Signout from "./pages/Signout/Signout";

import './App.css';

import { SIGNUP_PATH, HOME_PATH, SIGNIN_PATH, SIGNOUT_PATH } from './constants/const';

function App() {

   return (
      <Router>
         <Switch>
            <Route path={SIGNUP_PATH} component={Signup} />
            <Route path={SIGNIN_PATH} component={Signin} />
            <Route path={SIGNOUT_PATH} component={Signout} />
            <Route path={HOME_PATH} exact component={Home} />
         </Switch>
      </Router >
   );
}

export default App;
