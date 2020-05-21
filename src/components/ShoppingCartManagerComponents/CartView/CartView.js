import React, { Fragment } from 'react'
import  Row  from 'react-bootstrap/Row'
import CategoriesCards from '../CategoriesCards/CategoriesCards'
import BranchSummery from '../BranchSummery/BranchSummery'

const CartView = props => (
    <Fragment >
        <Row className='m-1' >
            <BranchSummery loadingCart={props.loadingCart}
                branch={props.branch}
                deleteItemClicked={props.deleteItemClicked}
            />
        </Row>
        <Row className="h-75">
            <CategoriesCards
                categories={props.categories}
                deleteItemClicked={props.deleteItemClicked} />
        </Row>
    </Fragment>
)
export default CartView