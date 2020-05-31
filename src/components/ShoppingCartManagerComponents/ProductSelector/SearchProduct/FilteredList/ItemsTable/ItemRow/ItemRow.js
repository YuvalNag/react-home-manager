import React, { useState, useEffect } from 'react'
import Figure from 'react-bootstrap/Figure'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import { Image, Button, Form, DropdownButton, Dropdown, Toast } from 'react-bootstrap'
import axios from '../../../../../../../axios/axios-shoppingCart'
import { IoMdAdd, IoMdCart, IoIosArrowForward } from 'react-icons/io'
import {staticBaseUrl} from '../../../../../../../shared/variables'
import ImageViewer from '../../../../../../UI/ImageViewer/ImageViewer'

const ItemRow = (props) => {

    const [isClicked, setIsClicked] = useState(false)
    const [quantity, setQuantity] = useState('')
    const [category, setCategory] = useState('מחלקה')
    const [msg, setMsg] = useState()
    const [showToast, setShowToast] = useState(false);




    const [src, setSrc] = useState(props.children.url)
    useEffect(() => {
        setSrc(props.children.url);
    }, [props.children.url])
    const pricesList = props.children.prices.map((price, i) =>
        <div key={price.chainName + i} style={{
            boxSizing: 'content-box',
            width: '55px',
            // display: 'flex',
            // justifyContent: 'space-between'
        }}>
            <Badge variant={i === props.children.prices.length - 1 ? 'success' : i === 0 ? 'danger' : null} > {price.price}<span style={{ fontSize: '15px' }}>₪</span>{props.children.isWeighted ? " Kg" : ''}</Badge>
            <Image
                src={`${staticBaseUrl}/img/chain/${price.chainName.toLowerCase()}.png`}
                fluid className='float-right w-100' />
        </div>
    )

    const successfullyToast = (
        <Toast style={{ backgroundColor: '#28a745', color: 'white' }} onClose={() => setShowToast(false)} show={showToast} delay={500} autohide>
            <Toast.Body ><h6>הוסף בהצלחה</h6></Toast.Body>
        </Toast>)
    const addView =
        <div style={{
            display: 'flex',
            justifyContent: ' space-between',
            marginLeft: '15px'
        }}>
            {
                msg ? <p style={{
                    position: 'absolute',
                    marginTop: ' 35px',
                    marginBottom: '0',
                    marginLeft: '-65px',
                    fontSize: '75%',
                    color: '#dc3545'
                }}>{msg}</p> : null
            }
            <p style={{
                marginTop: '15px',
                marginBottom: '0',
                marginRight: '5px',
                fontSize: '85%'
            }}>{!props.children.isWeighted ? 'יחידות' : 'ק"ג'}</p>

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


            <Button className='rounded-circle h-100 px-2' variant='outline-secondary' onClick={() => setIsClicked(false)}>
                <IoIosArrowForward size='22px' />
            </Button>
        </div >

    return (
        <div key={props.children.code}>

            <div style={{ display: 'flex' }} >
                <Figure className='m-1 float-left' >
                    <ImageViewer>

                        <Figure.Image
                            alt={props.children.name}
                            src={src}
                            onError={() => { setSrc(`https://m.pricez.co.il/ProductPictures/${props.children.code}.jpg`) }}
                        />
                    </ImageViewer>

                    <Figure.Caption>
                        <ListGroup.Item>
                            <h6 className='d-inline-flex'>
                                <Badge className='float-left m-1' variant='warning'>{props.children.avgPrice.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{/*props.children.isWeighted ? " Kg" : ''*/}</Badge>:מחיר ממוצע
                        </h6>
                        </ListGroup.Item>
                    </Figure.Caption>
                </Figure>
                {/* } */}
                <ListGroup variant="flush" className='float-right'>
                    <ListGroup.Item>{props.children.name}</ListGroup.Item>
                    {props.children.manufacturerName !== 'לא ידוע' && props.children.manufacturerName.length > 1 && <ListGroup.Item> {props.children.manufacturerName}</ListGroup.Item>}
                    {/* <ListGroup.Item>{props.children.isWeighted ? 'לפי משקל' : 'לפי יחידות'}</ListGroup.Item> */}

                </ListGroup>
            </div>
            <div style={{
                boxSizing: 'content-box',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Button className='rounded-circle h-75 px-2' variant='outline-success' onClick={() => {
                    if (isClicked) {
                        const error = props.addToCartClicked(props.children.isWeighted ? parseFloat(quantity) : parseInt(quantity), category, props.children)
                        if (error) {
                            setMsg(error)
                        }
                        else {
                            setIsClicked(false)
                            setShowToast(true)
                        }
                    }
                    else setIsClicked(true)
                }}>
                    {isClicked ? <IoMdCart size='22px' /> : <IoMdAdd size='22px' />}
                </Button>
                {isClicked ? addView : pricesList}

            </div>
            {showToast && successfullyToast}
        </div >
    )
}

export default ItemRow
