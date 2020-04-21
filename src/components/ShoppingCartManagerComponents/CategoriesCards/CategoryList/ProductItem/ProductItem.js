import React, { useState, useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline, IoMdImages } from 'react-icons/io'
import Image from 'react-bootstrap/Image'
import { Modal, Alert } from 'react-bootstrap'


const ProductItem = props => {
    const [show, setShow] = useState(false);

    const [src, setSrc] = useState(props.product.url)
    useEffect(() => {
        setSrc(props.product.url);
    }, [props.product.url])
    return (
        <ListGroup.Item className='p-0'>
            <Alert variant="light " show={show} onClose={() => setShow(false)} dismissible>

                <Image
                    fluid
                    alt={props.product.name}
                    src={src}
                    onError={() => { setSrc(`https://m.pricez.co.il/ProductPictures/s/${props.product.code}.jpg`) }}
                />
            </Alert>
            <Badge variant='secondary' className='ml-1'>
                {(props.product.price * props.product.quantity).toFixed(2)}
                <span style={{ fontSize: '15px' }}>₪</span>
            </Badge>

            <strong style={{ float: 'right' }}>x{props.product.quantity}</strong>
            <span style={{
                float: 'right',
                marginRight: '1px'
            }}>{props.product.name}</span>
            <div style={{
                display: 'inline-flex',
                float: 'left',
                justifyContent: 'space-evenly',

                width: '70px'
            }}>


                <IoMdCheckmarkCircleOutline style={{
                    cursor: 'pointer',
                    float: 'left'
                }}
                    color='green' size='1.2em' />
                <IoMdCloseCircleOutline size='1.2em' color='red' style={{
                    cursor: 'pointer',
                    float: 'right'
                }} onClick={() => props.deleteItemClicked({ code: props.product.code, category: props.title, quantity: props.product.quantity })} />
                <IoMdImages style={{
                    cursor: 'pointer',
                    float: 'left'
                }}
                    onClick={() => setShow(true)}
                    color='black' size='1.2em' />
            </div>
        </ListGroup.Item>
    )
}
export default ProductItem