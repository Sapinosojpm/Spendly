import { COLORS } from './constants';

/**
 * Formats a number as a currency string.
 */
export const formatCurrency = (amount) => {
  return `₱${parseFloat(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Determines the color status based on percentage spent.
 * < 70% = Green
 * 70-100% = Yellow
 * > 100% = Red
 */
export const getStatusColor = (percentage) => {
  if (percentage < 70) return COLORS.primary; // Green
  if (percentage <= 100) return COLORS.warning; // Yellow
  return COLORS.danger; // Red
};

/**
 * Calculates percentage of budget spent.
 */
export const calculatePercentage = (spent, allocated) => {
  if (allocated === 0) return 0;
  return (spent / allocated) * 100;
};
