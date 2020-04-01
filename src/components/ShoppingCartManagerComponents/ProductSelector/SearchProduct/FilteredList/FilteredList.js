

import React from 'react';

import ItemsTable from './ItemsTable/ItemsTable'

const FilteredList = (props) => {

    return (
        <div className="list filtered-list">
            <input className="filter form-control text-right" style={{ direction: 'rtl' }} onChange={props.changed} type="text" placeholder="חפש מוצר" value={props.searchTerm} />
            {props.items.length > 0 && <ItemsTable itemClicked={props.itemClicked} items={props.items} />}
        </div>
    );
}


export default FilteredList;
















