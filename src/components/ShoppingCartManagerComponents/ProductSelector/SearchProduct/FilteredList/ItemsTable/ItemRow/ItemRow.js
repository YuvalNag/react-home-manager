import React, { useState, useEffect } from 'react'
import Figure from 'react-bootstrap/Figure'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import { IoIosArrowDropright } from 'react-icons/io'


const ItemRow = (props) => {
    const buildBadges = (pricesArray) => {
        let badges = []
        badges.push(<Badge variant="success" > {pricesArray[0].ItemPrice.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{props.children.isWeighted ? " Kg" : ''}</Badge>)
        for (let index = 1; index < pricesArray.length - 1; index++) {

            badges.push(<Badge variant="warning">{pricesArray[index].ItemPrice.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{props.children.isWeighted ? " Kg" : ''}</Badge>);

        }
        badges.push(<Badge variant="danger"> {pricesArray[pricesArray.length - 1].ItemPrice.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{props.children.isWeighted ? " Kg" : ''}</Badge>)
        return badges
    }
    const withPrices = props.children.Branches !== undefined;
    const [src, setSrc] = useState(props.children.url)
    useEffect(() => {
        setSrc(props.children.url);
    }, [props.children.url])
    const errorImage = require(`../../../../../../../assets/images/no-image-available.png`);




    return (
        <div style={{ display: 'flex' }} >
            {props.children.isClicked && <IoIosArrowDropright size='1.3em' color='red' style={{
                color: '#aaa',
                cursor: 'pointer',
                position: 'absolute',
                right: '2%',
                zIndex: '1'
            }}
                 />}
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
                            <Badge className='float-left m-1' variant='success'>{props.children.price.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{/*props.children.isWeighted ? " Kg" : ''*/}</Badge>:מחיר ממוצע
                        </h6>
                    </ListGroup.Item>
                </Figure.Caption>
            </Figure>
            {/* } */}
            <ListGroup variant="flush" className='float-right'>
                <ListGroup.Item>{props.children.name}</ListGroup.Item>
                {withPrices && <ListGroup.Item> {props.children.ManufacturerName !== 'לא ידוע' && props.children.ManufacturerName.length > 1 ? props.children.ManufacturerName : null}</ListGroup.Item>}
                <ListGroup.Item>{props.children.isWeighted ? 'לפי משקל' : 'לפי יחידות'}</ListGroup.Item>
            </ListGroup>
        </div>
    )
}

export default ItemRow
