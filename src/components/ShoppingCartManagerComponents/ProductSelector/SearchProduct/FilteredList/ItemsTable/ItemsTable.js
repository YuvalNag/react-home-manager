import React from 'react'
import ItemRow from './ItemRow/ItemRow'
import ListGroup from 'react-bootstrap/ListGroup'

const ItemsTable = (props) => {
    return (
        <ListGroup variant="flush">
            {props.items.map((item, i) =>
                <ListGroup.Item key={item.code} onClick={() => props.itemClicked(item)}>
                    <ItemRow >
                        {item}
                    </ItemRow>
                </ListGroup.Item >)}

        </ListGroup >




    )
}

export default ItemsTable