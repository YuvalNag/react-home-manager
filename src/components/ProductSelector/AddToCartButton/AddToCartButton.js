import React from 'react'
import Button from 'react-bootstrap/Button'
// import { FaOpencart } from "react-icons/fa";

const addToCartButton = props => (

    <Button style={{fontSize:'15px'}}
     className='ml-1 w-100 '
    value="Input" 
    disabled={!props.valid} >
        Add To Cart</Button>

)

export default addToCartButton