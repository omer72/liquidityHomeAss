import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const fetchCharacterDetails = async (type:string, id:number) => {
  const response = await fetch(`https://swapi.dev/api/${type}/${id}/`);
  const data = await response.json();
  return data;
};

const CharacterPage = () => {
  const { type, id } = useParams();
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    fetchCharacterDetails(type, id).then(setCharacter);
  }, [type, id]);

  if (!character) {
    return <p>Loading...</p>;
  }

  return (
    <div className="character-detail">
      <h1>{character.name || character.title}</h1>
      <pre>{JSON.stringify(character, null, 2)}</pre>
      {/* Add more structured data display here as needed */}
    </div>
  );
};

export default CharacterPage;