import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import styled from 'styled-components';
import { zoneFirst, zoneSecond } from '../dataList';
import GetMeUser from '../hooks/getMeUser';

interface IProps {
  register: UseFormRegister<any>;
  children?: any;
}

const Zone = styled.div``;

function ZoneBlock({ register, children }: IProps) {
  const meData = GetMeUser();
  const [firstZone, setFirstZone] = useState(meData?.me?.zoneFirst ?? 0);

  return (
    <Zone>
      {children}
      <select
        {...register('zoneFirst', { required: 'Zone is required' })}
        placeholder='zone'
        id='zone'
        onChange={(e) => setFirstZone(+e.target.value)}
        defaultValue={meData?.me?.zoneFirst ?? 0}
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
        defaultValue={meData?.me?.zoneSecond ?? 0}
      >
        {zoneSecond[firstZone].map((title, index) => (
          <option value={index + ''} key={index + ''}>
            {title}
          </option>
        ))}
      </select>
    </Zone>
  );
}

export default ZoneBlock;
