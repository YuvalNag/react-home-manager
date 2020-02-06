import React from 'react'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import { GoSearch } from "react-icons/go";

import FilteredList from './FilteredList/FilteredList'

const SearchProduct = (props) => {
    return (
        <Form.Group as={Row} className='m-0' >
            <Col xs="auto" className='p-0' >
                <Button >
                    <GoSearch />
                </Button>
            </Col>

            <Col className='p-0' >
                <FilteredList type="text" productInfo={props.productInfo} itemClicked={props.itemClicked} changed={props.changed} items={props.items} />
            </Col>
        </Form.Group>
    )
}

export default SearchProduct
