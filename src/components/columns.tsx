import { StarFilled, StarOutlined } from "@ant-design/icons";

function renderValue(value: any) {
  return value !== null && value !== undefined ? value : "-";
}

const columns = [
  {
    title: "Favorite",
    dataIndex: "id",
    key: "favorite",
    render: (id: string, record: any) =>
      record.favoriteCharacters[id] ? (
        <StarFilled
          style={{ color: "gold", cursor: "pointer" }}
          onClick={() => record.toggleFavorite(id)}
        />
      ) : (
        <StarOutlined
          style={{ color: "black", cursor: "pointer" }}
          onClick={() => record.toggleFavorite(id)}
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

export default columns;
