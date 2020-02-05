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
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './App.css';

import { SIGNUP_PATH, HOME_PATH, SIGNIN_PATH, SIGNOUT_PATH } from './constants/const';

const getConfig = () => {
   return {
      locale: zhCN
   }
}

function App() {



   return (
      <ConfigProvider {...getConfig()}>
         <Router>
            <Switch>
               <Route path={SIGNUP_PATH} exact component={Signup} />
               <Route path={SIGNIN_PATH} exact component={Signin} />
               <Route path={SIGNOUT_PATH} exact component={Signout} />
               <Route path={HOME_PATH} component={Home} />
            </Switch>
         </Router >
      </ConfigProvider>

   );
}

export default App;
