import React from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Dropdown from 'react-bootstrap/Dropdown'
import ListGroup from 'react-bootstrap/ListGroup'
import Tab from 'react-bootstrap/Tab'
import Button from 'react-bootstrap/Button'
import { FiMapPin } from 'react-icons/fi'


const summeryBar = props => (
    <Form className='w-100'>
        <Form.Row className='m-1' >
            <Col className='m-0 p-0' >
                <Dropdown>
                    <Dropdown.Toggle
                        variant="secondary"
                        id="dropdown-basic">
                        {/* {props.brunches.reduce((min, current) => current.cartPrice < min.cartPrice ? current : min, props.brunches[0])} */}
                        Choose your preferred supermarkets
                </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {props.brunches && props.brunches.map(brunch => [
                            <Dropdown.Item
                                eventKey="1"
                                key={brunch.id}>
                                <input type='checkbox' />
                                {brunch.Chain.ChainName}
                                <Badge variant="success">
                                    {500.3}
                                </Badge>
                            </Dropdown.Item>,
                            <Dropdown.Divider
                                key={brunch.id + '_divider'} />]
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>

            <Col  >
                <Col
                    xs="auto"
                    className='p-0'>
                    <Button
                        onClick={props.locationClicked}>
                        <FiMapPin />
                    </Button>
                </Col>
            </Col>

            <h6
                style={{/* backgroundColor: '#007bff', borderRadius: '.25rem',*/
                    color: 'white'
                }}>
                Cheapest cart:
                 {props.brunches && props.brunches[0].Chain.ChainName}
                <Badge
                    variant="success">
                    {props.price}
                    <span
                        style={{ fontSize: '18px' }}
                    >₪
                        </span>
                </Badge>
            </h6>
        </Form.Row>

        <Col
            className='mt-1'>
            <Tab.Container
                id="list-group-tabs-example"
                defaultActiveKey="#link1">
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

    </Form>

)
export default summeryBar