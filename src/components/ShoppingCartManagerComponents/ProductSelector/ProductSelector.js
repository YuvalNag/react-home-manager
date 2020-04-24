import React, { Fragment } from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'


// import SearchProduct from './SearchProduct/SearchProduct'
import AddToCartButton from './AddToCartButton/AddToCartButton'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import SearchProduct from './SearchProduct/SearchProduct'
import Spinner from 'react-bootstrap/Spinner'



const productSelector = props => {
    return (
        <Fragment>
            <Col className='m-1 p-0' xs={{ order: 2 }}>
                <AddToCartButton addToCartClicked={props.addToCartClicked}
                    valid={props.productIsValid} />
            </Col>

            <Col className='m-1 p-0 ' xs={{ order: 3 }}>
                <DropdownButton
                    className='w-100'
                    as={ButtonGroup}
                    key='down'
                    id='dropdown-button-drop-down'
                    drop='down'
                    variant="secondary"
                    title={props.chosenCategory}
                >
                    {props.categories && props.categories.map(category => [
                        <Dropdown.Item eventKey="1" onClick={props.categoryClicked} key={category}>{category}</Dropdown.Item>,
                        <Dropdown.Divider key={category.id + '_divider'} />]
                    )}
                </DropdownButton>

                {props.chosenCategory === 'מחלקה' ? <p style={{
                    width: '100 %',
                    marginTop: '0',
                    marginBottom: '0',
                    fontSize: '80%',
                    color: '#dc3545'
                }}>בחר מחלקה</p> : null}
            </Col>
            <Col className='m-1 p-0' xs={{ span: 2, order: 4 }}>
                <Form.Control type="number" className='text-right' onChange={props.quantityChanged} placeholder="כמות" value={props.quantity} />
            </Col>
            <Col className='m-1 p-0' xs={{ span: 1, order: 5 }} >
                <Form.Label className='text-white p-0 m-0' column >:כמות</Form.Label>
            </Col>
            <Col className='m-1 p-0' md={{ span: 6, order: 6 }} xs={{ span: 12, order: 1 }}   >

                <SearchProduct searchClicked={props.searchClicked} changed={props.searchChanged}
                    searchTerm={props.searchTerm} itemClicked={props.itemClicked}
                    items={props.chosenItem ? [props.chosenItem] : props.items} />
                {props.loadingSearch && <Spinner animation="border" variant='secondary' />}
            </Col>
        </Fragment>
    )
}
export default productSelector