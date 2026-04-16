import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-gifted-charts';
import { COLORS } from '../utils/constants';

const SpendingChart = ({ data, type = 'bar', pieData = [] }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 165;  // Calculated to fit card + Y-axis labels exactly
  if (type === 'pie') {
    return (
      <View style={styles.container}>
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={COLORS.white}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 22, color: COLORS.black, fontWeight: '900'}}>
                  Stats
                </Text>
              </View>
            );
          }}
        />
        <View style={styles.legendContainer}>
          {pieData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.dot, {backgroundColor: item.color}]} />
              <Text style={styles.legendText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  const chartColors = [COLORS.primary, COLORS.secondary, COLORS.accent];
  const coloredData = data.map((item, index) => ({
    ...item,
    frontColor: chartColors[index % chartColors.length],
  }));

  if (type === 'line') {
    const spacing = (chartWidth - 20) / (data.length - 1);
    return (
      <View style={styles.container}>
        <LineChart
          data={data}
          width={chartWidth}
          height={160}
          spacing={spacing}
          initialSpacing={10}
          thickness={4}
          color={COLORS.primary}
          dataPointsColor={COLORS.black}
          dataPointsRadius={4}
          areaChart
          startFillColor={COLORS.primary}
          startOpacity={0.4}
          endOpacity={0.1}
          noOfSections={4}
          yAxisThickness={3}
          xAxisThickness={3}
          yAxisColor={COLORS.black}
          xAxisColor={COLORS.black}
          yAxisTextStyle={{color: COLORS.black, fontSize: 10, fontWeight: '900'}}
          xAxisLabelTextStyle={{color: COLORS.black, fontSize: 10, fontWeight: '900'}}
          hideRules
          backgroundColor={COLORS.white}
          yAxisLabelWidth={45}
          isAnimated
          animationDuration={1200}
        />
      </View>
    );
  }

  // Bar Chart Mode (Optimized for 7 days)
  const numBars = data.length || 7;
  const barWidth = 22;
  const totalBarWidth = barWidth * numBars;
  const plotWidth = chartWidth - 20; // Internal plot area
  const availableSpacing = (plotWidth - totalBarWidth) / (numBars + 1);

  return (
    <View style={styles.container}>
      <BarChart
        data={coloredData}
        barWidth={barWidth}
        spacing={availableSpacing}
        initialSpacing={availableSpacing}
        noOfSections={4}
        barBorderRadius={0}
        barBorderWidth={2}
        barBorderColor={COLORS.black}
        yAxisThickness={3}
        xAxisThickness={3}
        yAxisColor={COLORS.black}
        xAxisColor={COLORS.black}
        hideRules
        showValuesAsTopText={true}
        topLabelTextStyle={{color: COLORS.black, fontSize: 9, fontWeight: '900'}}
        yAxisTextStyle={{color: COLORS.black, fontSize: 10, fontWeight: '900'}}
        xAxisLabelTextStyle={{color: COLORS.black, fontSize: 10, fontWeight: '900', marginTop: 4}}
        width={plotWidth}
        height={160}
        yAxisLabelWidth={45}
        isAnimated
        animationDuration={800}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    gap: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default SpendingChart;
