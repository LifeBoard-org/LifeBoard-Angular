import { ChangeDetectionStrategy, Component, computed, HostListener, signal, inject } from "@angular/core";
import { ThemeService } from "../../core/theme/theme.service";
import { BoardItem, BoardItemType } from "./board.types";
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from "@angular/common";
import { Note } from "../components/note/note";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DragDropModule, CommonModule, Note, RouterLink]
})
export class BoardComponent {

    darkMode: boolean = true;

    private themeServices = inject(ThemeService);
    constructor() {
        this.darkMode = this.themeServices.isDarkMode()
    }

    itemTypes: { type: BoardItemType, name: string }[] = [
        { type: 'note', name: 'Note' },
        { type: 'task', name: 'Task' },
        { type: 'image', name: 'Image' },
    ]

    panX = signal(0);
    panY = signal(0);
    zoom = signal(1);

    isPanning = signal(false);
    // Track if user is actively dragging the mouse
    isDragging = false;
    isResizingItem = false;

    // Resize temporary state
    resizeActiveItem: BoardItem | null = null;
    resizeStartWidth = 0;
    resizeStartHeight = 0;

    // --- Computed Styles ---

    // The main transform string for the canvas
    surfaceTransform = computed(() =>
        `translate(${this.panX()}px, ${this.panY()}px) scale(${this.zoom()})`
    );

    // Dynamic cursor based on state
    cursorStyle = computed(() => {
        if (this.isDragging) return 'grabbing';
        if (this.isPanning()) return 'grab';
        return 'default';
    });

    // --- Mouse Event State ---
    private startX = 0;
    private startY = 0;
    private initialPanX = 0;
    private initialPanY = 0;

    // --- Event Handlers ---

    // 1. Wheel: Handles Zoom (Ctrl+Wheel) and Pan (Wheel only)
    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent) {

        // SCENARIO 1: ZOOM (Ctrl + Wheel)
        if (event.ctrlKey) {
            event.preventDefault();
            const zoomIntensity = 0.001; // Sensitivity
            const delta = -event.deltaY;
            const zoomFactor = Math.exp(delta * zoomIntensity);

            const currentZoom = this.zoom();
            // Clamp zoom level between 0.1x and 5x
            const nextZoom = Math.min(Math.max(currentZoom * zoomFactor, 0.1), 5);

            // Calculate mouse position relative to the world
            // to ensure we zoom "towards" the mouse pointer
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const worldX = (mouseX - this.panX()) / currentZoom;
            const worldY = (mouseY - this.panY()) / currentZoom;

            // Update Zoom
            this.zoom.set(nextZoom);

            // Adjust Pan to keep the world point stable
            this.panX.set(mouseX - worldX * nextZoom);
            this.panY.set(mouseY - worldY * nextZoom);
        }
        // SCENARIO 2: PAN (Wheel only - e.g. Trackpad or Mouse Wheel)
        else if (event.shiftKey) {
            this.panX.update(x => x - event.deltaX);
            this.panY.update(y => y - event.deltaY);
        }
    }

    // 2. Mouse Down: Initiates Drag Panning
    onMouseDown(event: MouseEvent) {
        // Allow panning if Space is held OR Middle Mouse Button is clicked
        if (this.isPanning() && event.button === 0) {
            this.isDragging = true;
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.initialPanX = this.panX();
            this.initialPanY = this.panY();
        }
    }

    // 3. Mouse Move: Updates Pan while dragging
    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.isPanning() && event.button === 0) {
            const dx = event.clientX - this.startX;
            const dy = event.clientY - this.startY;
            this.panX.set(this.initialPanX + dx);
            this.panY.set(this.initialPanY + dy);
            return;
        }

        // 2. Handle Item Resizing
        if (this.isResizingItem && this.resizeActiveItem) {
            const dx = event.clientX - this.startX;
            const dy = event.clientY - this.startY;

            // Convert screen delta to world delta
            const worldDx = dx / this.zoom();
            const worldDy = dy / this.zoom();

            // Update the specific item
            this.boardItems.update(items => items.map(i => {
                if (i.id === this.resizeActiveItem!.id) {
                    return {
                        ...i,
                        width: Math.max(100, this.resizeStartWidth + worldDx), // Min width 100
                        height: Math.max(80, this.resizeStartHeight + worldDy) // Min height 80
                    };
                }
                return i;
            }));
        }
    }

    // 4. Mouse Up: Stops Dragging
    @HostListener('window:mouseup')
    onMouseUp() {
        this.isDragging = false;
        this.isResizingItem = false;
        this.resizeActiveItem = null;
    }


    togglePanning() {
        this.isPanning.update(p => !p);
    }

    toggleTheme() {
        this.darkMode = !this.darkMode
        this.themeServices.toggle()
    }
    getViewportCenterInWorldSpace() {
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        // Inverse logic: (Screen - Pan) / Zoom
        const worldX = (screenCenterX - this.panX()) / this.zoom();
        const worldY = (screenCenterY - this.panY()) / this.zoom();

        return { x: worldX, y: worldY };
    }

    onDragEnded(event: CdkDragEnd, item: BoardItem) {
        // 1. Get how far we moved in SCREEN pixels
        const { x, y } = event.distance;

        // 2. Convert to WORLD units (divide by zoom)
        const worldDeltaX = x / this.zoom();
        const worldDeltaY = y / this.zoom();

        // 3. Update the item's permanent position
        this.boardItems.update(items => items.map(i => {
            if (i.id === item.id) {
                return { ...i, x: i.x + worldDeltaX, y: i.y + worldDeltaY };
            }
            return i;
        }));

        // 4. Reset CDK's internal transform so it doesn't double-apply visually
        event.source.reset();
    }
    startResizing(event: MouseEvent, item: BoardItem) {
        event.preventDefault();
        event.stopPropagation(); // Stop the drag from triggering

        this.isResizingItem = true;
        this.resizeActiveItem = item;
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.resizeStartWidth = item.width;
        this.resizeStartHeight = item.height;
    }

    trackById(index: number, item: BoardItem) {
        return item.id;
    }






    //Adding items
    boardItems = signal<BoardItem[]>([
        // {
        //     id: 1,
        //     type: 'note',
        //     x: 700,
        //     y: 400,
        //     width: 200,
        //     height: 150,
        //     content: { title: 'New Idea', content: 'New Idea', isEditing: false },
        //     color: '#fff9c4'
        // }
    ]);
    activeItem = signal<BoardItem | null>(null);
    addItem(type: 'note' | 'task' | 'image') {
        const center = this.getViewportCenterInWorldSpace();
        const newItem: BoardItem = {
            id: Date.now(),
            type,
            x: center.x,
            y: center.y,
            width: 300,  // Slightly wider default
            height: 200, // Slightly taller default
            content: { title: '', content: '', isEditing: true, color: 'var(--color-surface)' },
            color: 'var(--color-surface)'
        };
        this.activeItem.set(newItem);
        // this.boardItems.update(items => [...items, newItem]);

    }
    editItem(item: BoardItem) {
        // Create a deep copy to avoid direct mutation
        const activeCopy = JSON.parse(JSON.stringify(item));
        activeCopy.content.isEditing = true;
        this.activeItem.set(activeCopy);
    }

    closeModal() {
        if (this.activeItem() && (this.activeItem()?.content.title || this.activeItem()?.content.content || this.activeItem()?.content.image || this.activeItem()?.content.tasks?.length)) {
            // Update the Top-Level BoardItem Color based on the inner content color
            const updatedItem = {
                ...this.activeItem()!,
                content: {
                    ...this.activeItem()!.content,
                    isEditing: false
                },
                color: this.activeItem()!.content.color || 'var(--color-note-default)'
            };

            this.boardItems.update(items => {
                const existingIndex = items.findIndex(i => i.id === updatedItem.id);
                if (existingIndex > -1) {
                    const newItems = [...items];
                    newItems[existingIndex] = updatedItem;
                    return newItems;
                }
                return [...items, updatedItem];
            });
        }
        this.activeItem.set(null);
    }
}