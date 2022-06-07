import React, { useMemo, useState, useCallback } from 'react';
import { Grid, XAxis, BarChart, YAxis } from 'react-native-svg-charts';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import useFormatMessage from 'hooks/useFormatMessage';
import { format } from 'i18n/date-fns';
import SelectDevice from 'components/SelectDevice';
import CalendarComponent from './CalenderComponent';
import TopBar from './TopBar';
import Buttons from './Buttons';
import { Decorator, usePanResponder } from './DecoratorAndToolTip';

const styles = StyleSheet.create({
  chartContainer: { marginLeft: 'auto', marginRight: 'auto', height: 310 },
  yaxisChartContainer: { flexDirection: 'row', marginTop: 10 },
});

const Chart = ({ data, chartType }) => {
  const { ucFirst } = useFormatMessage();
  const [pressX, setPressX] = useState();
  const panResponder = usePanResponder({ setPressX });

  const processedData = useMemo(
    () =>
      (data ?? []).map(({ value, time }) => ({
        value,
        date: new Date(time),
      })),
    [data]
  );

  const handleLabelX = useCallback(
    (val, index) => {
      let divider;
      const plen = processedData.length ? processedData.length : 0;
      switch (true) {
        case plen > 800:
          divider = 200;
          break;
        case plen > 400:
          divider = 100;
          break;
        case plen > 200:
          divider = 60;
          break;
        case plen > 100:
          divider = 40;
          break;
        case plen > 35:
          divider = 20;
          break;
        case plen > 20:
          divider = 5;
          break;
        case plen > 10:
          divider = 2;
          break;
        case plen <= 10:
          divider = 1;
          break;
        default:
          console.log(plen);
          divider = 4;
      }
      console.log(plen);
      try {
        if (index % divider === 0) {
          return format(processedData[index].date, 'd/MM');
        }
      } catch (error) {
        console.log(error);
        return '';
      }
    },
    [processedData]
  );

  const getInset = dataLength => {
    console.log('getInset');
    if (dataLength > 18) {
      return { left: 25, right: 8 };
    }
    if (dataLength > 6) {
      return { left: 50, right: 30 };
    }
    if (dataLength > 1) {
      return { left: 80, right: 60 };
    }
  };

  const highestData = maxValue => {
    let highestValue = maxValue;
    processedData.forEach(element => {
      if (highestValue < element.value) {
        highestValue = element.value;
      }
    });
    return highestValue;
  };

  const noDataAvailable = !data?.length;

  if (noDataAvailable) {
    return (
      <View style={styles.chartContainer}>
        <Text style={{ paddingTop: 80, fontSize: 16 }}>
          {ucFirst({ id: 'general.noDataAvailable' })}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.chartContainer} {...panResponder.panHandlers}>
      <View style={styles.yaxisChartContainer}>
        <YAxis
          data={processedData && processedData}
          svg={{
            fill: 'black',
            fontSize: 10,
          }}
          contentInset={{ top: 5, bottom: 3 }}
          numberOfTicks={10}
          yAccessor={({ item }) => item.value}
          formatLabel={val => `${val}`}
          min={0}
          max={chartType === 'respiratoryRate' ? highestData(40) : highestData(100)}
        />
        <BarChart
          gridMin={0}
          gridMax={chartType === 'respiratoryRate' ? 40 : 100}
          contentInset={{ top: 5, bottom: 3, left: 0, right: 0 }}
          style={{ height: 280, width: Dimensions.get('screen').width * 0.9, margintop: 10 }}
          data={processedData}
          yAccessor={({ item }) => item.value}
          xAccessor={({ item }) => item.date}
          svg={{ fill: 'rgb(76, 175, 80)' }}
        >
          <Grid direction={Grid.Direction.HORIZONTAL} />
          <Decorator pressX={pressX} chartType={chartType} />
        </BarChart>
      </View>
      <XAxis
        data={processedData}
        svg={{
          fill: 'black',
          fontSize: 10,
          y: 10,
        }}
        numberOfTicks={processedData.length}
        contentInset={getInset(processedData.length)}
        formatLabel={(val, index) => handleLabelX(val, index)}
      />
    </View>
  );
};

const AreaWithBarsChart = ({ data, helpLink, chartType }) => (
  <View>
    <SelectDevice />
    <CalendarComponent setEndDate />
    <TopBar type={chartType} data={data} helpLink={helpLink} />
    <Chart data={data} chartType={chartType} />
    <Buttons binBy={null} setBinBy={null} />
  </View>
);
export default AreaWithBarsChart;
