import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { colors } from '@/theme/colors';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

function defaults(props: IconProps) {
  return {
    size: props.size ?? 22,
    color: props.color ?? colors.text,
    strokeWidth: props.strokeWidth ?? 2.2,
  };
}

export function ClipboardIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="8" y="2" width="8" height="4" rx="1.4" />
      <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </Svg>
  );
}

export function InstagramIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, color: p.color ?? colors.accent });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="3" width="18" height="18" rx="5" />
      <Circle cx="12" cy="12" r="4" />
      <Circle cx="17.5" cy="6.5" r="1.2" fill={color} />
    </Svg>
  );
}

export function ChevronRight(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, color: p.color ?? colors.dim, strokeWidth: 2.4 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 5l7 7-7 7" />
    </Svg>
  );
}

export function ChevronLeft(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, color: p.color ?? colors.text, strokeWidth: 2.4 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 5l-7 7 7 7" />
    </Svg>
  );
}

export function ClockIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, color: p.color ?? colors.dim, strokeWidth: 2 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function SearchIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, color: p.color ?? colors.dim, strokeWidth: 2.2 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <Circle cx="11" cy="11" r="7" />
      <Path d="m20 20-3.4-3.4" />
    </Svg>
  );
}

export function HomeIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.1 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5.5 9.5V20a1 1 0 0 0 1 1H17.5a1 1 0 0 0 1-1V9.5" />
    </Svg>
  );
}

export function BookmarkIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.1 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1z" />
    </Svg>
  );
}

export function ProfileIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.1 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4.5 20.5c0-4 3.5-6 7.5-6s7.5 2 7.5 6" />
    </Svg>
  );
}

export function PlayIcon(p: IconProps) {
  const { size, color } = defaults({ ...p, color: p.color ?? colors.onAccent });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M7 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 7 5.5z" />
    </Svg>
  );
}

export function CheckIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, color: p.color ?? colors.onAccent, strokeWidth: 3.2 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12l4.5 4.5L19 7" />
    </Svg>
  );
}

export function PlusIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, color: p.color ?? colors.onAccent, strokeWidth: 2.6 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function MinusIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.6 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <Path d="M5 12h14" />
    </Svg>
  );
}

export function CloseIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.4 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <Path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function UploadIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.2 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 15V4" />
      <Path d="M8 8l4-4 4 4" />
      <Path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
    </Svg>
  );
}

export function EyeIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.1 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <Circle cx={12} cy={12} r={3} />
    </Svg>
  );
}

export function EyeOffIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.1 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-7 0-10-7-10-7a17.55 17.55 0 0 1 4.06-5.06" />
      <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a17.7 17.7 0 0 1-2.16 3.19" />
      <Path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <Path d="M1 1l22 22" />
    </Svg>
  );
}

export function ExternalLinkIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.2 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <Path d="M15 3h6v6" />
      <Path d="M10 14L21 3" />
    </Svg>
  );
}

export function PencilIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, color: p.color ?? colors.dim, strokeWidth: 2.2 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </Svg>
  );
}

export function CameraIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.1 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 7h3l1.2-2h5.6L16 7h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <Circle cx={12} cy={12.5} r={3.2} />
    </Svg>
  );
}

export function TrashIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.2 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 6h18" />
      <Path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <Path d="M10 11v6M14 11v6" />
    </Svg>
  );
}

export function DownloadIcon(p: IconProps) {
  const { size, color, strokeWidth } = defaults({ ...p, strokeWidth: 2.2 });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 4v11" />
      <Path d="M16 11l-4 4-4-4" />
      <Path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
    </Svg>
  );
}
