import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useDeviceId = (givenSerialNumber = null) => {
  const deviceList = useSelector(store => store.deviceList);
  const serialNumber = useSelector(store => store.serialNumber);
  const [deviceId, setDeviceId] = useState(
    deviceList?.find(device => device.serialNumber === `${givenSerialNumber || serialNumber}`)
      ?.deviceId || null
  );

  useEffect(() => {
    let _deviceId = null;
    if (deviceList && (givenSerialNumber || serialNumber)) {
      _deviceId =
        deviceList.find(device => device.serialNumber === `${givenSerialNumber || serialNumber}`)
          ?.deviceId || null;
    }

    if (deviceId !== _deviceId) {
      setDeviceId(_deviceId);
    }
  }, [givenSerialNumber, serialNumber, deviceList, deviceId]);
  return deviceId;
};

export default useDeviceId;
