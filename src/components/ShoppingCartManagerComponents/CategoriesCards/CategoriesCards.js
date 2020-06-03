import React from 'react'
import CategoryList from './CategoryList/CategoryList'
import ScrollToTop from '../../UI/ScrollToTop/ScrollToTop'


const categoriesCards = props => {
    const categoriesCards = props.categories.map(category => <CategoryList
        categories={props.allCategories}
        key={category.name}
        title={category.name}
        products={category.products}
        updateCartClicked={props.updateCartClicked}
        deleteItemClicked={props.deleteItemClicked}
    />)
    return (
        <div style={{ direction: 'rtl' }}>
            {categoriesCards}
            <ScrollToTop />
        </div>
    )
}
export default categoriesCards