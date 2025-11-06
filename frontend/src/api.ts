import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { paths } from './lib/api/v1';

export function getBaseUrl() {
  return import.meta.env.DEV ? 'http://localhost:3000' : '';
}

export const fetchClient = createFetchClient<paths>({
  baseUrl: getBaseUrl(),
});

export const $api = createClient(fetchClient);
