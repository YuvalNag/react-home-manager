import React from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

const ToDoItem = (props) => {
    return (
        <div style={{    display: 'flex',
            flexFlow: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'}}>
            <DropdownButton id="dropdown-basic-button" title="" style={{backgroundColor: 'transparent',
    color: 'black',
    border: 'none'
}}>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </DropdownButton>
            {props.children}
            <input type='checkbox' style={{transform: 'scale(1.5)'}}/>
        </div>
    )
}

export default ToDoItem
