import React from 'react'
import CategoryCard from './CategoryCard/CategoryCard'


const categoriesCards = props => {
    const categoriesCards =props.categories.map(category=><CategoryCard key={category.title} title={category.title} imageName={category.imageName} description={category.description} />)
    return (
        <div>
            {categoriesCards}
        </div>
    )
}
export default categoriesCards