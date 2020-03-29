import React from 'react'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import { IoIosSearch,IoIosBarcode,IoIosList } from "react-icons/io";

import FilteredList from './FilteredList/FilteredList'

const SearchProduct = (props) => {
    return (
        <Form.Group as={Row} className='m-0' >
            <Col xs="auto" className='p-0' >
                <Button onClick={props.searchClicked}>
                    <IoIosSearch size='18px' />
                </Button>
            </Col>

            <Col className='p-0' >
                <FilteredList type="text" searchTerm={props.searchTerm} itemClicked={props.itemClicked} changed={props.changed} items={props.items} />
            </Col>
            <Col xs="auto" className=' mx-1 p-0' >
                <Button onClick={props.searchClicked}>
                    <IoIosBarcode size='18px'/>
                </Button>
            </Col>
            <Col xs="auto" className='p-0' >
                <Button onClick={props.listClicked}>
                    <IoIosList size='18px' />
                </Button>
            </Col>
        </Form.Group>
    )
}

export default SearchProduct
