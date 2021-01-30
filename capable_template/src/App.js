import React                                        from "react";
import { Redirect, Route, BrowserRouter as Router}  from "react-router-dom";
import Navbar                                       from "./Navbar";
import Dashboard                                    from "./Dashboard";
import Patients                                     from "./Patients";
import Documentation                                from "./Documentation";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
          <Router>
            <div className="navBar">
                <Navbar />
            </div>
            <div className="content">
                <Redirect exact from="/" to="/Patients" />
                <Route component={Dashboard} path="/Dashboard" />
                <Route component={Patients} path="/Patients" />
                <Route component={Documentation} path="/Documentation" />
            </div>
          </Router>   
    </div>
  );
}