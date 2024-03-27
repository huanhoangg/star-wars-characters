import { useState, useEffect } from "react";
import generateColumns from "./columns";
import { useQuery } from "@apollo/client";
import { Table } from "antd";
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

  const { favoriteCharacters, toggleFavorite } = useFavoriteCharacters();
  const [isFiltered, setIsFiltered] = useState(false);

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

  // If comment this out -> table only has 1 page because we need the total to know how many pages there are in total
  // bc pagination is set total = 0 before the table was create --> update total count when
  // total param is important for table in ant design to be displayed correctly
  useEffect(() => {
    if (data?.allPeople?.totalCount) {
      setPagination((prevPagination) => ({
        ...prevPagination,
        total: data?.allPeople?.totalCount || 0,
      }));
    }
  }, [data]);

  useEffect(() => {
    setCurrentPageBeforePagination(pagination.current);
  }, [currentPageBeforePagination, pagination]);

  // Try to eliminate all type any later
  const handleTableChange = async (pagination: any, filters: any) => {
    const isAnyFilterActive = Object.values(filters).some(
      (filterValue) => filterValue !== null && filterValue !== undefined
    );

    // When filter is (first) applied, do not fetch data
    if (isAnyFilterActive) {
      if (!isFiltered) setIsFiltered(true);
      return;
    }

    // Do not fetch more data after removing/resetting all filters
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
            // xem screenshot tai sao phai spread cai data
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
    <Table
      dataSource={
        data?.allPeople?.people
          ? data.allPeople.people.map((person) => ({
              ...person,
              favoriteCharacters,
              toggleFavorite,
            })) // Convert Maybe<Person>[] to AnyObject[], or else there are some errors
          : []
      }
      columns={generateColumns(data)}
      pagination={pagination}
      onChange={handleTableChange}
      loading={loading}
      rowKey="id"
    />
  );
}

export default CharactersTable;
