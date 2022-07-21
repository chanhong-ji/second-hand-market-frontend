import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faPlusCircle,
  faRotate,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { createPostVariables } from '../__generated__/createPost';

const Photos = styled.div``;
const Left = styled.div`
  background-color: whitesmoke;
  border-bottom-left-radius: 20px;
  height: 100%;
  position: relative;
  label {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    padding: 10px;
    border-radius: 5px;
    opacity: 0.5;
    cursor: pointer;
    :hover {
      opacity: 1;
    }
    :last-of-type {
      right: 50px;
    }
  }
  input {
    display: none;
  }
  ${Photos} {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    * {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      position: absolute;
      cursor: pointer;
    }
    .nextBtn {
      top: 50%;
      right: 10px;
      color: white;
    }
    .prevBtn {
      top: 50%;
      left: 10px;
      color: white;
    }
    .deleteBtn {
      top: 10px;
      right: 10px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
`;

interface IUploadForm {
  add: File | null;
  change: File | null;
  currency: string;
}
interface IProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<createPostVariables & IUploadForm>;
  photoUrls: string[];
  setPhotoUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

function Preview({ register, setValue, photoUrls, setPhotoUrls }: IProps) {
  const onClickPrevBtn = () => {
    setPhotoPage((prev) => prev - 1);
  };

  const onClickNextBtn = () => {
    setPhotoPage((prev) => prev + 1);
  };

  const onClickDeleteBtn = () => {
    setPhotoUrls((prev) => {
      let newPhotos = [...prev];
      newPhotos.splice(photoPage - 1, 1);
      return newPhotos;
    });
    setPhotoPage((prev) => (prev === 1 ? 1 : prev - 1));
  };

  const onAddPhoto = (input: any) => {
    if (photoUrls.length >= 3) {
      return;
    }
    if (input.target.files[0]) {
      const photoUrl = URL.createObjectURL(input.target?.files[0]);
      if (photoUrl) setPhotoUrls((prev) => [...prev, photoUrl]);
    }
    setValue('add', null);
  };

  const onChangePhoto = (input: any) => {
    if (input.target.files[0]) {
      const photoUrl = URL.createObjectURL(input.target?.files[0]);
      setPhotoUrls((prev) => {
        const newPhotos = [...prev];
        newPhotos.splice(photoPage - 1, 1, photoUrl);
        return newPhotos;
      });
    }
    setValue('change', null);
  };

  const [photoPage, setPhotoPage] = useState(1);

  return (
    <Left>
      <label
        htmlFor='add'
        style={{
          ...(photoUrls.length >= 3 && { opacity: 0.2, cursor: 'default' }),
        }}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
      </label>
      <input
        {...register('add', {
          onChange: onAddPhoto,
        })}
        type='file'
        id='add'
        accept='image/png, image/jpeg'
        disabled={photoUrls.length >= 3}
      />

      <label htmlFor='change'>
        <FontAwesomeIcon icon={faRotate} />
      </label>
      <input
        {...register('change', {
          onChange: onChangePhoto,
        })}
        type='file'
        id='change'
        accept='image/png, image/jpeg'
        disabled={photoUrls.length < photoPage}
      />

      {photoUrls.map((photoUrl, index) =>
        index + 1 === photoPage ? (
          <Photos style={{ backgroundImage: `url(${photoUrl})` }} key={index}>
            {photoUrls.length > index + 1 && (
              <FontAwesomeIcon
                icon={faArrowCircleRight}
                onClick={onClickNextBtn}
                className='nextBtn'
              />
            )}
            {index > 0 && (
              <FontAwesomeIcon
                icon={faArrowCircleLeft}
                onClick={onClickPrevBtn}
                className='prevBtn'
              />
            )}
            <FontAwesomeIcon
              icon={faXmarkCircle}
              onClick={onClickDeleteBtn}
              className='deleteBtn'
            />
          </Photos>
        ) : null
      )}
    </Left>
  );
}

export default Preview;
