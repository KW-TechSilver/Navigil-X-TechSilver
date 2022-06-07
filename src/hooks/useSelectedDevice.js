import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useSelectedDevice = (givenSerialNumber = null) => {
  const [deviceList, serialNumber] = useSelector(store => [store.deviceList, store.serialNumber]);
  const [device, setDevice] = useState(
    deviceList?.find(d => d.serialNumber === `${givenSerialNumber || serialNumber}`) || {}
  );

  useEffect(() => {
    let _device = {};
    if (deviceList && (givenSerialNumber || serialNumber)) {
      _device =
        deviceList.find(d => d.serialNumber === `${givenSerialNumber || serialNumber}`) || {};
    }
    if (device.deviceId !== _device.deviceId) {
      setDevice(_device);
    }
  }, [givenSerialNumber, serialNumber, deviceList, device.deviceId]);

  return device;
};

export default useSelectedDevice;
