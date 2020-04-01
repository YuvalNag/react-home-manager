import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import ProductSelector from '../../components/ShoppingCartManagerComponents/ProductSelector/ProductSelector'
import CategoriesCards from '../../components/ShoppingCartManagerComponents/CategoriesCards/CategoriesCards'
import SummeryBar from '../../components/ShoppingCartManagerComponents/SummeryBar/SummeryBar'
import BranchSummery from '../../components/ShoppingCartManagerComponents/BranchSummery/BranchSummery'

import * as actions from '../../store/actions/index'
import * as actionTypes from '../../store/actions/actionTypes'

import { loadingTypes } from '../../store/actions/shoppingCart'
import { CancelToken } from 'axios'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios/axios-shoppingCart'
import { groupBy } from '../../store/utility'
import { FaCartArrowDown } from 'react-icons/fa'


class ShoppingCartManager extends Component {

    state = {
        locationModalMessage: null,
        validatedLocation: false,
        searchTerm: '',
        quantity: 1,
        category: null,
        categoryChosen: false,
        chosenItem: null,
        timerId: null,
        showLackingModel: false,
        items: [],
        loadingSearch: false
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
                        // reject(new Error("Low Accuracy\nManually choose your location"))
                        reject(new Error("רמת דיוק נמוכה אנא כנס מיקום ידנית"))

                    }
                }, error =>
                    // reject(new Error('Enable your GPS position feature \nor manually choose your location')),
                    reject(new Error('אפשר מיקום או הכנס ידנית')),
                    { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });
            } else {
                //Geolocation is not supported by this browser
                // reject(new Error("Geolocation is not supported by this browser\nManually choose your location"))
                reject(new Error("מיקום אינו נתמך במכשירך אנא הכנס ידנית"))
            }
        })
    }
    locationClickedHandler = () => {
        this.getLocation()
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
        const city = form.elements.formCity.value;
        const street = form.elements.formAddress.value;
        this.props.onTryFetchBranches({ city: city, street: street })
        this.setState({ validatedLocation: true, locationModalMessage: null });
    };
    searchClickedHandler = () => {
        this.tryFetchItems(this.state.searchTerm, this.props.favoriteBranches, true)
    }
    searchChangedHandler = (event) => {
        const value = event.target.value;

        // console.log(this.state.searchTerm);
        clearInterval(this.state.timerId)
        const timerId = setTimeout(() => {
            if (this.state.searchTerm === value) {
                this.tryFetchItems(value, this.props.favoriteBranches, false)
            }
        }, 500);
        this.setState({ searchTerm: value, timerId: timerId })

    }
    quantityChangedHandler = (event) => {
        const quantity = parseInt(event.target.value);
        console.log(quantity);

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
                searchTerm: '',
                category: null,
                categoryChosen: false,
                items: []
            })
        }
    }
    deleteItemClickedHandler = (product) => {
        this.props.onTryDeleteItemFromCart(product)
    }
    branchClickedHandler = (branchId) => {
        this.props.onCurrentBranchChanged(branchId);
    }
    tryFetchItems = (searchTerm = '', branches = [], withPrices = false) => {

        let cancel;
        if (searchTerm.trim() === '') {
            this.setState({ items: [], loadingSearch: false })
        }
        else {
            this.setState({ items: [], loadingSearch: true })

            console.log(searchTerm);
            cancel && cancel()
            const queryParams = '?searchTerm=' + searchTerm + (branches && branches.map(brunch => ('&branchIds=' + brunch.id)).join(''));
            // const queryParams = '?searchTerm=' + searchTerm +'&branchIds=725&branchIds=718';
            axios.get('/supermarket/item' + queryParams + '&limit=' + 10 + '&price=' + withPrices, {
                cancelToken: new CancelToken(function executor(c) {
                    // An executor function receives a cancel function as a parameter
                    cancel = c;
                })
            })
                .then(response => {
                    console.log(response);
                    const products = (response && response.data.items) && response.data.items.map(item => {
                        return {
                            code: item.ItemCode,
                            name: item.ItemName,
                            ManufacturerName: item.ManufacturerName,
                            Branches: item.ItemBranches,
                            isWeighted: item.bIsWeighted && true,
                            price: item.mean,
                            url: 'https://static.rami-levy.co.il/storage/images/' + item.ItemCode + '/small.jpg'
                            // url: 'https://superpharmstorage.blob.core.windows.net/hybris/products/desktop/small/' + item.ItemCode + '.jpg'
                        }
                    });
                    this.setState({ items: products, loadingSearch: false })
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
        // if (!this.props.locationInfo) {
        //     this.locationClickedHandler()
        // }
        this.props.onTryFetchBranches(this.props.locationInfo, this.props.favoriteBranches)
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.favoriteBranches && (prevProps.favoriteBranches !== this.props.favoriteBranches)) {
            this.props.onTryFetchCartProducts(this.props.favoriteBranches)
        }
    }


    render() {
        console.log(this.props.loadingType);


        const loadingBranches = this.props.loading && ((this.props.loadingType === loadingTypes.FETCH_BRANCHES && this.props.loadingType !== actionTypes.FETCH_BRANCHES_SUCCESS))
        const loadingSearch = this.state.loadingSearch//this.props.loading && this.props.loadingType === loadingTypes.FETCH_ITEMS && this.props.loadingType !== actionTypes.FETCH_ITEMS_SUCCESS
        // const loadingSearch = ((this.props.loadingType === loadingTypes.FETCH_ITEMS && this.props.loadingType !== actionTypes.FETCH_ITEMS_SUCCESS) || this.props.loadingType === loadingTypes.FETCH_BRANCHES || this.props.loadingType === actionTypes.FETCH_Branches_SUCCESS || this.props.loadingType === 'INIT')
        const loadingCart = this.props.loading && this.props.loadingType === loadingTypes.FETCH_CART && this.props.loadingType !== actionTypes.FETCH_CART_PRODUCTS_SUCCESS
        // const loadingCart = this.props.currentBranch.cart === undefined || ((this.props.loadingType === loadingTypes.FETCH_CART && this.props.loadingType !== actionTypes.FETCH_CART_PRODUCTS_SUCCESS) || this.props.loadingType === loadingTypes.FETCH_BRANCHES || this.props.loadingType === actionTypes.FETCH_Branches_SUCCESS || this.props.loadingType === 'INIT')
        console.log('branches', loadingBranches);
        console.log('search', loadingSearch);
        console.log('cart', loadingCart);





        return (



            <Container className='mw-100' style={{ backgroundColor: 'currentColor' }} >
                <Row  >
                    <ProductSelector
                        item={this.state.chosenItem}
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
                        categoryChosen={this.state.categoryChosen}
                        loadingSearch={loadingSearch}
                    />
                </Row>

                <Row
                    style={{ backgroundColor: 'currentColor' }}
                    className="h-25 ">
                    <SummeryBar
                        loading={loadingBranches}
                        chains={this.props.chains}
                        favoriteBranches={groupBy(this.props.favoriteBranches, 'chainName')}
                        closeBranches={groupBy(this.props.closeBranches, 'chainName')}
                        locationClicked={this.locationClickedHandler}
                        located={this.props.locationInfo}
                        locationModalMessage={this.state.locationModalMessage}
                        submit={this.submitLocationHandler}
                        validatedLocation={this.state.validatedLocation}
                        hide={() => this.setState({ locationModalMessage: null })}
                        branchClicked={this.branchClickedHandler}
                    />
                </Row>
                {loadingCart ? <Spinner animation="border" variant='secondary' >
                    <FaCartArrowDown />
                </Spinner> :
                    this.props.currentBranch.cart
                    &&
                    <Fragment >
                        <Row className='m-1' >
                            <BranchSummery loadingCart={loadingCart}
                                branch={this.props.currentBranch}
                                deleteItemClicked={this.deleteItemClickedHandler}
                            />
                        </Row>
                        <Row className="h-75 ">
                            <CategoriesCards
                                categories={this.buildCategoriesArray(this.props.currentBranch.cart.products)}
                                deleteItemClicked={this.deleteItemClickedHandler} />
                        </Row>
                    </Fragment>

                }
            </Container>

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
        favoriteBranches: state.shoppingCart.favoriteBranches,
        closeBranches: state.shoppingCart.closeBranches,

        cart: state.shoppingCart.cart,
        chains: state.shoppingCart.chains,
        currentBranch: state.shoppingCart.currentBranch,


        loading: state.reqToServer.loading,
        loadingType: state.reqToServer.loadingType,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        // onSearchInputChanged: (event) => dispatch({ type: actionType.SEARCH_INPUT, searchText: event.target.value }),
        // onItemClicked: (index) => dispatch({ type: actionType.ITEM_CLICKED, itemIndex: index }),
        // onAmountInputChanged: (event) => dispatch({ type: actionType.AMOUNT_INPUT, amount: event.target.value }),
        // onAddToCartClicked: (index) => dispatch({ type: actionType.ADD_TO_CART, itemIndex: index }),
        // onLoadItems: () => dispatch(actions.loadItems()),
        onTryFetchBranches: (location, branches) => dispatch(actions.tryFetchBranches(location, branches)),
        onTryFetchItems: (searchTerm, branches, withPrices) => dispatch(actions.tryFetchItems(searchTerm, branches, withPrices)),
        onTryAddItemToCart: (product) => dispatch(actions.tryAddItemToCart(product)),
        onTryDeleteItemFromCart: (product) => dispatch(actions.tryDeleteItemFromCart(product)),
        onTryFetchCartProducts: (branches) => dispatch(actions.tryFetchCartProducts(branches)),
        onCurrentBranchChanged: (branchId) => dispatch(actions.currentBranchChanged(branchId))

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ShoppingCartManager, axios))
