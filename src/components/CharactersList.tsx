import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchCharacters, updateCharacter, deleteCharacter, createCharacter } from './api'; // Assume these are defined

import { Dialog, DialogContent } from './ui/dialog';

const CharactersList = () => {
  const { data, isLoading, refetch } = useQuery('characters', fetchCharacters);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = (id) => {
    deleteCharacter(id);
    refetch();
  };

  const handleEdit = (character) => {
    setEditingCharacter(character);
  };

  const handleSave = (character) => {
    updateCharacter(character);
    setEditingCharacter(null);
    refetch();
  };

  const handleCreate = (character) => {
    createCharacter(character);
    setIsCreating(false);
    refetch();
  };

  return (
    <div>
      <h1>Characters List</h1>
      {isLoading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Birth Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(character => (
              <tr key={character.id}>
                <td>{character.name}</td>
                <td>{character.gender}</td>
                <td>{character.birth_year}</td>
                <td>
                  <button onClick={() => handleEdit(character)}>Edit</button>
                  <button onClick={() => handleDelete(character.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => setIsCreating(true)}>Create</button>
      {editingCharacter && (
        <EditDialog character={editingCharacter} onSave={handleSave} onClose={() => setEditingCharacter(null)} />
      )}
      {isCreating && (
        <CreateDialog onSave={handleCreate} onClose={() => setIsCreating(false)} />
      )}
    </div>
  );
};

const EditDialog = ({ character, onSave, onClose }) => {
    const [name, setName] = useState(character.name);
    const [gender, setGender] = useState(character.gender);
    const [birthYear, setBirthYear] = useState(character.birth_year);
  
    const handleSubmit = () => {
      onSave({ ...character, name, gender, birth_year: birthYear });
    };
  
    return (
      <Dialog open onClose={onClose}>
        <DialogTitle>Edit Character</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} fullWidth />
          <TextField label="Birth Year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  const CreateDialog = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [birthYear, setBirthYear] = useState('');
  
    const handleSubmit = () => {
      onSave({ name, gender, birth_year: birthYear });
    };
  
    return (
      <Dialog open onClose={onClose}>
        <DialogTitle>Create Character</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} fullWidth />
          <TextField label="Birth Year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    );
  };

export default CharactersList;
