import { getAppEnv } from 'core/utils';

const awsmobileDev = {
  aws_project_region: 'eu-west-1',
  aws_cognito_identity_pool_id: 'eu-west-1:5c0b75eb-d7dc-4e0f-8769-a1e66b918649',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_kiVYq3ZqV',
  aws_user_pools_web_client_id: '7up15n6ho39bfjqunc2p9vnu9n',
  oauth: {},
};

const awsmobileOMDev = {
  aws_project_region: 'eu-west-1',
  aws_cognito_identity_pool_id: 'eu-west-1:30c1741f-a438-4c0f-9350-61b16804517b',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_xA2aAhDx3',
  aws_user_pools_web_client_id: '5rdna0gtpdalmkcpjdch516cs',
  oauth: {},
};

const awsmobileTest = {
  aws_project_region: 'eu-west-1',
  aws_cognito_identity_pool_id: 'eu-west-1:bfd4abc1-b491-4676-9635-f3ad714f2ee2',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_l2G4Ol5ia',
  aws_user_pools_web_client_id: '5l3ggd7stetlkrgn8c2fqqrtd4',
  oauth: {},
};

const awsmobileProd = {
  aws_project_region: 'eu-west-1',
  aws_cognito_identity_pool_id: 'eu-west-1:105cde1d-451a-4b89-aac8-d6d8359f0f74',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_GsaswP7tR',
  aws_user_pools_web_client_id: '66ed0394hnqsh2jkren98oec65',
  oauth: {},
};

const awsmobileNavigilTest = {
  aws_project_region: 'eu-west-1',
  aws_cognito_identity_pool_id: 'eu-west-1:b7ea19f3-583e-4e81-9be0-ba71fd55b4fc',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_VKf36HyrY',
  aws_user_pools_web_client_id: '1t7sdiqlda8tu2s1t01arim71n',
  oauth: {},
};

const awsmobileUSTest = {
  aws_project_region: 'us-east-1',
  aws_cognito_identity_pool_id: 'us-east-1:0dcc2338-9fe8-4e17-9f9d-d7aac53b3b33',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_vy92Tgc75',
  aws_user_pools_web_client_id: '6q5359hp7t6asbmcb6mf07o1jc',
  oauth: {},
};

export const getApiEnv = env => {
  switch (env) {
    case 'prod':
      return awsmobileProd;
    case 'staging':
      return awsmobileTest;
    case 'test':
      return awsmobileTest;
    case 'omdev':
      return awsmobileOMDev;
    case 'navigiltest':
      return awsmobileNavigilTest;
    case 'ustest':
      return awsmobileUSTest;
    case 'dev':
    default:
      return awsmobileDev;
  }
};

const awsmobile = getApiEnv(getAppEnv());

export default awsmobile;
