import React from 'react';
import PropTypes from 'prop-types';

import Section from './Section';
import { Input } from '../Generic';

export const DEFAULT_OPTION = {
  id: 1,
  label: 'Rank',
  disabled: false,
  value: 'default',
};

const StatsLayoutSection = ({ selectedOption, setSelectedOption }) => {
  const options = [
    DEFAULT_OPTION,
    { id: 2, label: 'Percentile', disabled: false, value: 'percentile' },
    { id: 3, label: 'GitHub', disabled: false, value: 'github' },
    { id: 4, label: 'None', disabled: false, value: 'default&hide_rank=true' },
  ];

  return (
    <Section title="Card Layout">
      <p>Select a card layout.</p>
      <Input
        options={options}
        selectedOption={selectedOption || DEFAULT_OPTION}
        setSelectedOption={setSelectedOption}
      />
    </Section>
  );
};

StatsLayoutSection.propTypes = {
  selectedOption: PropTypes.object.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
};

export default StatsLayoutSection;
