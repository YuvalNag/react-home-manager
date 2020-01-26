import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
// import classes from './CategoryCard.module.css'

const categoryCard = props => {
    let imageName = 'no-image-available.png'
    if (props.imageName) {
        imageName = props.imageName
    }
    const image = require(`../../../assets/images/${imageName}`);
    return (
        <Button variant="secondary" className="w-50">
            <Card className="img-thumbnail" style={{
        backgroundColor:'rgba(47,79,79 ,0.7)',
         color: 'white'
        }}  >
                <Card.Img src={image} alt="Card image" />
                <Card.ImgOverlay >
                    <Card.Title style={{
                        marginTop: '30%',
                        fontSize: '4vw',
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(47,79,79 ,0.7)',
                        color: 'white'
                        /* ;mixBlendMode: 'difference'*/
}}>{props.title.toUpperCase()}</Card.Title>
                    <Card.Text>{props.description}</Card.Text>
                </Card.ImgOverlay>
            </Card>
        </Button>

    )
}
export default categoryCard