import React, { useState, useEffect } from 'react';
import classes from './ProductSummary.module.css';
// import { Button } from 'semantic-ui-react';
import Spin from '../../shared/images/loading_spinner.gif';
import Button from '../UI/Button/Button';

const CarouselCard = props => {
  const {
    title,
    productId,
    quantity,
    price,
    icon,
    src,
    toDetailPage,
    deleteStartHandler
  } = props;
  // const [currentValue, setCurrentValue] = useState(returnQuantity(props));
  const [loading, setLoading] = useState(true);

  return (
    <div
      style={{
        minWidth: props.isCarousel ? 200 : 'none',
        marginRight: props.isCarousel ? 20 : 'none'
      }}
      className={[classes.CarouselCardContainer, classes.card].join(' ')}
    >
      <div className={classes.ImageContainer}>
        <img
          className={classes.prod}
          onClick={toDetailPage}
          src={src}
          alt=''
          onLoad={() => setLoading(false)}
        />
        {loading ? <img src={Spin} alt='' className={classes.spin} /> : null}
      </div>

      <hr />
      <div className={classes.TextContainer}>
        <h4 className={classes.Title} onClick={toDetailPage}>
          {title}
        </h4>
        <h4 className={classes.Price}>
          &#8358;{' '}
          {parseFloat(price.toString().replace(/,/g, ''))
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </h4>
      </div>

      <div className=''>
        <Button btnType='Danger' clicked={() => deleteStartHandler(productId)}>
          {' '}
          Delete product{' '}
        </Button>
      </div>
    </div>
  );
};

export default CarouselCard;
