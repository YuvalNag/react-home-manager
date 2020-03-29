import React from 'react'
import CategoryCard from './CategoryCard/CategoryCard'


const categoriesCards = props => {
    const categoriesCards =props.categories.map(category=><CategoryCard key={category.name} title={category.name} imageName={category.imageName} products={category.products} deleteItemClicked={props.deleteItemClicked}/>)
    return (
        <div>
            {categoriesCards}
        </div>
    )
}
export default categoriesCards