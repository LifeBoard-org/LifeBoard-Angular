export type BoardItemType = 'note' | 'task' | 'image';



export interface BoardItem {
  id: number;
  type: BoardItemType;
  x: number;
  y: number;
  content: NoteContent; // Can be typed further based on specific content requirements
  color: string;
  width: number;
  height: number;
}

export interface NoteContent {
  title?: string;
  content?: string;
  isEditing: boolean;
  image?: string | null;
  color?: string;
  tasks?: { id: number; text: string; completed: boolean }[];
}

