import { ChangeDetectionStrategy, Component, output, signal, computed, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteContent } from '../../pages/board.types';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note.html',
  styleUrl: './note.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Note {
  content = input.required<NoteContent>();
  closeModal = output<void>();

  // Use a local signal for managing state internally, especially for edits
  localContent = signal<NoteContent>({ title: '', content: '', isEditing: false, tasks: undefined });
  showColors = signal(false);

  // Predefined colors based on Material Design (Keep style) CSS variables
  colors = [
    'var(--color-note-default)', 'var(--color-note-red)', 'var(--color-note-orange)',
    'var(--color-note-yellow)', 'var(--color-note-green)', 'var(--color-note-teal)',
    'var(--color-note-blue)', 'var(--color-note-darkblue)', 'var(--color-note-purple)',
    'var(--color-note-pink)', 'var(--color-note-brown)', 'var(--color-note-gray)'
  ];

  constructor() {
    effect(() => {
      // Initialize local state when the input changes
      const inputContent = this.content();
      if (inputContent) {
        this.localContent.set({
          ...inputContent,
          tasks: inputContent.tasks ? [...inputContent.tasks] : undefined
        });
      }
    }, { allowSignalWrites: true });
  }

  updateTitle(event: Event) {
    const title = (event.target as HTMLInputElement).value;
    this.localContent.update(c => ({ ...c, title }));
    if (!this.localContent().isEditing) {
      this.syncToParent();
    }
  }

  updateContent(event: Event) {
    const text = (event.target as HTMLTextAreaElement).value;
    this.localContent.update(c => ({ ...c, content: text }));
    if (!this.localContent().isEditing) {
      this.syncToParent();
    }
  }

  changeColor(color: string) {
    this.localContent.update(c => ({ ...c, color }));
  }

  // --- Task Operations ---
  toggleTasklist() {
    this.localContent.update(c => {
      // If tasks exist (even empty array), we are in List mode -> switch to Text mode
      if (c.tasks !== undefined) {
        let newContent = c.content || '';
        if (c.tasks.length > 0) {
          const taskText = c.tasks.map(t => (t.completed ? '[x] ' : '[ ] ') + t.text).join('\n');
          newContent = newContent ? newContent + '\n' + taskText : taskText;
        }
        return { ...c, tasks: undefined, content: newContent };
      }

      // If tasks do not exist, we are in Text mode -> switch to List mode
      let newTasks: { id: number, text: string, completed: boolean }[] = [];
      let newContentStr = '';
      if (c.content) {
        const lines = c.content.split('\n');
        lines.forEach((line, i) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('[x] ') || trimmed.startsWith('[ ] ')) {
            const isCompleted = trimmed.startsWith('[x] ');
            newTasks.push({ id: Date.now() + i, text: trimmed.substring(4), completed: isCompleted });
          } else if (trimmed !== '') {
            newTasks.push({ id: Date.now() + i, text: trimmed, completed: false });
          }
        });
      }
      return { ...c, tasks: newTasks, content: newContentStr };
    });
    if (!this.localContent().isEditing) {
      this.syncToParent();
    }
  }

  addTask(event: Event) {
    const input = event.target as HTMLInputElement;
    const text = input.value.trim();
    if (text) {
      this.localContent.update(c => ({
        ...c,
        tasks: [...(c.tasks || []), { id: Date.now(), text, completed: false }]
      }));
      input.value = ''; // clear input
    }
  }

  updateTaskText(index: number, event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.localContent.update(c => {
      if (!c.tasks) return c;
      const tasks = [...c.tasks];
      tasks[index] = { ...tasks[index], text };
      return { ...c, tasks };
    });
    if (!this.localContent().isEditing) {
      this.syncToParent();
    }
  }

  toggleTaskCompletion(index: number) {
    this.localContent.update(c => {
      if (!c.tasks) return c;
      const tasks = [...c.tasks];
      tasks[index] = { ...tasks[index], completed: !tasks[index].completed };
      return { ...c, tasks };
    });
    if (!this.localContent().isEditing) {
      this.syncToParent();
    }
  }

  removeTask(index: number) {
    this.localContent.update(c => {
      if (!c.tasks) return c;
      const tasks = [...c.tasks];
      tasks.splice(index, 1);
      return { ...c, tasks };
    });
    if (!this.localContent().isEditing) {
      this.syncToParent();
    }
  }

  // --- Image Operations ---
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.localContent.update(c => ({
          ...c,
          image: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.localContent.update(c => ({ ...c, image: undefined }));
  }

  // --- Save / Close ---
  private syncToParent() {
    Object.assign(this.content(), {
      ...this.localContent()
    });
  }

  save() {
    this.localContent.update(c => ({ ...c, isEditing: false }));
    this.content().isEditing = false;
    this.syncToParent();
    this.closeModal.emit();
  }

  isNoteEmpty() {
    const c = this.localContent();
    return !c.title && !c.content && !c.image && (!c.tasks || c.tasks.length === 0);
  }
}
