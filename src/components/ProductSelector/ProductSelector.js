import React from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { FiMapPin } from "react-icons/fi";

import SearchProduct from './SearchProduct/SearchProduct'
import AddToCartButton from './AddToCartButton/AddToCartButton'

const productSelector = props => (
    <Form >
        <Form.Row>
            <Col className='m-1 p-0' >
                <SearchProduct changed={props.searchChanged} productInfo={props.productInfo} itemClicked={props.itemClicked} items={props.items}/>
            </Col>
            <Col sm={2} className='m-1'>

                <Form.Control type="number" onChange={props.amountChanged} placeholder="#Amount" value={props.amount} />

            </Col>
            <Col className='m-1 p-0' >
                <Form.Group as={Row} className='m-0' >
                    <Col xs="auto" className='p-0'>
                        <Button >
                            <FiMapPin />
                        </Button>
                    </Col>

                    <Col className='p-0'>
                        <AddToCartButton valid={props.valid}/>
                    </Col>
                </Form.Group>
            </Col>
        </Form.Row>
    </Form>

)
export default productSelector