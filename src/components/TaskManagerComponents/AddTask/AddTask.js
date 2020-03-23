import React from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

const AddTask = (props) => {
    
    return (
        <Form noValidate validated={props.validated} onSubmit={props.handleSubmit} >

            <Form.Group controlId="formTaskDescription">
                <Form.Label>Task</Form.Label>
                <Form.Control 
                placeholder="Task description"
                required />
                <Form.Control.Feedback type="invalid">
            Please provide a task.
          </Form.Control.Feedback>
            </Form.Group>

            <Form.Row>
                <Form.Group as={Col} controlId="formListType">
                    <Form.Label>List Type</Form.Label>
                    <Form.Control as="select">
                        {props.lists.map(list => <option>{list.name}</option>)}
                    </Form.Control>

                </Form.Group>

                <Form.Group as={Col} controlId="formOther">
                    <Form.Label>Other</Form.Label>
                    <Form.Control />
                    <Form.Text className="text-muted">
                    Add new list.
                    </Form.Text>
                </Form.Group>
               
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="formEvery">
                    <Form.Label>Every</Form.Label>
                    <Form.Control type='number' 
                    required/>
                    <Form.Control.Feedback type="invalid">
            Please provide a valid interval.
          </Form.Control.Feedback>
                    <Form.Control as="select">
                        <option>weeks</option>
                        <option>days</option>
                        <option>months</option>
                    </Form.Control>
                </Form.Group>
            </Form.Row>

            <Button variant="primary" type="submit">
                Add
        </Button>
        </Form>
    )
}

export default AddTask