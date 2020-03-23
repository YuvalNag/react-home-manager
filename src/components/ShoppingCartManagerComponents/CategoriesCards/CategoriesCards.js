import React from 'react'
import CategoryCard from './CategoryCard/CategoryCard'


const categoriesCards = props => {
    const categoriesCards =Object.keys(props.categories).map(title=><CategoryCard key={title} title={title} imageName={props.categories[title].imageName} products={props.categories[title].products} deleteItemClicked={props.deleteItemClicked}/>)
    return (
        <div>
            {categoriesCards}
        </div>
    )
}
export default categoriesCards