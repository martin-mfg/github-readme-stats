import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const cachedAxios = setupCache(axios, {
  // Cache for 30 minutes
  ttl: 30 * 60 * 1000,
  interpretHeader: false,
  methods: ['get', 'post'],
});

axios.get = cachedAxios.get.bind(cachedAxios);
axios.post = cachedAxios.post.bind(cachedAxios);

export default cachedAxios;
export const { get, post } = cachedAxios;
