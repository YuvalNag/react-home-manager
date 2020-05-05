import React, { Fragment } from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Image } from 'react-bootstrap'

const Layout = (props) => {
    const logoSrc = require(`../../../assets/images/logo1.png`);

    let links = <Nav.Link href="/">כניסה</Nav.Link>
    if (props.isAuth) {
        links = [<Nav.Link key='supermarket' href="/supermarket">קניות</Nav.Link>,
        // <Nav.Link key='tasks' href="/tasks">משימות</Nav.Link>,
        <span key='logout' onClick={props.logout}><Nav.Link href="/logout">התנתק</Nav.Link></span>]
    }
    return (
        <Fragment>
            <Navbar bg="dark" variant="dark" expand="sm" collapseOnSelect >
                <Navbar.Brand href="/"> <div style={{
                    boxSizing: 'content-box',
                    width: '90px',
                    // display: 'flex',
                    // justifyContent: 'space-between'
                }}><Image src={logoSrc} fluid /></div></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {links}
                    </Nav>
                    {/* <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form> */}
                </Navbar.Collapse>
            </Navbar>
            {props.children}
        </Fragment>
    )
}

export default Layout
