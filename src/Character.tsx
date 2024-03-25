// CharacterTableRow.tsx
import React from "react";
// import { Link } from 'react-router-dom';

export interface Character {
  name: string;
  height: number;
  mass: number | null;
  species: {
    name: string;
  } | null;
  gender: string;
  eyeColor: string;
  homeworld: {
    name: string;
  };
}

interface CharacterTableRowProps {
  character: Character;
}

const CharacterTableRow: React.FC<CharacterTableRowProps> = ({ character }) => {
  return (
    <p>Hello</p>
    // <tr>
    //   <td>{character.name}</td>
    //   <td>{character.height}</td>
    //   {/* <td>{character.weight}</td>
    //   <td>{character.homePlanet}</td> */}
    //   <td>{character.speciesName}</td>
    //   <td>{character.gender}</td>
    //   <td>{character.eyeColor}</td>
    //   {/* <td>
    //     <Link to={`/character/${character.id}`}>Details</Link>
    //   </td> */}
    // </tr>
  );
};

export default CharacterTableRow;
