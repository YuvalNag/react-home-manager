import React from 'react'
import ItemRow from './ItemRow/ItemRow'

const ItemsTable = (props) => {
    return (
        <table className="table table-bordered table-striped" style={{backgroundColor:'white',zIndex:'200'}}>
            <tbody >
               {props.items.map((item,i)=><ItemRow clicked={()=>props.itemClicked(i)} key={i}>{item}</ItemRow>)}
            </tbody>
        </table>
    )
}

export default ItemsTable
