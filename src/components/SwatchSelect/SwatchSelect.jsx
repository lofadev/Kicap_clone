import PropTypes from 'prop-types';
import { useState } from 'react';
import SwatchCheck from '~/assets/imgs/select-pro.jpg';
import './SwatchSelect.scss';

const SwatchSelect = ({ product, field }) => {
  const [checked, setChecked] = useState(0);
  const fieldName =
    field === 'layout'
      ? 'Layout'
      : field === 'species'
      ? 'Loại'
      : field === 'color'
      ? 'Màu sắc'
      : 'Switch';
  return (
    <div className='select-swatch-items'>
      <span className='field-name'>{fieldName}:</span>
      <div className='select-swap'>
        {product[field].map((item, index) => {
          const labelName = item.toLowerCase().split(' ').join('-');
          return (
            <div key={index} className='swatch-element'>
              <input
                type='radio'
                name={`option-${field}`}
                id={`swatch-${labelName}`}
                checked={index === checked}
                onChange={() => setChecked(index)}
              />
              <label htmlFor={`swatch-${labelName}`} className='has-thumb'>
                <span className='label-name'>{item}</span>
                <img src={SwatchCheck} alt='' />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

SwatchSelect.propTypes = {
  product: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
};

export default SwatchSelect;
