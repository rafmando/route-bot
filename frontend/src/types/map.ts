export interface Location {
  id: string;
  x: number;
  y: number;
  name: string;
  type: 'warehouse' | 'house';
}

export interface Road {
  from: string;
  to: string;
  distance: number;
}

export interface Map {
  id: string;
  name: string;
  warehouse: Location;
  locations: Location[];
  roads: Road[];
}