import React                from "react";
import { NavLink }          from "react-router-dom";
import { AiOutlineHome }    from "react-icons/ai"
import { ImNewspaper }      from "react-icons/im"
import { BsPeopleFill }     from "react-icons/bs"
import { CgFileDocument }   from "react-icons/cg"
import { BiPowerOff }       from "react-icons/bi"
import logo                 from "./capable_logo.png";
import "./bootstrap.min.css";
import "./styles.css";

export default class Navbar extends React.Component {
    render() {
        return (
            <nav className="Nav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/Home">
                            <img className="nav-logo" src={logo} alt={logo} />
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link-non-active" activeClassName="nav-link-active" to="/Home">
                            <div className="link-color"><AiOutlineHome className="menu-icon"/> Homepage</div>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link-non-active" activeClassName="nav-link-active" to="/Dashboard">
                            <div className="link-color"><ImNewspaper className="menu-icon"/> Dashboard</div>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link-non-active" activeClassName="nav-link-active" to="/Patients">
                            <div className="link-color"><BsPeopleFill className="menu-icon"/> Patients</div>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link-non-active" activeClassName="nav-link-active" to="/Documentation">
                            <div className="link-color"><CgFileDocument className="menu-icon"/> Documentation</div>
                        </NavLink>
                    </li>
                </ul>
                <NavLink className="log" to="">
                    <div className="logout"><BiPowerOff className="menu-icon"/> Log out</div>
                </NavLink>
            </nav>
        );
    }
}