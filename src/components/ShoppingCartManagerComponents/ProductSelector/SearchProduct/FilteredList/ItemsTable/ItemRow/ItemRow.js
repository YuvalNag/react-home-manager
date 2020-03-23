import React, { useState, useEffect } from 'react'
import Figure from 'react-bootstrap/Figure'
import Badge from 'react-bootstrap/Badge'


const ItemRow = (props) => {

    const [src, setSrc] = useState(props.children.url)
    useEffect(() => {
        setSrc(props.children.url);
    }, [props.children.url])
    const errorImage = require(`../../../../../../../assets/images/no-image-available.png`);

    return (

        <Figure onClick={() => props.clicked(props.children)}>
            { <Figure.Image
                width={100}
                height={75}
                alt={props.children.name}
                src={src}
                onError={() => { setSrc(errorImage) }}
            /> }
            <Figure.Caption>
                {props.children.name} <Badge variant="warning">{props.children.Branches.reduce((avg, cur) => avg + cur.ItemPrice / props.children.Branches.length, 0).toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{props.children.isWeighted ? " Kg" : ''}</Badge>
            </Figure.Caption>


        </Figure>


    )
}

export default ItemRow
