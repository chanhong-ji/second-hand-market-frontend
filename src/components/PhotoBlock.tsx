import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';

const Indicator = styled.div``;
const Photos = styled.div<{ photo: string }>`
  background-color: white;
  background-image: ${(p) => `url("${p.photo}")`};
  background-position: center;
  background-size: cover;
  width: 100%;
  padding-bottom: 60%;
  border-radius: 10px;
  position: relative;
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
}

function PhotoBlock({ photos }: IProps) {
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
