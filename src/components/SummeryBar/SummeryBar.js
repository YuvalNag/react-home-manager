import React, { Fragment } from 'react'
import Col from 'react-bootstrap/Col'

const summeryBar = props => (
    <Fragment>
        <Col style={{ color: 'aliceblue' }}>
            <div>lowest price</div>
        </Col>
        <Col style={{ color: 'aliceblue' }}>
            <div>preferd supermarket</div>
        </Col>
        <Col style={{ color: 'aliceblue' }} >
            <div>list of ubsents</div>
        </Col>
    </Fragment>
)

export default summeryBar