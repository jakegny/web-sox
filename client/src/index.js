import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './index.css';
import App from './App';
import ViewData from './ViewData'
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    
    <Router>
      <div>
        { /*
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/viewdata">ViewData</Link>
            </li>
            {/ * <li>
              <Link to="/users">Users</Link>
            </li> * /}
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          {/* <Route path="/about">
            <About />
          </Route> */}
          <Route path="/viewdata">
            <ViewData />
          </Route> 
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
