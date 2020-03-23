import React from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'


import SearchProduct from './SearchProduct/SearchProduct'
import AddToCartButton from './AddToCartButton/AddToCartButton'
import Dropdown from 'react-bootstrap/Dropdown'

const productSelector = props => (
    <Form >
        <Form.Row>
            <Col className='m-1 p-0' >
                <SearchProduct changed={props.searchChanged} searchTerm={props.searchTerm} itemClicked={props.itemClicked} items={props.items} />
            </Col>
            <Col sm={2} className='m-1'>

                <Form.Control type="number" onChange={props.quantityChanged} placeholder="#Quantity" value={props.quantity} />

            </Col>
            <Col className='m-1 p-0' xs="auto" >
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Chose Category
                </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {props.categories && props.categories.map(category => [
                            <Dropdown.Item eventKey="1" onClick={props.categoryClicked} key={category}>{category}</Dropdown.Item>,
                            <Dropdown.Divider key={category.id + '_divider'} />]
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>

            <Col className='m-1 p-0'>
                <AddToCartButton addToCartClicked={props.addToCartClicked}
                    valid={props.productIsValid} />
            </Col>
        </Form.Row>
    </Form>

)
export default productSelector