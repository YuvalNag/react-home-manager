import React, { Fragment } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import VerticallyCenteredModal from '../../../UI/VerticallyCenteredModal/VerticallyCenteredModal'
import ListGroup from 'react-bootstrap/ListGroup'
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import Badge from 'react-bootstrap/Badge'

// import classes from './CategoryCard.module.css'

const CategoryCard = (props) => {
    const [modalShow, setModalShow] = React.useState(false);

    const wideScreen = window.matchMedia("(min-width: 700px)").matches

    let imageName = 'no-image-available.png'
    if (props.imageName) {
        imageName = props.imageName
    }
    const image = require(`../../../../assets/images/${imageName}`);
    return (
        <Fragment>
            <VerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                title={props.title.toUpperCase()}>
                <ListGroup variant="flush">{
                    props.products.map(product =>
                        <ListGroup.Item key={product.code}> {product.name}
                            <Badge>4<span style={{ fontSize: '18px' }}>₪</span></Badge>
                            <div style={{
                                display: 'inline - flex',
                                float: 'right',
                                justifyContent: 'space-between',
                                width: '50px'
                            }}>
                                <IoMdCheckmarkCircleOutline style={{
                                    cursor: 'pointer',
                                    float: 'left'
                                }}
                                    color='green' size='1.2em' />
                                <IoMdCloseCircleOutline size='1.2em' color='red' style={{
                                    cursor: 'pointer',
                                    float: 'right'
                                }} onClick={() => props.deleteItemClicked({ code: product.code, category: props.title, quantity: product.quantity })} />
                            </div>
                        </ListGroup.Item>)

                }
                </ListGroup>
            </VerticallyCenteredModal>
            <Button variant="secondary" className={wideScreen ? "w-25" : "w-50"} onClick={() => setModalShow(true)}>
                <Card className="img-thumbnail" style={{
                    backgroundColor: 'rgba(47,79,79 ,0.7)',
                    color: 'white'
                }}  >
                    <Card.Img src={image} alt="Card image" />
                    <Card.ImgOverlay >
                        <Card.Title style={{
                            marginTop: '30%',
                            fontSize: wideScreen ? "3vw" : "4vw",
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(47,79,79 ,0.7)',
                            color: 'white'
                            /* ;mixBlendMode: 'difference'*/
                        }}>{props.title.toUpperCase()}</Card.Title>
                        <Card.Text>{props.description}</Card.Text>
                    </Card.ImgOverlay>
                </Card>
            </Button>
        </Fragment >
    )
}
export default CategoryCard