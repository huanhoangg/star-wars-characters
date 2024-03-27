import { useState, useEffect } from "react";

function useFavoriteCharacters() {
  const [favoriteCharacters, setFavoriteCharacters] = useState<any[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteCharacters");
    if (storedFavorites) {
      setFavoriteCharacters(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (record: any) => {
    const isFavorite = favoriteCharacters.some((char) => char.id === record.id);
    const updatedFavorites = isFavorite
      ? favoriteCharacters.filter((char) => char.id !== record.id)
      : [...favoriteCharacters, record];
    setFavoriteCharacters(updatedFavorites);
    localStorage.setItem(
      "favoriteCharacters",
      JSON.stringify(updatedFavorites)
    );
  };

  const removeAllFavorites = () => {
    setFavoriteCharacters([]);
  };

  return { favoriteCharacters, toggleFavorite, removeAllFavorites };
}

export default useFavoriteCharacters;
