import type { Map } from '../types/map';

export const suburbanMap: Map = {
    id: "suburban-area",
    name: "Suburban Area",

    warehouse: {
        id: 'warehouse',
        x: 400,    // Center-ish
        y: 100,    // Top area
        name: 'Distribution Center',
        notes: null,
        type: 'warehouse',
    },

    locations: [
        {
            id: 'h1',
            x: 300,   // Match your blue circles!
            y: 300,
            name: '45  Horse Road',
            notes:['Please delivery with no bags'],
            type: 'house',
        },
        {
            id: 'h2',
            x: 600,
            y: 200,
            name: '42 Oakley Lane',
            notes:['Please delivery with no bags'],
            type: 'house',
        },
        {
            id: 'h3',
            x: 400,
            y: 500,
            name: ' 104 Mulwhich village',
            notes:['Please delivery with no bags'],
            type: 'house',
        },
          {
            id: 'h4',
            x: 100,
            y: 500,
            name: '104 Grave Road',
            notes:['Please delivery with no bags'],
            type: 'house',
        },
    ],

    roads: [
        { from: 'warehouse', to: 'h2', distance: 5.2 },
        { from: 'h2', to: 'h3', distance: 7.1 },
        { from: 'h3', to: 'h1', distance: 4.5 },
        { from: 'h4', to: 'h3', distance: 4.5 },
        { from: 'h1', to: 'warehouse', distance: 3.5 },
    ],
};