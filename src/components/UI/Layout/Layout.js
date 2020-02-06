import React, { Fragment } from 'react'

import  Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const Layout = (props) => {
    return (
        <Fragment>
            <Navbar bg="dark" variant="dark" expand="sm" collapseOnSelect >
                <Navbar.Brand href="/">Housekeeper</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/supermarket">Supermarket</Nav.Link>
                        <Nav.Link href="/tasks">Tasks</Nav.Link>
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
