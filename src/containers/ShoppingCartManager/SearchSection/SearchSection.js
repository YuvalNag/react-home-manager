import React, { Fragment, useState } from 'react'
import ProductSelector from '../../../components/ShoppingCartManagerComponents/ProductSelector/ProductSelector'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'

import SearchProduct from '../../../components/ShoppingCartManagerComponents/ProductSelector/SearchProduct/SearchProduct'
import Col from 'react-bootstrap/Col'
import { IoIosBarcode, IoIosList, IoIosArrowDown, IoIosSearch, IoMdClose } from 'react-icons/io'
import { Row, Collapse } from 'react-bootstrap'
import FilteredList from '../../../components/ShoppingCartManagerComponents/ProductSelector/SearchProduct/FilteredList/FilteredList'
import AsyncCreatableSelect from 'react-select/async-creatable';
import ItemsTable from '../../../components/ShoppingCartManagerComponents/ProductSelector/SearchProduct/FilteredList/ItemsTable/ItemsTable'
import Scanner from '../../../components/ShoppingCartManagerComponents/Scanner/Scanner'



const customStyles = {
    control: (styles, { selectProps: { inputValue } }) => {
        const width = inputValue.length ? '300px' : '200px'
        return {
            ...styles,
            width: width
        }
    }
}
const SearchSection = props => {
    const icons = {
        search: <IoIosSearch size='18px' />,
        barcode: <IoIosBarcode size='18px' />,
        list: <IoIosList size='18px' onClick={props.prevItemsClicked} />,
        x: <IoMdClose size='18px' />
    }
    const [cancel, setCancel] = useState(false)
    const formatCreateLabel = inputValue => (inputValue)

    const views = (btn) => {
        switch (btn) {
            case 'x': return
            case 'barcode':
                return <Scanner onDetected={props.onDetected} />
            case 'search':
                return <AsyncCreatableSelect
                    createOptionPosition='first'
                    onChange={props.searchChanged}
                    onInputChange={props.onInputChange}
                    styles={customStyles}
                    width='100px'
                    // cacheOptions
                    loadOptions={props.promiseOptions}
                    placeholder='חפש מוצר'
                    isRtl
                    isClearable
                    formatCreateLabel={formatCreateLabel} />

            default:
                return <div>Error</div>

        }
    }
    const buttons = (
        <Fragment >
            <Col className='p-0' xs='auto' >
                {views(props.buttons[0])}
            </Col>
            {props.buttons.map(btn =>

                <Col xs='auto' key={btn} className='mr-1 p-0'>
                    <Button onClick={() => {
                        if (btn !== 'search') {
                            const buttons = cancel ? ['search', 'barcode', 'list'] : [btn]
                            props.buttonsClicked(buttons)
                            setCancel(prev => !prev)
                        }
                    }}>
                        {cancel ? icons['x'] : icons[btn]}
                    </Button>
                </Col>)}
        </Fragment>)


    return (

        // <Fragment>
        //     <div>buttons(search,barCode,list,previousList,...)</div>
        //     <div>list of extendable lists for each product search</div>
        // </Fragment>
        <Fragment>


            {/* <Col className='m-1 p-0' md={{ span: 6, order: 6 }} xs={{ span: 12, order: 1 }}   > */}
            <Row className='m-1 w-100'>
                {buttons}
            </Row>
            <Row className='m-1 w-100'>
                {props.items.length > 0 && <ItemsTable
                    itemClicked={props.itemClicked}
                    items={props.items}
                    // quantityChanged={props.quantityChanged}
                    // quantity={props.quantity}
                    // chosenCategory={props.chosenCategory}
                    categories={props.categories}
                    // categoryClicked={props.categoryClicked}
                    addToCartClicked={props.addToCartClicked}
                />}
            </Row>

        </Fragment>

        // <ProductSelector
        //     chosenItem={props.chosenItem}
        //     categories={props.categories}
        //     searchTerm={props.searchTerm}
        //     quantity={props.quantity}
        //     items={props.items}
        //     searchChanged={props.searchChanged}
        //     searchClicked={props.searchClicked}
        //     quantityChanged={props.quantityChanged}
        //     categoryClicked={props.categoryClicked}
        //     itemClicked={props.itemClicked}
        //     productIsValid={props.quantity && props.chosenItem}
        //     addToCartClicked={props.addToCartClicked}
        //     chosenCategory={props.chosenCategory}
        //     loadingSearch={props.loadingSearch}
        // />
    )
}
export default SearchSection