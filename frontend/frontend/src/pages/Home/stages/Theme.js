/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '../../../components';
import { themes } from 'github-readme-stats/themes/index.js';

const ThemeStage = ({ theme, setTheme, fullSuffix }) => {
  return (
    <div className="flex flex-wrap">
      {Object.keys(themes).map((myTheme, index) => (
        <button
          className="p-2 lg:p-4"
          key={index}
          type="button"
          onClick={() => setTheme(myTheme)}
        >
          <Card
            title={myTheme}
            description=""
            imageSrc={`${fullSuffix}&theme=${myTheme}`}
            selected={theme === myTheme}
          />
        </button>
      ))}
    </div>
  );
};

ThemeStage.propTypes = {
  theme: PropTypes.string.isRequired,
  setTheme: PropTypes.func.isRequired,
  fullSuffix: PropTypes.string.isRequired,
};

export default ThemeStage;
