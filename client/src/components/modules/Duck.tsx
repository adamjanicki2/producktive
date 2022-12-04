import React from "react";
import type { ColorOption } from "../../util";

const COLOR_TO_HEX = {
  yellow: {
    primary: "#FFD527",
    secondary: "#FFC31A",
  },
  orange: {
    primary: "#FF8F29",
    secondary: "#FF6E0B",
  },
  green: {
    primary: "#52DF13",
    secondary: "#C1FBA4",
  },
  blue: {
    primary: "#0075F2",
    secondary: "#00F2F2",
  },
  red: {
    primary: "#E52525",
    secondary: "#FB7373",
  },
  black: {
    primary: "#070707",
    secondary: "#727072",
  },
  purple: {
    primary: "#800080",
    secondary: "#f80bf8",
  },
} as const;

const Duck = ({
  beakColor,
  bodyColor,
  size,
}: {
  size: number;
  beakColor: ColorOption;
  bodyColor: ColorOption;
}) => {
  const bodyPrimary =
    COLOR_TO_HEX[bodyColor].primary ?? COLOR_TO_HEX.yellow.primary;
  const bodySecondary =
    COLOR_TO_HEX[bodyColor].secondary ?? COLOR_TO_HEX.yellow.secondary;
  const beakPrimary =
    COLOR_TO_HEX[beakColor].primary ?? COLOR_TO_HEX.orange.primary;
  const beakSecondary =
    COLOR_TO_HEX[beakColor].secondary ?? COLOR_TO_HEX.orange.secondary;
  return (
    <svg
      style={{
        width: size,
        height: size,
        verticalAlign: "middle",
        fill: "currentColor",
        overflow: "hidden",
      }}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="body-primary"
        d="M271.4 440.2c-29.9-32.9-28.8-70.5-25.6-124.6 3.4-58.9 39.2-102.7 85.5-131.5 102.6-64 265.9-15.6 295 112.5 21.9 96.4-23.1 138.5-59 172.2-38.1 35.8-31.5 44-4.3 58 26.7 13.7 88.8 14.3 140.1-26.1 62.5-49.2 91.6-94.4 155.4-26.7 84.3 89.5 43.2 276.8-97 358.2-144.7 83.8-291.7 50.2-355 33.8-63.5-16.5-183.6-74.7-205.2-192.1-18-97.8 41.1-151.6 93.2-180.9 38.5-21.7 16.7-9.2-23.1-52.8z"
        fill={bodyPrimary}
      />
      <path
        id="body-secondary"
        d="M858.4 473.9c-7.2-7.6-32.6-24.5-39-29.4 42 97.1-2.9 230.1-106.8 296-141.1 89.5-291.6 60-354.8 43.6-36.8-9.6-98.2-26.5-142.9-67.5 40 88.7 139.1 135.8 191.6 149.4 63.3 16.4 210.3 50.1 354.9-33.9 140.3-81.4 181.3-268.7 97-358.2z"
        fill={bodySecondary}
      />
      <path
        id="eye"
        d="M332.9 305.1a41.5 38.1 0 1 0 83 0 41.5 38.1 0 1 0-83 0Z"
        fill="#543630"
      />
      <path
        id="body-outline"
        d="M547.8 898.2c-68.4 0-124.9-14.7-143.8-19.6-41-10.7-86.6-33.7-122-61.5-49.4-38.9-80.7-87.8-90.5-141.4-8.5-46.4-1.2-88 21.8-123.4 17-26.2 42.7-49.1 76.3-68l0.4-0.2c3.7-2.1 7.3-4.1 10.1-5.8-0.1-0.1-0.2-0.1-0.2-0.2-7.7-5.4-20.7-14.5-35.9-31.2-33.7-37.1-31.2-81-28.2-131.9 1.7-29.7 11.3-57.3 28.4-82.1 15.2-21.9 35.9-41.2 61.7-57.3 27.1-16.9 59.2-27 92.9-29 32.4-2 65.7 3.3 96.2 15.4 61 24.1 105 72.3 120.8 132.1 10.2 38.5 7.3 75.7-8.6 110.7-11.1 24.5-28.5 47.9-53.2 71.4-22 21-23.7 27.9-23.5 29.9 0.5 3.5 12.8 9.8 16.8 11.9 23.8 12.2 81.4 12.7 129.4-25.1 9-7.1 17.2-14 25.2-20.7 46.2-39 82.7-69.7 143.7-5 37.2 39.4 53.1 99.2 43.6 163.9-5.9 40.7-21.5 81.1-45 116.9-25.1 38.2-58.9 70.3-97.8 92.9-64 37.1-135.6 56.4-212.9 57.4-1.8-0.1-3.8-0.1-5.7-0.1zM432.3 166c-4.1 0-8.1 0.1-12.2 0.4-30.4 1.9-59.3 10.9-83.6 26.1-34.8 21.8-77.2 60.9-80.8 123.6-3.2 55.2-3.7 87.9 23.1 117.3 13.7 15.1 25 23 32.6 28.2 7.6 5.3 13.6 9.5 13.2 17.4-0.3 7.1-6.5 11.3-9.1 13.1-3.6 2.4-8.6 5.3-15.6 9.2l-0.4 0.2c-71.9 40.4-101.6 97.7-88.3 170.4 9.1 49.5 37.1 93 83.2 129.3 49.4 38.9 100.2 54.1 114.6 57.9 18.3 4.8 72.9 19 138.8 19h5.5c73.8-0.9 142.1-19.3 203.1-54.7 36.2-21 67.8-51 91.1-86.5 21.9-33.4 36.4-71 42-108.8 8.5-58.6-5.4-112.3-38.4-147.3-15.5-16.5-36.2-34.8-58.9-30.5-17.3 3.3-35 18.2-57.3 37.1-8.1 6.8-16.4 13.9-25.7 21.1-34.2 26.9-72.5 36.7-103.6 36.7-19.4 0-36-3.8-47.2-9.5-14-7.2-25.7-14.1-27.5-26.9-2-14.1 9.8-28.5 29.5-47.3 22.8-21.7 38.7-43 48.8-65.1 13.9-30.6 16.4-63.4 7.4-97.3-14.2-53.6-53.8-96.8-108.8-118.6-24.1-9.5-49.9-14.5-75.5-14.5z"
        fill="#543630"
      />
      <path
        id="beak-primary"
        d="M244.1 334.6s8.6 32.6 60.7 52.4c24.8 9.5 51.3 10.3 59.6 40.2 5 17.8-3.8 34.3-22.8 48.4-32.5 24.1-74.4 16.3-103.4 11.2-9.4-1.7-40.2-6.9-73.5-30.9-29.9-21.6-57.3-66.2-31.6-84.2s59.7 2.4 111-37.1z"
        fill={beakPrimary}
      />
      <path
        id="beak-secondary"
        d="M364.4 427.1c-3-10.6-8.2-17.6-14.9-22.5-3.1 3.3-6.8 6.4-10.9 9.5-32.5 24.1-58.4 22.6-94.5 20.6-9.5-0.5-43.7-1.3-77-25.4-9.2-6.6-27.9-21.7-35.1-31.2-1.1 0.6 1.1-0.8 0 0-25.6 18 2.7 56 32.6 77.6 33.3 24.1 64.1 29.3 73.5 30.9 29.1 5.2 71 12.9 103.4-11.2 19.1-14 27.8-30.4 22.9-48.3z"
        fill={beakSecondary}
      />
      <path
        id="beak-outline"
        d="M285.2 502.1c-17.6 0-34.4-3-47.9-5.4l-1.2-0.2c-10.5-1.9-42.5-7.5-77.2-32.6-23-16.6-46.1-46.7-46-72.4 0.1-11.8 5.1-21.5 14.4-28.1 12.5-8.8 26.1-10 40.5-11.2 19.7-1.7 41.9-3.6 70.3-25.5 2.7-2.1 6.2-2.8 9.4-1.6 3.2 1.1 5.5 3.7 6.3 6.9 0.2 0.7 2.4 7.4 9.7 16 7.1 8.4 20.7 20.4 44.9 29.6 4.9 1.9 10 3.4 14.9 4.9 20 6.1 42.7 13 50.7 41.9 4.2 14.9 2.9 37.3-26.5 59.1-19.4 14.4-41.4 18.6-62.3 18.6z m-45.1-152.4c-28.4 18.7-51.7 20.7-70.7 22.4-12.6 1.1-22.6 2-30.7 7.6-4 2.8-5.9 6.6-5.9 11.9-0.1 15.8 16.8 41 37.7 56 31 22.4 59.6 27.5 69 29.1l1.3 0.2c27.9 5 66.2 11.7 94.9-9.5 16.3-12.1 22.8-24.7 19.2-37.6-4.9-17.5-16.7-21.9-37.3-28.1-5.3-1.6-10.7-3.3-16.2-5.4-36.5-13.8-53.6-33.8-61.3-46.6z m13.6-17.7z"
        fill="#543630"
      />
    </svg>
  );
};

export default Duck;
