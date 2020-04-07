import React, { Fragment, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import { IoIosSettings, IoIosPin } from 'react-icons/io'
import ChainSection from './ChainSection/ChainSection'
import DropdownButton from 'react-bootstrap/DropdownButton'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import VerticallyCenteredModal from '../../UI/VerticallyCenteredModal/VerticallyCenteredModal'
import ListGroup from 'react-bootstrap/ListGroup'
import './SummeryBar.css';
import { FaRegBuilding } from 'react-icons/fa'

const SummeryBar = props => {
    const [showCloseBranchesModel, setCloseBranchesModel] = useState(false)
    const [showAllBranchesModel, setAllBranchesModel] = useState(false)

    return (
        <Fragment>
            <VerticallyCenteredModal
                show={props.locationModalMessage !== null}
                onHide={props.hide}
                title={props.locationModalMessage} >
                <Form
                    noValidate
                    validated={props.validatedLocation}
                    onSubmit={props.submitLocation} >

                    <Form.Group
                        controlId="formCity">
                        <Form.Label>עיר</Form.Label>
                        <Form.Control
                            placeholder="עיר"
                            required />
                        <Form.Control.Feedback
                            type="invalid">
                            הכנס עיר
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group
                        controlId="formAddress">
                        <Form.Label>רחוב ומספר</Form.Label>
                        <Form.Control
                            placeholder="רחוב ומספר"
                            required />
                        <Form.Control.Feedback type="invalid">
                            הכנס רחוב ומספר
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit">
                        שלח
                        </Button>

                </Form>
            </VerticallyCenteredModal >

            <Form className='w-100'>

                <Form.Row className=' d-inline-flex'>


                    <Col>

                        <VerticallyCenteredModal
                            show={showAllBranchesModel}
                            onHide={() => setAllBranchesModel(false)}
                            title=':בחר שלושה סניפים מועדפים'>
                            <Form noValidate
                                // validated={props.validatedBranchesByLocation}
                                onSubmit={props.submitBranchesByLocation}
                            >

                                {props.closeBranches && Object.keys(props.closeBranches).map(chainName =>
                                    <ChainSection key={chainName} name={chainName.toLowerCase()}  >
                                        {props.closeBranches[chainName]}
                                    </ChainSection>

                                )}

                                <Button
                                    variant="outline-success"
                                    type="submit" onClick={() => setAllBranchesModel(false)}>
                                    שלח
                                    </Button>
                            </Form>
                        </VerticallyCenteredModal>

                        <Button className='rounded-circle px-2 h-100 w-100'
                            variant={showAllBranchesModel ? 'primary' : 'outline-primary'}
                            onClick={() => {
                                props.changeFavoritesClicked();
                                setAllBranchesModel(true);
                            }}>
                            <FaRegBuilding size='18px' />
                        </Button>
                    </Col>
                    <Col className=' d-inline-flex p-0' >
                        {props.located &&
                            <VerticallyCenteredModal
                                show={showCloseBranchesModel}
                                onHide={() => setCloseBranchesModel(false)}
                                title='קרוב אליך'>
                                <Form noValidate
                                    validated={props.validatedBranchesByLocation}
                                    onSubmit={props.submitBranchesByLocation} >

                                    {props.closeBranches && Object.keys(props.closeBranches).map(chainName =>
                                        <ChainSection key={chainName} name={chainName.toLowerCase()}  >
                                            {props.closeBranches[chainName]}
                                        </ChainSection>

                                    )}

                                    <Button
                                        variant="outline-success"
                                        type="submit" onClick={() => setCloseBranchesModel(false)}>
                                        שלח
                                    </Button>
                                </Form>
                            </VerticallyCenteredModal>
                        }
                        <Button className='rounded-circle px-2 h-100 w-100'
                            variant={showCloseBranchesModel ? 'primary' : 'outline-primary'}

                            onClick={() => {
                                props.locationClicked();
                                setCloseBranchesModel(true);
                            }}>
                            <IoIosPin size='18px' />
                        </Button>
                    </Col>
                    <Col className=' d-inline-flex' >

                        <DropdownButton className='dropdown-width float-right'
                            style={{ width: '250px' }}
                            as={InputGroup}

                            key='down'
                            id='dropdown-button-drop-down'
                            drop='down'
                            variant="secondary"
                            title={props.loading && !props.located ? <Spinner size="sm" animation="border" /> : 'המועדפים שלך'}
                        >
                            {props.chosenBranches && Object.keys(props.chosenBranches).map(chainName => [
                                <Dropdown.Item className='p-1'
                                    key={chainName}>
                                    {chainName !== 'undefined' &&
                                        <ChainSection name={chainName.toLowerCase()} favorite branchClicked={props.branchClicked}>
                                            {props.chosenBranches[chainName]}
                                        </ChainSection>}
                                </Dropdown.Item>,
                                <Dropdown.Divider
                                    key={chainName + '_divider'} />])}
                        </DropdownButton>
                    </Col>
                </Form.Row>
            </Form>
        </Fragment>
    )
}
export default SummeryBar