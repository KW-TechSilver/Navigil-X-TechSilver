import camelize from 'camelize';
import { has, includes, isEmpty, map } from 'lodash';
import { getAppEnv } from 'core/utils';
import { Auth } from 'aws-amplify';
import { format } from 'i18n/date-fns';
import awsconfig from '../../aws-config';
import { requiredPermissions } from '../permissions';
import {
  createDeviceCoordinates,
  createGeofence,
  deleteCoordinates,
  deleteGeofence as deleteGeofenceEndpoint,
  deviceCommand,
  deviceSettings,
  deviceStatus,
  getAllUsers,
  getBeacons,
  getCommandHistory,
  getCompanyDevices,
  getCoordinates,
  getCoordinatesByLatLng,
  getGoogleAddress,
  heatmap,
  signalstrength,
  callLog,
  devicesCallLog,
  getCompanyLatestCoordinates,
  getDeviceLogFiles,
  getFirmware,
  getMessageQueue,
  getGeofences as getGeofencesEndpoint,
  getListCompanyGroups,
  getLoginpageSettings,
  getMonthlyAlerts,
  importDevices,
  intlMessages,
  listDevices,
  listLanguage,
  listLocale,
  manageCompanies,
  readDeviceData,
  readServiceSettings,
  readWatchData,
  sendConsoleCommand,
  updateGeofence as updateGeofenceEndpoint,
  getDevicesAccess,
  listLanguageData,
  listLanguageKeyGroups,
  listLanguageDataKeyGroups,
  langData,
  keyData,
  missingLanguageTrans,
  a3CountryCode,
  userGroupAccess,
  companyGroup,
  deviceProfiles,
  deviceProfleAccess,
  getDevices,
  getDevicesCodes,
  userDeviceAccess,
  manageUsers,
  userNotifications,
  mobileDevice,
  groupCompanyDelete,
  manageCompanySubscription,
  manageGroupSubscription,
  companyCallCenter,
  companyCallCenterAccess,
  companyScaipEndPoints,
  reports,
  reportRows,
  manageBeacons,
  emergencyRecordings,
  userExist,
  smsSend,
  smsBalance,
  coordinateDates,
  getBackgrounds,
} from './Endpoints';

const getApiEnv = () => {
  const env = getAppEnv();
  switch (env) {
    case 'prod':
      return 'apiProd';
    case 'staging':
      return 'apiProd';
    case 'test':
      return 'apiTest';
    case 'omdev':
      return 'apiOMDev';
    case 'jsdev':
      return 'apiJSDev';
    case 'navigiltest':
      return 'apiNavigilTest';
    case 'ustest':
      return 'apiUSTest';
    case 'dev':
    default:
      return 'apiDev';
  }
};

const apiUrlPath = path => `${awsconfig[getApiEnv()].apiUrl}${path}`;
const apiDeviceUrlPath = path => `${awsconfig[getApiEnv()].apiDeviceUrl}${path}`;
const apiCompanyUrlPath = path => `${awsconfig[getApiEnv()].apiCompanyUrl}${path}`;
const apiUsersUrlPath = path => `${awsconfig[getApiEnv()].apiUser}${path}`;

async function getCurrentSession() {
  try {
    const session = await Auth.currentSession();
    return session;
  } catch (err) {
    const error = new Error();
    error.apiErrorMessage = 'Session expired, please sign in again';
    setTimeout(() => {
      Auth.signOut();
    }, 1000);
    throw error;
  }
}

export async function getCurrentToken() {
  const session = await getCurrentSession();
  const {
    idToken: { jwtToken = null },
  } = session;
  return jwtToken;
}

async function addAuthHeader(headers = {}) {
  const jwtToken = await getCurrentToken();
  const defaultHeader = jwtToken ? { Authorization: jwtToken } : null;
  if (!isEmpty(headers)) {
    return { ...headers, ...defaultHeader };
  }
  return defaultHeader;
}

// read
async function get(path, { headers: _headers, ...rest } = {}, noAuth = false) {
  try {
    const headers = noAuth ? null : await addAuthHeader(_headers);
    const response = await fetch(
      `https://${path}`,
      headers
        ? {
            headers,
            mode: 'cors',
            ...rest,
          }
        : {
            ...rest,
          }
    );
    return response;
  } catch (error) {
    console.log('get - error', error);
    console.log('path', path);
    return error;
  }
}

// create
async function post(path, body, { headers = {}, ...rest } = {}) {
  const _headers = {
    'Content-Type': 'application/json',
    ...headers,
  };
  try {
    const response = await fetch(`https://${path}`, {
      ...rest,
      method: 'POST',
      headers: await addAuthHeader(_headers),
      body: JSON.stringify(body),
      mode: 'cors',
    });
    return response;
  } catch (error) {
    console.log('post - error', error);
    console.log('path', path);
    return error;
  }
}

// update
async function put(path, body, { headers = {}, ...rest } = {}) {
  const _headers = {
    ...headers,
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`https://${path}`, {
      ...rest,
      method: 'PUT',
      headers: await addAuthHeader(_headers),
      body: JSON.stringify(body),
      mode: 'cors',
    });
    return response;
  } catch (error) {
    console.log('put - error', error);
    console.log('path', path);
    return error;
  }
}

// delete
async function del(path, body, { headers = {}, ...rest } = {}) {
  const _headers = {
    ...headers,
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`https://${path}`, {
      ...rest,
      method: 'DELETE',
      headers: await addAuthHeader(_headers),
      body: JSON.stringify(body),
      mode: 'cors',
    });
    return response;
  } catch (error) {
    console.log('del - error', error);
    console.log('path', path);
    return error;
  }
}

function parseBody(data) {
  try {
    return data?.name === 'AbortError' ? null : has(data, 'body') ? data.body : data;
  } catch (error) {
    return null;
  }
}

async function parseResponse(response, isCamelCase = true) {
  let data;
  try {
    if (!response.ok) {
      const error = new Error();
      error.apiErrorCode = response.error;
      error.apiErrorMessage = response.message || '';
      throw error;
    }
    data = await response.json();
    if (isCamelCase) {
      data = camelize(data);
    }
  } catch (error) {
    data = null;
  }
  return data;
}

async function parseResponseWithError(response, isCamelCase = true) {
  let data = {};
  if (response === null) {
    return null;
  }
  try {
    if (response.name === 'AbortError') {
      throw response;
    }
    if (!response.ok || response.status >= 300 || response.statusCode >= 300) {
      if (response.apiErrorMessage) {
        throw response;
      }
      data = await response.json();

      const error = new Error();
      error.apiErrorUrl = response.url;
      error.apiErrorType = `${response.type} / ${data.type}`;
      error.apiErrorCode = data.statusCode;
      error.apiErrorMessage = data.message || '';
      throw error;
    }
    data = await response.json();
    if (data?.statusCode >= 300) {
      const error = new Error();
      error.apiErrorCode = data.statusCode;
      error.apiErrorMessage = data.message || '';
      throw error;
    }
    if (isCamelCase) {
      data = camelize(data);
    }
  } catch (error) {
    const _data = { error };
    return _data;
  }
  return data;
}

async function parseResponseWithThrow(response, isCamelCase = true) {
  let data = {};
  if (response === null) {
    const error = new Error();
    error.apiErrorMessage = 'received <null>';
    throw error;
  }
  if (response.name === 'AbortError') {
    throw response;
  }
  if (!response.ok || response.status >= 300 || response.statusCode >= 300) {
    if (response.apiErrorMessage) {
      throw response;
    }
    if (response) {
      data = await response.json();
      const error = new Error();
      error.apiErrorUrl = response.url;
      error.apiErrorType = `${response.type} / ${data.type}`;
      error.apiErrorCode = data.statusCode;
      error.apiErrorMessage = data.message || '';

      throw error;
    }
  }
  data = await response.json();

  if (data?.statusCode >= 300 || data?.body?.statusCode >= 300) {
    const error = new Error();
    error.apiErrorCode = data?.body?.statusCode || data?.statusCode;
    error.apiErrorMessage = data?.body?.message || data?.message || '';
    throw error;
  }
  if (isCamelCase) {
    data = camelize(data);
  }
  return data;
}

export async function getUserGroups() {
  const session = await getCurrentSession();
  const groups = session.idToken.payload['cognito:groups'];
  return groups;
}

export async function isAdmin() {
  return includes(await getUserGroups(), 'NavigilAdmin');
}

export const getUserPermissions = async () => {
  const groups = await getUserGroups();
  const userPermissions = {};
  Object.keys(requiredPermissions).forEach(item => {
    userPermissions[item] = groups.reduce(
      (accumulator, currentValue) =>
        includes(requiredPermissions[item], currentValue) || accumulator,
      false
    );
  });
  return userPermissions;
};

export async function getFirmwareData(id = 0) {
  const empty = '';
  const response = await get(`${apiUrlPath(getFirmware)}/${id === 0 ? empty : id}`);
  return parseBody(await parseResponse(response));
}

export async function getMessageQueueData(qCount = 10) {
  const response = await get(`${apiUrlPath(getMessageQueue)}/${qCount}`);
  return parseBody(await parseResponse(response));
}

export async function getDeviceData(serialNumber, startDate, limit = 200) {
  const response = await get(
    `${apiUrlPath(
      readDeviceData
    )}?serialNumber=${serialNumber}&startDate=${startDate}&limit=${limit}`
  );
  return parseBody(await parseResponse(response));
}

export async function getVitalData({ deviceData }) {
  const response = await get(
    `${apiUrlPath(readWatchData)}?dataType=vitalData&deviceId=${deviceData.deviceId}&days=${
      deviceData.days
    }`
  );
  return parseBody(await parseResponseWithError(response));
}

export async function getHeatmap() {
  const response = await get(`${apiUrlPath(heatmap)}`);
  return parseBody(await parseResponseWithError(response));
}

export async function getSignalstrength(deviceId) {
  const response = await get(`${apiUrlPath(signalstrength)}?deviceId=${deviceId}`);
  return parseBody(await parseResponseWithError(response));
}

export async function getCalllog(deviceId) {
  const response = await get(`${apiUrlPath(callLog)}?deviceId=${deviceId}`);
  return parseBody(await parseResponseWithError(response));
}

export async function getCallLogRangeData({ deviceId, startDate, endDate }, initObject) {
  if (!deviceId) {
    return null;
  }
  const response = await get(
    `${apiUrlPath(callLog)}?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`,
    initObject
  );
  return parseBody(await parseResponseWithError(response));
}

export async function postCallLog(callLogData) {
  const response = await post(`${apiUrlPath(devicesCallLog)}`, { callLogData });
  return parseBody(await parseResponse(response));
}

export async function getActivityData({ deviceData }) {
  const response = await get(
    `${apiUrlPath(readWatchData)}?dataType=activityData&deviceId=${deviceData.deviceId}&days=${
      deviceData.days
    }`
  );
  return parseBody(await parseResponseWithError(response));
}

export async function getBatteryData({ deviceData }) {
  const response = await get(
    `${apiUrlPath(readWatchData)}?dataType=batteryData&deviceId=${deviceData.deviceId}&days=${
      deviceData.days
    }`
  );
  return parseBody(await parseResponseWithError(response));
}

export async function getActiveStatus({ deviceId }, initObject) {
  if (!deviceId) {
    return null;
  }
  const response = await get(`${apiUrlPath(deviceStatus)}/${deviceId}`, initObject);
  return parseBody(await parseResponseWithError(response));
}

export async function getDismissedStatus({ deviceId, type, days }, initObject) {
  if (!deviceId) {
    return null;
  }
  const response = await get(
    `${apiUrlPath(deviceStatus)}/${deviceId}/type/${type}/days/${days}`,
    initObject
  );
  return parseBody(await parseResponseWithError(response));
}

export async function getDeviceStatusLogs({ deviceId, type, ...query }, initObject) {
  if (!deviceId) {
    return null;
  }
  const querystring = map(query, (v, k) => `${k}=${v}`).join('&');
  const response = await get(
    `${apiUrlPath(deviceStatus)}/${deviceId}/type/${type}?${querystring}`,
    initObject
  );
  return parseBody(await parseResponseWithError(response));
}

export async function getDeviceSettings({ deviceId, type }, initObject) {
  if (!deviceId) {
    return null;
  }
  const response = await get(
    `${apiUrlPath(deviceSettings)}/${deviceId}${type ? `/type/${type}` : ''}`,
    initObject
  );
  return parseBody(await parseResponseWithThrow(response));
}

export async function saveDeviceSettings({ deviceId, settings }, initObject) {
  if (!deviceId) {
    return null;
  }
  const response = await post(`${apiUrlPath(deviceSettings)}/${deviceId}`, settings, initObject);
  return parseBody(await parseResponseWithError(response));
}

export async function dismissNotification({ deviceId, type }, initObject) {
  if (!deviceId) {
    return null;
  }
  const response = await del(
    `${apiUrlPath(deviceStatus)}/${deviceId}/type/${type}`,
    null,
    initObject
  );
  return parseResponseWithError(response);
}

export async function getBeaconList(beaconData, initObject) {
  const response = await post(`${apiDeviceUrlPath(getBeacons)}`, { beaconData }, initObject);
  return parseResponseWithThrow(response);
}

export async function getDeviceList() {
  const response = await get(`${apiDeviceUrlPath(listDevices)}`);
  return parseBody(await parseResponse(response));
}

export async function getLoginSettings(hostname, initObject) {
  const response = await get(
    `${apiUrlPath(getLoginpageSettings)}?companyid=0&hostname=${hostname.toString()}`,
    initObject,
    true
  );
  return parseBody(await parseResponseWithError(response));
}

export async function putGeofence({ geofence }, initObject) {
  const response = await post(`${apiUrlPath(createGeofence)}`, {
    geofenceData: geofence,
    initObject,
  });
  return parseResponse(response);
}

export async function updateGeofence({ geofence }, initObject) {
  const response = await put(`${apiUrlPath(updateGeofenceEndpoint)}`, {
    geofenceData: geofence,
    initObject,
  });
  return parseResponse(response);
}

export async function deleteGeofence({ id }, initObject) {
  const response = await del(`${apiUrlPath(deleteGeofenceEndpoint)}/${id}`, initObject);
  return parseResponse(response);
}

export async function getGeofences({ serialNumber }, initObject) {
  const response = await get(`${apiUrlPath(getGeofencesEndpoint)}/${serialNumber}`, initObject);
  return parseResponse(response);
}

// This is used only for development purposes
export async function devDeleteServerCoordinates(serialNumber) {
  if (parseInt(serialNumber, 10) >= 10000) {
    const error = new Error();
    error.apiErrorMessage = `Not in development watch Id-range (< 10000), too big, requested serialNumber: ${serialNumber}`;
    return Promise.reject(error);
    // throw 'Not in development watch Id-range, too big';
  }
  const response = await get(`${apiUrlPath(deleteCoordinates)}?serialNumber=${serialNumber}`);
  return parseBody(await parseResponse(response));
}

export async function postCoordinates(coordinateData) {
  const response = await post(`${apiUrlPath(createDeviceCoordinates)}`, coordinateData);
  return parseBody(await parseResponse(response));
}

export async function getCompanyGroup(companyId) {
  const response = await get(`${apiCompanyUrlPath(getListCompanyGroups)}/${companyId}`);
  return parseResponseWithThrow(response);
}

export async function getCompanyDevicesData(nozero = false) {
  const response = await get(
    `${apiCompanyUrlPath(getCompanyDevices)}${nozero ? '?nozerodevices' : ''}`
  );
  return parseBody(await parseResponse(response));
}

export async function addNewCompany(data) {
  const response = await post(`${apiUrlPath(manageCompanies)}`, {
    companyData: data,
  });
  return parseBody(await parseResponse(response));
}

export async function getCompanyData(companyId, initObject) {
  const response = await get(`${apiUrlPath(manageCompanies)}/${companyId}`, initObject);
  return parseBody(await parseResponseWithError(response));
}

export async function getCompanySubscription(companyId) {
  const response = await get(`${apiUrlPath(manageCompanySubscription)}/${companyId}`);
  return parseBody(await parseResponse(response));
}

export async function updateCompanySubscription(companyId) {
  const response = await post(`${apiUrlPath(manageCompanySubscription)}/${companyId}`);
  return parseBody(await parseResponse(response));
}
export async function updateCompanyData(company) {
  const response = await put(`${apiUrlPath(manageCompanies)}`, {
    companyData: company,
  });
  return parseBody(await parseResponse(response));
}

export async function getAllCompaniesData() {
  const response = await get(`${apiUrlPath(manageCompanies)}`);
  if (!response) return null;
  return parseBody(await parseResponse(response));
}

export async function getDeviceCoordinatesData({ hoursDiff, ...fetchParams }) {
  const { serialNumber } = fetchParams;
  const query = hoursDiff
    ? `serialNumber=${serialNumber}&hoursDiff=${hoursDiff}`
    : map(fetchParams, (value, key) => `${key}=${value}`).join('&');
  const response = await get(`${apiUrlPath(getCoordinates)}?${query}`);
  return parseBody(await parseResponse(response));
}

export async function getLatestDeviceCoordinates({ companyId, days = 1 }, initObject) {
  if (!companyId) {
    const error = new Error('No company Id');
    throw error;
  }
  const response = await get(
    `${apiUrlPath(getCompanyLatestCoordinates)}?companyId=${companyId}&days=${days}`,
    initObject
  );
  return parseResponseWithThrow(response);
}

export async function getCoordinatesByLatLngWindow({ latLngs = [], short }, initObject) {
  let paramString = null;
  const [latLngSW, latLngNE] = latLngs;

  if (latLngNE?.lat() && latLngSW?.lng()) {
    const [minLat, maxLat, minLng, maxLng] = [
      latLngSW.lat().toFixed(5),
      latLngNE.lat().toFixed(5),
      latLngSW.lng().toFixed(5),
      latLngNE.lng().toFixed(5),
    ];
    paramString = `?minLatitude=${minLat}&maxLatitude=${maxLat}&minLongitude=${minLng}&maxLongitude=${maxLng}`;
  } else if (short) {
    paramString = `?short=${short}`;
  }

  if (!paramString) {
    return { error: { apiErrorMessage: 'Missing parameters' } };
  }

  const response = await get(`${apiUrlPath(getCoordinatesByLatLng)}${paramString}`, initObject);
  return parseBody(await parseResponseWithError(response));
}

export async function getUserById(userId) {
  const response = await get(`${apiUrlPath(manageUsers)}/${userId}`);
  return parseBody(await parseResponse(response));
}

export async function updateMobilePushToken(body) {
  const response = await put(apiUrlPath(mobileDevice), body);
  return parseBody(await parseResponse(response));
}

export async function getUserByEmail(userEmail) {
  const response = await get(`${apiUrlPath(manageUsers)}/${userEmail}`);
  return parseBody(await parseResponse(response));
}
export async function getAllUsersData() {
  const response = await post(`${apiUsersUrlPath(getAllUsers)}`);
  return parseBody(await parseResponse(response));
}

export async function getBackgroundImage(email) {
  const response = await get(`${apiCompanyUrlPath(getBackgrounds)}${email}`, {}, true);
  const body = parseBody(await parseResponse(response));
  return body;
}

export async function putUserGroups({ accountId, groupData, initObject }) {
  const response = await post(
    `${apiUrlPath(userGroupAccess)}/account/${accountId}`,
    {
      groups: [...groupData],
    },
    initObject
  );
  return parseResponse(response);
}
export async function addNewUser(data, groupAccess) {
  const response = await post(`${apiUrlPath(manageUsers)}`, {
    userData: data,
    groupAccess,
  });
  return parseResponseWithThrow(response);
}

export async function updateUserData(data) {
  const response = await put(`${apiUrlPath(manageUsers)}`, { userData: data });
  return parseBody(await parseResponse(response));
}

export async function deleteUserData(userId) {
  const response = await del(`${apiUrlPath(manageUsers)}/${userId}`);
  return parseBody(await parseResponse(response));
}

export async function updateUserNotifications(notifications) {
  const response = await put(`${apiUrlPath(userNotifications)}`, { notifications });
  return parseBody(await parseResponse(response));
}

export async function getServiceSettings(getLUT) {
  const response = await get(`${apiUrlPath(readServiceSettings)}${getLUT ? '?LUT=true' : ''}`);
  return parseBody(await parseResponse(response));
}

// waiting for backend to change
//
// export async function getDeviceConsoleCommandsCRUD({ deviceId, days, startDate, endDate }) {
//   console.log('deviceId', deviceId);
//   console.log('days', days);
//   console.log('startDate', startDate);
//   console.log('endDate', endDate);
//   const daysString = typeof days === 'number' && !startDate && !endDate ? `days=${days}` : 'days=1';
//   const startDateString = startDate ? `&startDate=${startDate}` : '';
//   const endDateString = startDate && endDate ? `&endDate=${endDate}` : '';
//   const dateString = startDateString + endDateString;
//   console.log('dateString', dateString);
//   const response = await get(
//     `${apiUrlPath(getCommandHistory)}/${deviceId}?${daysString}${dateString}`
//   );
//   return parseBody(await parseResponse(response));
// }
export async function getDeviceConsoleCommands({ deviceId, days }) {
  const daysString = typeof days === 'number' ? `?days=${days}` : '';
  const response = await post(`${apiUrlPath(getCommandHistory)}/${daysString}`, { deviceId });
  return parseBody(await parseResponse(response));
}

export async function importDevice(deviceImportData, initObject) {
  const response = await post(`${apiUrlPath(importDevices)}`, { ...deviceImportData }, initObject);
  return parseResponseWithError(response);
}

export async function sendDeviceConsoleCommand(messagePackage) {
  const response = await post(`${apiDeviceUrlPath(sendConsoleCommand)}`, messagePackage);
  return parseResponseWithError(response);
}

export async function sendDeviceCommand(deviceId, commands, initObject) {
  const response = await post(`${apiUrlPath(deviceCommand)}/${deviceId}`, commands, initObject);
  return parseResponseWithError(response);
}

export async function getWatchData({ deviceId, dataType, days, startDate, endDate }) {
  const daysString = days && !startDate && !endDate ? `&days=${days}` : '';
  const startDateString = startDate ? `&startDate=${startDate}` : '';
  const endDateString = endDate ? `&endDate=${endDate}` : '';
  if (!deviceId || !dataType || (!days && !startDate)) {
    return null;
  }

  const response = await get(
    `${apiUrlPath(
      `${readWatchData}?dataType=${dataType}&deviceId=${deviceId}${daysString}${startDateString}${endDateString}`
    )}`
  );
  return parseResponseWithThrow(response);
}

export async function getDeviceLogs() {
  const response = await get(`${apiDeviceUrlPath(getDeviceLogFiles)}`);
  return parseBody(await parseResponse(response));
}

export async function getDeviceLogFileDownloadLink(bucketKey) {
  const response = await post(`${apiDeviceUrlPath(getDeviceLogFiles)}`, {
    bucketKey,
  });
  return parseBody(await parseResponse(response));
}

// Get monthly alerts
export async function getMonthlyAlertsData(year) {
  const response = await get(`${apiDeviceUrlPath(getMonthlyAlerts)}?year=${year}`);
  return parseBody(await parseResponse(response));
}

export async function getAllGroupData(companyId) {
  if (!companyId) return null;
  const response = await get(`${apiUrlPath(companyGroup)}/company/${companyId}`);
  return parseBody(await parseResponse(response));
}

export async function getAllGroupDataWithThrow(companyId) {
  if (!companyId) return null;
  const response = await get(`${apiUrlPath(companyGroup)}/company/${companyId}`);
  return parseResponseWithThrow(response);
}

export async function addNewGroup(data) {
  const response = await post(`${apiUrlPath(companyGroup)}`, {
    groupData: data,
  });
  return parseBody(await parseResponse(response));
}

export async function updateGroupData(data) {
  const response = await put(`${apiUrlPath(companyGroup)}`, {
    groupData: data,
  });
  return response;
}

export async function getGroupById(groupId) {
  if (!groupId) {
    return null;
  }
  const response = await get(`${apiUrlPath(companyGroup)}/${groupId}`);
  return parseBody(await parseResponse(response));
}

export async function getGroupSubscription(groupId) {
  const response = await get(`${apiUrlPath(manageGroupSubscription)}/${groupId}`);
  return parseBody(await parseResponse(response));
}

export async function postGroupSubscription(groupId) {
  const response = await post(`${apiUrlPath(manageGroupSubscription)}/${groupId}`);
  return parseBody(await parseResponse(response));
}

// Service Language
export async function getLanguageList() {
  const response = await get(`${apiUrlPath(listLanguage)}`, {}, true);
  return parseBody(await parseResponse(response));
}
export async function getLanguageListUMWAPI(initObject) {
  const response = await get(`${apiUrlPath(listLanguage)}`, initObject);
  return parseResponseWithThrow(response);
}

export async function getListLanguageData(compare) {
  const response = await get(`${apiUrlPath(listLanguageData)}/?compareLocale=${compare}`);
  return parseBody(await parseResponse(response, false));
}

export async function getListLanguageKeyGroups() {
  const response = await get(`${apiUrlPath(listLanguageKeyGroups)}`);
  return parseBody(await parseResponse(response));
}

export async function getListLanguageDataKeyGroups() {
  const response = await get(`${apiUrlPath(listLanguageDataKeyGroups)}`);
  return parseBody(await parseResponse(response, false));
}

export async function deleteLanguageKeyGroup(keyId) {
  const response = await del(`${apiUrlPath(keyData)}/${keyId}?force=true`);
  return parseBody(await parseResponse(response, false));
}
export async function checkGroupDelete(groupId) {
  if (!groupId) {
    return null;
  }
  const response = await get(`${apiUrlPath(groupCompanyDelete)}/${groupId}`);
  return parseBody(await parseResponse(response));
}

export async function deleteCompanyGroup(groupId) {
  if (!groupId) {
    return null;
  }
  const response = await del(`${apiUrlPath(companyGroup)}/${groupId}`);
  return parseBody(await parseResponse(response));
}

export async function addNewLanguageItem(data, isTranslated, initObject) {
  const strTranslate = isTranslated ? `?translate=1` : '';
  const response = await post(
    `${apiUrlPath(langData)}${strTranslate}`,
    {
      langData: data,
    },
    initObject
  );
  return parseResponseWithThrow(response, false);
}

export async function validateLanguageKeyName(keyName, keyGroup, initObject) {
  const response = await get(
    apiUrlPath(`${keyData}/?keyName=${keyName}&keyGroup=${keyGroup}`, initObject)
  );
  return parseResponseWithThrow(response, false);
}

export async function updateLanguageItem(data) {
  const response = await put(`${apiUrlPath(langData)}`, {
    langData: data,
  });
  return response;
}

export async function updateLanguageKeyData(data) {
  const response = await put(`${apiUrlPath(keyData)}`, {
    keyData: data,
  });
  return response;
}

export async function getI18nMessages(initObject) {
  const response = await get(`${apiUrlPath(intlMessages)}`, initObject, true);
  return parseBody(await parseResponseWithThrow(response, false));
}

export async function getLocaleList(initObject) {
  const response = await get(`${apiUrlPath(listLocale)}`, initObject, true);
  return parseBody(await parseResponseWithThrow(response));
}

export async function getGroupAccess(accountId) {
  if (!accountId) return null;
  const response = await get(`${apiUrlPath(userGroupAccess)}/account/${accountId}`);
  return parseBody(await parseResponse(response));
}

export async function getUserDeviceAccess(accountId) {
  if (!accountId) return null;
  const response = await get(`${apiUrlPath(userDeviceAccess)}/account/${accountId}`);
  return parseBody(await parseResponse(response));
}

export async function addUserDeviceAccess({ accountId, deviceId, initObject }) {
  const response = await post(
    `${apiUrlPath(userDeviceAccess)}/account/${accountId}`,
    { devices: [{ id: deviceId }] },
    initObject
  );
  return parseResponseWithError(response);
}

export async function deleteUserDeviceAccess({ accountId, deviceId, initObject }) {
  const response = await del(
    `${apiUrlPath(userDeviceAccess)}/account/${accountId}`,
    { devices: [{ id: deviceId }] },
    initObject
  );
  return parseResponseWithError(response);
}

export async function getDeviceStatus() {
  const response = await get(`${apiUrlPath(getDevicesAccess)}`);
  return parseBody(await parseResponse(response));
}

export async function getDeviceStatusThrow(initObject) {
  const response = await get(`${apiUrlPath(getDevicesAccess)}`, initObject);
  return parseResponseWithThrow(response);
}

export async function getDeviceProfiles() {
  const response = await get(`${apiUrlPath(deviceProfiles)}`);
  return parseBody(await parseResponseWithError(response));
}

export async function getDeviceProfileById(profileId) {
  if (!profileId) {
    return null;
  }
  const response = await get(`${apiUrlPath(deviceProfiles)}/${profileId}`);
  return parseBody(await parseResponseWithError(response));
}

export async function addDeviceProfile(profileData) {
  const response = await post(`${apiUrlPath(deviceProfiles)}`, {
    ...profileData,
  });
  return parseBody(await parseResponse(response));
}

export async function getDeviceProfileAccess(profileId) {
  if (!profileId) {
    return null;
  }
  const response = await get(`${apiUrlPath(deviceProfleAccess)}/${profileId}`);
  return parseBody(await parseResponseWithError(response));
}

export async function putDeviceProfileAccess(profileData, profileId, initObject) {
  if (!profileId) {
    return null;
  }
  const response = await put(
    `${apiUrlPath(deviceProfiles)}/${profileId}`,
    {
      ...profileData,
    },
    initObject
  );

  return parseResponseWithThrow(response);
}

export async function deleteDeviceProfileAccess(profileId) {
  if (!profileId) {
    return null;
  }
  const response = await del(`${apiUrlPath(deviceProfiles)}/${profileId}`);
  if (response.status === 400) {
    return response.status;
  }
  return parseResponse(response);
}

export async function getDeviceProfileRelationCompany(profileId, companyId) {
  if (!profileId) {
    return null;
  }
  const response = await get(`${apiUrlPath(deviceProfleAccess)}/${profileId}/company/${companyId}`);
  return parseBody(await parseResponse(response));
}

export async function addDeviceProfileCompanyGroup(profileId, profileData) {
  if (!profileId) {
    return null;
  }
  const response = await post(`${apiUrlPath(deviceProfleAccess)}/${profileId}`, [...profileData]);
  return parseBody(await parseResponseWithError(response));
}

export async function updateDeviceProfileCompanyGroup(profileId, profileData) {
  if (!profileId) {
    return null;
  }
  const response = await put(`${apiUrlPath(deviceProfleAccess)}/${profileId}`, profileData);
  return parseBody(await parseResponseWithError(response));
}

// use googleapis geocoding/reverse geocoding
// geocoding params:
// searchData: <object>
//    {
//      address:  <string>, eg. '60 picadilly london'  Address to be searched
//      language: <string>, eg. 'jp' for japanese characters results prefered language
//                (locale.substring(0, 2) for current locale language)
//    }
//
// reverse geocoding params:
// searchData: <object>
//    {
//      latlng: <string>, eg. '51.507877, -0.140494'
//      language: <string>, eg. 'jp' for japanese characters results prefered language
//                (locale.substring(0, 2) for current locale language)
//    }
export async function getAddressGoogle(searchData, initObject) {
  const response = await post(`${apiUrlPath(getGoogleAddress)}`, { searchData }, initObject);
  return parseBody(await parseResponseWithError(response));
}

export async function deleteDeviceProfileRelationCompany(deleteProfileAccess) {
  const response = await del(`${apiUrlPath(deviceProfleAccess)}`, [deleteProfileAccess]);
  return parseResponse(response);
}

export async function getDeviceInfo(serialNumber, initObject) {
  const response = await get(`${apiUrlPath(getDevices)}?serialNumber=${serialNumber}`, initObject);
  return parseResponseWithThrow(response);
}

export async function getDevicesProductCodes(code) {
  const response = await get(`${apiUrlPath(getDevicesCodes)}?code=${code}`);
  return parseResponseWithError(response);
}

export async function getAllCallCenterData() {
  const response = await get(`${apiUrlPath(companyCallCenter)}`);
  if (!response) return null;
  return parseBody(await parseResponse(response));
}

export async function addCallCenter(callCenterData) {
  const response = await post(`${apiUrlPath(companyCallCenter)}`, callCenterData);
  return parseBody(await parseResponse(response));
}

export async function updateCallCenterData(callCenterData, callCenterId) {
  if (!callCenterId) {
    return null;
  }
  const response = await put(`${apiUrlPath(companyCallCenter)}/${callCenterId}`, {
    ...callCenterData,
  });
  if (response.status === 400) {
    return response.status;
  }

  return parseBody(await parseResponseWithError(response));
}

export async function deleteCallCenter(callCenterId) {
  if (!callCenterId) {
    return null;
  }
  const response = await del(`${apiUrlPath(companyCallCenter)}/${callCenterId}`);
  if (response.status === 400) {
    return response.status;
  }
  return parseResponse(response);
}

export async function getCallCenterById(callCenterId) {
  if (!callCenterId) {
    return null;
  }
  const response = await get(`${apiUrlPath(companyCallCenter)}/${callCenterId}`);
  return parseBody(await parseResponseWithError(response));
}

export async function getCallCenterAccess(callCenterId) {
  if (!callCenterId) {
    return null;
  }
  const response = await get(`${apiUrlPath(companyCallCenterAccess)}/${callCenterId}`);
  return parseBody(await parseResponseWithError(response));
}

export async function updateCallCenterCompanyGroup(callCenterId, profileData) {
  if (!callCenterId) {
    return null;
  }
  const response = await put(`${apiUrlPath(companyCallCenterAccess)}/${callCenterId}`, profileData);
  return parseBody(await parseResponseWithError(response));
}

export async function addCallCenterCompanyGroup(callCenterId, profileData) {
  if (!callCenterId) {
    return null;
  }
  const response = await put(`${apiUrlPath(companyCallCenterAccess)}/${callCenterId}`, profileData);
  return parseBody(await parseResponseWithError(response));
}

export async function deleteCallCenterRelationCompany(callCenter) {
  const response = await del(`${apiUrlPath(companyCallCenterAccess)}`, [callCenter]);
  return parseResponse(response);
}

export async function getCallCenterRelationCompany(callCenterId, companyId) {
  if (!callCenterId) {
    return null;
  }
  const response = await get(
    `${apiUrlPath(companyCallCenterAccess)}/${callCenterId}/company/${companyId}`
  );
  return parseBody(await parseResponse(response));
}

export async function getMissingLanguageTrans(languageId) {
  const response = await get(`${apiUrlPath(missingLanguageTrans)}?languageId=${languageId}`);
  return parseResponseWithThrow(response);
}

export async function getScaipEndPoints() {
  const response = await get(`${apiUrlPath(companyScaipEndPoints)}`);
  return parseBody(await parseResponse(response));
}

export async function getA3CountryCodes(initObject) {
  const response = await get(apiUrlPath(a3CountryCode), initObject);
  return parseBody(await parseResponseWithError(response));
}

export async function getReports(initObject) {
  const response = await get(apiUrlPath(reports), initObject);
  return parseBody(await parseResponseWithError(response));
}

export async function getReportRows(id, params, initObject) {
  const response = await get(
    `${apiUrlPath(reportRows)}?id=${id}&params=${btoa(JSON.stringify(params))}`,
    initObject
  );
  return parseBody(await parseResponseWithError(response));
}

export async function updateBeaconData(beacon, initObject) {
  const response = await post(`${apiUrlPath(manageBeacons)}`, { beaconData: beacon }, initObject);
  return parseResponseWithError(response);
}

export async function deleteBeacon(beaconId, initObject) {
  const response = await del(
    `${apiUrlPath(manageBeacons)}`,
    { beaconData: { id: beaconId } },
    initObject
  );
  return parseBody(await parseResponse(response));
}

export async function getEmergencyRecordings({ deviceId, fetchRange }, initObject) {
  if (!deviceId && !fetchRange > 2) return [];
  const day = 3600 * 1000 * 24;
  const createdBefore = new Date(new Date(fetchRange[1]).getTime() + day).toISOString();
  const createdAfter = new Date(fetchRange[0]).toISOString();

  const minute = 60;
  const now = () => Math.floor(Date.now() / 1000);
  return (
    await parseBody(
      await parseResponseWithThrow(
        await get(
          `${apiUrlPath(
            emergencyRecordings
          )}?deviceId=${deviceId}&createdBefore=${createdBefore}&createdAfter=${createdAfter}`,
          initObject
        )
      )
    )
  ).map(({ url, dismissedBy, dismissedAt, created, ...rest }) => {
    const { href, searchParams } = new URL(url);
    const callDateAndTime = format(new Date(created), 'Pp');
    const dismissed = dismissedBy ? `${dismissedBy}\n${format(new Date(dismissedAt), 'Pp')}` : null;
    const link = {
      href,
      isExpired: () => searchParams.get('Expires') - minute < now(),
    };
    return { ...rest, created, callDateAndTime, dismissed, link };
  });
}

export async function putEmergencyRecording(recording, initObject) {
  const response = await put(`${apiUrlPath(emergencyRecordings)}`, recording, initObject);
  if (response.status === 200) {
    return response.status;
  }
  return parseResponse(response);
}

export async function getCompanyProfilesById(companyId) {
  if (!companyId) {
    return null;
  }
  const response = await get(`${apiUrlPath(deviceProfiles)}/company/${companyId}`);
  return parseResponseWithError(response);
}
export async function getCompanyGroupProfilesById(companyId) {
  if (!companyId) {
    return null;
  }
  const response = await get(`${apiUrlPath(deviceProfiles)}/company/${companyId}?groups`);
  return parseResponseWithError(response);
}

export async function getGroupProfilesById(companyId, groupId) {
  const response = await get(`${apiUrlPath(deviceProfiles)}/company/${companyId}/group/${groupId}`);
  return parseResponseWithError(response);
}

export async function getCompanyCallCentersById(companyId) {
  if (!companyId) {
    return null;
  }
  const response = await get(`${apiUrlPath(companyCallCenter)}/company/${companyId}`);
  return parseResponseWithError(response);
}

export async function getCompanyGroupCallCentersById(companyId) {
  if (!companyId) {
    return null;
  }
  const response = await get(`${apiUrlPath(companyCallCenter)}/company/${companyId}?groups`);
  return parseResponseWithError(response);
}

export async function getGroupCallCentersById(companyId, groupId) {
  const response = await get(
    `${apiUrlPath(companyCallCenter)}/company/${companyId}/group/${groupId}`
  );
  return parseResponseWithError(response);
}

export async function userExists(email, initObject) {
  const query = new URLSearchParams({ email }).toString();
  const response = await get(`${apiUrlPath(userExist)}?${query}`, initObject);
  return parseBody(await parseResponseWithError(response));
}

export async function sendSms(data, initObject) {
  const response = await post(apiUrlPath(smsSend), data, initObject);
  return parseResponseWithThrow(response);
}

export async function getSmsBalance(initObject) {
  const response = await get(apiUrlPath(smsBalance), initObject);
  return parseResponseWithThrow(response);
}

export async function getCoordinateDates({ deviceId }, initObject) {
  if (!deviceId) {
    return [];
  }
  const response = await get(`${apiUrlPath(coordinateDates)}?deviceId=${deviceId}`, initObject);
  const parsed = await parseResponseWithThrow(response);
  return parseBody(parsed).map(x => new Date(x));
}
