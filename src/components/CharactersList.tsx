import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCharacters, updateCharacter, deleteCharacter, createCharacter, IPeople } from '../api/swapi'; // Assume these are defined

import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogTitle,
  DialogDescription,
  DialogHeader,
 } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
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
  const pageNumber = useRef(1);
  const { data, isLoading, refetch } = useQuery({
    queryKey: [type,pageNumber.current], 
    queryFn: () => fetchCharacters(type,pageNumber.current)
  });
  const [editingCharacter, setEditingCharacter] = useState<IPeople|null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [tableData, setTableData] = useState<IPeople[]>([]);
  const countSize = useRef(0);
  
  const queryClient = useQueryClient();

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
        id: 'gender',
        cell: info => {
          const gendre = info.getValue();
          if (gendre === 'male'){
            return <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15 3C15 2.44772 15.4477 2 16 2H20C21.1046 2 22 2.89543 22 4V8C22 8.55229 21.5523 9 21 9C20.4477 9 20 8.55228 20 8V5.41288L15.4671 9.94579C15.4171 9.99582 15.363 10.0394 15.3061 10.0767C16.3674 11.4342 17 13.1432 17 15C17 19.4183 13.4183 23 9 23C4.58172 23 1 19.4183 1 15C1 10.5817 4.58172 7 9 7C10.8559 7 12.5642 7.63197 13.9214 8.69246C13.9587 8.63539 14.0024 8.58128 14.0525 8.53118L18.5836 4H16C15.4477 4 15 3.55228 15 3ZM9 20.9963C5.68831 20.9963 3.00365 18.3117 3.00365 15C3.00365 11.6883 5.68831 9.00365 9 9.00365C12.3117 9.00365 14.9963 11.6883 14.9963 15C14.9963 18.3117 12.3117 20.9963 9 20.9963Z" fill="#0F0F0F"></path> </g></svg>
          } else if (gendre === 'female'){
            return <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 18H15M12 13V21M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          } else {
            return <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          }
        },
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
            <Button variant className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(row.original as IPeople)}>
              Edit
            </Button>
            <Button variant className="text-red-500 hover:text-red-700" onClick={() => handleDelete(row.original as IPeople)}>
              Delete
            </Button>
          </div>
        ),
      }
    ],
    []
  )

  useEffect(() => {
    console.log('setTableData');
    setTableData(data?.results);
    countSize.current = data?.count;
  },[data])

  const goToPageNumber = (value:number) => {
    pageNumber.current = value;
    refetch();
  }
  
  const handleDelete = (character:IPeople) => {
    const previousTodos = queryClient.getQueryData(['people',pageNumber.current]);
    const updatedData = previousTodos.results.filter((value:IPeople) => 
        value.url !== character.url
    )
    previousTodos.results =  updatedData;
     // Optimistically update to the new value
    queryClient.setQueryData(['people',pageNumber.current], previousTodos);
    setTableData(updatedData); 
    
    
    //deleteCharacter(id);
    //refetch();
  };

  const handleEdit = (character:IPeople) => {
    console.log(character)
    setEditingCharacter(character);
  };

  const handleSave = (character:IPeople) => {
    const previousTodos = queryClient.getQueryData(['people',pageNumber.current]);
    const updatedData = previousTodos.results.map((value:IPeople) => 
        value.url === character.url ? character : value
    )
    previousTodos.results =  updatedData;
     // Optimistically update to the new value
    queryClient.setQueryData(['people',pageNumber.current], previousTodos);
    setTableData(updatedData);

    //updateCharacter(character);
    setEditingCharacter(null);
    //refetch();
  };

  const handleCreate = (character:IPeople) => {
    console.log('handleCreate');
    character.url = `https://swapi.dev/api/planets/${Math.floor(Math.random()*1000)}/`;
    const previousTodos = queryClient.getQueryData(['people',pageNumber.current]);
    let newData = previousTodos.results;
    newData =  [...newData,character ];
    previousTodos.results = newData;
     // Optimistically update to the new value
    queryClient.setQueryData(['people',pageNumber.current], previousTodos);
    setTableData(newData);
    //createCharacter(character);
    setIsCreating(false);
    //refetch();
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
        <div className='m-4'>
          <Pagination count={countSize.current} currentPage={pageNumber.current} setCurrentPage={goToPageNumber}/>
        </div>
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
              .rows.slice(0)
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
        <EditDialog character={editingCharacter} onSave={handleSave} onClose={() => {
          setEditingCharacter(null)}} />
      )}
      {isCreating && (
        <CreateDialog onSave={handleCreate} onClose={() => setIsCreating(false)} />
      )}
    </div>
  );
};

interface EditDialogProps{
  character:IPeople;
  onSave: (value:IPeople) => void;
  onClose: () => void;
}

const EditDialog = ({ character, onSave, onClose }:EditDialogProps) => {
    const [name, setName] = useState(character.name);
    const [gender, setGender] = useState(character.gender);
    const [birthYear, setBirthYear] = useState(character.birth_year);
    const [height, setHeight] = useState(character.height);
    const [mass, setMass] = useState(character.mass);
    const [open, setOpen] = useState(true);
  
    const handleSubmit = () => {
      onSave({ ...character, name, gender, birth_year: birthYear, height, mass });
      onClose();
      setOpen(!open);
    };

    const handleOpen = (value:boolean) => {
      console.log(' handleOpen ',value);
      onClose();
      setOpen(value);
    }
  
    return (


    <Dialog open={open} onOpenChange={handleOpen}>
    
    <DialogContent  className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Character</DialogTitle>
        <DialogDescription>
          Make changes to the character. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            defaultValue={name}
            className="col-span-3"
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Gendre
          </Label>
          <Input
            id="gendre"
            defaultValue={gender}
            className="col-span-3"
            onChange={(e) => setGender(e.target.value)} 
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Birth Year
          </Label>
          <Input
            id="birthYear"
            defaultValue={birthYear}
            className="col-span-3"
            onChange={(e) => setBirthYear(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="height" className="text-right">
            Height
          </Label>
          <Input
            id="height"
            defaultValue={height}
            className="col-span-3"
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="mass" className="text-right">
            Mass
          </Label>
          <Input
            id="mass"
            defaultValue={mass}
            className="col-span-3"
            onChange={(e) => setMass(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleSubmit}>Save changes</Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
    );
  };
  
  interface CreateDialogProps{
    
    onSave: (value:IPeople) => void;
    onClose: () => void;
  }
  
  const CreateDialog = ({ onSave, onClose }:CreateDialogProps) => {
      const [name, setName] = useState('');
      const [gender, setGender] = useState('');
      const [birthYear, setBirthYear] = useState('');
      const [height, setHeight] = useState('');
      const [mass, setMass] = useState('');
      const [open, setOpen] = useState(true);
    
      const handleSubmit = () => {
        onSave({ name, gender, birth_year: birthYear, height, mass });
        onClose();
        setOpen(!open);
      };
  
      const handleOpen = (value:boolean) => {
        console.log(' handleOpen ',value);
        onClose();
        setOpen(value);
      }
    
      return (
  
  
      <Dialog open={open} onOpenChange={handleOpen}>
      
      <DialogContent  className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Character</DialogTitle>
          <DialogDescription>
            Make changes to the character. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Gendre
            </Label>
            <Input
              id="gendre"
              defaultValue={gender}
              className="col-span-3"
              onChange={(e) => setGender(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Birth Year
            </Label>
            <Input
              id="birthYear"
              defaultValue={birthYear}
              className="col-span-3"
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">
              Height
            </Label>
            <Input
              id="height"
              defaultValue={height}
              className="col-span-3"
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mass" className="text-right">
              Mass
            </Label>
            <Input
              id="mass"
              defaultValue={mass}
              className="col-span-3"
              onChange={(e) => setMass(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>
      );
    };``

export default CharactersList;
