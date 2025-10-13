// Use require to bypass webpack alias and get the real axios
const axios = require('axios');
import { setupCache } from 'axios-cache-interceptor';

const cachedAxios = setupCache(axios, {
  // Cache for 30 minutes
  ttl: 30 * 60 * 1000,
  methods: ['get', 'post'],
});

export default cachedAxios;
export const { get, post } = cachedAxios;
