import React from 'react'

import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { FiEyeOff, FiEye, FiTrash } from 'react-icons/fi'
import { staticBaseUrl } from '../../../../shared/variables'

const BranchesTable = props => {


    return (

        props.loading && !props.located ? <Spinner size="sm" animation="border" /> :
            <Table responsive striped hover variant="dark" size="sm">
                <thead >
                    <tr>
                        <th>פעולות</th>
                        <th>מחיר מוערך</th>
                        <th>חוסרים</th>
                        <th>מיקום</th>
                        <th>רשת</th>
                    </tr>
                </thead>
                <tbody>
                    {props.chosenBranches && Object.values(props.chosenBranches).sort((a, b) => a.cart && b.cart && a.cart.price - b.cart.price).map(branch => (
                        <tr key={branch.id}>
                            <td><div style={{
                                display: 'inline-flex',
                                float: 'left',
                                justifyContent: 'space-evenly',
                                width: '100%'
                            }}>
                                <div style={{
                                    height: '25px',
                                    width: '25px'
                                }}>

                                    <Button className=' p-0 pb-4 h-100 w-100'
                                        variant='outline-danger'
                                        onClick={(event) => {
                                            event.preventDefault();
                                            props.removeChosenBranch(branch.id)
                                        }}>
                                        <FiTrash size='0.9em' />
                                    </Button>
                                </div>
                                <div style={{
                                    height: '25px',
                                    width: '25px'
                                }}>
                                    {props.currentBranchId !== branch.id
                                        ?
                                        <Button className=' p-0 pb-4 h-100 w-100'
                                            variant='outline-secondary'

                                            onClick={() => branch.cart && props.branchClicked(branch.id)}>
                                            <FiEyeOff size='0.9em' />
                                        </Button>
                                        : <Button className=' p-0 pb-4 h-100 w-100'
                                            variant='secondary'

                                        >
                                            <FiEye size='0.9em' />
                                        </Button>
                                    }
                                </div>
                            </div></td>
                            <td>{branch.cart && branch.cart.price.toFixed(2)}</td>
                            <td>{branch.cart && branch.cart.products.filter(product => !product.isPurchased && product.isLack).length}</td>
                            <td>{branch.storeName}</td>
                            <td><img width='50px' alt={branch.chainName.toLowerCase()} src={`${staticBaseUrl}/img/chain/${branch.chainName.toLowerCase()}.png`} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

    )
}
export default BranchesTable