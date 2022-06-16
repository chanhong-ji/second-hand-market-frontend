import { UseFormRegister } from 'react-hook-form';
import styled from 'styled-components';
import { categoryList } from '../dataList';

interface IProps {
  register: UseFormRegister<any>;
  defaultValue?: string;
}

const CategoryDiv = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.color.border};
  padding: 10px;
  label {
    display: block;
    margin-bottom: 4px;
    font-size: 15px;
    color: grey;
    font-weight: 600;
  }
  select {
    margin-top: 10px;
    font-size: 20px;
    border: none;
    outline: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }
`;

function CategoryBlock({ register, defaultValue }: IProps) {
  return (
    <CategoryDiv>
      <label htmlFor='categoryName'>Category</label>
      <select
        {...register('categoryName', { required: 'Cateogory is required' })}
        id='categoryName'
      >
        {categoryList.map((cate, index) => (
          <option value={cate} key={index + ''}>
            {cate}
          </option>
        ))}
      </select>
    </CategoryDiv>
  );
}

export default CategoryBlock;
