import React, { Fragment } from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'


import SearchProduct from './SearchProduct/SearchProduct'
import AddToCartButton from './AddToCartButton/AddToCartButton'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'


const productSelector = props => (
    <Fragment>
        <Col className='m-1 p-0' sm={2} >
            <SearchProduct searchClicked={props.searchClicked} changed={props.searchChanged} searchTerm={props.searchTerm} itemClicked={props.itemClicked}
                items={props.item ? [props.item] : props.items} />
            {/* items={props.items.length <= 0 ? props.item ? [props.item] : [] : props.items} /> */}
            {props.loadingSearch && <Spinner animation="border" variant='secondary' />}
        </Col>
        <Col className='mx-1 p-0'>
            <AddToCartButton addToCartClicked={props.addToCartClicked}
                valid={props.productIsValid} />
        </Col>

        <Col className='mx-1 p-0' xs="auto" >
            <DropdownButton
                as={ButtonGroup}
                key='down'
                id='dropdown-button-drop-down'
                drop='down'
                variant="secondary"
                title='מחלקה'
            >
                {props.categories && props.categories.map(category => [
                    <Dropdown.Item eventKey="1" onClick={props.categoryClicked} key={category}>{category}</Dropdown.Item>,
                    <Dropdown.Divider key={category.id + '_divider'} />]
                )}
            </DropdownButton>

            {!props.categoryChosen ? <p style={{
                width: '100 %',
                marginTop: '0',
                marginBottom: '0',
                fontSize: '80%',
                color: '#dc3545'
            }}>בחר מחלקה</p> : null}
        </Col>
        <Col className='p-0'>
            <Form.Control type="number" className='text-right' onChange={props.quantityChanged} placeholder="כמות" value={props.quantity} />
        </Col>
        <Form.Label className='text-white p-0' column >:כמות</Form.Label>
    </Fragment>


)
export default productSelector