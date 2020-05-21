import React from 'react'
import CategoryCard from './CategoryCard/CategoryCard'
import CategoryList from './CategoryList/CategoryList'


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
        </div>
    )
}
export default categoriesCards