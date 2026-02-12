import type { Map } from '../types/map';

export const suburbanMap: Map = {
    id: "suburban-area",
    name: "Suburban Area",

    warehouse: {
        id: 'warehouse',
        x: 400,    // Center-ish
        y: 100,    // Top area
        name: 'Distribution Center',
        type: 'warehouse',
    },

    locations: [
        {
            id: 'h1',
            x: 200,   // Match your blue circles!
            y: 300,
            name: '15 Maple Drive',
            type: 'house',
        },
        {
            id: 'h2',
            x: 600,
            y: 300,
            name: '42 Oak Lane',
            type: 'house',
        },
        {
            id: 'h3',
            x: 400,
            y: 500,
            name: '78 Pine Road',
            type: 'house',
        },
    ],

    roads: [
        { from: 'warehouse', to: 'h1', distance: 5.2 },
        { from: 'warehouse', to: 'h2', distance: 7.1 },
        { from: 'warehouse', to: 'h3', distance: 4.5 },
        { from: 'h1', to: 'h2', distance: 3.5 },
    ],
};