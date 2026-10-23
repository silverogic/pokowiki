"use client";

import cn from "classnames";
import Image from "next/image";

import communityIconImg from "@/assets/images/community.webp";
import { PokemonType } from "@/types";
import { useI18n } from "@/utils/i18n";

interface IIconProps {
  name: string;
  size?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

export const PokeBallIcon: React.FC<{
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size = "1em", className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("inline-block shrink-0 align-middle", className)}
    style={{ width: size, height: size, ...style }}
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="#FFFFFF"
      stroke="#2D3748"
      strokeWidth="2"
    />
    <path
      d="M2.05 12a10 10 0 0 1 19.9 0H15.5a3.5 3.5 0 0 1-7 0H2.05z"
      fill="#E53E3E"
    />
    <path
      d="M2 12h6.5a3.5 3.5 0 0 0 7 0H22"
      stroke="#2D3748"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="3.5"
      fill="#FFFFFF"
      stroke="#2D3748"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="1.5"
      fill="#2D3748"
    />
  </svg>
);

export const Icon: React.FC<IIconProps> = ({ name, size, style, className }) => {
  if (name === "community") {
    return (
      <Image
        src={communityIconImg}
        alt="Community"
        className={cn("inline-block shrink-0 object-contain align-middle", className)}
        style={{
          width: size || "1.25em",
          height: size || "1em",
          ...style,
        }}
        unoptimized
        aria-hidden="true"
      />
    );
  }

  if (name === "pokeball") {
    return (
      <PokeBallIcon
        size={size}
        style={style}
        className={className}
      />
    );
  }

  return (
    <span
      className={cn("icon", `icon-${name}`, className)}
      style={{ fontSize: size, ...style }}
    />
  );
};

interface ITypeIconProps {
  type: PokemonType;
  className?: string;
}

export const TypeIcon: React.FC<ITypeIconProps> = ({ type, className }) => {
  const { getTypeDisplayName } = useI18n();
  return (
    <div className={cn(`badge bg-${type}`, className)}>
      <div className={`badge-icon icon icon-${type}`} />
      <div className="badge-text">{getTypeDisplayName(type)}</div>
    </div>
  );
};

export const TypeIcons: React.FC<{ types: PokemonType[] }> = ({ types }) => (
  <span className="badges">
    {Array.from(new Set(types || [])).map((type) => (
      <TypeIcon
        key={type}
        type={type}
      />
    ))}
  </span>
);

const times = "晨日昏夜".split("");
const weathers = "晴阴雨".split("");
export const TimeIcons: React.FC<{ time: string }> = ({ time }) => (
  <div className="icon-wrapper">
    {times.map((t, i) => (
      <Icon
        size={32}
        key={t}
        name={t}
        className={cn(
          time[i] === "1" ? `bg-${t}` : "bg-无",
          i === 0 ? "rounded-l-lg" : i === times.length - 1 ? "rounded-r-lg" : "",
        )}
      />
    ))}
  </div>
);

export const WeatherIcons: React.FC<{ weather: string }> = ({ weather }) => (
  <div className="icon-wrapper">
    {weathers.map((t, i) => (
      <Icon
        size={32}
        key={t}
        name={t}
        className={cn(
          weather[i] === "1" ? `bg-${t}` : "bg-无",
          i === 0 ? "rounded-l-lg" : i === weathers.length - 1 ? "rounded-r-lg" : "",
        )}
      />
    ))}
  </div>
);
