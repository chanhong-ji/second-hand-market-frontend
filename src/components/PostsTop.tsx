import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ZoneBlock from './ZoneBlock';
import { categoryList } from '../dataList';

const Title = styled.div``;
const Options = styled(motion.form)``;
const CategoryOption = styled.div``;
const OptionBtn = styled.button``;
const Top = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 30px 40px 0px 40px;
  ${Title} {
    font-size: 17px;
    font-weight: 600;
    span {
      margin-left: 10px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .icon {
    cursor: pointer;
    font-size: 25px;
    color: ${(p) => p.theme.color.blue};
  }
  ${Options} {
    z-index: 1;
    padding: 10px;
    background-color: ${(p) => p.theme.color.bg.layout};
    border: 1px solid ${(p) => p.theme.color.border};
    border-radius: 10px;
    border-top-right-radius: 0;
    position: absolute;
    top: 60px;
    right: 40px;
    ${CategoryOption} {
      label {
        display: block;
        margin-bottom: 7px;
        margin-top: 20px;
      }
      select {
        font-size: 19px;
        border: none;
        padding: 5px;
        box-shadow: rgba(0, 0, 0, 0.01) 0px 1px 3px 0px,
          rgba(27, 31, 35, 0.1) 0px 0px 0px 1px;
      }
    }
    ${OptionBtn} {
      padding: 5px;
      border: none;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      border-radius: 5px;
      font-size: 17px;
      width: 100%;
      margin-top: 10px;
    }
  }
`;

interface IProps {
  register: UseFormRegister<any>;
  handleSubmit: any;
  loading: boolean;
}

function PostsTop({ handleSubmit, register, loading }: IProps) {
  const { search } = useLocation();
  const [menuClicked, setMenuClicked] = useState(false);
  const menuAnimation = useAnimation();

  useEffect(() => {
    if (menuClicked) {
      menuAnimation.start({ opacity: 1, display: 'block' });
    } else {
      menuAnimation.start({ opacity: 0, display: 'none' });
    }
  }, [menuClicked]);

  return (
    <Top>
      <Title>
        중고거래
        {search && <span>검색어: {search.split('=').slice(-1)}</span>}
      </Title>
      <FontAwesomeIcon
        icon={faFilter}
        onClick={() => setMenuClicked((prev) => !prev)}
        className='icon'
      />
      <Options
        onSubmit={handleSubmit}
        animate={menuAnimation}
        initial={{ opacity: 0, display: 'none' }}
        transition={{ duration: 0.2 }}
      >
        <ZoneBlock register={register} />
        {!!!search && (
          <CategoryOption>
            <label htmlFor='category'>Category</label>
            <select
              {...register('categoryName', { required: true })}
              id='category'
              defaultValue='all'
            >
              <option value='all' key='all'>
                전체
              </option>
              {categoryList.map((cate, index) => (
                <option value={cate} key={index + ''}>
                  {cate}
                </option>
              ))}
            </select>
          </CategoryOption>
        )}
        <OptionBtn disabled={loading} onClick={handleSubmit}>
          검색
        </OptionBtn>
      </Options>
    </Top>
  );
}

export default PostsTop;
