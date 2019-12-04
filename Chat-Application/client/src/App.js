import { LinkContainer, Modal, Button } from "react-router-bootstrap";
import React, { useEffect, useState } from "react";
import { Link, Switch, Redirect, Route, useHistory } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./App.css";
import Login from "./containers/Login";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Signup from "./containers/Signup";
import Chat from "./containers/Chat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-regular-svg-icons'

function App(props) {
    const [user, setUser] = useState(null);
    const [userChecked, setUserChecked] = useState(false);

    useEffect(() => {
        const fetchAuth = async () => {
            const response = await fetch('/api/auth', {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const text = await response.text();
                if (text) {
                    setUser(JSON.parse(text));
                }
                setUserChecked(true);
            }
        }
        fetchAuth();
    }, []);

    const history = useHistory();

    function handleChangeUsername() {
        console.log("user wanted to change username");
        
    }

    async function handleLogout(event) {
        event.preventDefault();
        console.log("user clicked logout button");
        const response = await fetch('/api/auth', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            setUser(null);
            history.push('/');
        } else {
            // cry about it
            // update global user state (working on the easiest way to do this)
        }
    }

    return userChecked ? (
        <div className="App">
            <Navbar className="navbar navbar-dark bg-dark">
                <Navbar.Brand>
                    <Link to="/">ChatApp</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">

                    {user ? (
                        <Nav>
                            <NavDropdown alignRight title={<span><FontAwesomeIcon icon={faUserCircle} /> {user.displayname || user.username}</span>} id="basic-nav-dropdown">

                                <NavDropdown.Item onClick={handleChangeUsername}>
                                    Change Display Name
                                </NavDropdown.Item>

                                <NavDropdown.Divider/>

                                <NavDropdown.Item onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>


                            </NavDropdown>
                        </Nav>) : (
                            <Nav>
                                <LinkContainer to="/signup">
                                    <Nav.Link>Signup</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/login">
                                    <Nav.Link>Login</Nav.Link>
                                </LinkContainer>
                            </Nav>
                        )}
                </Navbar.Collapse>
            </Navbar>
            <Switch>
                <Route path="/" exact render={props => <Home {...props} user={user} />} />
                <Route path="/login" exact render={props => user ? <Redirect to="/chat" /> : <Login {...props} setUser={setUser} />} />
                <Route path="/signup" exact render={props => user ? <Redirect to="/chat" /> : <Signup {...props} setUser={setUser} />} />
                <Route path="/chat/:channelId?" render={props => user ? <Chat {...props} user={user}/> : <Redirect to="/login" />} />
                <Route component={NotFound} />
            </Switch>
        </div>
    ) : null;
}

export default App;