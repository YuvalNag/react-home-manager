import React, { Fragment, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { IoIosPin } from 'react-icons/io'
import './BranchesManager.css';
import { FaRegBuilding } from 'react-icons/fa'
import BranchesModal from './BranchesModal/BranchesModal'
import CurrentBranchSelector from './CurrentBranchSelector/CurrentBranchSelector'

const BranchesManager = props => {
    const [showBranchesModel, setBranchesModel] = useState(false)

    return (
        <Fragment>
            <BranchesModal
                loading={props.loading}
                show={showBranchesModel}
                setModal={setBranchesModel}
                submit={props.submitUpdateChosenBranches}
                optionalBranches={props.optionalBranches}
            />
            <Form className='w-100'>
                <Form.Row className=' d-inline-flex float-right'>
                    <Col>
                        <Button className='rounded-circle px-2 h-100 w-100'
                            variant='outline-primary'
                            onClick={() => {
                                props.getAllAvailableBranches();
                                setBranchesModel(true);
                            }}>
                            <FaRegBuilding size='18px' />
                        </Button>

                    </Col>
                    <Col className=' d-inline-flex p-0' >

                        <Button className='rounded-circle px-2 h-100 w-100'
                            variant='outline-primary'
                            onClick={() => {
                                props.getClosestAvailableBranches();
                                setBranchesModel(true);
                            }}>
                            <IoIosPin size='18px' />
                        </Button>
                    </Col>
                    <Col className=' d-inline-flex' >
                        <CurrentBranchSelector
                            loading={props.loading}
                            located={props.located}
                            chosenBranches={props.chosenBranches}
                            currentBranchId={props.currentBranchId}
                            branchClicked={props.branchClicked}
                            removeChosenBranch={props.removeChosenBranch}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </Fragment>
    )
}
export default BranchesManager