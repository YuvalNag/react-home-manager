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


const SummeryBar = props => {
    const [showCloseBranchesModel, setCloseBranchesModel] = useState(false)
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

                    <Col className=' d-inline-flex' >

                        <DropdownButton className='w-100'
                            as={InputGroup}
                            key='down'
                            id='dropdown-button-drop-down'
                            drop='down'
                            variant="secondary"
                            title={props.loading && !props.located ? <Spinner size="sm" animation="border" /> : 'המועדפים שלך'}
                        >
                            {Object.keys(props.favoriteBranches).map(chainName => [
                                <Dropdown.Item className='p-1'
                                    key={chainName}>
                                    {chainName !== 'undefined' &&
                                        <ChainSection name={chainName.toLowerCase()} favorite branchClicked={props.branchClicked}>
                                            {props.favoriteBranches[chainName]}
                                        </ChainSection>}
                                </Dropdown.Item>,
                                <Dropdown.Divider
                                    key={chainName + '_divider'} />])}
                        </DropdownButton>
                        <Button>
                            <IoIosSettings size='18px' />
                        </Button>
                    </Col>
                    <Col className=' d-inline-flex' >
                        {props.located &&
                            <VerticallyCenteredModal
                                show={showCloseBranchesModel}
                                onHide={() => setCloseBranchesModel(false)}
                                title='קרוב אליך'>
                                <Form noValidate
                                    validated={props.validatedBranchesByLocation}
                                    onSubmit={props.submitBranchesByLocation} >

                                    {Object.keys(props.closeBranches).map(chainName =>
                                        <ChainSection key={chainName} name={chainName.toLowerCase()}  >
                                            {props.closeBranches[chainName]}
                                        </ChainSection>

                                    )}

                                    <Button
                                        variant="primary"
                                        type="submit" onClick={() => setCloseBranchesModel(false)}>
                                        שלח
                                    </Button>
                                </Form>
                            </VerticallyCenteredModal>
                        }
                        <DropdownButton className='w-100'
                            as={InputGroup}
                            key='down'
                            id='dropdown-button-drop-down'
                            drop='down'
                            alignRight
                            variant="secondary"
                            title={props.located && props.loading ? <Spinner size="sm" animation="border" /> : 'קרוב אליך'}
                        >
                            {Object.keys(props.chosenBranches).map(chainName => [
                                <Dropdown.Item className='p-1'
                                    key={chainName} >
                                    {chainName !== 'undefined' &&
                                        <ChainSection name={chainName.toLowerCase()} favorite branchClicked={props.branchClicked}>
                                            {props.chosenBranches[chainName]}
                                        </ChainSection>}
                                </Dropdown.Item>,
                                <Dropdown.Divider
                                    key={chainName + '_divider'} />])}
                        </DropdownButton>
                        <Button
                            onClick={() => {
                                props.locationClicked();
                                setCloseBranchesModel(true);
                            }}>
                            <IoIosPin size='18px' />
                        </Button>
                    </Col>

                </Form.Row>
            </Form>
        </Fragment>
    )
}
export default SummeryBar