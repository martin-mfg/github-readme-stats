import React from 'react';
import { FaGithub as GithubIcon } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="body-font">
      <div className="bg-gray-100 border-t border-gray-300">
        <div className="container mx-auto py-4 px-5 flex justify-center">
          <a
            href="https://www.github.com/avgupta456/github-trends"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              type="button"
              className="rounded-sm shadow bg-gray-700 hover:bg-gray-800 text-gray-50 px-3 py-2 flex items-center"
            >
              Star on
              <GithubIcon className="ml-1.5 w-5 h-5" />
            </button>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
