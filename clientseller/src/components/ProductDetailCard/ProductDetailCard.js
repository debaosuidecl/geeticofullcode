import React from 'react';
import SpinnerTwo from '../UI/Spinner2/Spinner2';
import PropTypes from 'prop-types';
import StarRatingComponent from 'react-star-rating-component';
import ProductNameComponent from '../ProductNameComponent/ProductNameComponent.js';
import PriceComponent from '../PriceComponent/PriceComponent.js';
import QuantityComponent from '../QuantityComponent/QuantityComponent.js';
import classes from './ProductDetailCard.module.css';
import DescriptionComponent from '../DescriptionComponent/DescriptionComponent';
import CategoryComponent from '../CategoryComponent/CategoryComponent';
import SearchTagComponent from '../SearchTagComponent/SearchTagComponent';
import PreviewImageComponent from '../PreviewImageComponent/PreviewImageComponent';
import EditUpdateSwitchComponent from '../EditUpdateSwitchComponent/EditUpdateSwitchComponent';
import ProductDetailSecondHalf from '../ProductDetailSecondHalf/ProductDetailSecondHalf';
import SerialNumberComponent from '../SerialNumberComponent/SerialNumberComponent';
export default function ProductDetailCard({
  details,
  isUpdating,
  previewOpen,
  previewOpenHandler,
  selectLink,
  setActiveLink,
  validator,
  onEditChange,
  startEdit,
  showInput,
  isEditable,
  updateHandler,
  formValidity,
  onInputTagChangeHandler,
  searchTagConfigValue,
  deleteTagHandler,
  keyPressHandler,
  deleteImageHandler,
  onAddNewImage,
  userDataArray
}) {
  const {
    productURL,
    productName,
    price,
    description,
    category,
    tags,
    productQuantity,
    referenceNumber,
    _id,
    reviews
    // showInput
  } = details;
  return (
    <div className={classes.ProductDetailCard}>
      <div className={classes.ProductDetailTopHalf}>
        {isUpdating ? <SpinnerTwo /> : null}
        <PreviewImageComponent
          isUpdating={isUpdating}
          onAddNewImage={onAddNewImage}
          showInput={showInput}
          deleteImageHandler={deleteImageHandler}
          selectLink={selectLink}
          productName={productName}
          previewOpenHandler={previewOpenHandler}
          previewOpen={previewOpen}
          setActiveLink={setActiveLink}
          productURL={productURL}
        />
        <div className={classes.ProductTextCont}>
          {/* Edit and Update buttons switch here */}
          <EditUpdateSwitchComponent
            isEditable={isEditable}
            showInput={showInput}
            startEdit={startEdit}
            updateHandler={updateHandler}
            formValidity={formValidity}
          />
          {/* Product Name */}
          <ProductNameComponent
            validator={validator}
            showInput={showInput}
            productName={productName}
            startEdit={startEdit}
            onEditChange={onEditChange}
          />
          {/* Price */}
          <div className={classes.priceContainer}>
            <PriceComponent
              validator={validator}
              showInput={showInput}
              price={price}
              startEdit={startEdit}
              onEditChange={onEditChange}
            />
          </div>
          {/* Quantity  */}

          <QuantityComponent
            productQuantity={productQuantity}
            validator={validator}
            showInput={showInput}
            startEdit={startEdit}
            onEditChange={onEditChange}
          />

          {/* Description */}
          <DescriptionComponent
            validator={validator}
            showInput={showInput}
            description={description}
            startEdit={startEdit}
            onEditChange={onEditChange}
          />

          {/* Category */}

          <CategoryComponent
            validator={validator}
            showInput={showInput}
            category={category}
            startEdit={startEdit}
            onEditChange={onEditChange}
          />

          <div className={classes.reviewAndOrderCont}>
            <div className={classes.ReviewCont}>
              <StarRatingComponent
                name='rate1'
                starCount={5}
                value={
                  details.reviews.reduce((prevValue, currValue) => {
                    return currValue.rating + prevValue;
                  }, 0) / details.reviews.length
                }
                emptyStarColor='#bbb'
                // onStarClick={this.onStarClick.bind(this)}
              />{' '}
              <span>{details.reviews.length} Review(s)</span>
            </div>
            <div className={classes.OrderCont}>
              <span>0 Order(s)</span>
            </div>
          </div>
          {/* Search Tags */}
          <h4>
            <strong>Search Tags</strong>
          </h4>
          <SearchTagComponent
            onInputTagChangeHandler={onInputTagChangeHandler}
            searchTagConfigValue={searchTagConfigValue}
            deleteTagHandler={deleteTagHandler}
            keyPressHandler={keyPressHandler}
            showInput={showInput}
            tags={tags}
          />
          <SerialNumberComponent
            referenceNumber={referenceNumber}
            validator={validator}
            showInput={showInput}
            startEdit={startEdit}
            onEditChange={onEditChange}
          />
        </div>
      </div>
      <ProductDetailSecondHalf
        id={_id}
        productName={productName}
        reviews={reviews}
        userDataArray={userDataArray}
      />
    </div>
  );
}

ProductDetailCard.propTypes = {
  startEdit: PropTypes.func,
  onEditChange: PropTypes.func
  // validator: PropTypes.instanceOf(SimpleReactValidator)
};
