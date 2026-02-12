interface Props {
  selected: string;
  onSelect: (algorithm: string) => void;
}

export function AlgorithmPicker({ selected, onSelect }: Props) {
  const algorithms = [
    { id: 'greedy', name: 'Greedy (Nearest Neighbor)' },
    { id: 'dijkstra', name: 'Dijkstra (Shortest Path)' },
    { id: 'clustered', name: 'Clustered (Area-Based)' }
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
        Select Algorithm:
      </label>
      <select 
        value={selected} 
        onChange={(e) => onSelect(e.target.value)}
        style={{ padding: '8px', fontSize: '14px' }}
      >
        {algorithms.map(algo => (
          <option key={algo.id} value={algo.id}>
            {algo.name}
          </option>
        ))}
      </select>
    </div>
  );
}