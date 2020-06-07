import React, { Fragment, useState } from 'react'
import Button from 'react-bootstrap/Button'

import Col from 'react-bootstrap/Col'
import { IoIosBarcode, IoIosSearch, IoMdClose } from 'react-icons/io'
import { GiCupcake } from 'react-icons/gi'

import Row from 'react-bootstrap/Row'
import AsyncCreatableSelect from 'react-select/async-creatable';
import Scanner from '../../../components/ShoppingCartManagerComponents/Scanner/Scanner'
import ItemsList from '../../../components/ShoppingCartManagerComponents/ItemsTable/ItemsList'
import ScrollToTop from '../../../components/UI/ScrollToTop/ScrollToTop'



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
        search: <IoIosSearch size='18px' onClick={props.searchClicked} />,
        barcode: <IoIosBarcode size='18px' />,
        recipe: <GiCupcake size='18px' />,
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
                    onChange={props.optionClicked}
                    onInputChange={props.onInputChange}
                    styles={customStyles}
                    width='100px'
                    // cacheOptions
                    loadOptions={props.promiseOptions}
                    placeholder='חפש מוצר'
                    isRtl
                    isSearchable
                    isClearable
                    formatCreateLabel={formatCreateLabel}
                    allowCreateWhileLoading
                    onKeyDown={(event) => {
                        if (event.keyCode === 13) {
                            props.searchClicked()
                        }
                    }}
                />

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
                            const buttons = cancel ? ['search', 'barcode', 'recipe'] : [btn]
                            props.buttonsClicked(buttons)
                            setCancel(prev => !prev)
                        }
                    }}>
                        {cancel ? icons['x'] : icons[btn]}
                    </Button>
                </Col>)}
        </Fragment>)


    return (
        <Fragment>


            <Row className='m-1 w-100'>
                {buttons}
            </Row>
            <Row className='m-1 w-100'>
                {props.items.length > 0 && <ItemsList
                    items={props.items}
                    categories={props.categories}
                    addToCartClicked={props.addToCartClicked}
                />}
            </Row>
            <ScrollToTop />
        </Fragment>

        // <ProductSelector
        //     chosenItem={props.chosenItem}
        //     categories={props.categories}
        //     searchTerm={props.searchTerm}
        //     quantity={props.quantity}
        //     items={props.items}
        //     optionClicked={props.optionClicked}
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