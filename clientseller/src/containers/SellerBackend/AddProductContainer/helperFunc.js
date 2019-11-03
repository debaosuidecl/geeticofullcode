import { checkValidity } from '../../../shared/utitlity';

export const priceQuantCheck = (
  event,
  state,
  controlName,
  updatedControls,
  e
) => {
  let newControls;
  if (controlName === 'price') {
    if (
      !/^[0-9]*$/.test(event.target.value) &&
      state.controls[controlName].value.length === 0
    )
      return null;
    else {
      // console.log(updatedControls[controlName].value);
      // console.log(e.target.value);
      let numberValue =
        e.target.value.length === 0
          ? ''
          : parseFloat(e.target.value.replace(/,/g, ''))
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      // console.log(numberValue);
      if (e.target.value.length > 16) {
        return null;
      }

      newControls = {
        ...updatedControls,
        [controlName]: {
          ...updatedControls[controlName],
          value: numberValue,
          valid: checkValidity(
            event.target.value,
            updatedControls[controlName].validation
          )
        }
      };
    }
  }
  if (controlName === 'productQuantity') {
    if (!/^[0-9]*$/.test(event.target.value)) return null;
  }
  return newControls;
};

export const imageParameters = (
  $imagePreviewOne,
  $imagePreviewTwo,
  $imagePreviewThree,
  state
) => {
  return [
    {
      name: 'fileOne',
      id: 'productfileOne',
      imagepreview: $imagePreviewOne,
      imagenumber: 'One',
      isover: state.isDragOver.fileOne,
      inputid: 'productfileOne'
    },
    {
      name: 'fileTwo',
      id: 'productfileTwo',
      imagepreview: $imagePreviewTwo,
      imagenumber: 'Two',
      isover: state.isDragOver.fileTwo,
      inputid: 'productfileTwo'
    },
    {
      name: 'fileThree',
      id: 'productfileThree',
      imagepreview: $imagePreviewThree,
      imagenumber: 'Three',
      isover: state.isDragOver.fileThree,
      inputid: 'productfileThree'
    }
  ];
};
