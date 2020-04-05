import React, { Component, Fragment } from 'react'
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';


import { connect } from 'react-redux'


import * as actions from '../../store/actions/index'
import * as actionTypes from '../../store/actions/actionTypes'

import { loadingTypes } from '../../store/actions/shoppingCart'
import { CancelToken } from 'axios'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios/axios-shoppingCart'
import { groupBy, distanceOfStrings } from '../../store/utility'



class ShoppingCartManager extends Component {

    state = {
        visibleTab: 0,

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
        validatedBranchesByLocation: false
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
        else {

            const city = form.elements.formCity.value;
            const street = form.elements.formAddress.value;
            this.props.onTryFetchBranches({ city: city, street: street })
            this.setState({ validatedLocation: true, locationModalMessage: null });
        }
    };
    submitBranchesByLocation = event => {
        event.preventDefault();

        const form = event.currentTarget;
        const checkedBranches = Array.from(form.elements).filter(a => { if (a.checked) return a.id })

        if (checkedBranches.length > 5) {
            event.stopPropagation();
            // this.setState({ validatedBranchesByLocation: false });
        }
        else {
            this.setState({ validatedBranchesByLocation: true });
            const branchesIdSet = new Set(checkedBranches.reduce((branchesArray, curSwitch) => branchesArray.concat(curSwitch.checked && curSwitch.id), []));
            const branches = []
            this.props.closeBranches.forEach(branch => {
                if (branchesIdSet.has(branch.id + '')) {
                    branch.isChosen = true;
                    branches.push(branch)
                }
                else {
                    branch.isChosen = false;
                }
            });
            this.props.onTryFetchCartProducts(branches)
        }
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
            axios.get('/supermarket/item' + queryParams + '&limit=' + 50 + '&price=' + withPrices, {
                cancelToken: new CancelToken(function executor(c) {
                    // An executor function receives a cancel function as a parameter
                    cancel = c;
                })
            })
                .then(response => {
                    console.log(response);
                    const products = (response && response.data.items) && response.data.items.map(item => {
                        return {
                            match: distanceOfStrings(searchTerm, item.ItemName),
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
        return (
            <Paper>
                <Tabs
                    value={this.state.visibleTab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={() => this.setState(prevState => ({ visibleTab: (prevState.visibleTab + 1) % 2 }))}
                    aria-label="disabled tabs example"
                    variant="fullWidth"

                >
                    <Tab label="חיפוש" variant="fullWidth" />
                    <Tab label="העגלה שלי" variant="fullWidth" />
                </Tabs>
                <ExpansionPanel value={this.state.visibleTab} index={0} id='full-width-tab-0'>
                    component
                </ExpansionPanel >
                <ExpansionPanel value={this.state.visibleTab} index={1} id='full-width-tab-1'>

                </ExpansionPanel>
            </Paper >

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
