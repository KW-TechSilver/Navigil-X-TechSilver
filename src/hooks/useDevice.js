import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useDevice = (givenSerialNumber = null) => {
  const [deviceList, serialNumber] = useSelector(store => [store.deviceList, store.serialNumber]);
  const [device, setDevice] = useState(
    (deviceList &&
      deviceList.find(
        _device => _device.serialNumber === `${givenSerialNumber || serialNumber}`
      )) ||
      {}
  );

  const getDevice = useCallback(
    _serialNumber => deviceList.find(_device => _device.serialNumber === _serialNumber) || null,
    [deviceList]
  );

  useEffect(() => {
    let _device = {};
    if (deviceList && (givenSerialNumber || serialNumber)) {
      _device =
        deviceList.find(item => item.serialNumber === `${givenSerialNumber || serialNumber}`) || {};
    }

    const _deviceId = _device?.deviceId;
    if (_deviceId !== device?.deviceId) {
      setDevice(_device);
    }
  }, [givenSerialNumber, serialNumber, deviceList, device.deviceId, device]);

  return [device, getDevice];
};

export default useDevice;
