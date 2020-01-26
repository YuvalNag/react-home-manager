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
            { title: 'Health & Beauty', description: '', imageName: 'healty.jpg' },
            { title: 'Bakery & Pastry', description: '', imageName: 'bakery.jpg' },
            { title: 'Fruits & Vegetables', description: '', imageName: 'fruits_vegetables.jpg' },
            { title: 'Dairy & Cheese', description: '', imageName: 'dairy.jpg' },
            { title: 'Pantry', description: '', imageName: 'pantry.jpg' },
            { title: 'Meat', description: '', imageName: 'meat.jpg' },
            { title: 'Fish', description: '', imageName: 'fish.jpg' },
            { title: 'Drinks & Spirits', description: '', imageName: 'drinks.jpg' }],
        currentProduct: {
            productInfo: 'salmon loveFish 69',
            amount: 5
        }
    }
    currentProductChangedHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        let newProduct={...this.state.currentProduct}
        newProduct[name]=value
        this.setState({currentProduct: newProduct })
    }
    render() {
        return (
            <Container >
                <Row xs={8} style={{ backgroundColor: 'currentColor' }}  >
                    <Col>
                        <ProductSelector
                            {...this.state.currentProduct}
                            Changed={this.currentProductChangedHandler} />
                    </Col>
                    <Col xs={3}>
                        <AddToCartButton currentProduct={this.state.currentProduct} />
                    </Col>

                </Row>
                <Row style={{ backgroundColor: 'currentColor' }} className="h-25 ">
                    <SummeryBar />
                </Row>
                <Row style={{ backgroundColor: 'l ightgray' }} className="h-75 ">
                    <Col className='p-0'>
                        {this.state.categoriesInfo ? <CategoriesCards categories={this.state.categoriesInfo} /> : <Spinner animation="border" />}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ShoppingCartManager
