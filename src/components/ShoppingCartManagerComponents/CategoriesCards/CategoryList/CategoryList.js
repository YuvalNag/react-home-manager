import React from 'react'
import VerticallyCenteredModal from '../../../UI/VerticallyCenteredModal/VerticallyCenteredModal'
import ListGroup from 'react-bootstrap/ListGroup'
import ProductItem from './ProductItem/ProductItem'


const CategoryList = props => {

    return (
        <VerticallyCenteredModal
            show={props.modalShow}
            onHide={() => props.setModalShow(false)}
            title={props.title.toUpperCase()}>
            <ListGroup variant="flush">{
                props.products.map(product => <ProductItem deleteItemClicked={props.deleteItemClicked} key={product.code} product={product} />
                )

            }
            </ListGroup>
        </VerticallyCenteredModal>
    )
}

export default CategoryList