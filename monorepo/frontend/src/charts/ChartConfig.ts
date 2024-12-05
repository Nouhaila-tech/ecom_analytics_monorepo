// Import Chart.js and Tailwind config utilities
import { Chart, Tooltip } from 'chart.js';
import { tailwindConfig, hexToRGB } from '../utils/Utils';
import type { Config } from 'tailwindcss';

// Register Chart.js Tooltip
Chart.register(Tooltip);

// Define Chart.js default settings
Chart.defaults.font.family = '"Inter", sans-serif';
Chart.defaults.font.weight = 500;
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.plugins.tooltip.mode = 'nearest';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.caretSize = 0;
Chart.defaults.plugins.tooltip.caretPadding = 20;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 8;

// Function that generates a gradient for line charts
export const chartAreaGradient = (
  ctx: CanvasRenderingContext2D,
  chartArea: { bottom: number; top: number },
  colorStops: { stop: number; color: string }[]
): CanvasGradient | string => {
  if (!ctx || !chartArea || colorStops.length === 0) {
    return 'transparent';
  }

  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  colorStops.forEach(({ stop, color }) => {
    gradient.addColorStop(stop, color);
  });

  return gradient;
};

// Extract and fallback values from Tailwind configuration
const config = tailwindConfig() as Config;

export const chartColors = {
  textColor: {
    light: config?.theme?.colors?.gray?.[400] || '#999999',  // Fallback for gray[400]
    dark: config?.theme?.colors?.gray?.[500] || '#666666',   // Fallback for gray[500]
  },
  gridColor: {
    light: config?.theme?.colors?.gray?.[100] || '#f5f5f5',  // Fallback for gray[100]
    dark: `rgba(${hexToRGB(config?.theme?.colors?.gray?.[700] || '#333333')}, 0.6)`, // Fallback for gray[700]
  },
  backdropColor: {
    light: config?.theme?.colors?.white || '#ffffff', // Fallback for white
    dark: config?.theme?.colors?.gray?.[800] || '#1f2937', // Fallback for gray[800]
  },
  tooltipTitleColor: {
    light: config?.theme?.colors?.gray?.[800] || '#1f2937', // Fallback for gray[800]
    dark: config?.theme?.colors?.gray?.[100] || '#f5f5f5', // Fallback for gray[100]
  },
  tooltipBodyColor: {
    light: config?.theme?.colors?.gray?.[500] || '#6b7280', // Fallback for gray[500]
    dark: config?.theme?.colors?.gray?.[400] || '#9ca3af', // Fallback for gray[400]
  },
  tooltipBgColor: {
    light: config?.theme?.colors?.white || '#ffffff', // Fallback for white
    dark: config?.theme?.colors?.gray?.[700] || '#374151', // Fallback for gray[700]
  },
  tooltipBorderColor: {
    light: config?.theme?.colors?.gray?.[200] || '#e5e7eb', // Fallback for gray[200]
    dark: config?.theme?.colors?.gray?.[600] || '#4b5563', // Fallback for gray[600]
  },
};
