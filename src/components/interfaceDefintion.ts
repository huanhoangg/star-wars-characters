interface Film {
  title: string;
}

interface Movie {
  person: {
    filmConnection: {
      films: Film[];
    };
  };
}

interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface AllPeopleData {
  allPeople: {
    pageInfo: PageInfo;
    totalCount: number;
    people: Character[];
  };
}

interface Homeworld {
  name: string;
}

interface Species {
  name: string;
}
interface Character {
  name: string;
  height: number;
  mass: number;
  species: Species;
  gender: string;
  eyeColor: string;
  homeworld: Homeworld;
  id: string;
}
