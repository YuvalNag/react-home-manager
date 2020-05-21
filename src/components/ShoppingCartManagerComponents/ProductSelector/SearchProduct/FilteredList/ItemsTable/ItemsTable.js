import React from 'react'
import ItemRow from './ItemRow/ItemRow'
import ListGroup from 'react-bootstrap/ListGroup'

const ItemsTable = (props) => {
    return (
        <ListGroup variant="flush">
            {props.items.map((item, i) =>
                <ListGroup.Item key={item.code}
                    onClick={() => props.itemClicked(item)}>
                    <ItemRow
                        // quantityChanged={props.quantityChanged}
                        // quantity={props.quantity}
                        // chosenCategory={props.chosenCategory}
                        categories={props.categories}
                        // categoryClicked={props.categoryClicked}
                        addToCartClicked={props.addToCartClicked} >
                        {item}
                    </ItemRow>
                </ListGroup.Item >)}

        </ListGroup >




    )
}

export default ItemsTable