import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import ProductSelector from '../../components/ShoppingCartManagerComponents/ProductSelector/ProductSelector'
import CategoriesCards from '../../components/ShoppingCartManagerComponents/CategoriesCards/CategoriesCards'
import SummeryBar from '../../components/ShoppingCartManagerComponents/SummeryBar/SummeryBar'


import * as actions from '../../store/actions/index'
import VerticallyCenteredModal from '../../components/UI/VerticallyCenteredModal/VerticallyCenteredModal'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios/axios-shoppingCart'


class ShoppingCartManager extends Component {

    state = {
        locationModalMessage: null,
        validatedLocation: false,
        searchTerm: '',
        quantity: 1,
        category: null,
        categoryChosen: false,
        chosenItem: null
    }

    getLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const accuracy = position.coords.accuracy;
                    if (accuracy <= 1000) {
                        resolve({ lat: latitude, lon: longitude })
                    }
                    else {
                        reject(new Error("Low Accuracy\nManually choose your location"))
                    }
                }, error => reject(new Error('Enable your GPS position feature \nor manually choose your location')), { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });
            } else {
                //Geolocation is not supported by this browser
                reject(new Error("Geolocation is not supported by this browser\nManually choose your location"))
            }
        })
    }
    locationClickedHandler = () => {
        this.getLocation()
            .then(location => this.props.onTryFetchBrunches(location))
            .catch(error => {
                console.error(error.message);
                this.setState({ locationModalMessage: error.message })

            });
    }
    submitLocationHandler = event => {
        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        const city = form.elements.formCity.value;
        const street = form.elements.formAddress.value;
        this.props.onTryFetchBrunches({ city: city, street: street })
        this.setState({ validatedLocation: true, locationModalMessage: null });
    };
    searchChangedHandler = (event) => {
        const value = event.target.value;
        const key = value.charAt(value.length - 1)
        this.setState({ searchTerm: value })

        // if (key === ' ') {
            console.log(this.state.searchTerm);

            this.props.onTryFetchItems(value, this.props.brunches)

        // }

    }
    quantityChangedHandler = (event) => {
        const quantity = parseInt(event.target.value);
        console.log(quantity);

        this.setState({
            quantity: quantity
        })
    }
    itemClickedHandler = (item) => {
        this.props.onTryFetchItems()
        this.setState({
            chosenItem: item
        });
    }
    categoryClickedHandler = (event) => {
        this.setState({ category: event.target.innerText, categoryChosen: true });
    }
    addToCartClickedHandler = () => {
        if (this.state.categoryChosen) {
            this.props.onTryAddItemToCart({
                item: this.state.chosenItem,
                quantity: this.state.quantity,
                category: this.state.category
            })
            console.log(this.state.chosenItem);

            this.setState({
                quantity: 1,
                chosenItem: null,
                searchTerm: ' ',
                category: null,
                categoryChosen: false
            })
        }
    }
    deleteItemClickedHandler = (product) => {
        this.props.onTryDeleteItemFromCart(product)
    }

    findIntersections = (object, arr) => {
        const res = {};
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                res[key] = {};
                res[key].products = object[key];
            }
        }
        arr.forEach(element => {
            if (res.hasOwnProperty(element.title)) {
                res[element.title].imageName = element.imageName
            }
        });
        console.log(res);

        return res;
    }
    componentDidMount() {
        if (!this.props.locationInfo) {
            this.locationClickedHandler()
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.brunches && (prevProps.brunches !== this.props.brunches)) {
            this.props.onTryFetchCartProducts(this.props.brunches)
        }
    }


    render() {
        return (
            <Fragment>
                {/* <VerticallyCenteredModal
                    show={this.state.locationModalMessage != null}
                    onHide={() => this.setState({ locationModalMessage: null })}
                    title={this.state.locationModalMessage}> */}

                {this.state.locationModalMessage != null ?
                    <Fragment>
                        <h3>{this.state.locationModalMessage}</h3>

                        <Form
                            noValidate
                            validated={this.state.validatedLocation}
                            onSubmit={this.submitLocationHandler} >

                            <Form.Group
                                controlId="formCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    placeholder="Enter your city."
                                    required />
                                <Form.Control.Feedback
                                    type="invalid">
                                    Please provide a city.
                        </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                controlId="formAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    placeholder="Enter your address."
                                    required />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a address.
                        </Form.Control.Feedback>
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit">
                                SUBMIT
                        </Button>

                        </Form>
                        <br />
                        <Spinner animation="border" />
                    </Fragment>
                    :

                    < Container className='mw-100'>
                        <Row
                            style={{ backgroundColor: 'currentColor' }}  >
                            <Col>
                                <ProductSelector
                                    categories={this.props.categoriesInfo.map(category => category.title)}
                                    searchTerm={this.state.searchTerm}
                                    quantity={this.state.quantity}
                                    items={this.props.filteredItems}
                                    searchChanged={this.searchChangedHandler}
                                    quantityChanged={this.quantityChangedHandler}
                                    categoryClicked={this.categoryClickedHandler}
                                    itemClicked={this.itemClickedHandler}
                                    productIsValid={this.state.quantity && this.state.chosenItem}
                                    addToCartClicked={this.addToCartClickedHandler}
                                    categoryChosen={this.state.categoryChosen}
                                />
                            </Col>
                        </Row>
                        <Row
                            style={{ backgroundColor: 'currentColor' }}
                            className="h-25 ">
                            <SummeryBar
                                brunches={this.props.brunches}
                                price={this.props.cart.totalPrice}
                                locationClicked={this.locationClickedHandler}
                            />
                        </Row>
                        <Row
                            style={{ backgroundColor: 'lightgray' }}
                            className="h-75 ">
                            <Col className='p-0'>
                                {this.props.categoriesInfo ? <CategoriesCards
                                    categories={this.findIntersections(this.props.cart.products, this.props.categoriesInfo)}
                                    deleteItemClicked={this.deleteItemClickedHandler} />
                                    :
                                    <Spinner animation="border" />}
                            </Col>
                        </Row>
                    </Container>
                }</Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        categoriesInfo: state.shoppingCart.categoriesInfo,
        items: state.shoppingCart.items,
        filteredItems: state.shoppingCart.filteredItems,
        chosenProduct: state.shoppingCart.chosenProduct,
        locationInfo: state.shoppingCart.location,
        brunches: state.shoppingCart.brunches,
        cart: state.shoppingCart.cart
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // onSearchInputChanged: (event) => dispatch({ type: actionType.SEARCH_INPUT, searchText: event.target.value }),
        // onItemClicked: (index) => dispatch({ type: actionType.ITEM_CLICKED, itemIndex: index }),
        // onAmountInputChanged: (event) => dispatch({ type: actionType.AMOUNT_INPUT, amount: event.target.value }),
        // onAddToCartClicked: (index) => dispatch({ type: actionType.ADD_TO_CART, itemIndex: index }),
        // onLoadItems: () => dispatch(actions.loadItems()),
        onTryFetchBrunches: (location) => dispatch(actions.tryFetchBrunches(location)),
        onTryFetchItems: (searchTerm, brunches) => dispatch(actions.tryFetchItems(searchTerm, brunches)),
        onTryAddItemToCart: (product) => dispatch(actions.tryAddItemToCart(product)),
        onTryDeleteItemFromCart: (product) => dispatch(actions.tryDeleteItemFromCart(product)),
        onTryFetchCartProducts: (brunches) => dispatch(actions.tryFetchCartProducts(brunches)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ShoppingCartManager, axios))
