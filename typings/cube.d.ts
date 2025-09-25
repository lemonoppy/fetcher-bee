export interface Cube {
  id: string;
  setCode: string;
  description: string;
}

export interface CubeSelection {
  key: string;
  cube: Cube;
}

export interface CubeUsageStats {
  cubeKey: string;
  count: number;
  lastUsed?: Date;
}

export interface CubeSelectionHistory {
  cubeKey: string;
  userId: string;
  username: string;
  timestamp: Date;
}