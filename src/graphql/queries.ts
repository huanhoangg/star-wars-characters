import { gql } from "@apollo/client";

export const ALL_CHARACTERS = gql`
  query AllPeople($first: Int, $last: Int, $after: String, $before: String) {
    allPeople(first: $first, last: $last, after: $after, before: $before) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
      people {
        name
        height
        mass
        species {
          name
        }
        gender
        eyeColor
        homeworld {
          name
        }
        id
      }
    }
  }
`;

export const CHARACTER_MOVIES = gql`
  query CharacterMovies($personId: ID) {
    person(id: $personId) {
      filmConnection {
        films {
          title
        }
      }
    }
  }
`;
