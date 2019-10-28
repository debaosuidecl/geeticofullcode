import React from 'react';
import { Carousel } from 'react-bootstrap';
import Agriculture from '../../shared/images/agriculture.jpeg';
import Prints from '../../shared/images/prints.jpeg';
import Textile from '../../shared/images/textile.jpeg';
import Plant from '../../shared/images/plant.jpeg';
import Button from '../UI/Button/Button';
import classes from './CarouselSlider.module.css';
class CarouselSlider extends React.Component {
  state = {
    carouselItems: [
      {
        imageLink: Agriculture,
        title: 'Agricultural Produce',
        desc: 'Get amazing wholesale prices from Yawemarket'
      },
      {
        imageLink: Prints,
        title: 'Amazing Clothes',
        desc: 'Get amazing off the Shelf Prices'
      },
      {
        imageLink: Textile,
        title: 'Get Quality Textiles',
        desc:
          'Amazing wholesale prices of quality fabrics from the best manufacturers '
      },
      {
        imageLink: Plant,
        title: 'Fruits and Vegetables',
        desc: 'Abundance of Lovely fruits and Vegetable'
      }
    ]
  };
  render() {
    const carouselContainer = this.state.carouselItems.map((item, i) => (
      <Carousel.Item animateOut={true} key={i}>
        <img src={item.imageLink} />
        <Carousel.Caption>
          <div className={classes.CaptionContainer}>
            <h3 className={classes.ItemTitle}>{item.title}</h3>
            <p className={classes.ItemDescription}>{item.desc}</p>
            <div className={classes.ButtonContainer}>
              <Button btnType='ShopNow'>Shop Now</Button>
            </div>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    ));
    return (
      <div className={classes.CarouselContainer}>
        <Carousel
          interval={8000}
          controls
          slide
          prevIcon={null}
          nextIcon={null}
        >
          {carouselContainer}
        </Carousel>
      </div>
    );
  }
}
export default CarouselSlider;
