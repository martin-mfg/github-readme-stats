/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-danger */

import React from 'react';
import PropTypes from 'prop-types';

import Section from './Section';
import { Checkbox } from '../Generic';

const CheckboxSection = ({
  title,
  text,
  question,
  variable,
  setVariable,
  disabled,
}) => {
  return (
    <Section title={title}>
      <p dangerouslySetInnerHTML={{ __html: text }} />
      <Checkbox
        question={question}
        variable={variable}
        setVariable={setVariable}
        disabled={disabled}
      />
    </Section>
  );
};

CheckboxSection.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  variable: PropTypes.bool.isRequired,
  setVariable: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

CheckboxSection.defaultProps = {
  disabled: false,
};

export default CheckboxSection;
