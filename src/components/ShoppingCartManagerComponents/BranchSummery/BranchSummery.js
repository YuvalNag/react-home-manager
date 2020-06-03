import React, { Fragment, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import {staticBaseUrl} from '../../../shared/variables'

const BranchSummery = (props) => {
    const chainName = props.branch.chainName.toLowerCase();
    const [src, setSrc] = useState()
    useEffect(() => {
        setSrc(`${staticBaseUrl}/img/chain/${chainName}.png`);
    }, [chainName])
    const errorImage = require(`../../../assets/images/no-image-available.png`);
    return (
        <Fragment>
            <Col className='d-flex'>
                <h4>
                    <Badge className='float-right mt-2' style={{ color: 'white' }}>
                        {props.branch.storeName + ': '}
                        {props.branch.cart.price.toFixed(2)
                        }₪
                    </Badge>
                </h4>
                <div style={{
                    boxSizing: 'content-box',
                    width: '100px',
                    // display: 'flex',
                    // justifyContent: 'space-between'
                }}>
                    <Image
                        src={src}
                        onError={() => { setSrc(errorImage) }} fluid className='float-right w-100' />
                </div>
            </Col>

        </Fragment >
    )
}
export default BranchSummery