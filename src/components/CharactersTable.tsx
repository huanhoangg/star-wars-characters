import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Table, Button, Modal } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { client } from "../index";
import { Query } from "../gql/graphql";
import useFavoriteCharacters from "./useFavoriteCharacters";
import { ALL_CHARACTERS, CHARACTER_MOVIES } from "../graphql/queries";

const PAGE_SIZE = 10;

interface Character {
  name: string;
  height: number;
  mass: number;
  species: {
    name: string;
  };
  gender: string;
  eyeColor: string;
  homeworld: {
    name: string;
  };
  id: string;
  filmConnection: {
    films: [
      {
        title: string;
      }
    ];
  };
}

const CharactersTable = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  });

  const [currentPageBeforePagination, setCurrentPageBeforePagination] =
    useState(1);

  const { favoriteCharacters, toggleFavorite, removeAllFavorites } =
    useFavoriteCharacters();
  const [isFiltered, setIsFiltered] = useState(false);
  const [isInFavoriteMode, setIsInFavoriteMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const [fetchMovies, { loading: movieLoading, data: movieData }] =
    useLazyQuery<Query>(CHARACTER_MOVIES);

  const [movies, setMovies] = useState<string[]>([]);

  const { loading, error, data, fetchMore } = useQuery<Query>(ALL_CHARACTERS, {
    variables: {
      first: PAGE_SIZE,
      after: null,
      before: null,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
    client: client,
  });

  const handleRemoveAllFavorites = () => {
    removeAllFavorites();
    alert("All favorites removed successfully!");
  };

  useEffect(() => {
    if (data?.allPeople?.totalCount) {
      setPagination((prevPagination) => ({
        ...prevPagination,
        total: isInFavoriteMode
          ? favoriteCharacters.length
          : data?.allPeople?.totalCount || 0,
      }));
    }
  }, [data, isInFavoriteMode, favoriteCharacters]);

  useEffect(() => {
    setCurrentPageBeforePagination(pagination.current);
  }, [currentPageBeforePagination, pagination]);

  const handleTableChange = async (pagination: any, filters: any) => {
    const isAnyFilterActive = Object.values(filters).some(
      (filterValue) => filterValue !== null && filterValue !== undefined
    );

    if (isAnyFilterActive) {
      if (!isFiltered) setIsFiltered(true);
      return;
    }

    if (isFiltered && !isAnyFilterActive) {
      setIsFiltered(false);
      return;
    }

    const after =
      pagination.current > currentPageBeforePagination
        ? data?.allPeople?.pageInfo?.endCursor
        : null;

    const before =
      pagination.current < currentPageBeforePagination
        ? data?.allPeople?.pageInfo?.startCursor
        : null;

    const first =
      pagination.current > currentPageBeforePagination ? PAGE_SIZE : null;

    const last =
      pagination.current < currentPageBeforePagination ? PAGE_SIZE : null;

    await fetchMore({
      variables: {
        first: first,
        last: last,
        after: after,
        before: before,
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        console.log(fetchMoreResult);
        if (!fetchMoreResult) return prev;
        return {
          allPeople: {
            ...fetchMoreResult.allPeople,
            people: fetchMoreResult.allPeople.people,
          },
        };
      },
    });

    setPagination((prevPagination) => ({
      ...prevPagination,
      current: pagination.current,
    }));
  };

  function renderValue(value: any) {
    return value !== null && value !== undefined ? value : "-";
  }

  function generateColumns(data: any) {
    return [
      {
        title: "Favorite",
        dataIndex: "id",
        key: "favorite",
        render: (id: string, record: any) => {
          const isFavorite = record.favoriteCharacters.some(
            (char: any) => char.id === id
          );
          return isFavorite ? (
            <StarFilled
              style={{ color: "gold", cursor: "pointer" }}
              onClick={() => toggleFavorite(record)}
            />
          ) : (
            <StarOutlined
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => toggleFavorite(record)}
            />
          );
        },
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text: string, record: any) => (
          <Button type="link" onClick={() => handleNameClick(record)}>
            {renderValue(text)}
          </Button>
        ),
      },
      {
        title: "Species",
        dataIndex: "species",
        key: "species",
        render: (species: any) => renderValue(species?.name),
        filters: data?.allPeople?.people
          ?.map((person: any) => person.species?.name)
          .filter(
            (species: string, index: number, self: string[]) =>
              self.indexOf(species) === index
          )
          .map((species: string) => ({
            text: renderValue(species),
            value: species !== null && species !== undefined ? species : "-",
          })),
        onFilter: (value: any, record: any) =>
          record.species?.name === value ||
          (record.species?.name === undefined && value === "-"),
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
        render: (text: string) => renderValue(text),
        filters: data?.allPeople?.people
          ?.map((person: any) => person.gender)
          .filter(
            (gender: string, index: number, self: string[]) =>
              self.indexOf(gender) === index
          )
          .map((gender: string) => ({ text: gender, value: gender })),
        onFilter: (value: any, record: any) => record.gender === value,
        filterMultiple: false,
      },
      {
        title: "Height (cm)",
        dataIndex: "height",
        key: "height",
        render: (text: number) => renderValue(text),
      },
      {
        title: "Weight (kg)",
        dataIndex: "mass",
        key: "mass",
        render: (text: number) => renderValue(text),
      },
      {
        title: "Eye color",
        dataIndex: "eyeColor",
        key: "eyeColor",
        render: (text: string) => renderValue(text),
        filters: data?.allPeople?.people
          ?.map((person: any) => person.eyeColor)
          .filter(
            (eyeColor: string, index: number, self: string[]) =>
              self.indexOf(eyeColor) === index
          )
          .map((eyeColor: string) => ({
            text: renderValue(eyeColor),
            value: eyeColor,
          })),
        onFilter: (value: any, record: any) =>
          renderValue(record.eyeColor) === value,
      },
      {
        title: "Home planet",
        dataIndex: "homeworld",
        key: "homeworld",
        render: (homeworld: any) => renderValue(homeworld?.name),
      },
    ];
  }

  const handleNameClick = async (record: any) => {
    setSelectedCharacter(record);
    setModalVisible(true);
    fetchMovies({ variables: { id: record.id } });
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
    setModalVisible(false);
    setMovies([]); // Reset movies when closing the modal
  };

  if (error) return <p>Whoops... Something is wrong!</p>;

  return (
    <>
      <Button
        type={isInFavoriteMode ? "primary" : "default"}
        onClick={() => setIsInFavoriteMode((prev) => !prev)}
        icon={isInFavoriteMode ? <StarFilled /> : <StarOutlined />}
        style={{
          backgroundColor: isInFavoriteMode ? "yellow" : "black",
          color: isInFavoriteMode ? "black" : "yellow",
        }}
      >
        {isInFavoriteMode ? "Show All Characters" : "Favorites Only"}
      </Button>
      <Button
        type="default"
        onClick={handleRemoveAllFavorites}
        style={{ marginLeft: 16 }}
      >
        Remove All Favorites
      </Button>
      <Table
        dataSource={
          isInFavoriteMode
            ? favoriteCharacters.map((char) => ({
                ...char,
                favoriteCharacters,
                toggleFavorite,
              }))
            : data?.allPeople?.people
            ? data.allPeople.people.map((person) => ({
                ...person,
                favoriteCharacters,
                toggleFavorite,
              }))
            : []
        }
        columns={generateColumns(data)}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title="Character Details"
        // Only open modal when movie is fully fetched and loaded
        open={modalVisible && !movieLoading}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        {selectedCharacter && (
          <div>
            <p>Name: {selectedCharacter.name}</p>
            <p>Species: {renderValue(selectedCharacter.species?.name)}</p>
            <p>Gender: {renderValue(selectedCharacter.gender)}</p>
            <p>Height (cm): {renderValue(selectedCharacter.height)}</p>
            <p>Weight (kg): {renderValue(selectedCharacter.mass)}</p>
            <p>Eye Color: {renderValue(selectedCharacter.eyeColor)}</p>
            <p>Home Planet: {renderValue(selectedCharacter.homeworld?.name)}</p>
            {movieData && movieData.person && (
              <>
                <p>Movies:</p>
                <ul>
                  {movieData.person.filmConnection!.films!.map((film: any) => (
                    <li key={film.title}>{film.title}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default CharactersTable;
