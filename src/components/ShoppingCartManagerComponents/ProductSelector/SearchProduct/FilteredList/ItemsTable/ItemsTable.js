import React from 'react'
import ItemRow from './ItemRow/ItemRow'

const ItemsTable = (props) => {
    return (
        <div className="table table-bordered table-striped" style={{ backgroundColor: 'white', zIndex: '200' }}>

            {props.items.map((item, i) => <ItemRow clicked={props.itemClicked} key={item.code}>{item}</ItemRow>)}

        </div>
    )
}

export default ItemsTable

// <table className="table table-bordered table-striped" style={{backgroundColor:'white',zIndex:'200'}}>
//             <tbody >
//                {props.items.map((item,i)=><ItemRow clicked={()=>props.itemClicked(i)} key={i}>{item}</ItemRow>)}
//             </tbody>
//         </table>