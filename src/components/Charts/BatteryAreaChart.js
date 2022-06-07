import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { format } from 'i18n/date-fns';
import { Circle, G, TSpan, Text as SVGText, Rect } from 'react-native-svg';
import { AreaChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import useFormatMessage from 'hooks/useFormatMessage';
import SelectDevice from 'components/SelectDevice';
import CalendarComponent from './CalenderComponent';
import TopBar from './TopBar';
import Buttons from './Buttons';
import { usePanResponder } from './DecoratorAndToolTip';

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
      <G key={index} x={xPos} y={yPos}>
        {index === selectedIndex && (
          <>
            <Tooltip x={xPos > 150 ? -150 : 0} y={yPos > 230 ? -50 : 0} value={value} />
            <Circle stroke='purple' fill='purple' r={2} />
            <Rect width={0.5} x={-0.25} height='100%' stroke='black' fill='black' />
          </>
        )}
      </G>
    );
  });
};

const Chart = ({ data }) => {
  const { ucFirst } = useFormatMessage();
  const [pressX, setPressX] = useState();
  const panResponder = usePanResponder({ setPressX });

  const processedData = useMemo(
    () => (data ?? []).map(({ value, time }) => ({ value, date: new Date(time) })),
    [data]
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
          numberOfTicks={10}
          yAccessor={({ item }) => item.value}
          formatLabel={val => `${val} %`}
          min={0}
          max={100}
        />
        <AreaChart
          gridMin={0}
          gridMax={100}
          contentInset={{ top: 5, bottom: 3, left: 10, right: 10 }}
          style={{ height: 280, width: Dimensions.get('screen').width * 0.9, margintop: 10 }}
          data={processedData}
          yAccessor={({ item }) => item.value}
          xAccessor={({ item }) => item.date}
          curve={shape.curveMonotoneX}
          svg={{ fill: 'rgb(76, 175, 80)' }}
        >
          <Grid direction={Grid.Direction.HORIZONTAL} />
          <Decorator pressX={pressX} />
        </AreaChart>
      </View>
      <XAxis
        data={processedData}
        svg={{
          fill: 'black',
          fontSize: 10,
          y: 10,
        }}
        numberOfTicks={6}
        contentInset={{ left: 35, right: 15 }}
        xAccessor={({ item }) => item.date}
        formatLabel={val => format(val, 'dd/MM')}
      />
    </View>
  );
};

const BatteryAreaChart = ({ data, helpLink }) => (
  <View>
    <SelectDevice />
    <CalendarComponent />
    <TopBar type='battery' data={data} helpLink={helpLink} />
    <Chart data={data} />
    <Buttons binBy={null} setBinBy={null} />
  </View>
);

export default BatteryAreaChart;
