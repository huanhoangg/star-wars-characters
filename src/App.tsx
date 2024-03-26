import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Table } from "antd";
import { client } from "./index";
import { StarFilled, StarOutlined } from "@ant-design/icons";

const ALL_CHARACTERS = gql`
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

const PAGE_SIZE = 10;

function App() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  });

  const [currentPageBeforePagination, setCurrentPageBeforePagination] =
    useState(1);

  const [favoriteCharacters, setFavoriteCharacters] = useState<{
    [key: string]: boolean;
  }>({});

  const { loading, error, data, fetchMore } = useQuery(ALL_CHARACTERS, {
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
        total: data.allPeople.totalCount,
      }));
    }
  }, [data]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteCharacters");
    if (storedFavorites) {
      setFavoriteCharacters(JSON.parse(storedFavorites));
    }
  }, []);

  // Update current page number before pagination change
  useEffect(() => {
    setCurrentPageBeforePagination(pagination.current);
  }, [pagination]);

  const handleTableChange = async (
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    const after =
      pagination.current > currentPageBeforePagination
        ? data?.allPeople?.pageInfo?.endCursor
        : null;
    console.log("Forward cursor: ", after);

    const before =
      pagination.current < currentPageBeforePagination
        ? data?.allPeople?.pageInfo?.startCursor
        : null;
    console.log("Backward cursor: ", before);

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
    console.log("---");
  };

  const renderValue = (value: any) => {
    return value !== null && value !== undefined ? value : "-";
  };

  const toggleFavorite = (id: string) => {
    setFavoriteCharacters((prev) => {
      const updatedFavorites = {
        ...prev,
        [id]: !prev[id],
      };
      localStorage.setItem(
        "favoriteCharacters",
        JSON.stringify(updatedFavorites)
      );
      return updatedFavorites;
    });
  };

  const columns = [
    {
      title: "Favorite",
      dataIndex: "id",
      key: "favorite",
      render: (id: string) =>
        favoriteCharacters[id] ? (
          <StarFilled
            style={{ color: "gold", cursor: "pointer" }}
            onClick={() => toggleFavorite(id)}
          />
        ) : (
          <StarOutlined
            style={{ color: "black", cursor: "pointer" }}
            onClick={() => toggleFavorite(id)}
          />
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => renderValue(text),
    },
    {
      title: "Species",
      dataIndex: "species",
      key: "species",
      render: (species: any) => renderValue(species?.name),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text: string) => renderValue(text),
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
    },
    {
      title: "Home planet",
      dataIndex: "homeworld",
      key: "homeworld",
      render: (homeworld: any) => renderValue(homeworld?.name),
    },
  ];

  if (error) return <p>Whoops... Something is wrong!</p>;

  return (
    <div className="App">
      <h1>Star Wars Characters</h1>
      <Table
        dataSource={data?.allPeople?.people}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
}

export default App;
