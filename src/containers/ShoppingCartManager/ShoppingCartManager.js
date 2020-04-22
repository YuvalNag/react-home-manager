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
import { groupBy, distanceOfStrings, deepClone } from '../../shared/utility'
import { FaCartArrowDown } from 'react-icons/fa'
import VerticallyCenteredModal from '../../components/UI/VerticallyCenteredModal/VerticallyCenteredModal'
import { Form, Button } from 'react-bootstrap'
import SearchProduct from '../../components/ShoppingCartManagerComponents/ProductSelector/SearchProduct/SearchProduct'


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
        loadingSearch: false,
        validatedBranchesByLocation: false,

    }

    changeFavoritesClickedHandler = () => {
        this.props.onTryFetchBranches()
    }
    locationClickedHandler = () => {
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
                        { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });
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
    submitBranchesByLocation = event => {
        const getFavoritesBranches = (chosenBranches) => {
            const favoritesBranches = {}
            for (const key in chosenBranches) {
                if (chosenBranches.hasOwnProperty(key)) {
                    const branch = chosenBranches[key];
                    if (branch.isFavorite) {
                        favoritesBranches[key] = branch
                    }

                }
            }
            return favoritesBranches
        }
        event.preventDefault();

        const form = event.currentTarget;
        const checkedBranches = Array.from(form.elements).filter(a => { if (a.checked) return a.id })

        if (checkedBranches.length === 0) {
            event.stopPropagation();
            // this.setState({ validatedBranchesByLocation: false });
        }
        else {
            this.setState({ validatedBranchesByLocation: true });

            const checkedBranchesIdSet = new Set(checkedBranches.reduce((branchesArray, curSwitch) => branchesArray.concat(curSwitch.checked && curSwitch.id), []));
            const updatedChosenBranches = getFavoritesBranches(this.props.chosenBranches)

            for (const key in this.props.closeBranches) {
                if (checkedBranchesIdSet.has(key)) {
                    const newBranch = deepClone(this.props.closeBranches[key])
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
        // event.preventDefault();
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

        // console.log(this.state.searchTerm);
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
        this.props.onUpdateCurrentBranchAndCart(branchId + '');
    }
    tryFetchItems = (searchTerm = '', branches = [], withPrices = false) => {
        const findUrl = (code) => {
            const urls = [`https://static.rami-levy.co.il/storage/images/${code}/small.jpg`,
            `https://m.pricez.co.il/ProductPictures/s/${code}.jpg`
            ]
            axios.all(urls).then(axios.spread((...responses) => {
                for (const response of responses) {
                    console.log(response);

                }
                // use/access the results 
            })).catch(errors => {
                // react on errors.
                console.log(errors);

            })
        }
        let cancel;
        if (searchTerm.trim() === '') {
            this.setState({ items: [], loadingSearch: false })
        }
        else {
            this.setState({ items: [], loadingSearch: true })

            console.log(searchTerm);
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
                    console.log(response);
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
        if (!this.props.isAuth) {
            this.props.history.push('/auth')
        }
        // else if (Object.entries(this.props.chosenBranches).length !== 0) {
        //     this.props.onTryFetchBranches(this.props.locationInfo, this.props.chosenBranches)
        // }
        // else if (Object.entries(this.props.chosenBranches).length === 0) {
        //     this.locationClickedHandler()
        // }
        else {
            this.props.onGetChosenBranchesAndCart()
        }
    }
    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props.isAuth && this.props.loadingType === 'INIT') {
    //         this.props.onGetChosenBranchesAndCart()
    //     }
    // }



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
        const loadingSearch = this.state.loadingSearch//this.props.loading && this.props.loadingType === loadingTypes.FETCH_ITEMS && this.props.loadingType !== actionTypes.FETCH_ITEMS_SUCCESS
        // const loadingSearch = ((this.props.loadingType === loadingTypes.FETCH_ITEMS && this.props.loadingType !== actionTypes.FETCH_ITEMS_SUCCESS) || this.props.loadingType === loadingTypes.FETCH_BRANCHES || this.props.loadingType === actionTypes.FETCH_Branches_SUCCESS || this.props.loadingType === 'INIT')
        const loadingCart = this.props.loading && this.props.loadingType === loadingTypes.FETCH_CART && this.props.loadingType !== actionTypes.FETCH_CART_PRODUCTS_SUCCESS
        // const loadingCart = this.props.currentBranch.cart === undefined || ((this.props.loadingType === loadingTypes.FETCH_CART && this.props.loadingType !== actionTypes.FETCH_CART_PRODUCTS_SUCCESS) || this.props.loadingType === loadingTypes.FETCH_BRANCHES || this.props.loadingType === actionTypes.FETCH_Branches_SUCCESS || this.props.loadingType === 'INIT')
        console.log('init', initialLoading);
        console.log('branches', loadingBranches);
        console.log('search', loadingSearch);
        console.log('cart', loadingCart);
        const currentBranch = Object.values(this.props.currentBranch)[0]
        return (

            [locationModel,
                initialLoading
                    ? <Spinner animation="border" key='spinner' variant='secondary' />
                    :
                    <Container key='container' className='mw-100' style={{ backgroundColor: 'currentColor' }} >
                        <Row>

                            <SearchProduct searchClicked={this.searchClickedHandler} changed={this.searchChangedHandler}
                                searchTerm={this.state.searchTerm} itemClicked={this.itemClickedHandler}
                                items={this.state.chosenItem ? [this.state.chosenItem] : this.state.items} />
                            {/* items={props.items.length <= 0 ? props.item ? [props.item] : [] : props.items} /> */}
                            {loadingSearch && <Spinner animation="border" variant='secondary' />}

                        </Row>
                        <Row  >
                            <ProductSelector
                                // item={this.state.chosenItem}
                                categories={Object.keys(this.props.categoriesInfo)}
                                // searchTerm={this.state.searchTerm}
                                quantity={this.state.quantity}
                                // items={this.state.items}
                                // searchChanged={this.searchChangedHandler}
                                // searchClicked={this.searchClickedHandler}
                                quantityChanged={this.quantityChangedHandler}
                                categoryClicked={this.categoryClickedHandler}
                                // itemClicked={this.itemClickedHandler}
                                productIsValid={this.state.quantity && this.state.chosenItem}
                                addToCartClicked={this.addToCartClickedHandler}
                                categoryChosen={this.state.categoryChosen}
                            // loadingSearch={loadingSearch}
                            />
                        </Row>

                        <Row
                            style={{ backgroundColor: 'currentColor' }}
                            className="h-25 ">
                            <SummeryBar
                                removeChosenBranch={this.removeChosenBranchHandler}
                                changeFavoritesClicked={this.changeFavoritesClickedHandler}
                                loading={loadingBranches}
                                chosenBranches={groupBy(Object.values(this.props.chosenBranches), 'chainName')}
                                closeBranches={groupBy(Object.values(this.props.closeBranches), 'chainName')}
                                locationClicked={this.locationClickedHandler}
                                located={this.props.locationInfo}



                                branchClicked={this.branchClickedHandler}
                                submitBranchesByLocation={this.submitBranchesByLocation}
                                validatedBranchesByLocation={this.state.validatedBranchesByLocation}

                            />
                        </Row>
                        {loadingCart ? <Spinner animation="border" variant='secondary' >
                            <FaCartArrowDown />
                        </Spinner> :
                            currentBranch && currentBranch.cart
                            &&
                            <Fragment >
                                <Row className='m-1' >
                                    <BranchSummery loadingCart={loadingCart}
                                        branch={currentBranch}
                                        deleteItemClicked={this.deleteItemClickedHandler}
                                    />
                                </Row>
                                <Row className="h-75 ">
                                    <CategoriesCards
                                        categories={this.buildCategoriesArray(currentBranch.cart.products)}
                                        deleteItemClicked={this.deleteItemClickedHandler} />
                                </Row>
                            </Fragment>

                        }
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
        closeBranches: state.shoppingCart.closeBranches,
        currentBranch: state.shoppingCart.currentBranch,

        loading: state.reqToServer.loading,
        loadingType: state.reqToServer.loadingType,

        isAuth: state.auth.token !== null,
        token: state.auth.token

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
        // onTryFetchItems: (searchTerm, branches, withPrices) => dispatch(actions.tryFetchItems(searchTerm, branches, withPrices)),
        onTryAddItemToCart: (product) => dispatch(actions.tryAddItemToCart(product)),
        onTryDeleteItemFromCart: (product) => dispatch(actions.tryDeleteItemFromCart(product)),
        onTryFetchCartProducts: () => dispatch(actions.tryFetchCartProducts()),
        onUpdateCurrentBranchAndCart: (branchId) => dispatch(actions.updateCurrentBranchAndCart(branchId)),
        onUpdateChosenBranchesAndCart: (newChosenBranches) => dispatch(actions.updateChosenBranchesAndCart(newChosenBranches)),
        onGetChosenBranchesAndCart: () => dispatch(actions.getChosenBranchesAndCart())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ShoppingCartManager, axios))
