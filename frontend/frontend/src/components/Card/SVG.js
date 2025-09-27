/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-danger */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SvgInline = (props) => {
  const [svg, setSvg] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);
  const { url } = props;

  useEffect(() => {
    setLoaded(false);
    fetch(url)
      .then((res) => res.text())
      .then(setSvg)
      .then(() => setLoaded(true))
      .catch((e) => console.error(e));
  }, [props.url]);

  useEffect(() => {
    if (loaded && svg && containerRef.current) {
      let shadow = containerRef.current.shadowRoot;
      if (!shadow) {
        shadow = containerRef.current.attachShadow({ mode: 'open' });
      }
      shadow.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.innerHTML = svg;
      shadow.appendChild(wrapper);
    }
  }, [loaded, svg]);

  if (props.forceLoading || !loaded) {
    if (props.compact) {
      return <Skeleton style={{ paddingBottom: '58%' }} />;
    }
    // these are the maximum dimensions of cards in SelectCard stage
    return <Skeleton className="h-[245px] w-[450px]" />;
  }

  return <div ref={containerRef} id="svgWrapper" className={props.className} />;
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
