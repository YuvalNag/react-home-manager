import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'

import AddToCartButton from '../../components/AddToCartButton/AddToCartButton'
import ProductSelector from '../../components/ProductSelector/ProductSelector'
import CategoriesCards from '../../components/CategoriesCards/CategoriesCards'
import SummeryBar from '../../components/SummeryBar/SummeryBar'


class ShoppingCartManager extends Component {

    state = {
        categoriesInfo: [
            { title: 'Bakery & Pastry', description: '', imageName: 'bakery.jpg' },
            { title: 'Fruits & Vegetables', description: '', imageName: 'fruits_vegetables.jpg' },
            { title: 'Dairy & Cheese', description: '', imageName: 'dairy.jpg' },
            { title: 'Meat', description: '', imageName: 'meat.jpg' },
            { title: 'Fish', description: '', imageName: 'fish.jpg' },
            { title: 'Drinks & Spirits', description: '', imageName: 'drinks.jpg' }]
    }
    render() {
        return (
            <Container >
                <Row xs="auto" style={{ backgroundColor: 'currentColor' }} >
                    <Col>
                        <ProductSelector />
                    </Col>
                    <Col xs="auto">
                        <AddToCartButton  />
                    </Col>

                </Row>
                <Row  style={{ backgroundColor: 'currentColor' }} className="h-25 ">
                    <SummeryBar />
                </Row>
                <Row style={{ backgroundColor: 'l ightgray' }} className="h-75 ">
                    <Col className='p-0'>
                        {this.state.categoriesInfo?<CategoriesCards categories={this.state.categoriesInfo} />:<Spinner  animation="border"/>}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ShoppingCartManager
