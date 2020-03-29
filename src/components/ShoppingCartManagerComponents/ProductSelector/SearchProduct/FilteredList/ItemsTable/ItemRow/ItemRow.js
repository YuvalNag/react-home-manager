import React, { useState, useEffect } from 'react'
import Figure from 'react-bootstrap/Figure'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'


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


    const priceBadges = withPrices && buildBadges(props.children.Branches.sort((a, b) => a.ItemPrice - b.ItemPrice))


    return (
        <div style={{ display: 'flex' }}>
            {withPrices &&
                <Figure className='m-1 float-left' onClick={() => props.clicked(props.children)}>
                    <Figure.Image
                        width={100}
                        height={75}
                        alt={props.children.name}
                        src={src}
                        onError={() => { setSrc(`https://m.pricez.co.il/ProductPictures/s/${props.children.code}.jpg`) }}
                    />
                    <Figure.Caption>
                        <ListGroup.Item>{priceBadges}</ListGroup.Item>
                    </Figure.Caption>
                </Figure>
            }
            <ListGroup variant="flush" className='float-right'>
                <ListGroup.Item>{props.children.name}</ListGroup.Item>
                {withPrices && <ListGroup.Item> {props.children.ManufacturerName !== 'לא ידוע' ? props.children.ManufacturerName : null}</ListGroup.Item>}
            </ListGroup>
        </div>
    )
}

export default ItemRow
