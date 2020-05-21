import React, { useState, useEffect, Fragment } from 'react'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline, IoMdImages, IoMdCreate, IoIosArrowForward, IoIosSync } from 'react-icons/io'
import Image from 'react-bootstrap/Image'
import Alert from 'react-bootstrap/Alert'
import { Form, DropdownButton, Dropdown, Button } from 'react-bootstrap'


const ProductItem = props => {
    const [quantity, setQuantity] = useState(props.product.quantity)
    const [category, setCategory] = useState(props.product.category)
    console.log('quantity', props.categories);
    console.log('category', category);

    const [msg, setMsg] = useState()
    const addView =
        <div style={{
            display: 'flex',
            justifyContent: ' space-between',
            marginLeft: '15px'
        }}>
            {/* {
                msg ? <p style={{
                    position: 'absolute',
                    marginTop: ' 35px',
                    marginBottom: '0',
                    marginLeft: '-65px',
                    fontSize: '75%',
                    color: '#dc3545'
                }}>{msg}</p> : null
            } */}
            <p style={{
                marginTop: '15px',
                marginBottom: '0',
                marginRight: '5px',
                fontSize: '85%'
            }}>{!props.product.isWeighted ? 'יחידות' : 'ק"ג'}</p>

            <Form.Control type="number" className='text-right w-50' onChange={(event) => {
                setQuantity(event.target.value)
                setMsg()
            }} placeholder="כמות" value={quantity} />
            <DropdownButton
                className='w-100'

                key='down'
                id='dropdown-button-drop-down'
                drop='down'
                variant="secondary"
                title={category}
            >
                {props.categories && props.categories.map(category => [
                    <Dropdown.Item eventKey="1" onClick={(event) => {
                        setCategory(event.target.innerText)
                        setMsg()
                    }} key={category}>{category}</Dropdown.Item>,
                    <Dropdown.Divider key={category.id + '_divider'} />]
                )}
            </DropdownButton>



            <IoIosSync size='2.5em' onClick={() => {
                const error = props.updateCartClicked(props.product.isWeighted ? parseFloat(quantity) : parseInt(quantity), category, props.product)
                if (error) {
                    setMsg(error)
                }
                else {
                    setEdit(false)
                }

            }} />

        </div >
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);

    const [src, setSrc] = useState(props.product.url)
    useEffect(() => {
        setSrc(props.product.url);
    }, [props.product.url])
    return (
        <ListGroup.Item className='p-0 ml-2' style={{
            width: '100vw',
            fontSize: ' 1.2em'
        }}>
            <Alert variant="light " show={show} onClose={() => setShow(false)} dismissible>

                <Image
                    fluid
                    alt={props.product.name}
                    src={src}
                    onError={() => { setSrc(`https://m.pricez.co.il/ProductPictures/s/${props.product.code}.jpg`) }}
                />
            </Alert>

            {edit
                ? addView
                : <Fragment>
                    <h5>
                        <Badge variant={props.product.avgPrice > props.product.price ? 'success' : props.product.avgPrice < props.product.price ? 'danger' : 'secondary'} className='ml-1'>
                            {((props.product.isLack ? props.product.avgPrice : props.product.price) * quantity).toFixed(2)}
                           ₪
                        </Badge>
                    </h5>
                    <strong style={{ float: 'right', marginLeft: '5px' }}> {quantity} {props.product.isWeighted ? 'ק"ג' : "יח'"}</strong>
                </Fragment>}


            <span style={{
                float: 'right',
                marginRight: '1px'
            }}
                onClick={() => setShow(prevShow => !prevShow)}>{props.product.name}{props.product.isLack && <strong> (חסר) </strong>}</span>
            <div style={{
                display: 'inline-flex',
                float: 'left',
                justifyContent: 'space-evenly',

                width: '35%'
            }}>


                <IoMdCheckmarkCircleOutline style={{
                    cursor: 'pointer',
                    float: 'left'
                }}
                    color='green' size='1.5em' />
                <IoMdCloseCircleOutline size='1.5em' color='red' style={{
                    cursor: 'pointer',
                    float: 'right'
                }} onClick={() => props.deleteItemClicked({ code: props.product.code })} />
                <IoMdCreate style={{
                    cursor: 'pointer',
                    float: 'left'
                }}
                    onClick={() => setEdit(prevEdit => !prevEdit)}
                    color='grey' size='1.5em' />
            </div>
        </ListGroup.Item>
    )
}
export default ProductItem