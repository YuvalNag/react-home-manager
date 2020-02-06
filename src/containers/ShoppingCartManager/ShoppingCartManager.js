import React, { Component } from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'

import ProductSelector from '../../components/ProductSelector/ProductSelector'
import CategoriesCards from '../../components/CategoriesCards/CategoriesCards'
import SummeryBar from '../../components/SummeryBar/SummeryBar'

import * as actionType from '../../store/actions'

class ShoppingCartManager extends Component {

    state = {
        orderFrom: {
            product: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Search for...'
                },
                value: '',
                touched: false,
                valid: true,
                validationRules: {
                    required: true
                },
                validationError: null
            },
            amount: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeholder: '#Amount'
                },
                value: '',
                touched: false,
                valid: true,
                validationRules: {
                    required: true,
                    between: [2, 20]
                },
                validationError: null
            }
        },
        validProduct: false
    }
    validator = (items, amount, productInfo) => {
        const validProductInfo = items.findIndex(item => item === productInfo.replace(/ /g, '_')) !== -1
        const validAmount = amount > 0
        return validProductInfo && validAmount
    }

    componentDidMount() {
        //fatch list from backend
        //this.setState({ items: this.props.items });

    }
    componentDidUpdate(prevProps, prevState) {
        const inputIsValid = this.validator(this.props.items, this.props.chosenProduct.amount, this.props.chosenProduct.productInfo)
        if (this.state.validProduct !== inputIsValid) {
            this.setState({ validProduct: inputIsValid })
        }
    }


    render() {
        return (
            <Container className='mw-100'>
                <Row style={{ backgroundColor: 'currentColor' }}  >
                    <Col>
                        <ProductSelector
                            {...this.props.chosenProduct}
                            items={this.props.filteredItems}
                            searchChanged={this.props.onSearchInputChanged}
                            amountChanged={this.props.onAmountInputChanged}
                            itemClicked={this.props.onItemClicked}
                            valid={this.state.validProduct} />
                    </Col>
                </Row>
                <Row style={{ backgroundColor: 'currentColor' }} className="h-25 ">
                    <SummeryBar />
                </Row>
                <Row style={{ backgroundColor: 'lightgray' }} className="h-75 ">
                    <Col className='p-0'>
                        {this.props.categoriesInfo ? <CategoriesCards categories={this.props.categoriesInfo} /> : <Spinner animation="border" />}
                    </Col>
                </Row>
            </Container>
        )
    }
}
const mapStateToProps = state => {
    return {
        categoriesInfo: state.categoriesInfo,
        items: state.items,
        filteredItems: state.filteredItems,
        chosenProduct: state.chosenProduct
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSearchInputChanged: (event) => dispatch({ type: actionType.SEARCH_INPUT, searchText: event.target.value }),
        onItemClicked: (index) => dispatch({ type: actionType.ITEM_CLICKED, itemIndex: index }),
        onAmountInputChanged: (event) => dispatch({ type: actionType.AMOUNT_INPUT, amount: event.target.value }),
        onAddToCartClicked: (index) => dispatch({ type: actionType.ADD_TO_CART, itemIndex: index }),



    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCartManager)
