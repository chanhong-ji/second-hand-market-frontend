import { useState } from 'react';
import { UseFormClearErrors, UseFormRegister } from 'react-hook-form';
import { Zone } from './shared';
import { zoneFirst, zoneSecond } from '../zones';

interface IProps {
  register: UseFormRegister<any>;
  clearErrors: UseFormClearErrors<any>;
  defaultValue?: string;
}

function ZoneBlock({ register, clearErrors, defaultValue }: IProps) {
  const [firstZone, setFirstZone] = useState(0);

  return (
    <Zone>
      <select
        {...register('first', { required: true })}
        placeholder='zone'
        onClick={() => clearErrors()}
        onChange={(e) => setFirstZone(+e.target.value)}
        defaultValue={defaultValue ? +defaultValue.slice(0, -2) : 0}
      >
        {zoneFirst.map((title, index) => (
          <option value={index + ''} key={index + ''}>
            {title}
          </option>
        ))}
      </select>

      <select
        {...register('second')}
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
