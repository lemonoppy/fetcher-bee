import { cubeHistoryDB, cubeIndexDB } from 'src/db/users';
import { logger } from 'src/lib/logger';
import { Cube, CubeSelection, CubeSelectionHistory, CubeUsageStats } from 'typings/cube';

export const cubes: Record<string, Cube> = {
  'Matica': {
    id: 'matica',
    description: "Nelson's buildaround, modern-ish cube",
    setCode: 'MTC'
  },
  'Mid': {
    id: 'mid',
    description: "Nelson's midrange, mid card, pioneer cube",
    setCode: 'PMC'
  },
  'Cheapo': {
    id: 'cheapo',
    description: "Hersh's cheapo pauper cube",
    setCode: 'CHP'
  },
  'Vintage': {
    id: 'Decaluwe',
    description: "Kyle's take on the MTGO Vintage cube",
    setCode: 'KVC'
  },
  'Duplicity': {
    id: 'dupli',
    description: "Sam's artifact cube, non-singleton",
    setCode: 'DPC'
  },
  'Interstellar': {
    id: 'margus',
    description: "Markus's modern no-banlist sicko cube",
    setCode: 'INT'
  },
  'Luka': {
    id: 'luka',
    description: "Luka's casual, cool cards cube",
    setCode: 'LKC'
  },
  'Hogwild': {
    id: 'hogwild',
    description: "Jake's past standard darlings cube",
    setCode: 'HOG'
  },
  'Zendikar Remastered': {
    id: 'zrr',
    description: "Hersh's Zendikar Remastered plane cube",
    setCode: 'ZRR'
  },
  'Eldraine Plane Cube': {
    id: 'anacube',
    description: "Ana's Eldraine plane cube",
    setCode: 'AEC'
  },
  'MH2 Set Cube - Remastered': {
    id: 'mh2be',
    description: "Sam's Modern Horizons 2 set cube",
    setCode: 'M2C'
  },
  'Velocity': {
    id: 'velocity',
    description: "Kyle's Totally Real cube",
    setCode: 'KVC'
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

/**
 * Track a cube selection by incrementing its usage count and logging the selection
 * @param cubeKey The cube key that was selected
 * @param userId The Discord user ID who made the selection
 * @param username The Discord username who made the selection
 */
export const trackCubeSelection = async (cubeKey: string, userId: string, username: string): Promise<void> => {
  try {
    const selectionId = `${cubeKey}_${userId}_${Date.now()}`;

    const historyEntry: CubeSelectionHistory = {
      cubeKey,
      userId,
      username,
      timestamp: new Date(),
    };
    await cubeHistoryDB.set(selectionId, historyEntry);

    // Update the index for this cube
    const currentIndex = await cubeIndexDB.get(cubeKey) || [];
    currentIndex.push(selectionId);
    await cubeIndexDB.set(cubeKey, currentIndex);
  } catch (error) {
    logger.error('Error tracking cube selection:', error);
  }
};

/**
 * Get usage statistics for a specific cube
 * @param cubeKey The cube key to get stats for
 * @returns The usage statistics
 */
export const getCubeStats = async (cubeKey: string): Promise<CubeUsageStats> => {
  try {
    const selectionIds = await cubeIndexDB.get(cubeKey) || [];
    const count = selectionIds.length;

    let lastUsed: Date | undefined;
    if (count > 0) {
      // Get the most recent selection
      const latestId = selectionIds[selectionIds.length - 1];
      const latestSelection = await cubeHistoryDB.get(latestId);
      lastUsed = latestSelection?.timestamp;
    }

    return { cubeKey, count, lastUsed };
  } catch (error) {
    logger.error('Error getting cube stats:', error);
    return { cubeKey, count: 0 };
  }
};

/**
 * Get usage statistics for all cubes
 * @returns Array of all cube usage statistics sorted by count descending
 */
export const getAllCubeStats = async (): Promise<CubeUsageStats[]> => {
  const stats: CubeUsageStats[] = [];
  const cubeKeys = Object.keys(cubes);

  for (const cubeKey of cubeKeys) {
    const stat = await getCubeStats(cubeKey);
    stats.push(stat);
  }

  return stats.sort((a, b) => b.count - a.count);
};

/**
 * Get the top user for a specific cube
 * @param cubeKey The cube key to analyze
 * @returns The top user info or null if no users found
 */
export const getTopUserForCube = async (cubeKey: string): Promise<{ username: string; count: number } | null> => {
  try {
    const selectionIds = await cubeIndexDB.get(cubeKey) || [];
    if (selectionIds.length === 0) return null;

    // Count selections by user
    const userCounts: Record<string, { username: string; count: number }> = {};

    for (const selectionId of selectionIds) {
      const selection = await cubeHistoryDB.get(selectionId);
      if (selection) {
        if (!userCounts[selection.userId]) {
          userCounts[selection.userId] = { username: selection.username, count: 0 };
        }
        userCounts[selection.userId].count++;
      }
    }

    // Find the user with the most selections
    return Object.values(userCounts).reduce((max, user) =>
      user.count > max.count ? user : max
    );
  } catch (error) {
    logger.error('Error getting top user for cube:', error);
    return null;
  }
};