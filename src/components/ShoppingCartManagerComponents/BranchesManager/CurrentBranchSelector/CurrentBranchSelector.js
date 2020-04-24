import React from 'react'

import ChainSection from '../ChainSection/ChainSection';
import { DropdownButton, Spinner, Dropdown } from 'react-bootstrap';

const CurrentBranchSelector = props => (

    <DropdownButton className='dropdown-width float-right'
        style={{ width: '250px' }}

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
                    <ChainSection name={chainName.toLowerCase()}
                        isChosenBranches
                        currentBranchId={props.currentBranchId}
                        branchClicked={props.branchClicked}
                        removeChosenBranch={props.removeChosenBranch}>
                        {props.chosenBranches[chainName]}
                    </ChainSection>}
            </Dropdown.Item>,
            <Dropdown.Divider
                key={chainName + '_divider'} />])}
    </DropdownButton>
)
export default CurrentBranchSelector