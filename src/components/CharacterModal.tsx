import React from "react";
import { Modal, Button } from "antd";

interface Props {
  open: boolean;
  character: any;
  movieData: any;
  onClose: () => void;
}

const CharacterModal: React.FC<Props> = ({
  open,
  character,
  movieData,
  onClose,
}) => {
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
      {character && (
        <div>
          <p>Name: {character.name}</p>
          <p>Species: {character.species?.name}</p>
          <p>Gender: {character.gender}</p>
          <p>Height (cm): {character.height}</p>
          <p>Weight (kg): {character.mass}</p>
          <p>Eye Color: {character.eyeColor}</p>
          <p>Home Planet: {character.homeworld?.name}</p>
          {movieData && movieData.person && (
            <>
              <p>Movies:</p>
              <ul>
                {movieData.person.filmConnection?.films.map((film: any) => (
                  <li key={film.title}>{film.title}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default CharacterModal;
