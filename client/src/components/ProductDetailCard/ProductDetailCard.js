import React from 'react';
import SpinnerTwo from '../UI/Spinner2/Spinner2';
import PropTypes from 'prop-types';
// import StarRatingComponent from 'react-star-rating-component';
import ProductNameComponent from '../ProductNameComponent/ProductNameComponent.js';
import PriceComponent from '../PriceComponent/PriceComponent.js';
// import QuantityComponent from '../QuantityComponent/QuantityComponent.js';
import classes from './ProductDetailCard.module.css';
import DescriptionComponent from '../DescriptionComponent/DescriptionComponent';
import CategoryComponent from '../CategoryComponent/CategoryComponent';
import SearchTagComponent from '../SearchTagComponent/SearchTagComponent';
import PreviewImageComponent from '../PreviewImageComponent/PreviewImageComponent';
import EditUpdateSwitchComponent from '../EditUpdateSwitchComponent/EditUpdateSwitchComponent';
import ProductDetailSecondHalf from '../ProductDetailSecondHalf/ProductDetailSecondHalf';
import SerialNumberComponent from '../SerialNumberComponent/SerialNumberComponent';
import AddToCartComponent from '../AddToCartComponent/AddToCartComponent';
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
  userDataArray,
  handleUpdate
}) {
  const {
    productURL,
    productName,
    price,
    description,
    category,
    tags,
    _id,
    reviews,

    // productQuantity,
    referenceNumber
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
          <div
            className=''
            style={{
              textAlign: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #eee',
              marginBottom: 20
            }}
          >
            <ProductNameComponent
              validator={validator}
              showInput={showInput}
              productName={productName}
              startEdit={startEdit}
              onEditChange={onEditChange}
            />
          </div>
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

          {/* <QuantityComponent
            productQuantity={productQuantity}
            validator={validator}
            showInput={showInput}
            startEdit={startEdit}
            onEditChange={onEditChange}
          /> */}
          <AddToCartComponent details={details} productId={_id} />

          {/* Category */}
          <div style={{ marginBottom: 20 }}>
            <CategoryComponent
              validator={validator}
              showInput={showInput}
              category={category}
              startEdit={startEdit}
              onEditChange={onEditChange}
            />
          </div>
          {/* <hr /> */}

          {/* Search Tags */}
          <h4>
            <strong>Related to:</strong>
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

          {/* Description */}
          <DescriptionComponent
            validator={validator}
            showInput={showInput}
            description={description}
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
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

ProductDetailCard.propTypes = {
  startEdit: PropTypes.func,
  onEditChange: PropTypes.func
  // validator: PropTypes.instanceOf(SimpleReactValidator)
};
