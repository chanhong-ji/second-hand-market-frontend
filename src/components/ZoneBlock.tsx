import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import styled from 'styled-components';
import { zoneFirst, zoneSecond } from '../dataList';
import GetMeUser from '../hooks/getMeUser';

interface IProps {
  register: UseFormRegister<any>;
}

const Zone = styled.div`
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
`;

function ZoneBlock({ register }: IProps) {
  const meData = GetMeUser();
  const [firstZone, setFirstZone] = useState(
    meData?.me?.zoneId ? +meData.me.zoneId.slice(0, -2) : 0
  );
  return (
    <Zone>
      <label htmlFor='zone'>Zone</label>
      <select
        {...register('zoneFirst', { required: 'Zone is required' })}
        placeholder='zone'
        id='zone'
        onChange={(e) => setFirstZone(+e.target.value)}
        defaultValue={firstZone}
        style={{ marginRight: 7 }}
      >
        {zoneFirst.map((title, index) => (
          <option value={index + ''} key={index + ''}>
            {title}
          </option>
        ))}
      </select>

      <select
        {...register('zoneSecond', { required: 'Zone is required' })}
        defaultValue={
          meData?.me?.zoneId.slice(-2) ? +meData.me.zoneId.slice(-2) : 0
        }
      >
        {zoneSecond[+firstZone].map((title, index) => (
          <option value={index + ''} key={index + ''}>
            {title}
          </option>
        ))}
      </select>
    </Zone>
  );
}

export default ZoneBlock;
