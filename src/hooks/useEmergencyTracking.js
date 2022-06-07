import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsEmergencyTracking } from 'actions/setIsEmergencyTracking';
import useDeviceId from 'hooks/useDeviceId';
import { sendDeviceCommand } from 'api/MiddlewareAPI';

const useEmergencyTracking = () => {
  const dispatch = useDispatch();
  const currentDeviceId = useDeviceId();
  const isEmergencyTracking = useSelector(state => state.isEmergencyTracking);

  const startEmergencyTracking = useCallback(
    async deviceId => {
      const response = await sendDeviceCommand(
        typeof deviceId === 'number' ? deviceId : currentDeviceId,
        {
          command: 'enableEmergencyTracking',
        }
      );
      if (response.statusCode === 200) {
        dispatch(setIsEmergencyTracking(true));
      }
      return response;
    },
    [currentDeviceId, dispatch]
  );

  const stopEmergencyTracking = useCallback(
    async deviceId => {
      const response = await sendDeviceCommand(
        typeof deviceId === 'number' ? deviceId : currentDeviceId,
        {
          command: 'disableEmergencyTracking',
        }
      );
      if (response.statusCode === 200) {
        dispatch(setIsEmergencyTracking(false));
      }
      return response;
    },
    [currentDeviceId, dispatch]
  );

  return [isEmergencyTracking, startEmergencyTracking, stopEmergencyTracking];
};

export default useEmergencyTracking;
