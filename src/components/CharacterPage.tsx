import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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
    <>
      <div>
          <Link to="/">&lt;&#45;&#45;Home</Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen min-w-full w-full  font-mono">
        <h1>{character.name || character.title}</h1>
        <pre className='font-mono'>{JSON.stringify(character, null, 2)}</pre>
        {/* Add more structured data display here as needed */}
      </div>
    </>
  );
};

export default CharacterPage;