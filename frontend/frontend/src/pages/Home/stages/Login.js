/* eslint-disable react/no-array-index-key */

import React from 'react';

import { Button, Card, CheckboxSection } from '../../../components';
import { CardTypes, classnames } from '../../../utils';
import {
  GITHUB_PRIVATE_AUTH_URL,
  GITHUB_PUBLIC_AUTH_URL,
} from '../../../constants';
import { FaGithub as GithubIcon } from 'react-icons/fa';

const LoginStage = ({ setCurrItem }) => {
  const items = [
    {
      url: GITHUB_PUBLIC_AUTH_URL,
      label: 'GitHub Public Access\u00A0',
      description: 'Generate stats based on your public repositories.',
      buttonClassName: 'text-white bg-blue-500 hover:bg-blue-600',
      onClick: null,
    },
    {
      url: GITHUB_PRIVATE_AUTH_URL,
      label: 'GitHub Private Access',
      description:
        'Includes contributions in your private repositories for more complete and accurate stats.',
      buttonClassName:
        'text-black border border-black bg-white hover:bg-gray-100',
      onClick: null,
    },
    {
      url: null,
      label: 'Continue as Guest',
      description: 'TODO',
      buttonClassName:
        'text-black border border-black bg-white hover:bg-gray-100',
      onClick: () => {
        setCurrItem(1);
      },
    },
  ];

  return (
    <div className="h-full flex flex-wrap">
      <div className="hidden lg:block lg:w-3/5 lg:p-8 lg:my-auto">
        <div
          className={classnames(
            'bg-gray-200 rounded-sm w-full h-full m-auto p-8 shadow',
            'lg:h-auto',
          )}
        >
          {items.map((item, index) => {
            const button = (
              <Button
                className={
                  item.buttonClassName +
                  ' h-12 flex justify-center items-center'
                }
                onClick={item.onClick}
              >
                {item.url && <GithubIcon className="w-6 h-6" />}
                <span className="ml-2 xl:text-lg">{item.label}</span>
              </Button>
            );

            return (
              <React.Fragment key={index}>
                {index > 0 && <div className="mt-4" />}
                <div className="flex gap-4 items-center">
                  {item.url ? <a href={item.url}>{button}</a> : button}
                  <div className="flex-1">{item.description}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="w-full h-full lg:w-2/5 flex lg:flex-col lg:p-8">
        placeholder for cards
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-wrap">
      {[
        {
          title: 'GitHub Stats Card',
          description: 'your overall GitHub statistics',
          imageSrc: `?&username=${userId}`,
          demoCustomization: '&include_all_commits=true',
          cardType: 'stats',
        },
        {
          title: 'Top Languages Card',
          description: 'your most frequently used languages',
          imageSrc: `/top-langs?&username=${userId}`,
          demoCustomization: '&langs_count=4',
          cardType: 'top-langs',
        },
        {
          title: 'GitHub Extra Pin',
          description:
            'pin more than 6 repositories in your profile using a GitHub profile readme',
          imageSrc: '/pin?repo=anuraghazra/github-readme-stats',
          demoCustomization: '',
          cardType: 'pin',
        },
        {
          title: 'GitHub Gist Pin',
          description:
            'pin gists in your GitHub profile using a GitHub profile readme',
          imageSrc: '/gist?id=bbfce31e0217a3689c8d961a356cb10d',
          demoCustomization: '',
          cardType: 'gist',
        },
        {
          title: 'WakaTime Stats Card',
          description: 'your coding activity from WakaTime',
          imageSrc: '/wakatime?username=ffflabs',
          demoCustomization: '&langs_count=6&card_width=450',
          cardType: 'wakatime',
        },
      ].map((card, index) => (
        <button
          className="p-2 lg:p-4"
          key={index}
          type="button"
          onClick={() => {
            setSelectedCard(card.cardType);
            setImageSrc(card.imageSrc);
          }}
        >
          <Card
            title={card.title}
            description={card.description}
            imageSrc={card.imageSrc + card.demoCustomization}
            selected={selectedCard === card.cardType}
            fixedSize="true"
          />
        </button>
      ))}
    </div>
  );
};

LoginStage.propTypes = {
  setCurrItem: PropTypes.func.isRequired,
};

export default LoginStage;
