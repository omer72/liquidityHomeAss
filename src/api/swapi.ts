

export interface IFilm {
    characters: string[] | IPeople[];
    created: Date;
    director: string;
    edited: Date;
    episode_id: string;
    opening_crawl: string;
    planets: string[] | IPlanet[];
    producer: string;
    release_date: Date;
    species: string[] | ISpecie[];
    starships: string[] | IStarship[];
    title: string;
    url: string;
    vehicles: string[] | IVehicle[];
  }
  export interface IPeople {
    birth_year: string;
    eye_color?: string;
    films?: string[] | IFilm[];
    gender: string;
    hair_color?: string;
    height: string;
    homeworld?: string | IPlanet;
    mass: string;
    name: string;
    skin_color?: string;
    created?: Date;
    edited?: Date;
    species?: string[] | ISpecie[];
    starships?: string[] | IStarship[];
    url?: string;
    vehicles?: string[] | IVehicle[];
  }
  export interface IPlanet {
    climate: string;
    created: Date;
    diameter: string;
    edited: Date;
    films: string[] | IFilm[];
    gravity: string;
    name: string;
    orbital_period: string;
    population: string;
    residents: string[] | IPeople[];
    rotation_period: string;
    surface_water: string;
    terrain: string;
    url: string;
  }
  export interface ISpecie {
    average_height: string;
    average_lifespan: string;
    classification: string;
    created: Date;
    designation: string;
    edited: Date;
    eye_colors: string;
    hair_colors: string;
    homeworld: string | IPlanet;
    language: string;
    name: string;
    people: string[] | IPeople[];
    films: string[] | IFilm[];
    skin_colors: string;
    url: string;
  }
  export interface IStarship {
    MGLT: string;
    cargo_capacity: string;
    consumables: string;
    cost_in_credits: string;
    created: Date;
    crew: string;
    edited: Date;
    hyperdrive_rating: string;
    length: string;
    manufacturer: string;
    max_atmosphering_speed: string;
    model: string;
    name: string;
    passengers: string;
    films: string[] | IFilm[];
    pilots: string[] | IPeople[];
    starship_class: string;
    url: string;
  }
  export interface IVehicle {
    cargo_capacity: string;
    consumables: string;
    cost_in_credits: string;
    created: Date;
    crew: string;
    edited: Date;
    length: string;
    manufacturer: string;
    max_atmosphering_speed: string;
    model: string;
    name: string;
    passengers: string;
    pilots: string[] | IPeople[];
    films: string[] | IFilm[];
    url: string;
    vehicle_class: string;
  }
  
  export enum ResourcesType {
    Films = 'films',
      People = 'people',
      Planets = 'planets',
      Species = 'species',
      Starships = 'starships',
      Vehicles = 'vehicles',
  }

  // ./api.js
export const fetchCharacters = async ( type:string | undefined , page:number = 1) => {

    const response = await fetch(`https://swapi.dev/api/${type}/?page=${page}`);
    const data = await response.json();
    return {
      results: data.results,
      nextPage: data.next,
      hasNextPage: Boolean(data.next),
      count: data.count
    };
  };
  
  export const updateCharacter = async (character: IPeople) => {
    // Simulate API update
    return character;
  };
  
  export const deleteCharacter = async (id: number) => {
    // Simulate API delete
    return id;
  };
  
  export const createCharacter = async (character: IPeople) => {
    // Simulate API create
    return character;
  };
  

  
