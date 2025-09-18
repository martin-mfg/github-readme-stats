import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { BACKEND_URL } from '../constants';

const URL_PREFIX = BACKEND_URL;

const setUserKey = async (code) => {
  try {
    const key = uuidv4();
    const fullUrl = `${URL_PREFIX}/auth/web/set_user_key/${code}/${key}`;
    await axios.post(fullUrl);
    return key;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const authenticate = async (code, privateAccess, userKey) => {
  try {
    const fullUrl = `https://github-readme-stats-phi-jet-58.vercel.app/api/authenticate?code=${code}&private_access=${privateAccess}&user_key=${userKey}`;
    const result = await axios.post(fullUrl);
    return result.data;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const getUserMetadata = async (userKey) => {
  try {
    const fullUrl = `https://github-readme-stats-phi-jet-58.vercel.app/api/private-access?user_key=${userKey}`;
    const result = await axios.get(fullUrl);
    return result.data;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const deleteAccount = async (userId, userKey) => {
  try {
    const fullUrl = `https://github-readme-stats-phi-jet-58.vercel.app/api/delete-user?user_key=${userKey}`;
    const result = await axios.get(fullUrl);
    return result.data; // no decorator
  } catch (error) {
    console.error(error);
    return '';
  }
};

export { setUserKey, authenticate, getUserMetadata, deleteAccount };
