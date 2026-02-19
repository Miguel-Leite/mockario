import type { SchemaRelation, SchemaTable } from '@/types';

interface RelationLinesProps {
  relations: SchemaRelation[];
  tables: SchemaTable[];
}

const TABLE_WIDTH = 256;
const TABLE_HEADER_HEIGHT = 40;
const FIELD_ROW_HEIGHT = 24;

const relationColors: Record<string, string> = {
  'one-to-one': '#22c55e',
  'one-to-many': '#3b82f6',
  'many-to-many': '#a855f7',
};

function getRelationTypeKey(type: string): string {
  return type.replace(/-/g, '');
}

function getTableCenter(table: SchemaTable): { x: number; y: number } {
  const height = TABLE_HEADER_HEIGHT + Math.max(table.fields.length * FIELD_ROW_HEIGHT, 48);
  return {
    x: table.position.x + TABLE_WIDTH / 2,
    y: table.position.y + height / 2,
  };
}

function createCurvedPath(x1: number, y1: number, x2: number, y2: number): string {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.min(distance * 0.3, 80);
  
  const offsetX = -dy / distance * curvature;
  const offsetY = dx / distance * curvature;
  
  const cp1x = midX + offsetX;
  const cp1y = midY + offsetY;
  
  return `M ${x1} ${y1} Q ${cp1x} ${cp1y} ${x2} ${y2}`;
}

export function RelationLines({ relations, tables }: RelationLinesProps) {
  if (relations.length === 0) return null;

  const tableMap = new Map(tables.map(t => [t.id, t]));

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {Object.entries(relationColors).map(([type, color]) => (
          <marker
            key={type}
            id={`arrow-${getRelationTypeKey(type)}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        ))}
      </defs>
      {relations.map((relation) => {
        const fromTable = tableMap.get(relation.fromTable);
        const toTable = tableMap.get(relation.toTable);
        
        if (!fromTable || !toTable) return null;

        const from = getTableCenter(fromTable);
        const to = getTableCenter(toTable);
        
        const path = createCurvedPath(from.x, from.y, to.x, to.y);
        const color = relationColors[relation.type] || '#6b7280';
        
        return (
          <g key={relation.id}>
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeOpacity="0.6"
              markerEnd={`url(#arrow-${getRelationTypeKey(relation.type)})`}
            />
          </g>
        );
      })}
    </svg>
  );
}
