import Link from "next/link";
import { FC } from "react";

import { Habitat } from "@/types";
import { useI18n } from "@/utils/i18n";

import { HabitatIcon } from "../../habitat/HabitatIcon";

interface IProps {
  result: Habitat;
  onClick: () => void;
}

export const SearchHabitat: FC<IProps> = ({ result, onClick }) => {
  const { getHabitatDisplayName } = useI18n();

  return (
    <Link
      href={`/h/${result.index.toString().padStart(3, "0")}`}
      onClick={onClick}
      className="search-item"
    >
      <HabitatIcon
        habitat={result}
        size={40}
      />
      <div>
        <div className="search-item-name-line">
          <div className="search-item-name">{getHabitatDisplayName(result)}</div>
        </div>
      </div>
    </Link>
  );
};
