import React, { Fragment } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import ProductItem from './ProductItem/ProductItem'


const CategoryList = props => {

    return (
        <Fragment>
            <h4 style={{ color: 'white' }}>{props.title}</h4>
            <ListGroup variant="flush">{
                props.products.map(product => !product.isPurchased && <ProductItem
                    categories={props.categories}
                    deleteItemClicked={props.deleteItemClicked}
                    key={product.code}
                    product={product}
                    updateCartClicked={props.updateCartClicked}
                />
                )

            }
            </ListGroup>
        </Fragment>
    )
}

export default CategoryList