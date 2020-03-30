import React from 'react'
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';


const ChainSection = props => {
    const imageSrc = require(`../../../../assets/images/${props.name}.png`);
    return (
        props.children.length > 0 &&
        <div>
            <div style={{
                boxSizing: 'content-box',
                width: '100px',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Image src={imageSrc} fluid className='float-right w-100' />
            </div>

            {props.children.map(branch => (
                <div key={branch.id}>
                    {!props.favorite && <input type='checkbox' />}
                    {branch.storeName}
                    {branch.cart && <Badge className='float-left'>{branch.cart && branch.cart.price.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{/*props.children.isWeighted ? " Kg" : ''*/}</Badge>}


                </div>



            ))}

        </div >
    )
}

export default ChainSection