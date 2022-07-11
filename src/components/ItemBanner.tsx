import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getFormatValue } from '../shared/utils';
import { seePosts_seePosts_posts } from '../__generated__/seePosts';

const Container = styled.div`
  width: 100%;
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
  border-radius: 8%;
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
const Record = styled.div``;
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
  ${Record} {
    display: flex;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.5);
    font-weight: 600;
    div:nth-child(2) {
      margin-left: 4px;
      margin-right: 4px;
    }
  }
`;

// from Grid, ProfileBottom
function ItemBanner({
  id,
  title,
  photos,
  dealt,
  interestsCount,
  price,
  roomCount,
  zoneName,
}: seePosts_seePosts_posts) {
  const onClickPost = () =>
    navigate(`/posts/${id}`, { state: { photoUrls: photos } });

  const navigate = useNavigate();
  const formatPrice = getFormatValue(price);

  return (
    <Container onClick={onClickPost}>
      <Photo img={photos[0] || ''}>
        {dealt && (
          <Overlay>
            <span>Dealt</span>
          </Overlay>
        )}
      </Photo>
      <Info>
        <Title>{title}</Title>
        <Zone>{zoneName}</Zone>
        <Price>{(formatPrice + '').slice(1)} 원</Price>
        <Record>
          <InterestCount>관심 {interestsCount}</InterestCount>
          <div>∙</div>
          <Chatcount>채팅 {roomCount}</Chatcount>
        </Record>
      </Info>
    </Container>
  );
}

export default ItemBanner;
