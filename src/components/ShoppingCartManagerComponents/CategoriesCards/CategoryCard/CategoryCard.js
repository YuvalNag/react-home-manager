import React, { Fragment, useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import CategoryList from '../CategoryList/CategoryList'
import axios from '../../../../axios/axios-shoppingCart'

const CategoryCard = (props) => {
    const [modalShow, setModalShow] = useState(false);

    const imageName = props.imageName;
    const [src, setSrc] = useState()
    useEffect(() => {
        setSrc(`${axios.defaults.baseURL}/img/category/${imageName}`);
    }, [imageName])
    const errorImage = require(`../../../../assets/images/no-image-available.png`);


    const wideScreen = window.matchMedia("(min-width: 700px)").matches

    return (
        <Fragment>
            <CategoryList
                title={props.title}
                products={props.products}
                modalShow={modalShow}
                setModalShow={setModalShow}
                deleteItemClicked={props.deleteItemClicked} />
            <Button variant="secondary" className={wideScreen ? "w-25" : "w-50"} onClick={() => setModalShow(true)}>
                <Card className="img-thumbnail" style={{
                    backgroundColor: 'rgba(47,79,79 ,0.7)',
                    color: 'white'
                }}  >
                    <Card.Img src={src}
                        onError={() => { setSrc(errorImage) }}
                        alt="Card image" />
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
        </Fragment>
    )
}
export default CategoryCard