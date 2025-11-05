import React from 'react';
import PropTypes from 'prop-types';

import { CheckboxSection, Image } from '../../../components';
import { CardTypes } from '../../../utils';
import TextSection from '../../../components/Home/TextSection';
import NumericSection from '../../../components/Home/NumericSection';
import LanguagesLayoutSection from '../../../components/Home/LanguagesLayoutSection';

const CustomizeStage = ({
  selectedCard,
  selectedLayout,
  setSelectedLayout,
  showTitle,
  setShowTitle,
  customTitle,
  setCustomTitle,
  langsCount,
  setLangsCount,
  enableAnimations,
  setEnableAnimations,
  hideProgress,
  setHideProgress,
  fullSuffix,
}) => {
  const cardType = selectedCard || CardTypes.STATS;
  return (
    <div className="w-full flex flex-wrap">
      <div className="h-auto lg:w-2/5 md:w-1/2 pr-10 p-10 rounded-sm bg-gray-200">
        {(cardType === CardTypes.STATS || cardType === CardTypes.TOP_LANGS) && (
          <CheckboxSection
            title="Show Title?"
            text="Shows a title at the top of the card."
            question="Show title?"
            variable={showTitle}
            setVariable={setShowTitle}
          />
        )}
        {cardType === CardTypes.STATS && (
          <TextSection
            title="Custom Title"
            text="Set a custom title for the card.<br>Leave empty for default title."
            placeholder='e.g. "My GitHub Stats"'
            value={customTitle}
            setValue={setCustomTitle}
          />
        )}
        {cardType === CardTypes.TOP_LANGS && (
          <NumericSection
            title="Language Count"
            text="Set the number of languages to be shown.<br>Leave empty for default count."
            value={langsCount}
            setValue={setLangsCount}
            min={1}
            max={20}
          />
        )}
        {cardType === CardTypes.TOP_LANGS && (
          <LanguagesLayoutSection
            selectedOption={selectedLayout}
            setSelectedOption={setSelectedLayout}
          />
        )}
        {cardType === CardTypes.TOP_LANGS && (
          <CheckboxSection
            title="Compact View"
            text="Use default view or compact view."
            question="Use compact view?"
            variable={hideProgress}
            setVariable={setHideProgress}
          />
        )}
        {cardType === CardTypes.TOP_LANGS && (
          <CheckboxSection
            title="Animations"
            text="Enable Animations."
            question="enable animations?"
            variable={enableAnimations}
            setVariable={setEnableAnimations}
          />
        )}
      </div>
      <div className="w-full lg:w-3/5 md:w-1/2 object-center pt-5 md:pt-0 pl-0 md:pl-5 lg:pl-0">
        <div className="w-full lg:w-3/5 mx-auto flex flex-col justify-center">
          <Image imageSrc={fullSuffix} />
        </div>
      </div>
    </div>
  );
};

CustomizeStage.propTypes = {
  selectedCard: PropTypes.string.isRequired,
  selectedLayout: PropTypes.object.isRequired,
  setSelectedLayout: PropTypes.func.isRequired,
  hideProgress: PropTypes.bool.isRequired,
  setHideProgress: PropTypes.func.isRequired,
  showTitle: PropTypes.bool.isRequired,
  setShowTitle: PropTypes.func.isRequired,
  customTitle: PropTypes.string.isRequired,
  setCustomTitle: PropTypes.func.isRequired,
  langsCount: PropTypes.number.isRequired,
  setLangsCount: PropTypes.func.isRequired,
  enableAnimations: PropTypes.bool.isRequired,
  setEnableAnimations: PropTypes.func.isRequired,
  fullSuffix: PropTypes.string.isRequired,
};

export default CustomizeStage;
