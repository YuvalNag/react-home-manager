import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProductSelector from '../../components/ShoppingCartManagerComponents/ProductSelector/ProductSelector'
import CartView from '../../components/ShoppingCartManagerComponents/CartView/CartView'
import BranchesManager from '../../components/ShoppingCartManagerComponents/BranchesManager/BranchesManager'

import * as actions from '../../store/actions/index'
import * as actionTypes from '../../store/actions/actionTypes'

import { loadingTypes } from '../../store/actions/shoppingCart'
import { CancelToken } from 'axios'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios/axios-shoppingCart'
import { groupBy, distanceOfStrings, deepClone } from '../../shared/utility'
import { FaCartArrowDown } from 'react-icons/fa'
import VerticallyCenteredModal from '../../components/UI/VerticallyCenteredModal/VerticallyCenteredModal'
import { Form, Button, Spinner, Container, Row, Tabs, Tab } from 'react-bootstrap'
import MyCart from './MyCart/MyCart'
import SearchSection from './SearchSection/SearchSection'


class ShoppingCartManager extends Component {

    state = {
        visibleTab: 0,

        locationModalMessage: null,
        validatedLocation: false,
        searchTerm: '',
        quantity: 1,
        chosenCategory: 'מחלקה',
        chosenItem: null,
        timerId: null,
        showLackingModel: false,
        items: [],
        loadingSearch: false,
        validatedUpdateChosenBranches: false,

    }

    getAllAvailableBranchesHandler = () => {
        this.props.onTryFetchBranches()
    }
    getClosestAvailableBranchesHandler = () => {
        const getLocation = () => {
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
                            // reject(new Error("Low Accuracy\nManually choose your location"))
                            reject(new Error("רמת דיוק נמוכה אנא כנס מיקום ידנית"))

                        }
                    }, error =>
                        // reject(new Error('Enable your GPS position feature \nor manually choose your location')),
                        reject(new Error('אפשר מיקום או הכנס ידנית')),
                        { maximumAge: 30 * 1000, timeout: 30 * 1000, enableHighAccuracy: true });
                } else {
                    //Geolocation is not supported by this browser
                    // reject(new Error("Geolocation is not supported by this browser\nManually choose your location"))
                    reject(new Error("מיקום אינו נתמך במכשירך אנא הכנס ידנית"))
                }
            })
        }
        getLocation()
            .then(location => this.props.onTryFetchBranches(location))
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
        else {

            const city = form.elements.formCity.value;
            const street = form.elements.formAddress.value;
            this.props.onTryFetchBranches({ city: city, street: street })
            this.setState({ validatedLocation: true, locationModalMessage: null });
        }
    };
    submitUpdateChosenBranches = event => {

        event.preventDefault();

        const form = event.currentTarget;
        const checkedBranches = Array.from(form.elements).filter(a => a.checked)

        if (checkedBranches.length === 0) {
            event.stopPropagation();
            // this.setState({ validatedUpdateChosenBranches: false });
        }
        else {
            this.setState({ validatedUpdateChosenBranches: true });

            const checkedBranchesIdSet = new Set(checkedBranches.reduce((branchesArray, curSwitch) => branchesArray.concat(curSwitch.checked && curSwitch.id), []));
            const updatedChosenBranches = deepClone(this.props.chosenBranches)

            for (const key in this.props.optionalBranches) {
                if (checkedBranchesIdSet.has(key)) {
                    const newBranch = deepClone(this.props.optionalBranches[key])
                    newBranch.isChosen = true;
                    updatedChosenBranches[key] = newBranch;
                }
            }
            this.props.onUpdateChosenBranchesAndCart(updatedChosenBranches)
        }
    };
    removeChosenBranchHandler = branchId => {
        const alternativeBranchId = () => {
            let newBranchId;
            let i = 0;
            do {
                newBranchId = Object.keys(this.props.chosenBranches)[i]
            } while (newBranchId === branchId + '' && i < this.props.chosenBranches.length);
            if (newBranchId === branchId + '') return;
            else return newBranchId;
        }
        if (this.props.currentBranch[branchId]) {
            this.props.onUpdateCurrentBranchAndCart(alternativeBranchId())
        }
        const updatedChosenBranches = { ...this.props.chosenBranches }
        delete updatedChosenBranches[branchId]
        this.props.onUpdateChosenBranchesAndCart(updatedChosenBranches)
    };
    searchClickedHandler = () => {
        this.tryFetchItems(this.state.searchTerm, this.props.chosenBranches, true)
    }
    searchChangedHandler = (event) => {
        const value = event.target.value;

        clearInterval(this.state.timerId)
        const timerId = setTimeout(() => {
            if (this.state.searchTerm === value) {
                this.tryFetchItems(value, this.props.chosenBranches, true)
            }
        }, 500);
        this.setState({ searchTerm: value, timerId: timerId })

    }
    quantityChangedHandler = (event) => {
        const quantity = parseInt(event.target.value);

        this.setState({
            quantity: quantity
        })
    }
    itemClickedHandler = (item) => {
        if (!item.isClicked) {
            const chosenItem = { ...item, isClicked: true };
            this.setState({
                chosenItem: chosenItem
            });
        }
        else {
            this.setState({
                chosenItem: null
            });
        }

    }
    categoryClickedHandler = (event) => {
        this.setState({ chosenCategory: event.target.innerText });
    }
    addToCartClickedHandler = () => {
        if (this.state.chosenCategory !== 'מחלקה') {
            this.props.onTryAddItemToCart({
                item: this.state.chosenItem,
                quantity: this.state.quantity,
                category: this.state.chosenCategory
            })

            this.setState({
                quantity: 1,
                chosenItem: null,
                searchTerm: '',
                chosenCategory: 'מחלקה',
                items: []
            })
        }
    }
    deleteItemClickedHandler = (product) => {
        this.props.onTryDeleteItemFromCart(product)
    }
    branchClickedHandler = (branchId) => {
        this.props.onUpdateCurrentBranchAndCart(branchId + '');
    }
    tryFetchItems = (searchTerm = '', branches = [], withPrices = false) => {
        let cancel;
        if (searchTerm.trim() === '') {
            this.setState({ items: [], loadingSearch: false })
        }
        else {
            this.setState({ items: [], loadingSearch: true })

            cancel && cancel()
            const queryParams = '?searchTerm=' + searchTerm + (branches && Object.keys(branches).map(branchId => ('&branchIds=' + branchId)).join(''));
            // const queryParams = '?searchTerm=' + searchTerm +'&branchIds=725&branchIds=718';
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.token}`
            }
            axios.get('/supermarket/item' + queryParams + '&limit=' + 50 + '&price=' + withPrices, {
                headers: headers,

                cancelToken: new CancelToken(function executor(c) {
                    // An executor function receives a cancel function as a parameter
                    cancel = c;
                })
            })
                .then(response => {
                    const products = (response && response.data.items) && response.data.items.map(item => {
                        const prices = item.ItemBranches.map(branch => ({ chainName: this.props.chosenBranches[branch.BranchId].chainName, price: branch.ItemPrice.toFixed(2), promotions: branch.Promotions }))
                        const uniquePrices = Array.from(new Set(prices.map(a => a.price)))
                            .map(price => {
                                return prices.find(a => a.price === price)
                            })
                        return {
                            match: distanceOfStrings(searchTerm, item.ItemName),
                            code: item.ItemCode,
                            name: item.ItemName,
                            isClicked: false,
                            manufacturerName: item.ManufacturerName || '',
                            isWeighted: item.bIsWeighted && true,
                            avgPrice: item.mean.toFixed(2) || 'Not Found',
                            prices: uniquePrices.sort((a, b) => -1 * (a.price - b.price)),
                            url: `https://static.rami-levy.co.il/storage/images/${item.ItemCode}/small.jpg`

                            // url: 'https://superpharmstorage.blob.core.windows.net/hybris/products/desktop/small/' + item.ItemCode + '.jpg'
                        }
                    });

                    this.setState({ items: products.sort((a, b) => b.match - a.match), loadingSearch: false })
                })
                .catch(error => {

                    this.setState({ items: [], loadingSearch: false })

                })

        }
    }

    buildCategoriesArray = (products) => {
        const productsGroupByCategory = groupBy(products, 'category');
        const categoriesArray = [];
        for (const category in productsGroupByCategory) {
            productsGroupByCategory[category].imageName = this.props.categoriesInfo[category].imageName
            categoriesArray.push({ name: category, imageName: this.props.categoriesInfo[category].imageName, products: productsGroupByCategory[category] })
        }

        return categoriesArray
    }
    componentDidMount() {
        if (this.props.isAuth) {
            this.props.onGetChosenBranchesAndCart()
        }
        else {
            this.props.history.push('/auth')
        }
    }



    render() {
        const locationModel = (<VerticallyCenteredModal key='locationModel'
            show={this.state.locationModalMessage !== null}
            onHide={() => this.setState({ locationModalMessage: null })}
            title={this.state.locationModalMessage} >
            <Form
                noValidate
                validated={this.state.validatedLocation}
                onSubmit={this.submitLocationHandler} >

                <Form.Group
                    controlId="formCity">
                    <Form.Label>עיר</Form.Label>
                    <Form.Control
                        placeholder="עיר"
                        required />
                    <Form.Control.Feedback
                        type="invalid">
                        הכנס עיר
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                    controlId="formAddress">
                    <Form.Label>רחוב ומספר</Form.Label>
                    <Form.Control
                        placeholder="רחוב ומספר"
                        required />
                    <Form.Control.Feedback type="invalid">
                        הכנס רחוב ומספר
                    </Form.Control.Feedback>
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit">
                    שלח
                    </Button>

            </Form>
        </VerticallyCenteredModal >)
        const initialLoading = this.props.loadingType === 'INIT'
        const loadingBranches = this.props.loading && ((this.props.loadingType === loadingTypes.FETCH_BRANCHES && this.props.loadingType !== actionTypes.FETCH_BRANCHES_SUCCESS))
        const loadingSearch = this.state.loadingSearch
        const loadingCart = this.props.loading && this.props.loadingType === loadingTypes.FETCH_CART && this.props.loadingType !== actionTypes.FETCH_CART_PRODUCTS_SUCCESS

        const currentBranch = Object.values(this.props.currentBranch)[0]
        return (

            [locationModel,
                initialLoading
                    ? <Spinner animation="border" key='spinner' variant='secondary' />
                    :
                    <Container key='container' className='mw-100' style={{ backgroundColor: 'currentColor' }} >
                        <Row className="h-25 ">
                            <BranchesManager
                                removeChosenBranch={this.removeChosenBranchHandler}
                                getAllAvailableBranches={this.getAllAvailableBranchesHandler}
                                loading={loadingBranches}
                                chosenBranches={this.props.chosenBranches}
                                // chosenBranches={groupBy(Object.values(this.props.chosenBranches), 'chainName')}
                                optionalBranches={groupBy(Object.values(this.props.optionalBranches), 'chainName')}
                                getClosestAvailableBranches={this.getClosestAvailableBranchesHandler}
                                located={this.props.locationInfo}

                                currentBranchId={currentBranch && currentBranch.id}

                                branchClicked={this.branchClickedHandler}
                                submitUpdateChosenBranches={this.submitUpdateChosenBranches}
                                validatedUpdateChosenBranches={this.state.validatedUpdateChosenBranches}

                            />
                        </Row>
                        <Row className="h-75 ">
                            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                                <Tab eventKey="addProducts" title="הוספת מוצרים">
                                    <SearchSection
                                        chosenItem={this.state.chosenItem}
                                        categories={Object.keys(this.props.categoriesInfo)}
                                        searchTerm={this.state.searchTerm}
                                        quantity={this.state.quantity}
                                        items={this.state.items}
                                        searchChanged={this.searchChangedHandler}
                                        searchClicked={this.searchClickedHandler}
                                        quantityChanged={this.quantityChangedHandler}
                                        categoryClicked={this.categoryClickedHandler}
                                        itemClicked={this.itemClickedHandler}
                                        productIsValid={this.state.quantity && this.state.chosenItem}
                                        addToCartClicked={this.addToCartClickedHandler}
                                        chosenCategory={this.state.chosenCategory}
                                        loadingSearch={loadingSearch} />
                                </Tab>
                                <Tab eventKey="myCart" title="העגלה שלי">
                                    {loadingCart ? <Spinner animation="border" variant='secondary' >
                                        <FaCartArrowDown />
                                    </Spinner> :
                                        currentBranch && currentBranch.cart
                                        &&
                                        <MyCart
                                            currentBranch={currentBranch}
                                            loadingCart={loadingCart}
                                            deleteItemClicked={this.deleteItemClickedHandler}
                                            categories={this.buildCategoriesArray(currentBranch.cart.products)}
                                        />
                                    }
                                </Tab>
                            </Tabs>
                        </Row>
                    </Container>
            ]
        )
    }
}
const mapStateToProps = state => {
    return {
        categoriesInfo: state.shoppingCart.categoriesInfo,
        locationInfo: state.shoppingCart.location,
        chosenBranches: state.shoppingCart.chosenBranches,
        optionalBranches: state.shoppingCart.optionalBranches,
        currentBranch: state.shoppingCart.currentBranch,

        loading: state.reqToServer.loading,
        loadingType: state.reqToServer.loadingType,

        isAuth: state.auth.token !== null,
        token: state.auth.token

    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryFetchBranches: (location, branches) => dispatch(actions.tryFetchBranches(location, branches)),
        onTryAddItemToCart: (product) => dispatch(actions.tryAddItemToCart(product)),
        onTryDeleteItemFromCart: (product) => dispatch(actions.tryDeleteItemFromCart(product)),
        onTryFetchCartProducts: () => dispatch(actions.tryFetchCartProducts()),
        onUpdateCurrentBranchAndCart: (branchId) => dispatch(actions.updateCurrentBranchAndCart(branchId)),
        onUpdateChosenBranchesAndCart: (newChosenBranches) => dispatch(actions.updateChosenBranchesAndCart(newChosenBranches)),
        onGetChosenBranchesAndCart: () => dispatch(actions.getChosenBranchesAndCart())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ShoppingCartManager, axios))
