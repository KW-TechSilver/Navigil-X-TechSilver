import _, { round } from 'lodash';
import React, { useMemo, useCallback, useRef } from 'react';
import { PanResponder } from 'react-native';
import { Circle, G, TSpan, Text as SVGText, Rect } from 'react-native-svg';
import { format } from 'i18n/date-fns';

const yes = () => true;

export const usePanResponder = ({ setPressX }) => {
  const releasePress = useCallback(() => setPressX(undefined), [setPressX]);
  const handlePress = useCallback(event => setPressX(_.last(event.nativeEvent.touches).locationX), [
    setPressX,
  ]);
  return useRef(
    PanResponder.create({
      onShouldBlockNativeResponder: yes,
      onPanResponderTerminationRequest: yes,
      onStartShouldSetPanResponder: yes,
      onStartShouldSetPanResponderCapture: yes,
      onMoveShouldSetPanResponder: yes,
      onMoveShouldSetPanResponderCapture: yes,
      onPanResponderMove: handlePress,
      onPanResponderRelease: releasePress,
      onPanResponderTerminate: releasePress,
    })
  ).current;
};

const ChartValue = (value, chartType) => {
  switch (chartType) {
    case 'signalStrength':
      return `${value.value} dB`;
    case 'activity':
      return `${value.value} %`;
    case 'heartRate':
      return `${value.value} /min`;
    case 'hrv':
    case 'respiratoryRate':
      return `${value.value}`;
    case 'activityBinned':
      return `Very Active: ${value.mode2.value}`;
    default:
  }
};

const Tooltip = ({ x, y, value, chartType }) => (
  <>
    <Rect
      stroke='white'
      fill='white'
      width={130}
      height={chartType === 'activityBinned' ? 70 : 50}
      x={x + 10}
      y={y}
    />
    <SVGText stroke='black'>
      <TSpan x={x + 15} y={y + 20} fontWeight={100}>
        {ChartValue(value, chartType)}
      </TSpan>
      {chartType === 'activityBinned' && (
        <TSpan x={x + 15} y={y + 40} fontWeight={100}>
          {`Active: ${value.mode1.value}`}
        </TSpan>
      )}
      <TSpan x={x + 15} y={chartType === 'activityBinned' ? y + 60 : y + 40} fontWeight={100}>
        {format(value.date, 'Pp')}
      </TSpan>
    </SVGText>
  </>
);

function areaSelection(areaInfo, areaData) {
  const rectX = 10;
  let rectY = 5;
  const textX = 55;
  let textY = 5;
  // eslint-disable-next-line no-return-assign
  const areaObject = Object.keys(areaInfo).map(aInfo => ({
    rectX,
    rectY: (rectY += 22),
    textX,
    textY: (textY += 22),
    title: areaInfo[aInfo].title,
    color: areaInfo[aInfo].color,
    barValue: Object.keys(areaData).map(area => area === aInfo && round(areaData[area].value)),
  }));
  return areaObject;
}

const BeaconTooltip = ({ x, y, value, areaInfo }) => {
  const selectedBar = areaSelection(areaInfo, value);
  return (
    <>
      <Rect stroke='white' fill='rgb(62, 159, 59)' width={120} height={160} x={x + 10} y={y} />
      <SVGText stroke='white'>
        <TSpan x={x + 45} y={y + 20} fontWeight={100}>
          {format(value.date, 'P')}
        </TSpan>
      </SVGText>
      {selectedBar.map((selBar, index) => (
        <G key={index}>
          <SVGText x={15} dy={20} alignmentBaseline='middle' textAnchor='middle' fill='white'>
            <TSpan x={x + 45} dy='10' y={selBar.textY}>
              {selBar.title}
            </TSpan>
          </SVGText>
          <Rect
            height={20}
            width={30}
            stroke='grey'
            fill={selBar.color}
            ry={5}
            rx={5}
            x={x + 85}
            y={selBar.rectY}
          />
          <SVGText x={15} dy={20} alignmentBaseline='middle' textAnchor='middle' stroke='white'>
            <TSpan x={x + 100} dy='10' y={selBar.textY}>
              {selBar.barValue}
            </TSpan>
          </SVGText>
        </G>
      ))}
    </>
  );
};
export const Decorator = ({ x, y, data, pressX, bandwidth, chartType, areaInfo }) => {
  const selectedIndex = useMemo(() => {
    let closest;
    let dist = 1e9;
    data.forEach((value, index) => {
      const diff = x(index) - pressX + bandwidth / 2;
      if (diff * diff < dist) {
        dist = diff * diff;
        closest = index;
      }
    });

    return closest;
  }, [data, x, pressX, bandwidth]);

  return data.map((value, index) => {
    const xPos = x(index) + bandwidth / 2;
    const yPos = y(value.value);
    return (
      index === selectedIndex && (
        <G key={index} x={xPos} y={yPos}>
          {chartType === 'beaconChart' ? (
            <>
              <BeaconTooltip
                x={xPos > 150 ? -150 : 0}
                y={yPos > 230 ? -50 : 0}
                value={value}
                areaInfo={areaInfo}
              />
              <Circle stroke='purple' fill='purple' r={2.5} />
              <Rect width={0.5} x={-0.25} height='100%' stroke='black' fill='black' />
            </>
          ) : (
            <>
              <Tooltip
                x={xPos > 150 ? -150 : 0}
                y={yPos > 230 ? -50 : 0}
                value={value}
                chartType={chartType}
              />
              <Circle stroke='purple' fill='purple' r={2.5} />
              <Rect width={0.5} x={-0.25} height='100%' stroke='black' fill='black' />
            </>
          )}
        </G>
      )
    );
  });
};
