import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import CarouselCard from '../CarouselCard/CarouselCard';
import Apple from '../../shared/images/apple.png';
import Bannana from '../../shared/images/Banana.png';
import Jaguar from '../../shared/images/Jaguar.png';
import { Link } from 'react-router-dom';
// import Bulb from "../../shared/images/bulb.jpeg";
import classes from './MultiCarousel.module.css';

class Gallery extends React.Component {
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    1024: { items: 4 }
  };
  state = {
    text: [
      { imageLink: Apple, desc: 'Apples', Price: '24,000.00', Discount: '50%' },
      {
        imageLink: Bannana,
        desc: 'Bananas',
        Price: '154,000.00',
        Discount: '10%'
      },
      {
        imageLink: Jaguar,
        desc: 'Samsung S6 2018',
        Price: '29,000.00',
        Discount: '50%'
      },
      {
        imageLink: Bannana,
        desc: 'Bananas',
        Price: '14,999.00',
        Discount: '30%'
      },
      {
        imageLink: Apple,
        desc: 'Apples',
        Price: '230,000.00',
        Discount: '19%'
      },
      {
        imageLink: Bannana,
        desc: 'Bananas',
        Price: '14,000.00',
        Discount: '20%'
      }
    ]
  };

  onSlideChange(e) {
    // console.log('Item`s position during a change: ', e.item);
    // console.log('Slide`s position during a change: ', e.slide);
  }

  onSlideChanged(e) {
    // console.log('Item`s position after changes: ', e.item);
    // console.log('Slide`s position after changes: ', e.slide);
  }

  galleryItems() {
    return this.props.carouselData.map((item, i) => (
      <CarouselCard
        imageLink={item.imageLink}
        desc={item.desc}
        Price={item.Price}
        Discount={item.Discount}
        key={`key-${i}`}
      />
    ));
  }

  render() {
    const items = this.galleryItems();

    return (
      <div className={classes.MultiCarouselContainer}>
        <div className={classes.CarouselHeader}>
          <h4>{this.props.carouselHeader}</h4>

          <Link to='/'> View All</Link>
        </div>
        <button
          className={classes.LeftButton}
          onClick={() => this.Carousel._slidePrev()}
        >
          &#171;
        </button>
        <button
          className={classes.RightButton}
          onClick={() => this.Carousel._slideNext()}
        >
          &#187;
        </button>
        <AliceCarousel
          ref={el => (this.Carousel = el)}
          items={items}
          duration={300}
          autoPlay={true}
          startIndex={1}
          fadeOutAnimation={true}
          autoPlayInterval={10000}
          autoPlayDirection='ltr'
          responsive={this.responsive}
          disableAutoPlayOnAction={true}
          onSlideChange={this.onSlideChange}
          onSlideChanged={this.onSlideChanged}
          mouseDragEnabled={true}
          dotsDisabled={true}
          buttonsDisabled={true}
        />
      </div>
    );
  }
}

export default Gallery;
