import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { format } from 'i18n/date-fns';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import useFormatMessage from 'hooks/useFormatMessage';
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

  const SignalBarColor = val =>
    val > 120 ? 'rgb(211, 47, 47)' : val > 104 ? 'rgb(255, 193, 7)' : '#4caf50';
  const ActivityBarColor = val =>
    val < 30 ? 'rgb(211, 47, 47)' : val < 80 ? 'rgb(255, 193, 7)' : '#3e9f3b';
  const processedData = useMemo(
    () =>
      (data ?? []).map(({ value, time }) => ({
        value,
        svg: {
          fill: chartType === 'signalStrength' ? SignalBarColor(value) : ActivityBarColor(value),
        },
        date: new Date(time),
      })),
    [data, chartType]
  );
  const dates = useMemo(() => (data ?? []).map(({ time }) => ({ date: new Date(time) })), [data]);

  const noDataAvailable = !data?.length;

  const getInset = dataLength => {
    if (dataLength > 18) {
      return { left: 25, right: 8 };
    }
    if (dataLength > 6) {
      return { left: 40, right: 30 };
    }
    if (dataLength > 1) {
      return { left: 80, right: 60 };
    }
  };

  const handleLabelX = useCallback(
    (val, index) => {
      if (chartType === 'activity') {
        if (processedData.length > 35) {
          if (index % 24 === 0) {
            return format(processedData[index].date, 'd/MM');
          }
          return '';
        }
        if (processedData.length > 24 && index % 2 !== 0) {
          return '';
        }
        if (processedData.length <= 8 && processedData.length > 3) {
          try {
            return format(processedData[index].date, 'd/MM');
          } catch (error) {
            console.log(error);
          }
        }
        try {
          return format(processedData[index].date, 'd');
        } catch (error) {
          console.log(error);
        }
      }
      return '';
    },
    [chartType, processedData]
  );

  const highestData = maxValue => {
    let highestValue = maxValue;
    processedData.forEach(element => {
      if (highestValue < element.value) {
        highestValue = element.value;
      }
    });
    return highestValue;
  };

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
          data={processedData}
          svg={{
            fill: 'black',
            fontSize: 10,
          }}
          contentInset={{ top: 5, bottom: 3 }}
          numberOfTicks={10}
          yAccessor={({ item }) => item.value}
          formatLabel={val => (chartType === 'signalStrength' ? `${val} dB` : `${val}`)}
          min={0}
          max={highestData(100)}
        />
        <BarChart
          gridMin={0}
          gridMax={100}
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
        data={dates}
        svg={{
          fill: 'black',
          fontSize: 10,
          y: 10,
        }}
        numberOfTicks={chartType === 'signalStrength' ? 6 : 0}
        contentInset={getInset(processedData.length)}
        xAccessor={({ item }) => item.date}
        formatLabel={(val, index) => handleLabelX(val, index)}
      />
    </View>
  );
};
const SignalStrengthChart = ({ data, helpLink, chartType }) => (
  <View>
    <SelectDevice />
    <CalendarComponent setEndDate />
    <TopBar type={chartType} data={data} helpLink={helpLink} />
    <Chart data={data} chartType={chartType} />
    <Buttons binBy={null} setBinBy={null} />
  </View>
);

export default SignalStrengthChart;
