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
            x: 200,   // Match your blue circles!
            y: 300,
            name: '5 Horse Walk',
            notes:['Please delivery with no bags'],
            type: 'house',
        },
        {
            id: 'h2',
            x: 300,
            y: 250,
            name: '24 Trollingbourne',
            notes:['Please delivery with no bags'],
            type: 'house',
        },
        {
            id: 'h3',
            x: 500,
            y: 200,
            name: ' 10 Samdene Ave',
            notes:['Please delivery with no bags'],
            type: 'house',
        },
          {
            id: 'h4',
            x: 700,
            y: 300,
            name: '104 Tindale Road',
            notes:['Please delivery with no bags'],
            type: 'house',
        },
    ],

    roads: [
        { from: 'warehouse', to: 'h3', distance: 1.2 },
        { from: 'h3', to: 'h2', distance: 0.2 },
        { from: 'h2', to: 'h1', distance: 0.4 },
        { from: 'h1', to: 'h4', distance: 2.3 },
        { from: 'h4', to: 'warehouse', distance: 3.5 },
    ],
};