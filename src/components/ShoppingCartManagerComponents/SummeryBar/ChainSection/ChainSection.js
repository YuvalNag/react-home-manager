import React, { Fragment, useState, useEffect } from 'react'
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import { MdExpandMore, MdExpandLess } from 'react-icons/md'


const ChainSection = props => {
    console.log(props);
    const [open, setOpen] = useState(false);
    const chainName = props.name;
    const [src, setSrc] = useState()
    useEffect(() => {
        setSrc(`https://heifetz.duckdns.org/img/chain/${chainName}.png`);
    }, [chainName])
    const errorImage = require(`../../../../assets/images/no-image-available.png`);
    let branches = <Collapse in={open} mountOnEnter unmountOnExit>
        <div>            {props.children.map(branch => (
            <div key={branch.id} onClick={() => branch.cart && props.branchClicked(branch.id)} >

                <Form.Check
                    type="switch"
                    // checked={branch.isChosen}
                    id={branch.id}
                    label={branch.storeName}
                    onChange={() => { }}
                />

                {(branch.isFavorite || branch.isChosen)
                    ?
                    <p>
                        {branch.cart && <Badge className='float-left'>{branch.cart && branch.cart.price.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{/*props.children.isWeighted ? " Kg" : ''*/}</Badge>}
                        {branch.storeName}
                    </p>
                    :
                    null}
            </div>
        ))
        }
        </div>

    </Collapse>
    if (props.favorite) {
        branches = <div>
            {props.children.map(branch => (
                <div key={branch.id} onClick={() => branch.cart && props.branchClicked(branch.id)} >
                    {(branch.isFavorite || branch.isChosen)
                        ?
                        <p>
                            {branch.cart && <Badge className='float-left'>{branch.cart && branch.cart.price.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{/*props.children.isWeighted ? " Kg" : ''*/}</Badge>}
                            {branch.storeName}
                        </p>
                        :
                        null}
                </div>
            ))
            }
        </div>

    }

    return (
        props.children.length > 0 &&
        <div>
            <div onClick={() => setOpen(!open)} style={{
                boxSizing: 'content-box',
                width: '110px',
                display: 'flex',
                justifyContent: 'space-between',
                margin: '10px',
                alignItems: 'center',
                fontSize: '25px'
            }}>
                {!props.favorite ? !open ? <MdExpandMore /> : <MdExpandLess /> : null}

                <Image
                    src={src}
                    onError={() => { setSrc(errorImage) }}
                    fluid
                    className='float-right w-75' />
            </div>
            {branches}
        </div >
    )
}

export default ChainSection