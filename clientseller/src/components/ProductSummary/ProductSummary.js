import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/UI/Button/Button';
import classes from './ProductSummary.module.css';
const ProductSummary = ({
  title,
  productId,
  quantity,
  price,
  icon,
  src,
  toDetailPage,
  deleteStartHandler
}) => {
  return (
    <div className={classes.ProductContainer}>
      <div className={classes.Picture}>
        <img onClick={toDetailPage} src={src} height='100' alt={src + title} />
      </div>
      <div
        className={[classes.ProdDetailContainerMobile, classes.mobileOnly].join(
          ' '
        )}
      >
        <div>
          Product Name:{' '}
          <span onClick={toDetailPage} className={classes.title}>
            {title}
          </span>
        </div>
        <div>Quantity: {quantity}</div>
        <div>
          Price per/pc: &#x20A6;
          {parseFloat(price.toString().replace(/,/g, ''))
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
        <Button btnType='Danger' clicked={() => deleteStartHandler(productId)}>
          {' '}
          Delete product{' '}
        </Button>
      </div>
      <h6
        onClick={toDetailPage}
        className={[classes.title, classes.desktopOnly].join(' ')}
      >
        {title}
      </h6>
      <h6 className={classes.desktopOnly}>{quantity}</h6>
      <div
        className={[classes.PriceAndSettingCont, classes.desktopOnly].join(' ')}
      >
        <h6>&#8358;{price}</h6>
        <div onClick={() => deleteStartHandler(productId)}>
          <FontAwesomeIcon icon={icon} size='1x' />
          {/* <Button btnType='Gosmall'>View Product</Button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;
