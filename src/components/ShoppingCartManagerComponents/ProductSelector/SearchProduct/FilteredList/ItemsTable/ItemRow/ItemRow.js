import React, { useState, useEffect } from 'react'
import Figure from 'react-bootstrap/Figure'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import { FiMinusCircle } from 'react-icons/fi'
import { Image } from 'react-bootstrap'
import axios from '../../../../../../../axios/axios-shoppingCart'

const ItemRow = (props) => {

    const [src, setSrc] = useState(props.children.url)
    useEffect(() => {
        setSrc(props.children.url);
    }, [props.children.url])


    return (
        <div key={props.children.code}>

            <div style={{ display: 'flex' }} >
                {props.children.isClicked &&
                    <FiMinusCircle size='1.3em' color='red' style={{
                        color: '#aaa',
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '2%',
                        zIndex: '1'
                    }}
                    />
                }
                <Figure className='m-1 float-left' >
                    <Figure.Image
                        width={100}
                        height={75}
                        alt={props.children.name}
                        src={src}
                        onError={() => { setSrc(`https://m.pricez.co.il/ProductPictures/s/${props.children.code}.jpg`) }}
                    />
                    <Figure.Caption>
                        <ListGroup.Item>
                            <h6 className='d-inline-flex'>
                                <Badge className='float-left m-1' variant='warning'>{props.children.avgPrice}<span style={{ fontSize: '18px' }}>₪</span>{/*props.children.isWeighted ? " Kg" : ''*/}</Badge>:מחיר ממוצע
                        </h6>
                        </ListGroup.Item>
                    </Figure.Caption>
                </Figure>
                {/* } */}
                <ListGroup variant="flush" className='float-right'>
                    <ListGroup.Item>{props.children.name}</ListGroup.Item>
                    {props.children.manufacturerName !== 'לא ידוע' && props.children.manufacturerName.length > 1 && <ListGroup.Item> {props.children.manufacturerName}</ListGroup.Item>}
                    <ListGroup.Item>{props.children.isWeighted ? 'לפי משקל' : 'לפי יחידות'}</ListGroup.Item>

                </ListGroup>
            </div>
            <div style={{
                boxSizing: 'content-box',
                display: 'flex',
                justifyContent: 'space-evenly'
            }}>{props.children.prices.map((price, i) =>
                <div key={price.chainName + i} style={{
                    boxSizing: 'content-box',
                    width: '55px',
                    // display: 'flex',
                    // justifyContent: 'space-between'
                }}>
                    <Badge variant={i === props.children.prices.length - 1 ? 'success' : i === 0 ? 'danger' : null} > {price.price}<span style={{ fontSize: '15px' }}>₪</span>{props.children.isWeighted ? " Kg" : ''}</Badge>
                    <Image
                        src={`${axios.defaults.baseURL}/img/chain/${price.chainName.toLowerCase()}.png`}
                        fluid className='float-right w-100' />
                </div>
            )}
            </div>
        </div>
    )
}

export default ItemRow
