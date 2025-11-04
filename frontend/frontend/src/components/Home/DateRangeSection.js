import React from 'react';
import PropTypes from 'prop-types';

import Section from './Section';
import { Input } from '../Generic';

const DateRangeSection = ({
  selectedOption,
  setSelectedOption,
}) => {
  const options = [
    { id: 1, label: 'Past 1 Month', disabled: false, value: 'one_month' },
    {
      id: 2,
      label: 'Past 3 Months',
      disabled: false,
      value: 'three_months',
    },
    { id: 2, label: 'Past 6 Months', disabled: false, value: 'six_months' },
    { id: 3, label: 'Past 1 Year', disabled: false, value: 'one_year' },
    { id: 4, label: 'All Time', disabled: true, value: 'all_time' },
  ];

  const defaultOption = 2;

  return (
    <Section title="Date Range">
      <p>Select the date range for statistics.</p>
      <Input
        options={options}
        selectedOption={selectedOption || options[defaultOption]}
        setSelectedOption={setSelectedOption}
      />
    </Section>
  );
};

DateRangeSection.propTypes = {
  selectedOption: PropTypes.object.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  privateAccess: PropTypes.bool.isRequired,
};

export default DateRangeSection;
