/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
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
  const { areaInfo, areaData } = data || {};
  const dataRef = useRef(areaData);

  useEffect(() => {
    dataRef.current = areaData;
  }, [areaData, dataRef]);
  const getInset = dataLength => {
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

  const processedData = useMemo(
    () =>
      areaData &&
      areaData.map((area, index) => {
        const { areas, date } = area;
        const { area0: a0, area1: a1, area2: a2, area3: a3, area4: a4, area5: a5 } = areas;
        return {
          area0: {
            value: a0,
          },
          area1: {
            value: a1,
          },
          area2: {
            value: a2,
          },
          area3: {
            value: a3,
          },
          area4: {
            value: a4,
          },
          area5: {
            value: a5,
          },
          key: index,
          date,
        };
      }),
    [areaData]
  );

  const handleLabelX = useCallback(
    (val, index) => {
      if (processedData.length > 24 && index % 2 !== 0) {
        return '';
      }
      if (processedData.length < 8 && processedData.length > 3) {
        try {
          return format(processedData[index].date, 'd/MM');
        } catch (error) {
          throw new Error(error);
        }
      }
      try {
        return format(processedData[index].date, 'd');
      } catch (error) {
        throw new Error(error);
      }
    },
    [processedData]
  );

  if (!data) {
    return (
      <View style={styles.chartContainer}>
        <Text style={{ paddingTop: 80, fontSize: 16 }}>
          {ucFirst({ id: 'general.noDataAvailable' })}
        </Text>
      </View>
    );
  }

  const keys = Object.keys(areaInfo);
  const colors = Object.keys(areaInfo).map(key => areaInfo[key].color);
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
          max={100}
        />
        <StackedBarChart
          yAccessor={({ item }) => item.value}
          xAccessor={({ item }) => item.date}
          colors={colors}
          keys={keys}
          gridMin={0}
          gridMax={100}
          contentInset={{ top: 5, bottom: 3, left: 0, right: 0 }}
          style={{ height: 280, width: Dimensions.get('screen').width * 0.9, margintop: 10 }}
          data={processedData}
          valueAccessor={({ item, key }) => item[key].value}
        >
          <Grid direction={Grid.Direction.HORIZONTAL} />
          <Decorator pressX={pressX} chartType={chartType} areaInfo={areaInfo} />
        </StackedBarChart>
      </View>
      <XAxis
        data={processedData}
        svg={{
          fill: 'black',
          fontSize: 10,
          y: 10,
        }}
        numberOfTicks={processedData.length - 1}
        contentInset={getInset(processedData.length)}
        formatLabel={(val, index) => handleLabelX(val, index)}
      />
    </View>
  );
};

const BeaconCharts = ({ data, helpLink, chartType }) => (
  <View>
    <SelectDevice />
    <CalendarComponent />
    <TopBar type='beacon' data={data} helpLink={helpLink} />
    <Chart data={data} chartType={chartType} />
    <Buttons binBy={null} setBinBy={null} />
  </View>
);

export default BeaconCharts;
