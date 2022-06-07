import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { format } from 'i18n/date-fns';
import { Circle, G, TSpan, Text as SVGText, Rect } from 'react-native-svg';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import useFormatMessage from 'hooks/useFormatMessage';
import CalendarComponent from './CalenderComponent';
import TopBar from './TopBar';
import Buttons from './Buttons';

const styles = StyleSheet.create({
  chartContainer: { marginLeft: 'auto', marginRight: 'auto', height: 310 },
  yaxisChartContainer: { flexDirection: 'row', marginTop: 10 },
});

const Tooltip = ({ x, y, value }) => (
  <>
    <Rect stroke='white' fill='white' width={130} height={50} x={x + 10} y={y} />
    <SVGText stroke='black'>
      <TSpan x={x + 15} y={y + 20} fontWeight={100}>
        {value.value} %
      </TSpan>
      <TSpan x={x + 15} y={y + 40} fontWeight={100}>
        {format(value.date, 'Pp')}
      </TSpan>
    </SVGText>
  </>
);

const Decorator = ({ x, y, data, pressX }) => {
  const selectedIndex = useMemo(() => {
    let closest;
    let dist = 1e9;
    data.forEach((value, index) => {
      const diff = x(value.date) - pressX;
      if (diff * diff < dist) {
        dist = diff * diff;
        closest = index;
      }
    });
    return closest;
  }, [pressX, data, x]);

  return data.map((value, index) => {
    const xPos = x(value.date);
    const yPos = y(value.value);

    return (
      index === selectedIndex && (
        <G key={index} x={xPos} y={yPos}>
          <Tooltip x={xPos > 150 ? -150 : 0} y={yPos > 230 ? -50 : 0} value={value} />
          <Circle stroke='purple' fill='purple' r={2.5} />
          <Rect width={0.5} x={-0.25} height='100%' stroke='black' fill='black' />
        </G>
      )
    );
  });
};

const Chart = ({ data }) => {
  const { ucFirst } = useFormatMessage();
  const [pressX, setPressX] = useState();

  const handlePress = useCallback(event => setPressX(event.nativeEvent.locationX), []);
  const releasePress = useCallback(() => setPressX(undefined), []);

  const ActivityBarColor = val =>
    val < 30 ? 'rgb(211, 47, 47)' : val < 80 ? 'rgb(255, 193, 7)' : '#3e9f3b';
  const processedData = useMemo(
    () =>
      (data ?? []).map(({ value, time }) => ({
        value,
        svg: {
          fill: ActivityBarColor(value),
        },
        date: new Date(time),
      })),
    [data]
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
    <View style={styles.chartContainer}>
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
          formatLabel={val => `${val} %`}
          min={0}
          max={100}
        />
        <BarChart
          gridMin={0}
          gridMax={100}
          contentInset={{ top: 5, bottom: 3, left: 10, right: 10 }}
          style={{ height: 280, width: Dimensions.get('screen').width * 0.9, margintop: 10 }}
          data={processedData}
          yAccessor={({ item }) => item.value}
          xAccessor={({ item }) => item.date}
          svg={{ fill: 'rgb(76, 175, 80)', onPressIn: handlePress, onPressOut: releasePress }}
        >
          <Grid direction={Grid.Direction.HORIZONTAL} />
          <Decorator pressX={pressX} />
        </BarChart>
      </View>
      <XAxis
        data={processedData}
        svg={{
          fill: 'black',
          fontSize: 10,
          y: 10,
        }}
        numberOfTicks={6}
        contentInset={getInset(processedData.length)}
        formatLabel={(val, index) => handleLabelX(val, index)}
      />
    </View>
  );
};
const ActivityBarChart = ({ data, helpLink }) => (
  <View>
    <CalendarComponent setEndDate />
    <TopBar type='activity' data={data} helpLink={helpLink} />
    <Chart data={data} chartType='activity' />
    <Buttons />
  </View>
);

export default ActivityBarChart;
