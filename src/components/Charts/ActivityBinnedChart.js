import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { format } from 'i18n/date-fns';
import { StackedBarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
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

  const keys = ['mode2', 'mode1'];
  const colors = ['rgb(255, 193, 7)', 'rgb(76, 175, 80)'];

  const processedData = useMemo(
    () =>
      (data ?? []).map(({ mode1, date, mode2 }, index) => ({
        mode1: { value: mode1 },
        date,
        mode2: { value: mode2 },
        key: index,
      })),
    [data]
  );

  const highestData = maxValue => {
    let highestValue = maxValue;
    processedData.forEach(element => {
      const sumValue = element.mode1.value + element.mode2.value;
      if (highestValue < sumValue) {
        highestValue = sumValue;
      }
    });
    return highestValue;
  };

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
    },
    [processedData]
  );

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
          data={processedData}
          svg={{
            fill: 'black',
            fontSize: 10,
          }}
          contentInset={{ top: 5, bottom: 3 }}
          numberOfTicks={6}
          yAccessor={({ item }) => item.value}
          formatLabel={val => `${val} `}
          min={0}
          max={highestData(40)}
        />
        <StackedBarChart
          yAccessor={({ item }) => item.value}
          xAccessor={({ item }) => item.date}
          colors={colors}
          keys={keys}
          gridMin={0}
          gridMax={40}
          contentInset={{ top: 5, bottom: 3, left: 0, right: 0 }}
          style={{ height: 280, width: Dimensions.get('screen').width * 0.9, margintop: 10 }}
          data={processedData}
          valueAccessor={({ item, key }) => item[key].value}
        >
          <Grid direction={Grid.Direction.HORIZONTAL} />
          <Decorator pressX={pressX} chartType={chartType} />
        </StackedBarChart>
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

const ActivityBinChart = ({ data, helpLink, chartType, binBy, setBinBy }) => (
  <View>
    <SelectDevice />
    <CalendarComponent />
    <TopBar type={chartType} data={data} helpLink={helpLink} />
    <Chart data={data} chartType={chartType} />
    <Buttons binBy={binBy} setBinBy={setBinBy} />
  </View>
);

export default ActivityBinChart;
