import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { COLORS } from '../utils/constants';
import useBudgetStore from '../store/useBudgetStore';
import useTheme from '../utils/useTheme';

const CalendarView = ({ onDateSelect, selectedDate }) => {
  const { expenses, paydayDays } = useBudgetStore();
  const C = useTheme();

  // Generate marked dates for expenses and paydays
  const markedDates = useMemo(() => {
    const marks = {};

    // 1. Mark Paydays (15th and 30th)
    // We'll mark them for current, previous, and next month to be safe
    const now = new Date();
    const months = [now.getMonth() - 1, now.getMonth(), now.getMonth() + 1];
    const year = now.getFullYear();

    months.forEach(m => {
      paydayDays.forEach(day => {
        const date = new Date(year, m, day);
        const dateString = date.toISOString().split('T')[0];
        marks[dateString] = {
          customStyles: {
            container: {
              backgroundColor: C.accent,
              borderWidth: 2,
              borderColor: C.border,
              borderRadius: 4,
            },
            text: {
              color: '#000',
              fontWeight: '900',
            },
          },
        };
      });
    });

    // 2. Mark Expense Days
    expenses.forEach(expense => {
      const dateString = expense.date.split('T')[0];
      if (marks[dateString]) {
        // If it's already a payday, add a dot
        marks[dateString].dots = [{ key: 'expense', color: C.text, selectedDotColor: C.text }];
      } else {
        marks[dateString] = {
          marked: true,
          dotColor: C.text,
        };
      }
    });

    // 3. Highlight Selected Date
    if (selectedDate) {
      if (!marks[selectedDate]) marks[selectedDate] = {};
      marks[selectedDate].selected = true;
      marks[selectedDate].selectedColor = C.primary;
      marks[selectedDate].selectedTextColor = '#000';
    }

    return marks;
  }, [expenses, paydayDays, selectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={day => onDateSelect(day.dateString)}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: C.text,
          selectedDayBackgroundColor: C.primary,
          selectedDayTextColor: '#000',
          todayTextColor: C.secondary,
          dayTextColor: C.text,
          textDisabledColor: '#999',
          dotColor: C.text,
          selectedDotColor: '#000',
          arrowColor: C.text,
          disabledArrowColor: '#d9e1e8',
          monthTextColor: C.text,
          indicatorColor: C.text,
          textDayFontWeight: '900',
          textMonthFontWeight: '900',
          textDayHeaderFontWeight: '900',
          textDayFontSize: 14,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
        }}
        style={styles.calendar}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.box, { backgroundColor: COLORS.accent }]} />
          <Text style={styles.legendText}>Payday</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.dot} />
          <Text style={styles.legendText}>Gastos</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#000',
    padding: 10,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  calendar: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  legend: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#EEE',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  box: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
  },
  legendText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
});

export default CalendarView;
