/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-danger */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { createMockReq, createMockRes } from '../../mock-http';
import { default as router } from '../../backend/.vercel/output/functions/api.func/router.js';

const waitForPat = async (interval = 100) => {
  while (true) {
    if (process.env.PAT_1 !== 'placeholderPAT') return;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
};

const SvgInline = (props) => {
  const [svg, setSvg] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);
  const { url } = props;

  useEffect(() => {
    setLoaded(false);

    const req = createMockReq({
      method: 'GET',
      url: url,
    });
    const res = createMockRes();

    waitForPat()
      .then(() => router(req, res))
      .then(() => {
        const body = res._getBody();
        const status = res._getStatusCode();
        if (status >= 300) {
          throw new Error('failed to generate SVG');
        }
        return body;
      })
      .then(setSvg)
      .then(() => setLoaded(true))
      .catch((e) => console.error(e));
  }, [props.url]);

  useEffect(() => {
    if (loaded && svg && containerRef.current) {
      // Attach shadow root if not already present
      let shadow = containerRef.current.shadowRoot;
      if (!shadow) {
        shadow = containerRef.current.attachShadow({ mode: 'open' });
      }
      // Clear previous content
      shadow.innerHTML = '';
      // Insert SVG
      const wrapper = document.createElement('div');
      wrapper.innerHTML = svg;
      shadow.appendChild(wrapper);
    }
  }, [loaded, svg]);

  if (props.forceLoading || !loaded) {
    if (props.compact) {
      return <Skeleton style={{ paddingBottom: '58%' }} />;
    }
    // maximum dimensions of cards in SelectCard stage
    return <Skeleton className="h-[245px] w-[450px]" />;
  }

  // Render a container div for the shadow DOM
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
