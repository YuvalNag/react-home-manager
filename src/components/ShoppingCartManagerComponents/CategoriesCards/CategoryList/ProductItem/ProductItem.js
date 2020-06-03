import React, { useState, useEffect, Fragment } from 'react'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline, IoMdCreate, IoIosSync } from 'react-icons/io'
import Image from 'react-bootstrap/Image'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import ImageViewer from '../../../../UI/ImageViewer/ImageViewer'
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

const ProductItem = props => {
    const [quantity, setQuantity] = useState(props.product.quantity)
    const [category, setCategory] = useState(props.product.category)
    // const [unit, setUnit] = useState(props.product.unit || !props.product.isWeighted ? 'יחידות' : 'ק"ג')


    const categories = props.categories && props.categories.map(category => ({ value: category, label: category }))

    const [msg, setMsg] = useState()
    const editView =
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

            <Form.Control type="number" className='text-right w-25' onChange={(event) => {
                setQuantity(event.target.value)
                setMsg()
            }} placeholder="כמות" value={quantity} />

            {/* <Select
                placeholder={!props.product.isWeighted ? 'יחידות' : 'ק"ג'}
                styles={unitsStyles}
                isClearable
                isRtl
                isSearchable
                options={[{ value: 'יחידות', label: 'יחידות' }, { value: 'ק"ג', label: 'ק"ג' }]}
                onChange={(option, actions) => {
                    if (actions.action === "select-option") {
                        setUnit(option.value === 'ק"ג' ? true : false)
                    }
                }}
            /> */}
            <p style={{
                marginTop: '15px',
                marginBottom: '0',
                marginRight: '5px',
                fontSize: '85%'
            }}>{!props.product.isWeighted ? 'יחידות' : 'ק"ג'}</p>

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


            <IoIosSync size='30px' onClick={() => {
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
            backgroundColor: props.product.isLack ? 'rgb(248, 226, 162)' : 'rgb(168, 226, 235)',
            fontSize: ' 1.2em'
        }}>
            <Alert variant="light " show={show} onClose={() => setShow(false)} dismissible style={{
                borderColor: props.product.isLack ? 'rgb(248, 226, 162)' : 'rgb(168, 226, 235)',
                borderStyle: 'solid',
                borderWidth: '5px',
                borderRadius: '20px',
                marginLeft: '7px'
            }}>
                <ImageViewer>

                    <Image
                        fluid
                        alt={props.product.name}
                        src={src}
                        onError={() => { setSrc(`https://m.pricez.co.il/ProductPictures/${props.product.code}.jpg`) }}
                    />
                </ImageViewer>

            </Alert>

            {edit
                ? editView
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
                    color='#28a745' size='1.5em'
                    onClick={() => {
                        const error = props.updateCartClicked(props.product.isWeighted ? parseFloat(quantity) : parseInt(quantity), category, props.product, 'prevCart')
                        if (error) {
                            setMsg(error)
                        }
                        else {
                            props.deleteItemClicked({ code: props.product.code })
                        }

                    }} />
                <IoMdCloseCircleOutline size='1.5em' color='#dc3545' style={{
                    cursor: 'pointer',
                    float: 'right'
                }} onClick={() => props.deleteItemClicked({ code: props.product.code })} />
                <IoMdCreate style={{
                    cursor: 'pointer',
                    float: 'left'
                }}
                    onClick={() => setEdit(prevEdit => !prevEdit)}
                    color='#6c757d' size='1.5em' />
            </div>
        </ListGroup.Item>
    )
}
export default ProductItem