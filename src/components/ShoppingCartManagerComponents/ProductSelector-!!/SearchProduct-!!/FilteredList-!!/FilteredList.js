

import React from 'react';

import ItemsList from './ItemsList/ItemsList'

const FilteredList = (props) => {

    return (
        <div className="list filtered-list">
            <input className="filter form-control text-right" style={{ direction: 'rtl' }} onChange={props.changed} type="text" placeholder="חפש מוצר" value={props.searchTerm} />
            {props.items.length > 0 && <ItemsList itemClicked={props.itemClicked} items={props.items} />}
        </div>
    );
}


export default FilteredList;
















