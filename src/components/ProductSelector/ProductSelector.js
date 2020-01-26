import React from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { GoSearch } from "react-icons/go";
import Button from 'react-bootstrap/Button'
import { FiMapPin } from "react-icons/fi";


const productSelector = props => (
    <Form >
        <Form.Row>
            <Col className='m-1 p-0' >
                <Form.Group as={Row} className='m-0' >
                    <Col xs="auto" className='p-0' >
                        <Button variant="secondary">
                            <GoSearch />
                        </Button>
                    </Col>

                    <Col className='p-0' >
                        <Form.Control type="text" onChange={props.Changed} name='productInfo' placeholder="Search" value={props.productInfo} />
                    </Col>
                </Form.Group>
            </Col>
            <Col sm={2} className='m-1'>

                <Form.Control type="number" onChange={props.Changed} name='amount' placeholder="#Amount" value={props.amount} />

            </Col>
            <Col className='m-1 p-0' >
                <Form.Group as={Row} className='m-0' >
                    <Col xs="auto" className='p-0'>
                        <Button variant="secondary">
                            <FiMapPin />
                        </Button>
                    </Col>

                    <Col className='p-0'>
                        <Form.Control type="text" placeholder="Location" />
                    </Col>
                </Form.Group>
            </Col>
        </Form.Row>
    </Form>

)
export default productSelector