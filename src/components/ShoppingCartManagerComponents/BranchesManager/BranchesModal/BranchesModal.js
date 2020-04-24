import React from 'react'
import VerticallyCenteredModal from '../../../UI/VerticallyCenteredModal/VerticallyCenteredModal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ChainSection from '../ChainSection/ChainSection';
import Spinner from 'react-bootstrap/Spinner';

const BranchesModal = props => (

    <VerticallyCenteredModal
        show={props.show}
        onHide={() => props.setModal(false)}
        title=':בחר סניפים מועדפים'>

        <Form noValidate
            onSubmit={props.submit}
        >
            {props.loading && <Spinner animation="border" key='spinner' variant='secondary' />}

            <Button className='float-right sticky-top'
                variant="outline-success"
                type="submit" onClick={() => props.setModal(false)}>
                שלח
            </Button>
            {props.optionalBranches && Object.keys(props.optionalBranches).map(chainName =>
                <ChainSection key={chainName}
                    name={chainName.toLowerCase()}
                >
                    {props.optionalBranches[chainName]}
                </ChainSection>
            )}
        </Form>

    </VerticallyCenteredModal>
)
export default BranchesModal