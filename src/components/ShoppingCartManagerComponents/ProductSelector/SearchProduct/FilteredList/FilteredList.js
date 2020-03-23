

import React from 'react';

import ItemsTable from './ItemsTable/ItemsTable'

const FilteredList = (props) => {

    return (
        <div className="list filtered-list">
            <input className="filter form-control" onChange={props.changed} type="text" placeholder="Search for..." value={props.searchTerm} />
            {props.items.length > 0 && <ItemsTable itemClicked={props.itemClicked} items={props.items} />}
        </div>
    );
}


export default FilteredList;
















