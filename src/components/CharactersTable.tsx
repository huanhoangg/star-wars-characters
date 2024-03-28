import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useQuery, useLazyQuery } from "@apollo/client";
import { ALL_CHARACTERS, CHARACTER_MOVIES } from "../graphql/queries";
import useFavoriteCharacters from "./useFavoriteCharacters";
import generateColumns from "./generateColumns";
import CharacterModal from "./CharacterModal";
import { Character } from "./generateColumns";
import CustomButton from "./CustomButton";

const PAGE_SIZE = 10;

const CharactersTable = () => {
  const [pagination, setPagination] = useState({
    hideOnSinglePage: true,
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
  const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null);

  const [fetchMovies, { loading: movieLoading, data: movieData }] =
    useLazyQuery(CHARACTER_MOVIES);

  const { loading, error, data, fetchMore } = useQuery(ALL_CHARACTERS, {
    variables: {
      first: PAGE_SIZE,
      after: null,
      before: null,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
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

  const handleNameClick = async (record: any) => {
    setSelectedCharacter(record);
    setModalVisible(true);
    fetchMovies({ variables: { personId: record.id } });
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
    setModalVisible(false);
  };

  if (error) return <p>Whoops... Something is wrong!</p>;

  return (
    <div style={{ margin: 8 }}>
      <Space
        style={{
          marginBottom: 16,
          marginTop: 16,
        }}
      >
        <CustomButton
          onClick={() => setIsInFavoriteMode((prev) => !prev)}
          isInFavoriteMode={isInFavoriteMode}
          label={isInFavoriteMode ? "Show All Characters" : "Favorites Only"}
          icon={isInFavoriteMode ? <StarFilled /> : <StarFilled />}
        />
        <CustomButton
          onClick={handleRemoveAllFavorites}
          isInFavoriteMode={isInFavoriteMode}
          label="Remove All Favorites"
        />
      </Space>
      <Table
        dataSource={
          isInFavoriteMode
            ? favoriteCharacters.map((char) => ({
                ...char,
                favoriteCharacters,
                toggleFavorite,
              }))
            : data?.allPeople?.people
            ? data.allPeople.people.map((person: Character) => ({
                ...person,
                favoriteCharacters,
                toggleFavorite,
              }))
            : []
        }
        columns={generateColumns({ data, handleNameClick })}
        pagination={{ ...pagination, position: ["bottomCenter"] }}
        onChange={handleTableChange}
        loading={loading}
        rowKey="id"
      />
      <CharacterModal
        open={modalVisible && !movieLoading}
        character={selectedCharacter}
        movieData={movieData}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CharactersTable;
