import { useState, useEffect } from "react";
import generateColumns from "./columns";
import { useQuery } from "@apollo/client";
import { Table, Button } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { client } from "../index";
import { Query } from "../gql/graphql";
import useFavoriteCharacters from "./useFavoriteCharacters";
import { ALL_CHARACTERS } from "../graphql/queries";

const PAGE_SIZE = 10;

function CharactersTable() {
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
    </>
  );
}

export default CharactersTable;
