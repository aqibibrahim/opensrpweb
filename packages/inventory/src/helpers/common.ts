import { OPENSRP_API_BASE_URL } from '../constants';

export interface CommonProps {
  baseURL: string;
}

export const defaultCommonProps: CommonProps = {
  baseURL: OPENSRP_API_BASE_URL,
};
