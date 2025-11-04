import React from 'react';
import PropTypes from 'prop-types';

import Section from './Section';
import { Input } from '../Generic';

export const DEFAULT_OPTION = {
  id: 4,
  label: 'Past 1 Year',
  disabled: false,
  value: 'one_year',
};

const DateRangeSection = ({ selectedOption, setSelectedOption }) => {
  const options = [
    { id: 1, label: 'Past 1 Month', disabled: false, value: 'one_month' },
    { id: 2, label: 'Past 3 Months', disabled: false, value: 'three_months' },
    { id: 3, label: 'Past 6 Months', disabled: false, value: 'six_months' },
    DEFAULT_OPTION,
    { id: 5, label: 'All Time', disabled: true, value: 'all_time' },
  ];

  return (
    <Section title="Date Range">
      <p>Select the date range for statistics.</p>
      <Input
        options={options}
        selectedOption={selectedOption || DEFAULT_OPTION}
        setSelectedOption={setSelectedOption}
      />
    </Section>
  );
};

DateRangeSection.propTypes = {
  selectedOption: PropTypes.object.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
};

export default DateRangeSection;
