import React from 'react'
import CategoryCard from './CategoryCard/CategoryCard'
import CategoryList from './CategoryList/CategoryList'


const categoriesCards = props => {
    const categoriesCards = props.categories.map(category => <CategoryList key={category.name} title={category.name} products={category.products} deleteItemClicked={props.deleteItemClicked} />)
    return (
        <div style={{ direction: 'rtl' }}>
            {categoriesCards}
        </div>
    )
}
export default categoriesCards