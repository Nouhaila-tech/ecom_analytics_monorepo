// Import Chart.js and Tailwind config utilities
import { Chart, Tooltip } from 'chart.js';
import { tailwindConfig, hexToRGB } from '../utils/Utils';

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
  ctx: CanvasRenderingContext2D | null,
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

// Define a safe type for the Tailwind configuration
type TailwindColors = {
  [key: string]: string | { [key: string]: string };
};

type TailwindConfig = {
  theme: {
    colors: TailwindColors;
  };
};

// Get Tailwind configuration
const config = tailwindConfig() as TailwindConfig;

// Utility function to safely extract colors
const getColor = (colorPath: string, fallback: string): string => {
  const paths = colorPath.split('.');
  let current: any = config.theme.colors;

  for (const path of paths) {
    if (current && typeof current === 'object' && path in current) {
      current = current[path];
    } else {
      return fallback;
    }
  }

  return typeof current === 'string' ? current : fallback;
};

// Extract and fallback values from Tailwind configuration
export const chartColors = {
  textColor: {
    light: getColor('gray.400', '#999999'),
    dark: getColor('gray.500', '#666666'),
  },
  gridColor: {
    light: getColor('gray.100', '#f5f5f5'),
    dark: `rgba(${hexToRGB(getColor('gray.700', '#333333'))}, 0.6)`,
  },
  backdropColor: {
    light: getColor('white', '#ffffff'),
    dark: getColor('gray.800', '#1f2937'),
  },
  tooltipTitleColor: {
    light: getColor('gray.800', '#1f2937'),
    dark: getColor('gray.100', '#f5f5f5'),
  },
  tooltipBodyColor: {
    light: getColor('gray.500', '#6b7280'),
    dark: getColor('gray.400', '#9ca3af'),
  },
  tooltipBgColor: {
    light: getColor('white', '#ffffff'),
    dark: getColor('gray.700', '#374151'),
  },
  tooltipBorderColor: {
    light: getColor('gray.200', '#e5e7eb'),
    dark: getColor('gray.600', '#4b5563'),
  },
};
