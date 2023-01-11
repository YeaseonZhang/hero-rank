import { kohRequest } from './base.js';

export const rankList = ({ heroId, areaId, adcode, token, userId }) =>
  kohRequest({
    url: '/honor/ranklist',
    method: 'post',
    data: {
      heroId,
      areaId,
      adcode,
      token,
      userId,
    },
  });
