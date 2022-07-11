import { SubmitHandler, useForm } from 'react-hook-form';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { searchPostVariables } from '../__generated__/searchPost';

const Wrapper = styled.form<{ isMobile: boolean }>`
  width: 100%;
  height: 100%;
  input {
    width: 100%;
    height: 100%;
    border: none;
    background-color: ${(p) => p.theme.color.header.input};
    border-radius: 10px;
    font-size: 20px;
    font-size: ${(p) => (p.isMobile ? '15px' : '20px')};
    padding-left: 25px;
    outline: none;
  }
`;

function SearchBar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 865 });
  const { register, handleSubmit, setValue } = useForm<searchPostVariables>();

  const onValid: SubmitHandler<searchPostVariables> = ({ keyword }) => {
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword.trim().toLowerCase()}`);
      setValue('keyword', '');
    }
  };

  return (
    <Wrapper onSubmit={handleSubmit(onValid)} isMobile={isMobile}>
      <input
        {...register('keyword')}
        placeholder='필요한 물품을 검색해보세요'
      />
    </Wrapper>
  );
}

export default SearchBar;
