import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Button } from "antd";
interface Props {
  data: AllPeopleData;
  handleNameClick: (record: any) => void;
}

export function renderValue(value: string | number | null | undefined) {
  return value !== null && value !== undefined ? value : "-";
}

function generateColumns({ data, handleNameClick }: Props) {
  return [
    {
      title: "Favorite",
      dataIndex: "id",
      key: "favorite",
      align: "center" as const,
      width: "5%",
      render: (id: string, record: any) => {
        const isFavorite = record.favoriteCharacters.some(
          (char: any) => char.id === id
        );
        return isFavorite ? (
          <StarFilled
            style={{ color: "gold", cursor: "pointer" }}
            onClick={() => record.toggleFavorite(record)}
          />
        ) : (
          <StarOutlined
            style={{ color: "black", cursor: "pointer" }}
            onClick={() => record.toggleFavorite(record)}
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      align: "center" as const,
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
      width: "15%",
      align: "center" as const,
      render: (species: Species) => renderValue(species?.name),
      filters: data?.allPeople?.people
        ?.map((person: Character) => person.species?.name)
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
      width: "12.5%",
      align: "center" as const,
      render: (text: string) => renderValue(text),
      filters: data?.allPeople?.people
        ?.map((person: Character) => person.gender)
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
      width: "12.5%",
      align: "center" as const,

      render: (text: number) => renderValue(text),
    },
    {
      title: "Weight (kg)",
      dataIndex: "mass",
      key: "mass",
      width: "12.5%",
      align: "center" as const,

      render: (text: number) => renderValue(text),
    },
    {
      title: "Eye color",
      dataIndex: "eyeColor",
      key: "eyeColor",
      width: "12.5%",
      align: "center" as const,
      render: (text: string) => renderValue(text),
      filters: data?.allPeople?.people
        ?.map((person: Character) => person.eyeColor)
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
      width: "15%",
      align: "center" as const,
      render: (homeworld: Homeworld) => renderValue(homeworld?.name),
    },
  ];
}

export default generateColumns;
