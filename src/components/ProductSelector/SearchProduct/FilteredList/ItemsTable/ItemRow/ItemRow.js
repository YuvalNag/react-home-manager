import React from 'react'

const ItemRow = (props) => {
    const item = props.children.split('_')
    return (
        <tr onClick={props.clicked}>
            <td>{item[0]}</td>
            <td>{item[1]}</td>
            <td>{item[2]+'$'}</td>
        </tr>
    )
}

export default ItemRow
