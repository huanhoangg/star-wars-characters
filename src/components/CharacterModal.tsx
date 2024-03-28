import React from "react";
import { Modal, Button } from "antd";
import { renderValue } from "./generateColumns";

interface Props {
  open: boolean;
  character: Character;
  movieData: Movie;
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
          <p className="modal-paragraph">Name: {renderValue(character.name)}</p>
          <p className="modal-paragraph">
            Species: {renderValue(character.species?.name)}
          </p>
          <p className="modal-paragraph">
            Gender: {renderValue(character.gender)}
          </p>
          <p className="modal-paragraph">
            Height (cm): {renderValue(character.height)}
          </p>
          <p className="modal-paragraph">
            Weight (kg): {renderValue(character.mass)}
          </p>
          <p className="modal-paragraph">
            Eye color: {renderValue(character.eyeColor)}
          </p>
          <p className="modal-paragraph">
            Home planet: {renderValue(character.homeworld?.name)}
          </p>
          {movieData && movieData.person && (
            <>
              <p className="modal-paragraph">Movies:</p>
              <ul style={{ margin: 0 }}>
                {movieData.person.filmConnection?.films.map((film: Film) => (
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
