import { useState, useEffect } from "react";

function useFavoriteCharacters() {
  const [favoriteCharacters, setFavoriteCharacters] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteCharacters");
    if (storedFavorites) {
      setFavoriteCharacters(JSON.parse(storedFavorites));
    }
  }, []);

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

  return { favoriteCharacters, toggleFavorite };
}

export default useFavoriteCharacters;
