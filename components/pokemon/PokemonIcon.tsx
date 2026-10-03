"use client";

import cn from "classnames";
import Image from "next/image";
import React, { FC, PropsWithChildren } from "react";

import { Pokemon } from "@/types";
import { Link, getPokemonFullId, useI18n } from "@/utils";

export interface IPokemonIconProps extends PropsWithChildren {
  pokemon?: Pokemon | null;
  size?: number;
  className?: string;
  link?: boolean;
}

export const PokemonIcon: FC<IPokemonIconProps> = ({ pokemon, size = 64, className = "", link = false, children }) => {
  if (!pokemon) return null;

  const style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const content = pokemon.imageUrl ? (
    <Image
      src={pokemon.imageUrl}
      alt={pokemon.name}
      width={size}
      height={size}
      className="pointer-events-none h-full w-full object-contain select-none"
    />
  ) : pokemon.x !== undefined && pokemon.y !== undefined ? (
    <span
      className={cn("pokemon-icon", className)}
      style={{
        fontSize: `${size}px`,
        backgroundPosition: `-${pokemon.x}em -${pokemon.y}em`,
      }}
    />
  ) : null;

  const containerClassName = cn("relative inline-flex items-center justify-center shrink-0", className);

  return link ? (
    <Link
      href={`/p/${getPokemonFullId(pokemon)}`}
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

export const PokemonIconWithName: FC<IPokemonIconProps> = ({ pokemon, link, ...rest }) => {
  const { getPokemonDisplayName } = useI18n();
  if (!pokemon) return null;

  const displayName = getPokemonDisplayName(pokemon);

  const content = (
    <>
      <PokemonIcon
        pokemon={pokemon}
        {...rest}
      />
      <div className="mt-1 max-w-full truncate">{displayName}</div>
    </>
  );

  return link ? (
    <Link
      href={`/p/${getPokemonFullId(pokemon)}`}
      className="hover:text-primary flex w-[72px] flex-col items-center text-center text-xs transition-colors"
    >
      {content}
    </Link>
  ) : (
    <div className="flex w-[72px] flex-col items-center text-center text-xs">{content}</div>
  );
};
