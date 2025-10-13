import axios from 'axios-original';
import { setupCache } from 'axios-cache-interceptor';

const cachedAxios = setupCache(axios, {
  // Cache for 30 minutes
  ttl: 30 * 60 * 1000,
  methods: ['get', 'post'],
});

export default cachedAxios;
export const { get, post } = cachedAxios;
