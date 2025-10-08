import axios from 'axios';
import { default as router } from '../../backend/.vercel/output/functions/api.func/router.js';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BounceLoader from 'react-spinners/BounceLoader';

import { v4 as uuidv4 } from 'uuid';
import { ProgressBar } from '../../components';
import {
  CustomizeStage,
  DisplayStage,
  SelectCardStage,
  ThemeStage,
} from './stages';

import { authenticate } from '../../api';
import { login as _login } from '../../redux/actions/userActions';
import { HOST } from '../../constants';
import { CardTypes } from '../../utils';
import { createMockReq, createMockRes } from '../../mock-http';

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const userId = useSelector((state) => state.user.userId);
  const privateAccess = useSelector((state) => state.user.privateAccess);

  const isAuthenticated = userId && userId.length > 0;

  const dispatch = useDispatch();

  const login = (newUserId, userKey) => dispatch(_login(newUserId, userKey));

  // for all stages
  const [stage, setStage] = useState(0);

  // for stage one
  const [selectedCard, setSelectedCard] = useState();
  const [imageSrc, setImageSrc] = useState(`?&username=${userId}`);

  // for stage two
  const defaultTimeRange = {
    id: 3,
    label: 'Past 1 Year',
    disabled: false,
    value: 'one_year',
  };
  const [selectedTimeRange, setSelectedTimeRange] = useState(defaultTimeRange);

  const [usePercent, setUsePercent] = useState(false);
  const [usePrivate, setUsePrivate] = useState(false);
  const [groupOther, setGroupOther] = useState(false);
  const [groupPrivate, setGroupPrivate] = useState(false);
  const [useLocChanged, setUseLocChanged] = useState(false);
  const [useCompact, setUseCompact] = useState(false);

  const [showTitle, setShowTitle] = useState(true);
  const [customTitle, setCustomTitle] = useState('');
  const [langsCount, setLangsCount] = useState();

  const resetCustomization = () => {
    setSelectedTimeRange(defaultTimeRange);
    setUsePercent(false);
    setUsePrivate(false);
    setUseLocChanged(false);
    setUseCompact(false);
  };

  useEffect(() => {
    resetCustomization();
  }, [selectedCard]);

  const time = selectedTimeRange.value;
  let fullSuffix = `${imageSrc}&time_range=${time}`;

  if (usePercent) {
    fullSuffix += '&use_percent=True';
  }

  if (usePrivate) {
    fullSuffix += '&include_private=True';
  }

  if (usePrivate && groupOther && groupPrivate) {
    fullSuffix += '&group=private';
  } else if (groupOther) {
    fullSuffix += '&group=other';
  }

  if (useLocChanged) {
    fullSuffix += '&loc_metric=changed';
  }

  if (useCompact) {
    fullSuffix += '&compact=True';
  }

  if (!showTitle) {
    fullSuffix += '&hide_title=true';
  }

  if (customTitle) {
    const encodedTitle = encodeURIComponent(customTitle);
    fullSuffix += `&custom_title=${encodedTitle}`;
  }

  if (langsCount) {
    fullSuffix += `&langs_count=${langsCount}`;
  }

  // for stage three
  const [theme, setTheme] = useState('default');
  const themeSuffix = `${fullSuffix}&theme=${theme}`;

  useEffect(() => {
    async function redirectCode() {
      // After requesting Github access, Github redirects back to your app with a code parameter
      const url = window.location.href;

      // If Github API returns the code parameter
      if (url.includes('code=')) {
        const tempPrivateAccess = url.includes('private');
        const newUrl = url.split('?code=');
        const redirect = `${url.split(HOST)[0]}${HOST}/frontend/user`;
        window.history.pushState({}, null, redirect);
        setIsLoading(true);
        const userKey = uuidv4();
        const newUserId = await authenticate(
          newUrl[1],
          tempPrivateAccess,
          userKey,
        );
        login(newUserId, userKey);
        try {
          let testEndpoint = async (path) => {
            const req = createMockReq({
              method: 'GET',
              url: path,
            });
            const res = createMockRes();
            try {
              await router(req, res);
              const body = res._getBody();
              const status = res._getStatusCode();
              console.log('mock results: ', { status, body });
            } catch (e) {
              console.log('mock http error: ', e);
            }
          };
          const ghToken = prompt('input GitHub token:');
          // process.env['PAT_1'] = ghToken;
          await testEndpoint('/api/status/pat-info');
          await testEndpoint('/api/status/up');
          await testEndpoint('/api?username=martin-mfg');
          await testEndpoint('/api/gist?id=bbfce31e0217a3689c8d961a356cb10d');
          await testEndpoint(
            '/api/pin/?username=martin-mfg&repo=openapi-generator',
          );
          await testEndpoint(
            '/api/top-langs/?username=anuraghazra&langs_count=4',
          );
          // TODO: wakatime
          // console.log(router);
          /*
          const restResult = await axios.get(
            'https://api.github.com/search/commits?q=author:martin-mfg',
          );
          console.log(restResult);
          const ghToken = prompt('input GitHub token:');
          const graphqlResult = await axios.post(
            'https://api.github.com/graphql',
            {
              query: 'query { viewer { login }}',
            },
            {
              headers: {
                Authorization: `Bearer ${ghToken}`,
              },
            },
          );
          console.log(graphqlResult);
*/
        } catch (e) {
          console.error(e);
        }
        setIsLoading(false);
      }
    }

    redirectCode();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full py-8 flex justify-center items-center">
        <BounceLoader color="#3B82F6" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-full py-8 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Please sign in to access this page
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full px-2 py-4 lg:p-8 text-gray-600 body-font">
      <div className="flex flex-col">
        <ProgressBar
          items={[
            'Select Card',
            'Modify Parameters',
            'Customize Theme',
            'Display Card',
          ]}
          currItem={stage}
          setCurrItem={setStage}
        />
        <div className="m-4 rounded-sm">
          <div className="lg:p-4">
            <div className="text-2xl text-gray-600 font-semibold">
              {
                [
                  'Select a Card',
                  'Modify Card Parameters',
                  'Choose a Theme',
                  'Display your Card',
                ][stage]
              }
            </div>
            <div>
              {
                [
                  'You will be able to customize your card in future steps.',
                  'Change the date range, include private commits, and more!',
                  'Choose from one of our predefined themes (more coming soon!)',
                  'Display your card on GitHub, Twitter, or Linkedin',
                ][stage]
              }
            </div>
          </div>
          {stage === 0 && (
            <SelectCardStage
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              setImageSrc={setImageSrc}
            />
          )}
          {stage === 1 && (
            <CustomizeStage
              selectedCard={selectedCard || CardTypes.STATS}
              imageSrc={imageSrc}
              selectedTimeRange={selectedTimeRange}
              setSelectedTimeRange={setSelectedTimeRange}
              usePrivate={usePrivate}
              setUsePrivate={setUsePrivate}
              groupOther={groupOther}
              setGroupOther={setGroupOther}
              groupPrivate={groupPrivate}
              setGroupPrivate={setGroupPrivate}
              privateAccess={privateAccess}
              useCompact={useCompact}
              setUseCompact={setUseCompact}
              usePercent={usePercent}
              setUsePercent={setUsePercent}
              useLocChanged={useLocChanged}
              setUseLocChanged={setUseLocChanged}
              showTitle={showTitle}
              setShowTitle={setShowTitle}
              customTitle={customTitle}
              setCustomTitle={setCustomTitle}
              langsCount={langsCount}
              setLangsCount={setLangsCount}
              fullSuffix={fullSuffix}
            />
          )}
          {stage === 2 && (
            <ThemeStage
              theme={theme}
              setTheme={setTheme}
              fullSuffix={fullSuffix}
            />
          )}
          {stage === 3 && (
            <DisplayStage userId={userId} themeSuffix={themeSuffix} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
