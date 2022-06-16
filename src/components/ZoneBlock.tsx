import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import styled from 'styled-components';
import { zoneFirst, zoneSecond } from '../dataList';

interface IProps {
  register: UseFormRegister<any>;
  defaultValue?: string;
  children?: any;
}

const Zone = styled.div``;

function ZoneBlock({ register, defaultValue, children }: IProps) {
  const [firstZone, setFirstZone] = useState(0);

  return (
    <Zone>
      {children}
      <select
        {...register('first', { required: 'Zone is required' })}
        placeholder='zone'
        id='zone'
        onChange={(e) => setFirstZone(+e.target.value)}
        defaultValue={defaultValue ? +defaultValue.slice(0, -2) : 0}
        style={{ marginRight: 7 }}
      >
        {zoneFirst.map((title, index) => (
          <option value={index + ''} key={index + ''}>
            {title}
          </option>
        ))}
      </select>

      <select
        {...register('second', { required: 'Zone is required' })}
        defaultValue={defaultValue ? +defaultValue.slice(-2) : 0}
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
