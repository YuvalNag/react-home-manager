import React, { useState, useEffect } from 'react'
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { FiEye, FiEyeOff, FiMinus } from 'react-icons/fi';
import { Button } from 'react-bootstrap';
import axios from '../../../../axios/axios-shoppingCart'
import {staticBaseUrl} from '../../../../shared/variables'

const ChainSection = props => {
    const [open, setOpen] = useState(false);
    const chainName = props.name;
    const [src, setSrc] = useState()
    useEffect(() => {
        setSrc(`${staticBaseUrl}/img/chain/${chainName}.png`);
    }, [chainName])
    const errorImage = require(`../../../../assets/images/no-image-available.png`);
    let branches = <Collapse in={open} mountOnEnter >
        <div>            {props.children.map(branch => (
            <div key={branch.id} onClick={() => branch.cart && props.branchClicked(branch.id)} >

                <Form.Check
                    type="switch"
                    id={branch.id}
                    label={branch.storeName}
                    onChange={() => { }}
                />

                {branch.isChosen &&
                    <p>
                        {branch.cart && <Badge className='float-left'>{branch.cart && branch.cart.price.toFixed(2)}<span style={{ fontSize: '18px' }}>₪</span>{/*props.children.isWeighted ? " Kg" : ''*/}</Badge>}
                        {branch.storeName}
                    </p>
                }
            </div>
        ))
        }
        </div>

    </Collapse>
    if (props.isChosenBranches) {
        branches = (
            <div>
                {props.children.map(branch => (
                    branch.isChosen &&
                    <div key={branch.id}  >
                        <h5>
                            <Badge className='float-right' style={{ color: 'black' }}>
                                {branch.storeName + ': '}
                                {branch.cart && branch.cart.price.toFixed(2)
                                }₪
                    </Badge>
                        </h5>


                        <div style={{
                            display: 'inline-flex',
                            float: 'left',
                            justifyContent: 'space-evenly',
                            width: '100%'
                        }}>
                            <div style={{
                                height: '25px',
                                width: '25px'
                            }}>

                                <Button className='rounded-circle p-0 h-100 w-100'
                                    variant='outline-danger'
                                    onClick={(event) => {
                                        event.preventDefault();
                                        props.removeChosenBranch(branch.id)
                                    }}>
                                    <FiMinus size='0.9em' />
                                </Button>
                            </div>
                            <div style={{
                                height: '25px',
                                width: '25px'
                            }}>
                                {props.currentBranchId !== branch.id
                                    ?
                                    <Button className='rounded-circle p-0 h-100 w-100'
                                        variant='outline-secondary'

                                        onClick={() => branch.cart && props.branchClicked(branch.id)}>
                                        <FiEyeOff size='0.9em' />
                                    </Button>
                                    : <Button className='rounded-circle p-0 h-100 w-100'
                                        variant='secondary'

                                    >
                                        <FiEye size='0.9em' />
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>

                ))
                }
            </div>
        )
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
                {!props.isChosenBranches ? !open ? <MdExpandMore /> : <MdExpandLess /> : null}

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