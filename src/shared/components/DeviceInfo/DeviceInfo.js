import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useFormatMessage from 'hooks/useFormatMessage';
import { SafeAreaView, View, StyleSheet, Text, Platform } from 'react-native';
import { getDeviceInfo, getDevicesProductCodes } from 'api/MiddlewareAPI';
import useSpinner from 'hooks/useSpinner';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    margin: 5,
  },
  title: {
    fontSize: 32,
  },
  buttons: {
    flexDirection: 'row',
    padding: 5,
    margin: 5,
    color: '#FFFFFF',
    justifyContent: 'flex-end',
  },
  column2: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },

  column3: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    fontSize: 30,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  icon: {
    position: 'absolute',
    right: 0,
    margin: 40,
  },
  headline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 30,
  },
  scrollView: {
    marginHorizontal: 10,
  },
  bold:
    Platform.OS === 'ios'
      ? {
          fontFamily: 'fontFamily',
          fontWeight: 'bold',
        }
      : {
          fontFamily: 'fontFamily-bold',
        },
});

const DeviceInfo = () => {
  const spinner = useSpinner();
  const { ucFirst } = useFormatMessage();
  const [deviceInfo, setDeviceInfo] = useState();
  const [productCodes, setProductCode] = useState();
  const { serialNumber } = useSelector(store => ({
    serialNumber: store.serialNumber,
  }));

  useEffect(() => {
    const makeData = async () => {
      const spinnerId = spinner.show();
      const response = await getDeviceInfo(serialNumber);
      setDeviceInfo(response.body);
      const { productCode: code } = response.body.deviceData;
      if (code) {
        const productResponse = await getDevicesProductCodes(code);
        setProductCode(productResponse);
      }
      spinner.hide(spinnerId);
    };
    makeData();
  }, [serialNumber, spinner]);

  if (!deviceInfo || !productCodes) {
    return null;
  }
  const newDeviceInfo = { ...deviceInfo, ...productCodes };
  const { phoneNumber, case: deviceCase, bezel, strap } = newDeviceInfo;
  const { mcu, ble, modem, gnss } = newDeviceInfo.firmwareData;
  const {
    deviceType,
    manufactureDate,
    productCode,
    IMEI,
    IMSI,
    ICCID,
    simOperator,
  } = newDeviceInfo.deviceData;

  const dataObject = {
    [`${ucFirst({ id: 'general.serialNumber' })}`]: serialNumber,
    [`${ucFirst({ id: 'general.deviceId' })}`]: deviceInfo.id,
    [`${ucFirst({ id: 'general.telephoneNumber' })}`]: phoneNumber,
    [`${ucFirst({ id: 'general.deviceType' })}`]: deviceType,
    [`${ucFirst({ id: 'general.manufacturedDate' })}`]: manufactureDate,
    [`${ucFirst({ id: 'general.productCode' })}`]: productCode,
    [`${ucFirst({ id: 'general.IMEI' })}`]: IMEI,
    [`${ucFirst({ id: 'general.IMSI' })}`]: IMSI,
    [`${ucFirst({ id: 'general.ICCID' })}`]: ICCID,
    [`${ucFirst({ id: 'general.operatorSim' })}`]: simOperator,
    [`${ucFirst({ id: 'general.mcu' })}`]: mcu,
    [`${ucFirst({ id: 'general.ble' })}`]: ble,
    [`${ucFirst({ id: 'general.modem' })}`]: modem,
    [`${ucFirst({ id: 'general.gnss' })}`]: gnss,
    [`${ucFirst({ id: 'general.case' })}`]: ucFirst({ id: deviceCase }),
    [`${ucFirst({ id: 'general.bezel' })}`]: ucFirst({ id: bezel }),
    [`${ucFirst({ id: 'general.strap' })}`]: ucFirst({ id: strap }),
  };
  return (
    <SafeAreaView>
      <View style={styles.headline}>
        <View>
          {Object.keys(dataObject).map((key, index) => (
            <Text key={index}>{key}</Text>
          ))}
        </View>
        <View>
          {!deviceInfo
            ? null
            : Object.values(dataObject).map((key, index) => <Text key={index}>{key}</Text>)}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeviceInfo;
