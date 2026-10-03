import cn from "classnames";
import Image from "next/image";
import React, { FC, PropsWithChildren } from "react";

import { Item } from "@/types";
import { Link } from "@/utils";

export interface IItemIconProps extends PropsWithChildren {
  item?: Item | null;
  size?: number;
  className?: string;
  link?: boolean;
}

export const ItemIcon: FC<IItemIconProps> = ({ item, size = 48, className = "", link = false, children }) => {
  if (!item) return null;

  const style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const content = item.imageUrl ? (
    <Image
      src={item.imageUrl}
      alt={item.name}
      width={size}
      height={size}
      className="pointer-events-none h-full w-full object-contain select-none"
    />
  ) : item.x !== undefined && item.y !== undefined ? (
    <span
      className={cn("item-icon", className)}
      style={{
        fontSize: `${size}px`,
        backgroundPosition: `-${item.x}em -${item.y}em`,
      }}
    />
  ) : null;

  const containerClassName = cn("relative inline-flex items-center justify-center shrink-0", className);

  return link ? (
    <Link
      href={`/i/${item.hash}`}
      className={containerClassName}
      style={style}
    >
      {content}
      {children}
    </Link>
  ) : (
    <span
      className={containerClassName}
      style={style}
    >
      {content}
      {children}
    </span>
  );
};

export const ItemIconWithName: FC<IItemIconProps> = ({ item, link, ...rest }) => {
  if (!item) return null;

  const content = (
    <>
      <ItemIcon
        item={item}
        {...rest}
      />
      <div className="mt-1 max-w-full truncate">{item.name}</div>
    </>
  );

  return link ? (
    <Link
      href={`/i/${item.hash}`}
      className="hover:text-primary flex w-[72px] flex-col items-center text-center text-xs transition-colors"
    >
      {content}
    </Link>
  ) : (
    <div className="flex w-[72px] flex-col items-center text-center text-xs">{content}</div>
  );
};
