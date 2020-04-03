import React, { Fragment } from 'react'
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';


const ChainSection = props => {
    console.log(props);
    
    const imageSrc = require(`../../../../assets/images/${props.name}.png`);
    return (
        props.children.length > 0 &&
        <div>
            <div style={{
                boxSizing: 'content-box',
                width: '80px',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Image src={imageSrc} fluid className='float-right w-100' />
            </div>

            {props.children.map(branch => (
                <div key={branch.id} onClick={() => branch.cart && props.branchClicked(branch.id)} >
                    {
                        !props.favorite &&
                        <Form.Check
                            type="switch"
                            id={branch.id}
                            label={branch.storeName}
                            onChange={() => { }}
                        />
                    }
                    {branch.storeName}
                    {branch.cart && <Badge className='float-left'>{branch.cart && branch.cart.price.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{/*props.children.isWeighted ? " Kg" : ''*/}</Badge>}
                </div>



            ))
            }

        </div >
    )
}

export default ChainSection