import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCharacters, updateCharacter, deleteCharacter, createCharacter, IPeople } from '../api/swapi'; // Assume these are defined

import { Dialog, DialogContent, DialogFooter, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link, useParams } from 'react-router-dom';
import _ from 'lodash';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import Pagination from './Pagination';


const CharactersList = () => {
  const { type } = useParams();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [type], 
    queryFn: () => fetchCharacters(type)
  });
  const [editingCharacter, setEditingCharacter] = useState<IPeople|null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [tableData, setTableData] = useState<IPeople[]>([]);

  const columns = React.useMemo<ColumnDef<IPeople>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const url = row.original.url as string;
          return <Link to={`/${type}/id/${url.split('/').slice(-2, -1)[0]}`}>{row.getValue('name')}</Link>;
        },
      },
      {
        accessorFn: row => row.gender,
        id: 'url',
        cell: info => info.getValue(),
        header: () => <span>url</span>,
      },
      {
        accessorFn: row => row.gender,
        id: 'gender',
        cell: info => info.getValue(),
        header: () => <span>Gender</span>,
      },
      {
        accessorKey: 'birth_year',
        header: () => 'Birth Year',
      },
      {
        accessorKey: 'height',
        cell: info => info.getValue()+'cm',
        header: () => <span>Height</span>,
      },
      {
        accessorKey: 'mass',
        cell: info => info.getValue()+'kg',
        header: 'Mass',
      },
      {
        id: 'edit',
        header: 'Actions',
        accessor: '[row identifier to be passed to button]',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button className="text-blue-500 hover:text-blue-700">
              Edit
            </Button>
            <Button className="text-red-500 hover:text-red-700">
              Delete
            </Button>
          </div>
        ),
      }
    ],
    []
  )

  useEffect(() => {
    setTableData(data?.results);
  },[data])
  
  const handleDelete = (id) => {
    deleteCharacter(id);
    refetch();
  };

  const handleEdit = (character:IPeople) => {
    console.log(character)
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
  const table = useReactTable({
    columns: columns as ColumnDef<unknown, IPeople>[],
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    state: {
      sorting,
    },
  })

  return (
    <div className="p-4">
      <div>
          <Link to="/">&lt;&#45;&#45;Home</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">{_.capitalize(type)} List</h1>
      {isLoading && !tableData ? <p>Loading...</p> : (
      <div className="overflow-x-auto">
        <Pagination count={80} currentPage={1} setCurrentPage={(value:number) => console.log(value)}/>
        <table className='min-w-full bg-white border border-gray-200'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-gray-200 text-left text-gray-600 uppercase text-sm leading-normal">
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan} className="py-3 px-6">
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10)
              .map(row => {
                return (
                  <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100">
                    {row.getVisibleCells().map(cell => {
                      return (
                        <td key={cell.id} className="py-3 px-6">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
        
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
          <Input title="Name" value={name} onChange={(e) => setName(e.target.value)}  />
          <Input title="Gender" value={gender} onChange={(e) => setGender(e.target.value)}  />
          <Input title="Birth Year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)}  />
        </DialogContent>
        <DialogFooter>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogFooter>
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
          <Input title="Name" value={name} onChange={(e) => setName(e.target.value)}  />
          <Input title="Gender" value={gender} onChange={(e) => setGender(e.target.value)}  />
          <Input title="Birth Year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)}  />
        </DialogContent>
        <DialogFooter>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogFooter>
      </Dialog>
    );
  };

export default CharactersList;
