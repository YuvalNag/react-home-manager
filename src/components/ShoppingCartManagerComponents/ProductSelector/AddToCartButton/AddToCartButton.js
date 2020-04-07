import React from 'react'
import Button from 'react-bootstrap/Button'
import { IoIosCart } from "react-icons/io";

const addToCartButton = props => (

    <Button onClick={props.addToCartClicked} style={{ fontSize: '15px' }}
        className='ml-1 w-100 '
        value="Input"
        disabled={!props.valid} >
        <IoIosCart size='18px' />
    </Button>

)

export default addToCartButton