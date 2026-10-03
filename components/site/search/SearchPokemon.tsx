import Link from "next/link";
import { FC } from "react";

import { Pokemon } from "@/types";
import { TypeIcons, getPokemonFullId } from "@/utils";
import { useI18n } from "@/utils/i18n";

import { PokemonIcon } from "../../pokemon/PokemonIcon";

interface IProps {
  result: Pokemon;
  onClick: () => void;
}

export const SearchPokemon: FC<IProps> = ({ result, onClick }) => {
  const { getPokemonDisplayName } = useI18n();

  return (
    <Link
      href={`/p/${getPokemonFullId(result)}`}
      onClick={onClick}
      className="search-item"
    >
      <PokemonIcon
        pokemon={result}
        size={40}
      />
      <div>
        <div className="search-item-name-line">
          <div className="search-item-name">{getPokemonDisplayName(result)}</div>
          <TypeIcons types={result.types} />
        </div>
        <div className="pokemon-form">{result.formName}</div>
      </div>
    </Link>
  );
};
