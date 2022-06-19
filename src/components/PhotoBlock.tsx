import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';

const Indicator = styled.div``;
const Overlay = styled.div``;
const Photos = styled.div<{ photo: string }>`
  background-color: white;
  background-image: ${(p) => `url("${p.photo}")`};
  background-position: center;
  background-size: cover;
  width: 100%;
  padding-bottom: 60%;
  border-radius: 10px;
  position: relative;
  ${Overlay} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      color: rgba(255, 255, 255, 0.8);
      font-size: 50px;
    }
  }
  ${Indicator} {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: center;
  }
`;
const Dot = styled.div<{ now: boolean }>`
  width: 9px;
  height: 9px;
  border-radius: 4px;
  margin: 0 3px;
  background-color: ${(p) => (p.now ? 'white' : 'grey')};
`;

interface IProps {
  photos: string[];
  isDealt: boolean;
}

function PhotoBlock({ photos, isDealt }: IProps) {
  const onClickLeftArrow = () => {
    setPhotoN((prev) => (prev == 0 ? photoUrls.length - 1 : prev - 1));
  };
  const onClickRightArrow = () => {
    setPhotoN((prev) => (prev + 1 == photoUrls.length ? 0 : prev + 1));
  };

  const location: any = useLocation();
  const [photoUrls, setPhotoUrls] = useState(location?.state?.photoUrls || []);
  const [photoN, setPhotoN] = useState(0);

  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (!location?.state?.photoUrls) {
      setPhotoUrls(photos);
    }
  }, []);

  return (
    <Photos photo={photoUrls[photoN]}>
      {isDealt && (
        <Overlay>
          <span>Dealt complete</span>
        </Overlay>
      )}
      {photoUrls.length > 1 && (
        <>
          <FontAwesomeIcon
            onClick={onClickLeftArrow}
            icon={faArrowLeft}
            style={{
              position: 'absolute',
              top: '50%',
              left: theme.size.arrow,
              fontSize: theme.size.arrow,
              color: 'white',
              cursor: 'pointer',
            }}
          />
          <FontAwesomeIcon
            onClick={onClickRightArrow}
            icon={faArrowRight}
            style={{
              position: 'absolute',
              top: '50%',
              right: theme.size.arrow,
              fontSize: theme.size.arrow,
              color: 'white',
              cursor: 'pointer',
            }}
          />
        </>
      )}
      <Indicator>
        {photoUrls.map((_: string, index: number) => (
          <Dot now={index == photoN} key={index + ''} />
        ))}
      </Indicator>
    </Photos>
  );
}

export default PhotoBlock;
