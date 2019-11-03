import React from 'react';
import ImageInput from '../imageInput/imageInput';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export default function AddNewImageComponent({ onAddNewImage }) {
  return (
    <div>
      <ImageInput
        // imagenumber='Add a new Image'
        type='file'
        name='newImage'
        id='random'
        icon={faPlusCircle}
        inputid='random'
        onChange={onAddNewImage}
      />
    </div>
  );
}
