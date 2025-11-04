import React from 'react';
import PropTypes from 'prop-types';

import { CheckboxSection, DateRangeSection, Image } from '../../../components';
import { CardTypes } from '../../../utils';
import TextSection from '../../../components/Home/TextSection';
import NumericSection from '../../../components/Home/NumericSection';

const CustomizeStage = ({
  selectedCard,
  selectedTimeRange,
  setSelectedTimeRange,
  usePrivate,
  setUsePrivate,
  groupOther,
  setGroupOther,
  groupPrivate,
  setGroupPrivate,
  privateAccess,
  useCompact,
  setUseCompact,
  usePercent,
  setUsePercent,
  useLocChanged,
  setUseLocChanged,
  showTitle,
  setShowTitle,
  customTitle,
  setCustomTitle,
  langsCount,
  setLangsCount,
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
        <DateRangeSection
          selectedOption={selectedTimeRange}
          setSelectedOption={setSelectedTimeRange}
        />
        {cardType === CardTypes.TOP_LANGS && (
          <CheckboxSection
            title="Compact View"
            text="Use default view or compact view."
            question="Use compact view?"
            variable={useCompact}
            setVariable={setUseCompact}
          />
        )}
        <CheckboxSection
          title="Include Private Repositories?"
          text="By default, private commits are hidden. We will never reveal private repository information."
          question="Use private commits?"
          variable={usePrivate}
          setVariable={setUsePrivate}
          disabled={!privateAccess}
        />
        {cardType === CardTypes.STATS && (
          <CheckboxSection
            title="Group Other Repositories?"
            text="Group all remaining repositories together at the bottom of the card."
            question="Group other repositories?"
            variable={groupOther}
            setVariable={setGroupOther}
          />
        )}
        {cardType === CardTypes.STATS && usePrivate && groupOther && (
          <CheckboxSection
            title="Group Private Repositories?"
            text="Force private repositories together at the bottom of the card."
            question="Group private commits?"
            variable={groupPrivate}
            setVariable={setGroupPrivate}
          />
        )}
        {cardType === CardTypes.TOP_LANGS && (
          <CheckboxSection
            title="Percent vs LOC"
            text="Use absolute LOC (default) or percent to rank your top repositories"
            question="Use percent?"
            variable={usePercent}
            setVariable={setUsePercent}
            disabled={useCompact}
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
        <CheckboxSection
          title="LOC Metric"
          text="By default, LOC are measured as Added: (+) - (-). Alternatively, you can use Changed: (+) + (-)"
          question="Use LOC changed?"
          variable={useLocChanged}
          setVariable={setUseLocChanged}
          disabled={cardType === CardTypes.TOP_LANGS && usePercent}
        />
      </div>
      <div className="w-full lg:w-3/5 md:w-1/2 object-center pt-5 md:pt-0 pl-0 md:pl-5 lg:pl-0">
        <div className="w-full lg:w-3/5 mx-auto flex flex-col justify-center">
          <Image imageSrc={fullSuffix} compact={useCompact} />
        </div>
      </div>
    </div>
  );
};

CustomizeStage.propTypes = {
  selectedCard: PropTypes.string.isRequired,
  selectedTimeRange: PropTypes.object.isRequired,
  setSelectedTimeRange: PropTypes.func.isRequired,
  usePrivate: PropTypes.bool.isRequired,
  setUsePrivate: PropTypes.func.isRequired,
  groupOther: PropTypes.bool.isRequired,
  setGroupOther: PropTypes.func.isRequired,
  groupPrivate: PropTypes.bool.isRequired,
  setGroupPrivate: PropTypes.func.isRequired,
  privateAccess: PropTypes.bool.isRequired,
  useCompact: PropTypes.bool.isRequired,
  setUseCompact: PropTypes.func.isRequired,
  hideProgress: PropTypes.bool.isRequired,
  setHideProgress: PropTypes.func.isRequired,
  usePercent: PropTypes.bool.isRequired,
  setUsePercent: PropTypes.func.isRequired,
  useLocChanged: PropTypes.bool.isRequired,
  setUseLocChanged: PropTypes.func.isRequired,
  showTitle: PropTypes.bool.isRequired,
  setShowTitle: PropTypes.func.isRequired,
  customTitle: PropTypes.string.isRequired,
  setCustomTitle: PropTypes.func.isRequired,
  langsCount: PropTypes.number.isRequired,
  setLangsCount: PropTypes.func.isRequired,
  fullSuffix: PropTypes.string.isRequired,
};

export default CustomizeStage;
