/* eslint-disable react/no-danger */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Section from './Section';

const TextSection = ({
  title,
  text,
  value,
  setValue,
  disabled,
  placeholder,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    // Debounce setValue
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (internalValue === value) {
      return undefined;
    }
    debounceTimeout.current = setTimeout(() => {
      setValue(internalValue);
    }, 700);
    // return cleanup function:
    return () => clearTimeout(debounceTimeout.current);
  }, [internalValue]);

  return (
    <Section title={title}>
      <p dangerouslySetInnerHTML={{ __html: text }} />
      <input
        type="text"
        className="border border-gray-300 rounded px-2 py-1 mt-2 w-1/2"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
    </Section>
  );
};

TextSection.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

TextSection.defaultProps = {
  disabled: false,
  placeholder: '',
};

export default TextSection;
