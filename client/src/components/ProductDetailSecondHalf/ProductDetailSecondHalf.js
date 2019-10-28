import React, { useState } from 'react';
import classes from './ProductDetailSecondHalf.module.css';
import StarRatingComponent from 'react-star-rating-component';
import Button from '../UI/Button/Button';
import { connect } from 'react-redux';
import axios from 'axios';
import { toggleAuthModalAction } from '../../store/actions/auth';
import App from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from '../UI/Modal/Modal';
import Backdrop from '../UI/Backdrop/Backdrop';
import Spinner from '../UI/Spinner/Spinner';
function ProductDetailSecondHalf({
  reviews,
  productName,
  id,
  userDataArray,
  userId,
  handleUpdate,
  onShowAuthModalToggle
}) {
  const [starState, setStarState] = useState(0.0);
  const [textAreaState, settextAreaState] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteHandler = () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    if (!token) {
      // return this.props.onAuthLogout();
      return this.props.onShowAuthModalToggle();
      // return console.log('No authorization');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };

    axios
      .delete(
        `${App.domain}api/userproducts/reviews/${id}`,

        config
      )
      .then(res => {
        // console.log(res.data);
        Promise.all(
          res.data.reviews.map(review => {
            return new Promise(async (resolve, reject) => {
              let userData = await axios.get(
                `${App.domain}api/userauth/pub/${review.user}`
              );
              resolve(userData);
            });
          })
        ).then(userData => {
          // console.log(userData);
          handleUpdate(res.data.reviews, userData);
          setLoading(false);
          setShowModal(false);
        });
      })
      .catch(e => {
        if (e.response === undefined) return;
        setLoading(false);
        // console.log(e.response);
        if (
          e.response.data.msg === 'Token is not valid' ||
          e.response.data.msg === 'No token, authorization denied'
        ) {
          return this.props.onShowAuthModalToggle();
        }
      });
    // this.props.onSetAuthModalToTrue();
  };
  const OnReviewHandler = isDelete => {
    const token = localStorage.getItem('token');
    setLoading(true);
    if (!token) {
      setLoading(false);
      // return this.props.onAuthLogout();
      return onShowAuthModalToggle();
      // return console.log('No authorization');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };

    axios
      .post(
        `${App.domain}api/userproducts/reviews/${id}`,
        {
          comment: textAreaState,
          rating: starState
        },
        config
      )
      .then(res => {
        console.log(res.data);
        Promise.all(
          res.data.reviews.map(review => {
            return new Promise(async (resolve, reject) => {
              let userData = await axios.get(
                `${App.domain}api/userauth/pub/${review.user}`
              );
              resolve(userData);
            });
          })
        ).then(userData => {
          // console.log(userData);
          handleUpdate(res.data.reviews, userData);
          setLoading(false);
          setShowModal(false);
        });
      })
      .catch(e => {
        if (e.response === undefined) return;
        setLoading(false);
        // console.log(e.response);
        if (
          e.response.data.msg === 'Token is not valid' ||
          e.response.data.msg === 'No token, authorization denied'
        ) {
          return this.props.onShowAuthModalToggle();
        }
      });
    // this.props.onSetAuthModalToTrue();
  };
  // console.log(userId, 'please');
  const ratingSection = (
    <React.Fragment>
      <h5 style={{ textAlign: 'center' }}>Set a Rating and Comment</h5>
      <p style={{ textAlign: 'center' }}>
        Help us provide you with the best service
      </p>
      <p
        style={{
          textAlign: 'center',
          fontSize: '32px',
          margin: 0,
          color: starState < 3 ? 'red' : starState === 0 ? '#eee' : 'gold'
        }}
      >
        {starState}
      </p>
      <div className={classes.ReviewLogoContainer}>
        <StarRatingComponent
          name='rate1'
          starCount={5}
          value={starState}
          emptyStarColor='#bbb'
          starColor='gold'
          // onStarHover={nextValue => setStarState(nextValue)}
          // onStarHoverOut={nextValue => setStarState(0)}
          onStarClick={nextValue => setStarState(nextValue)}
        />
      </div>
      <div className={classes.taCont}>
        <textarea
          value={textAreaState}
          onChange={e => settextAreaState(e.target.value)}
          placeholder={`Enter a review about ${productName}`}
        ></textarea>
      </div>
      <div className={classes.NoReviewTextContainer}>
        {/* <h3>No Customer Review Yet</h3> */}
        <Button btnType='Go' clicked={() => OnReviewHandler()}>
          Add Review
        </Button>
      </div>
    </React.Fragment>
  );
  let loadingStage = (
    <div className='' style={{ position: 'relative', zIndex: '20000' }}>
      <Backdrop forceWhite show={true} />

      <div className={classes.spinnerCont}>
        <Spinner />
      </div>
    </div>
  );
  const onEditHandler = (rating, comment) => {
    setStarState(rating);
    settextAreaState(comment);
    setShowModal(true);
  };
  const modal = (
    <Modal show={showModal} removeModal={() => setShowModal(false)}>
      <React.Fragment>
        <p
          style={{
            textAlign: 'center',
            fontSize: '32px',
            margin: 0,
            color: starState < 3 ? 'red' : starState === 0 ? '#eee' : 'gold'
          }}
        >
          {starState}
        </p>
        <div className={classes.ReviewLogoContainer}>
          <StarRatingComponent
            name='rate1'
            starCount={5}
            value={starState}
            emptyStarColor='#bbb'
            starColor='gold'
            onStarClick={nextValue => setStarState(nextValue)}
          />
        </div>
        <div className={classes.taCont}>
          <textarea
            value={textAreaState}
            onChange={e => settextAreaState(e.target.value)}
            placeholder={`Enter a review about ${productName}`}
          ></textarea>
        </div>
        <div className={classes.NoReviewTextContainer}>
          {/* <h3>No Customer Review Yet</h3> */}
          <Button btnType='Go' clicked={() => OnReviewHandler()}>
            Edit Review
          </Button>
        </div>
      </React.Fragment>
    </Modal>
  );
  return (
    <div className={classes.ProductDetailSecondHalf}>
      {modal}
      {loading ? loadingStage : null}
      <h2>Customer Reviews</h2>
      {reviews.length > 0 && userDataArray.length > 0 ? (
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
                    {userId === userDataArray[i].data._id ? (
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
                          onClick={() => deleteHandler()}
                          style={{ color: '#bbb', cursor: 'pointer' }}
                        >
                          Delete <FontAwesomeIcon icon={faTrashAlt} />
                        </span>
                      </React.Fragment>
                    ) : null}
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
      {/* if ReviewArrayLength <= 0 */}
      {userDataArray.findIndex(user => user.data._id === userId) === -1
        ? ratingSection
        : null}
    </div>
  );
}
const mapStateToProps = state => {
  return {
    userId: state.auth._id
  };
};
const mapDispatchToProps = dispatch => {
  return {
    // onAddToCart: prodData => dispatch(initiateAddToCart(prodData)),
    onShowAuthModalToggle: () => dispatch(toggleAuthModalAction())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetailSecondHalf);
