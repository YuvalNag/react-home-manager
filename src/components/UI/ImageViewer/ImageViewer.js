import React, { Fragment, useState } from "react";
import VerticallyCenteredModal from "../VerticallyCenteredModal/VerticallyCenteredModal";
const ImageViewer = props => {
    const [show, setShow] = useState(false)

    return (
        <Fragment>
            <VerticallyCenteredModal
                show={show}
                onHide={() => setShow(false)}
                title=''>
                {props.children}
            </VerticallyCenteredModal>
            <span onClick={() => setShow(prevShow => !prevShow)}>
                {props.children}
            </span>
        </Fragment>
    )
}
export default ImageViewer