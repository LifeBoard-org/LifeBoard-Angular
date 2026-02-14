export type BoardItemType = 'note' | 'task' | 'image';



export interface BoardItem {
  id: number;
  type: BoardItemType;
  x: number;
  y: number;
  content: any; // Can be typed further based on specific content requirements
  color:string;
  width: number; 
  height: number; 
}

