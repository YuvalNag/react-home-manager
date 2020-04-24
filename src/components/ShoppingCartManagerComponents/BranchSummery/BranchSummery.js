import React, { Fragment, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import VerticallyCenteredModal from '../../UI/VerticallyCenteredModal/VerticallyCenteredModal';
import axios from '../../../axios/axios-shoppingCart'

import ListGroup from 'react-bootstrap/ListGroup';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import Button from 'react-bootstrap/Button';

const BranchSummery = (props) => {
    const [showLackingModel, setLackingModel] = useState(false)
    const chainName = props.branch.chainName.toLowerCase();
    const [src, setSrc] = useState()
    useEffect(() => {
        setSrc(`${axios.defaults.baseURL}/img/chain/${chainName}.png`);
    }, [chainName])
    const errorImage = require(`../../../assets/images/no-image-available.png`);
    return (
        <Fragment>
            <Col>
                <div style={{
                    boxSizing: 'content-box',
                    width: '80px',
                    // display: 'flex',
                    // justifyContent: 'space-between'
                }}>
                    <Image
                        src={src}
                        onError={() => { setSrc(errorImage) }} fluid className='float-right w-100' />

                    <h5>
                        <Badge className='float-left' style={{ color: 'white' }}>
                            {props.branch.storeName+': '}
                             {props.branch.cart.price.toFixed(2)
                             }₪
                    </Badge>
                    </h5>
                </div>
            </Col>
            <Col xs="auto" className='m-1 h-100'>

                {props.branch.cart.lacking.length > 0 &&
                    <Fragment>
                        <VerticallyCenteredModal
                            show={showLackingModel}
                            onHide={() => setLackingModel(false)}
                            title='חוסרים'>
                            <ListGroup variant="flush">{
                                props.branch.cart.lacking.map(product =>
                                    <ListGroup.Item key={product.code}> {product.name}
                                        <Badge>
                                            {product.price}
                                            <span style={{ fontSize: '18px' }}>₪</span>
                                        </Badge>
                                        <div style={{
                                            display: 'inline - flex',
                                            float: 'right',
                                            justifyContent: 'space-between',
                                            width: '50px'
                                        }}>

                                            <IoMdCloseCircleOutline size='1.2em' color='red' style={{
                                                cursor: 'pointer',
                                                float: 'right'
                                            }} onClick={() => props.deleteItemClicked({ code: product.code, category: props.title, quantity: product.quantity })} />

                                        </div>
                                    </ListGroup.Item>)

                            }
                            </ListGroup>
                        </VerticallyCenteredModal>
                        < Button variant='secondary' className='float-right' onClick={() => setLackingModel(true)}>
                            <Badge className='m-1' variant={props.branch.cart.lacking.length < 6 ? 'warning' : 'danger'}>
                                {props.branch.cart.lacking.length}
                            </Badge>
                            <strong>
                                חוסרים
                         </strong></Button>
                    </Fragment>
                }

            </Col>
        </Fragment >
    )
}
export default BranchSummery