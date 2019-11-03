export const updateObject = (state, updatedProperties) => {
  return {
    ...state,
    ...updatedProperties
  };
};

export const checkValidity = (value, rules) => {
  let isValid = true;

  if (rules.required) {
    isValid = value.trim() !== '' && isValid; // trim() method is used to remove white spaces...
    // this is to make sure no field is empty
    // if the check is not equal(meaning that the input value is not null) then the check will return true
    //console.log(isValid, 'required')
  }
  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
    //console.log(isValid, 'maxLength');
  }
  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
    //console.log(isValid, 'minLength');
  }
  if (rules.isANumber) {
    isValid = !isNaN(value) && isValid;
  }
  if (rules.isEmail) {
    // eslint-disable-next-line
    const pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; // regular expression for email addresse
    isValid = pattern.test(value) && isValid;
  }
  if (rules.special) {
    const regularExpression = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}/;
    isValid = regularExpression.test(value);
  }

  return isValid;
};

export function imageZoom(imgID, resultID) {
  var img, lens, result, cx, cy;

  img = document.getElementById(imgID);

  result = document.getElementById(resultID);
  /*create lens:*/
  lens = document.createElement('DIV');
  lens.setAttribute('class', 'img-zoom-lens');
  /*insert lens:*/
  img.parentElement.insertBefore(lens, img);
  /*calculate the ratio between result DIV and lens:*/
  cx = result.offsetWidth / lens.offsetWidth;
  cy = result.offsetHeight / lens.offsetHeight;
  /*set background properties for the result DIV:*/
  result.style.backgroundImage = "url('" + img.src + "')";
  //   console.log(img);
  result.style.backgroundSize = img.width * cx + 'px ' + img.height * cy + 'px';
  /*execute a function when someone moves the cursor over the image, or the lens:*/
  lens.addEventListener('mousemove', moveLens);
  img.addEventListener('mousemove', moveLens);
  /*and also for touch screens:*/
  lens.addEventListener('touchmove', moveLens);
  img.addEventListener('touchmove', moveLens);
  function moveLens(e) {
    console.log('moved');
    // console.log(img.src);
    var pos, x, y;
    /*prevent any other actions that may occur when moving over the image:*/
    e.preventDefault();
    /*get the cursor's x and y positions:*/
    pos = getCursorPos(e);
    // console.log(pos);
    /*calculate the position of the lens:*/
    x = pos.x - lens.offsetWidth / 2;
    y = pos.y - lens.offsetHeight / 2;
    /*prevent the lens from being positioned outside the image:*/
    if (x > img.width - lens.offsetWidth) {
      x = img.width - lens.offsetWidth;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > img.height - lens.offsetHeight) {
      y = img.height - lens.offsetHeight;
    }
    if (y < 0) {
      y = 0;
    }
    /*set the position of the lens:*/
    lens.style.left = x + 'px';
    lens.style.top = y + 'px';
    /*display what the lens "sees":*/
    result.style.backgroundPosition = '-' + x * cx + 'px -' + y * cy + 'px';
    console.log('done');
  }
  function getCursorPos(e) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
}

export const newImageZoom = (imgID, resultID) => {
  var img, lens, result, cx, cy;
  img = document.getElementById(imgID);
  result = document.getElementById(resultID);
  /*create lens:*/
  lens = document.createElement('DIV');
  lens.setAttribute('class', 'img-zoom-lens');
  /*insert lens:*/
  img.parentElement.insertBefore(lens, img);
  /*calculate the ratio between result DIV and lens:*/
  cx = result.offsetWidth / lens.offsetWidth;
  cy = result.offsetHeight / lens.offsetHeight;
  /*set background properties for the result DIV:*/
  result.style.backgroundImage = "url('" + img.src + "')";
  result.style.backgroundSize = img.width * cx + 'px ' + img.height * cy + 'px';
  /*execute a function when someone moves the cursor over the image, or the lens:*/
  lens.addEventListener('mousemove', moveLens);
  img.addEventListener('mousemove', moveLens);
  /*and also for touch screens:*/
  lens.addEventListener('touchmove', moveLens);
  img.addEventListener('touchmove', moveLens);
  function moveLens(e) {
    var pos, x, y;
    /*prevent any other actions that may occur when moving over the image:*/
    e.preventDefault();
    /*get the cursor's x and y positions:*/
    pos = getCursorPos(e);
    /*calculate the position of the lens:*/
    x = pos.x - lens.offsetWidth / 2;
    y = pos.y - lens.offsetHeight / 2;
    /*prevent the lens from being positioned outside the image:*/
    if (x > img.width - lens.offsetWidth) {
      x = img.width - lens.offsetWidth;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > img.height - lens.offsetHeight) {
      y = img.height - lens.offsetHeight;
    }
    if (y < 0) {
      y = 0;
    }
    /*set the position of the lens:*/
    lens.style.left = x + 'px';
    lens.style.top = y + 'px';
    /*display what the lens "sees":*/
    result.style.backgroundPosition = '-' + x * cx + 'px -' + y * cy + 'px';
  }
  function getCursorPos(e) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
};
