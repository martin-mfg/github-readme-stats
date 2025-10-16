import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import {
  logout as _logout,
  setUserAccess as _setUserAccess,
} from '../../redux/actions/userActions';

import Header from './Header';
import LandingScreen from '../Landing';
import DemoScreen from '../Demo';
import { SignUpScreen } from '../Auth';
import HomeScreen from '../Home';
import SettingsScreen from '../Settings';
import { NoMatchScreen } from '../Misc';
import { getUserMetadata } from '../../api';
import { WRAPPED_URL } from '../../constants';
import Footer from './Footer';

function WrappedAuthRedirectScreen() {
  // for wrapped auth redirects
  const { rest } = useParams();
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    window.location.href = `${WRAPPED_URL}/${rest}?code=${code}`;
  }, [rest]);

  return null;
}

function WrappedRedirectScreen() {
  // redirects /wrapped/* to https://www.githubwrapped.com/*
  const { userId, year } = useParams();
  useEffect(() => {
    if (userId) {
      if (year) {
        window.location.href = `${WRAPPED_URL}/${userId}/${year}`;
      } else {
        window.location.href = `${WRAPPED_URL}/${userId}`;
      }
    } else {
      window.location.href = `${WRAPPED_URL}/`;
    }
  }, [userId, year]);
}

function App() {
  const userId = useSelector((state) => state.user.userId);
  const userKey = useSelector((state) => state.user.userKey);
  const isAuthenticated = userId && userId.length > 0;

  const dispatch = useDispatch();
  const setUserAccess = (access) =>
    dispatch(_setUserAccess(access.token, access.privateAccess));

  useEffect(() => {
    async function getPrivateAccess() {
      if (userKey && userKey.length > 0) {
        const userAccess = await getUserMetadata(userKey);
        if (userAccess === null) {
          dispatch(_logout());
        } else {
          setUserAccess(userAccess);
        }
      }
    }
    getPrivateAccess();
  }, [userKey]);

  return (
    <div className="h-screen flex flex-col">
      <Router basename="/frontend">
        <Header mode="trends" />
        <section className="bg-white text-gray-700 flex-grow">
          <Routes>
            {!isAuthenticated && (
              <Route path="/signup" element={<SignUpScreen />} />
            )}
            <Route path="/demo" element={<DemoScreen />} />
            <Route
              path="/user/wrapped/:rest"
              element={<WrappedAuthRedirectScreen />}
            />
            <Route path="/user/*" element={<HomeScreen />} />
            <Route
              path="/wrapped/:userId/:year"
              element={<WrappedRedirectScreen />}
            />
            <Route
              path="/wrapped/:userId"
              element={<WrappedRedirectScreen />}
            />
            <Route path="/wrapped" element={<WrappedRedirectScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/:userId" element={<WrappedRedirectScreen />} />
            <Route exact path="/" element={<LandingScreen />} />
            <Route path="*" element={<NoMatchScreen />} />
          </Routes>
        </section>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
