/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-danger */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SvgInline = (props) => {
  const [svg, setSvg] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [loaded, setLoaded] = useState(false);

  const { url } = props;

  useEffect(() => {
    setLoaded(false);
    fetch(url)
      .then((res) => res.text())
      .then(setSvg)
      .then(() => setLoaded(true))
      .catch((e) => console.error(e));
  }, [props.url]);

  if (props.forceLoading || !loaded) {
    if (props.compact) {
      return <Skeleton style={{ paddingBottom: '58%' }} />;
    }
    return <Skeleton style={{ paddingBottom: '95%' }} />;
  }

  if (props.compact) {
    return (
      <div
        className={props.className}
        dangerouslySetInnerHTML={{
          __html: `<div id="svg-card">${svg}</div>`,
        }}
      />
    );
  }

  return (
    <div
      className={props.className}
      dangerouslySetInnerHTML={{
        __html: `<div id="svg-card">${svg}</div>`,
      }}
    />
  );
};

SvgInline.propTypes = {
  className: PropTypes.any,
  url: PropTypes.string.isRequired,
  forceLoading: PropTypes.bool,
  compact: PropTypes.bool,
};

SvgInline.defaultProps = {
  className: '',
  forceLoading: false,
  compact: false,
};

export default SvgInline;
