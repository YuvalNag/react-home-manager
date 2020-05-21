import React, { Fragment } from 'react'
import { Spinner } from 'react-bootstrap'
import { FaCartArrowDown } from 'react-icons/fa'
import CartView from '../../../components/ShoppingCartManagerComponents/CartView/CartView'

const MyCart = props => {

    return (
        // <Fragment>

        //     <div>expandable branches filter and table with chain,name,address,distance,icons(favorite,visible,chosen),price</div>
        //     <div>visible branch->(BranchSummery,CategoriesCards) </div>
        // </Fragment>
        <CartView
            loadingCart={props.loadingCart}
            branch={props.currentBranch}
            deleteItemClicked={props.deleteItemClicked}
            categories={props.categories}
        />
    )
}
export default MyCart