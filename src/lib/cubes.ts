import { Cube, CubeSelection } from 'typings/cube';

export const cubes: Record<string, Cube> = {
  'Matica': {
    id: 'matica',
    description: "Nelson's buildaround, modern-ish cube"
  },
  'Mid': {
    id: 'mid',
    description: "Nelson's midrange, mid card, pioneer cube"
  },
  'Cheapo': {
    id: 'cheapo',
    description: "Hersh's cheapo pauper cube"
  },
  'Vintage': {
    id: 'Decaluwe',
    description: "Kyle's take on the MTGO Vintage cube"
  },
  'Duplicity': {
    id: 'dupli',
    description: "Sam's artifact cube, non-singleton"
  },
  'Interstellar': {
    id: 'margus',
    description: "Markus's modern no-banlist sicko cube"
  },
  'Luka': {
    id: 'luka',
    description: "Luka's casual, cool cards cube"
  },
  'Hogwild': {
    id: 'hogwild',
    description: "Jake's past standard darlings cube"
  },
  'Zendikar Remastered': {
    id: 'zrr',
    description: "Hersh's Zendikar Remastered plane cube"
  },
  'Eldraine Plane Cube': {
    id: 'anacube',
    description: "Ana's Eldraine plane cube"
  },
  'MH2 Set Cube - Remastered': {
    id: 'mh2be',
    description: "Sam's Modern Horizons 2 set cube"
  },
};

/**
 * Utility function to get a random cube from the cubes object
 * @returns An object containing both the key and cube data
 */
export const getRandomCube = (): CubeSelection => {
  const cubeKeys = Object.keys(cubes);
  const randomKey = cubeKeys[Math.floor(Math.random() * cubeKeys.length)];
  return { key: randomKey, cube: cubes[randomKey] };
};

/**
 * Get a cube by its key
 * @param key The cube key
 * @returns The cube object or undefined if not found
 */
export const getCubeByKey = (key: string): Cube | undefined => {
  return cubes[key];
};

/**
 * Get a cube by its ID
 * @param id The cube ID
 * @returns The cube object and key or undefined if not found
 */
export const getCubeById = (id: string): CubeSelection | undefined => {
  const entry = Object.entries(cubes).find(([, cube]) => cube.id === id);
  return entry ? { key: entry[0], cube: entry[1] } : undefined;
};