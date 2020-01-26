import React from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import ListGroup from 'react-bootstrap/ListGroup'
import Tab from 'react-bootstrap/Tab'

const summeryBar = props => (
    <Form className='w-100'>
        <Form.Row>
            <Col xs="auto" className='m-1' >
                <h6 style={{/* backgroundColor: '#007bff', borderRadius: '.25rem',*/color: 'white' }}>
                    Lowest Price: <Badge variant="success">{/*props.lowestPrice.toFixed(2)*/500.3}</Badge>
                </h6>
            </Col>
            <Col xs="auto"  >
                <DropdownButton
                    alignRight
                    title="Preferred Supermarket"
                    id="dropdown-menu-align-right"
                    className='mt-1'
                >
                    <Dropdown.Item eventKey="1">Rami Levi <Badge variant="success">{500.3}</Badge></Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="2">Osher Ad <Badge variant="warning">{500.6}</Badge></Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="3">Yohnanofe <Badge variant="danger">{600}</Badge></Dropdown.Item>

                </DropdownButton>
            </Col>
            <Col  className='mt-1'>
                <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                    <Row>
                        <Col >
                            <ListGroup horizontal>
                                <ListGroup.Item action href="#link1">
                                    Link 1
                                </ListGroup.Item>
                                <ListGroup.Item action href="#link2">
                                    Link 2
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        </Row>
                        <Row>
                        <Col >
                            <Tab.Content style={{ color: 'white' }}>
                                <Tab.Pane eventKey="#link1">
                                   <h6>can be fount at:</h6>
                                </Tab.Pane>
                                <Tab.Pane eventKey="#link2">
                                <h6>can be fount at:</h6>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Col>
        </Form.Row>
    </Form>

)
export default summeryBar