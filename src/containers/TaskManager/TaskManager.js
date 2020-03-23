import React, { Component } from 'react'
import ToDoList from '../../components/TaskManagerComponents/ToDoList/ToDoList'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { FaPlus } from 'react-icons/fa'
import AddTask from '../../components/TaskManagerComponents/AddTask/AddTask'
import VerticallyCenteredModal from '../../components/UI/VerticallyCenteredModal/VerticallyCenteredModal'

class TaskManager extends Component {
    state = {
        lists: [
            { name: 'General' },
            { name: 'Yuval' },
            { name: 'Moriya' },
            { name: 'Kids' }
        ],
        showModal: false,
        validated: false
    }
    handleSubmit = event => {
        const form = event.currentTarget;
        console.log((new FormData (form)).getAll); 
        
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.setState({validated:true});
    };

    render() {
        // let style = {
        //     backgroundColor: 'currentColor', display: 'flex',
        //     flexFlow: 'row'
        // }
        return (
            <div style={{ backgroundColor: 'currentColor', alignItems: 'center', width: '100%', height: '100%' }}>
                <VerticallyCenteredModal show={this.state.showModal} onHide={() => { this.setState({ showModal: false }) }} >
                    <AddTask lists={this.state.lists} validated={this.state.validated} handleSubmit={this.handleSubmit} />
                </VerticallyCenteredModal>
                <Button style={{
                    position: 'fixed',
                    zIndex: 1999,
                    right: '5%',
                    marginTop: '1%',
                    backgroundColor: 'forestgreen',
                    borderColor: 'darkgreen',
                    borderStyle: 'solid',
                    borderRadius: '50%',
                    borderWidth: 'medium',
                    height: '50px',
                    width: '50px',
                    // fontSize: '25px',
                    padding: '0',
                    cursor: 'pointer',
                }}
                    onClick={() => { this.setState({ showModal: true }) }}
                    disabled={this.state.showModal}
                ><FaPlus /></Button>
                <Row>

                    {this.state.lists.map((list, i) => {
                        return <ToDoList key={list.name} name={list.name} />
                    })}
                </Row>
            </div>
        )
    }
}

export default TaskManager
