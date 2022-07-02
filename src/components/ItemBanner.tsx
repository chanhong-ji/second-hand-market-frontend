import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getFormatValue } from '../shared/utils';

interface IProps {
  id: number;
  title: string;
  price: number;
  photos: (string | null)[] | null;
  dealt: boolean;
  interestsCount: number;
  zone: {
    id: number;
    name: string;
  };
}

const Container = styled.div`
  width: 100%;
  /* min-width: 180px; */
  overflow: hidden;
  cursor: pointer;
  * {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Overlay = styled.div``;
const Photo = styled.div<{ img: string }>`
  width: 100%;
  padding-bottom: 100%;
  background-image: ${(p) => `url('${p.img}')`};
  background-position: center;
  background-size: cover;
  border-radius: 10%;
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
      font-size: 30px;
    }
  }
`;
const Title = styled.div``;
const Price = styled.div``;
const Zone = styled.div``;
const InterestCount = styled.div``;
const Chatcount = styled.div``;
const Info = styled.div`
  padding: 15px 5px;
  width: 100%;

  ${Title} {
    font-size: 17px;
  }
  ${Price} {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: orange;
  }
  ${Zone} {
    padding: 8px 0;
    font-size: 15px;
    color: grey;
  }
  div + :last-child {
    display: flex;
    font-size: 13px;
  }
`;

function ItemBanner({
  id,
  title,
  photos,
  dealt,
  interestsCount,
  zone,
  price,
}: IProps) {
  const goToArticle = () =>
    navigate(`/posts/${id}`, { state: { photoUrls: photos } });
  const navigate = useNavigate();
  const formatPrice = getFormatValue(price);
  return (
    <Container onClick={goToArticle}>
      {photos !== (undefined || null) && (
        <Photo img={photos[0] || ''}>
          {dealt && (
            <Overlay>
              <span>Dealt</span>
            </Overlay>
          )}
        </Photo>
      )}
      <Info>
        <Title>{title}</Title>
        <Zone>{zone.name}</Zone>
        <Price>{(formatPrice + '').slice(1)} 원</Price>
        <div>
          <InterestCount>관심 {interestsCount}</InterestCount>
          <div>∙</div>
          {/* 룸 개수 */}
          <Chatcount>채팅 </Chatcount>
        </div>
      </Info>
    </Container>
  );
}

export default ItemBanner;
