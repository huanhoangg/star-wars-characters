import React from "react";
import { Character } from "./Character";
import { useQuery, gql } from "@apollo/client";
import { Table } from "antd";

const ALL_CHARACTERS = gql`
  query {
    allPeople {
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
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(ALL_CHARACTERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Whoops... Something is wrong oh no baby!</p>;

  const renderValue = (value: any) => {
    return value !== null && value !== undefined && value !== "n/a"
      ? value
      : "-";
  };

  const columns = [
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

  return (
    <div className="App">
      <h1>Star Wars Characters</h1>
      <Table
        dataSource={data.allPeople.people}
        columns={columns}
        pagination={false}
      />
    </div>
  );
}

export default App;
