import React, { ReactElement } from "react";
import { Modal, Button, Table } from "antd";
import { renderValue } from "./generateColumns";

interface Props {
  open: boolean;
  character: Character | null;
  movieData: Movie;
  onClose: () => void;
}

const columns = [
  {
    title: "Attribute",
    dataIndex: "attribute",
    key: "attribute",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

const CharacterModal: React.FC<Props> = ({
  open,
  character,
  movieData,
  onClose,
}) => {
  let dataSource: {
    attribute: string;
    value: string | number | ReactElement;
  }[] = [];
  if (character) {
    dataSource = [
      { attribute: "Name", value: renderValue(character.name) },
      { attribute: "Species", value: renderValue(character.species?.name) },
      { attribute: "Gender", value: renderValue(character.gender) },
      { attribute: "Height (cm)", value: renderValue(character.height) },
      { attribute: "Weight (kg)", value: renderValue(character.mass) },
      { attribute: "Eye color", value: renderValue(character.eyeColor) },
      {
        attribute: "Home planet",
        value: renderValue(character.homeworld?.name),
      },
    ];
  }

  const movies = movieData?.person?.filmConnection?.films.map(
    (film: Film) => film.title
  );

  if (movies && movies.length > 0) {
    dataSource.push({
      attribute: "Movies",
      value: (
        <ul style={{ margin: 0, paddingLeft: 12 }}>
          {movies.map((movie: string) => (
            <li key={movie}>{movie}</li>
          ))}
        </ul>
      ),
    });
  }

  return (
    <Modal
      title="Character Details"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </Modal>
  );
};

export default CharacterModal;
