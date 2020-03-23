import React from 'react'

const MemberInfo = (props) => {
    return (
        <div>
            <h4 style={{textTransform:'capitalize',color:'white'}}>{props.name}</h4>
        </div>
    )
}
export default MemberInfo