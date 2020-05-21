import React, { Fragment } from 'react'
import VerticallyCenteredModal from '../../../UI/VerticallyCenteredModal/VerticallyCenteredModal'
import ListGroup from 'react-bootstrap/ListGroup'
import ProductItem from './ProductItem/ProductItem'


const CategoryList = props => {

    return (
        <Fragment>
            <h6 style={{color:'white'}}>{props.title}</h6>
            <ListGroup variant="flush">{
                props.products.map(product => <ProductItem deleteItemClicked={props.deleteItemClicked} key={product.code} product={product} />
                )

            }
            </ListGroup>
        </Fragment>
    )
}

export default CategoryList