import React, { useState, useEffect } from 'react'
import Figure from 'react-bootstrap/Figure'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import { IoMdAdd, IoMdCart, IoIosArrowForward, IoMdCheckmark } from 'react-icons/io'
import { staticBaseUrl } from '../../../../shared/variables'
import ImageViewer from '../../../UI/ImageViewer/ImageViewer'
import Select from 'react-select'

const categoriesStyles = {
    control: (styles, { selectProps: { inputValue } }) => {
        const width = '150px'
        const height = '50%'
        return {
            ...styles,
            width: width,
            height: height

        }
    }
}
// const unitsStyles = {
//     control: (styles, { selectProps: { inputValue } }) => {
//         const width = '100px'
//         const height = '15%'
//         return {
//             ...styles,
//             width: width,
//             height: height

//         }
//     }
// }

const ItemRow = (props) => {

    const [isClicked, setIsClicked] = useState(false)
    const [quantity, setQuantity] = useState('')
    const [category, setCategory] = useState('מחלקה')
    const [msg, setMsg] = useState()
    const [isAdded, setIsAdded] = useState(false);

    const categories = props.categories && props.categories.map(category => ({ value: category, label: category }))

    console.log(props.children.name, props.children.similarity);

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

            {/* <Select
                placeholder={!props.children.isWeighted ? 'יחידות' : 'ק"ג'}
                styles={unitsStyles}
                isClearable
                isRtl
                isSearchable
                options={[{ value: 'יחידות', label: 'יחידות' }, { value: 'ק"ג', label: 'ק"ג' }]}
                onChange={(option, actions) => {
                    if (actions.action === "select-option") {
                        props.children.isWeighted = (option.value === 'ק"ג' ? true : false)
                    }
                }}
            /> */}
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


            <Select
                placeholder={category}
                styles={categoriesStyles}
                isClearable
                isRtl
                isSearchable
                options={categories}
                onChange={(option, actions) => {
                    if (actions.action === "select-option") {
                        setCategory(option.value)
                        setMsg()
                    }
                }}
            />



            <IoIosArrowForward size='22px' onClick={() => setIsClicked(false)} />

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
                            setIsAdded(true)
                        }
                    }
                    else setIsClicked(true)
                }}>
                    {isClicked ? <IoMdCart size='22px' /> : isAdded ? <IoMdCheckmark size='22px' /> : <IoMdAdd size='22px' />}
                </Button>
                {isClicked ? addView : pricesList}

            </div>
        </div >
    )
}

export default ItemRow
