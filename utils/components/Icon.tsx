"use client";

import cn from "classnames";

import { PokemonType } from "@/types";
import { useI18n } from "@/utils/i18n";

interface IIconProps {
  name: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const Icon: React.FC<IIconProps> = ({ name, size, style, className }) => (
  <span
    className={cn("icon", `icon-${name}`, className)}
    style={{ fontSize: size, ...style }}
  />
);

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
