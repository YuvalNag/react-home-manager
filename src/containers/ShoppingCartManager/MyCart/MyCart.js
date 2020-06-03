import React from 'react'
import CartView from '../../../components/ShoppingCartManagerComponents/CartView/CartView'

const MyCart = props => {

    return (
        // <Fragment>

        //     <div>expandable branches filter and table with chain,name,address,distance,icons(favorite,visible,chosen),price</div>
        //     <div>visible branch->(BranchSummery,CategoriesCards) </div>
        // </Fragment>
        <CartView
            updateCartClicked={props.updateCartClicked}
            allCategories={props.allCategories}
            loadingCart={props.loadingCart}
            branch={props.currentBranch}
            deleteItemClicked={props.deleteItemClicked}
            categories={props.categories}
        />
    )
}
export default MyCart