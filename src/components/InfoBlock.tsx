import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getFormatValue } from '../shared/utils';
import { seePost_seePost } from '../__generated__/seePost';

const Title = styled.div``;
const Category = styled.div``;
const Price = styled.div``;
const Exp = styled.div``;
const EditBtn = styled.div``;
const Info = styled.div`
  padding: 30px 0;
  border-bottom: 1px solid ${(p) => p.theme.color.border};
  border-top: 1px solid ${(p) => p.theme.color.border};
  min-height: 250px;
  position: relative;
  ${Title} {
    font-size: 20px;
    font-weight: 600;
  }
  ${Category} {
    font-size: 14px;
    margin-top: 5px;
    color: grey;
  }
  ${Price} {
    margin-top: 9px;
    font-size: 15px;
    font-weight: 600;
  }
  ${Exp} {
    margin-top: 20px;
    color: ${(p) => p.theme.color.font.exp};
  }
  ${EditBtn} {
    position: absolute;
    right: 0;
    bottom: 10px;
    font-size: 15px;
    color: grey;
    :hover {
      color: black;
      cursor: pointer;
    }
    span {
      margin-right: 5px;
    }
  }
`;

function InfoBlock({
  id: postId,
  title,
  caption,
  dealt,
  price,
  photos,
  category,
  isMine,
}: seePost_seePost) {
  const formatPrice = String(getFormatValue(price)).slice(1);
  return (
    <Info>
      <Title>{title}</Title>
      <Category>{category.name}</Category>
      <Price>{formatPrice} 원</Price>
      <Exp>{`${caption}`}</Exp>
      <Link
        to='edit'
        state={{
          title,
          caption,
          photoUrl: photos[0],
          postId,
          price,
          categoryName: category.name,
          isMine,
        }}
      >
        {!!isMine && !!!dealt && (
          <EditBtn>
            <span>Edit Post</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </EditBtn>
        )}
      </Link>
    </Info>
  );
}

export default InfoBlock;
