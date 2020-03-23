import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'

import MemberInfo from './MemberInfo/MemberInfo'
import ToDoItem from './ToDoItem/ToDoItem'
import Col from 'react-bootstrap/Col'
const ToDoList = (props) => {
    // const wideScreen = window.matchMedia("(min-width: 700px)").matches
    return (
        <Col>
            <Card bg='secondary' className='mx-1 mb-1 w-100' style={{ minWidth: '200px' }} >
                <MemberInfo name={props.name} />
                {/* <ProgressInfo doneCounter={props.doneCounter} />*/}
                <ListGroup className='px-2 pb-1'>
                    <ListGroup.Item className='p-1 m-1' variant="success"><ToDoItem>שטוף כלים</ToDoItem></ListGroup.Item>
                    <ListGroup.Item className='p-1 m-1' variant="danger"><ToDoItem>לתלות נדנדה </ToDoItem></ListGroup.Item>
                    <ListGroup.Item className='p-1 m-1' variant="warning"><ToDoItem>לשתוף סלון-מטבח</ToDoItem></ListGroup.Item>
                    <ListGroup.Item className='p-1 m-1' variant="info"><ToDoItem>לרקוד הורה</ToDoItem></ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>

    )
}

export default ToDoList
