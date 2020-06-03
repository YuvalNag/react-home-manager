import React from 'react'
import ItemRow from './ItemRow/ItemRow'
import ListGroup from 'react-bootstrap/ListGroup'

const ItemsList = (props) => {
    return (
        <ListGroup variant="flush">
            {props.items.map((item, i) =>
                <ListGroup.Item key={item.code}>
                    <ItemRow
                        categories={props.categories}
                        addToCartClicked={props.addToCartClicked} >
                        {item}
                    </ItemRow>
                </ListGroup.Item >)}

        </ListGroup >




    )
}

export default ItemsList