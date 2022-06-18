import { UseFormRegister } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ZoneBlock from './ZoneBlock';

const Title = styled.div``;
const Options = styled.form``;
const OptionBtn = styled.button``;
const Top = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${Title} {
    font-size: 17px;
    font-weight: 600;
    margin-left: 30px;
    span {
      margin-left: 10px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
  ${Options} {
    label {
      font-size: 15px;
      color: grey;
      font-weight: 600;
      margin-right: 5px;
    }
    select {
      border: none;
      outline: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    }

    ${OptionBtn} {
      padding: 5px;
      border-radius: 5px;
    }
  }
`;

interface IProps {
  children?: any;
  register: UseFormRegister<any>;
  handleSubmit: any;
  loading: boolean;
}

function PostsTop({ handleSubmit, register, loading, children }: IProps) {
  const { search } = useLocation();
  return (
    <Top>
      <Title>
        중고거래
        {search && <span>검색어: {search.split('=').slice(-1)}</span>}
      </Title>
      <Options onSubmit={handleSubmit}>
        <ZoneBlock register={register}>
          <label htmlFor='zone'>Zone</label>
        </ZoneBlock>

        {children}

        <OptionBtn disabled={loading} onClick={handleSubmit}>
          검색
        </OptionBtn>
      </Options>
    </Top>
  );
}

export default PostsTop;
