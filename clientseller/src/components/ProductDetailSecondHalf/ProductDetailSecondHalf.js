import React from 'react';
import classes from './ProductDetailSecondHalf.module.css';
import StarRatingComponent from 'react-star-rating-component';

export default function ProductDetailSecondHalf({ reviews, userDataArray }) {
  return (
    <div className={classes.ProductDetailSecondHalf}>
      <h2>Customer Reviews</h2>
      {reviews.length <= 0 ? (
        <h2>No customer reviews on this product</h2>
      ) : reviews.length > 0 && userDataArray.length > 0 ? (
        <div className={classes.reviews}>
          {reviews.map((review, i) => (
            <div key={i} className={classes.singleReview}>
              <div className={classes.AvatarCont}>
                <img
                  className={classes.avatarImg}
                  src={userDataArray[i].data.avatar}
                  alt='avatar'
                />
              </div>

              <div className={classes.NameRatingAndCommentCont}>
                <div className={classes.NameAndRatingCont}>
                  <div>
                    <p>{userDataArray[i].data.fullName}</p>
                    {/* {userId === userDataArray[i].data._id ? (
                      <React.Fragment>
                        <span
                          onClick={() =>
                            onEditHandler(review.rating, review.comment)
                          }
                          style={{
                            color: '#bbb',
                            cursor: 'pointer',
                            marginRight: 10
                          }}
                        >
                          Edit <FontAwesomeIcon icon={faPenAlt} />
                        </span>
                        <span
                          // onClick={() => deleteHandler()}
                          style={{ color: '#bbb', cursor: 'pointer' }}
                        >
                          Delete <FontAwesomeIcon icon={faTrashAlt} />
                        </span>
                      </React.Fragment>
                    ) : null} */}
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {review.rating}.0{' '}
                    <StarRatingComponent
                      name='rate2'
                      starCount={5}
                      value={review.rating}
                      emptyStarColor='#bbb'
                      starColor='gold'
                    />
                  </span>
                </div>
                <div className={classes.CommentCont}>
                  <p>{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
