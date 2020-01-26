import React from 'react'
import Button from 'react-bootstrap/Button'
// import { FaOpencart } from "react-icons/fa";

const addToCartButton = props => (

    <Button style={{fontSize:'15px'}}
    className='mt-3 mt-sm-1 w-75 h-75 pb-3'
    value="Input" 
    disabled={!props.currentProduct} >
        Add To Cart</Button>

)

export default addToCartButton