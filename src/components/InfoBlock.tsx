import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

interface IProps {
  postId: number;
  title: string;
  caption: string;
  category: {
    id: number;
    name: string;
  };
}

function InfoBlock({ postId, title, caption, category }: IProps) {
  const navigate = useNavigate();
  return (
    <Info>
      <Title>{title}</Title>
      <Category>{category.name}</Category>
      {/* <Price>{price}</Price> */}
      <Price>15,000원</Price>
      <Exp>{`${caption}`}</Exp>
      <EditBtn onClick={() => navigate('edit', { state: { postId } })}>
        <span>Edit Post</span>
        <FontAwesomeIcon icon={faArrowRight} />
      </EditBtn>
    </Info>
  );
}

export default InfoBlock;
