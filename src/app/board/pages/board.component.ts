import { Component, computed, HostListener, signal } from "@angular/core";
import { ThemeService } from "../../core/theme/theme.service";
import { BoardItem, BoardItemType } from "./board.types";
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from "@angular/common";
import { Image } from "../components/image/image";
import { Tasklist } from "../components/tasklist/tasklist";
import { Note } from "../components/note/note";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
    standalone: true,
    imports: [DragDropModule, CommonModule,Image,Tasklist,Note,RouterLink]
})
export class BoardComponent {

    darkMode: boolean = true;

    constructor(
        private themeServices: ThemeService
    ) {
        this.darkMode = this.themeServices.isDarkMode()
    }

    itemTypes:{type:BoardItemType,name:string}[] = [
        {type:'note',name:'Note'},
        {type:'task',name:'Task'},
        {type:'image',name:'Image'},
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
        event.preventDefault();

        // SCENARIO 1: ZOOM (Ctrl + Wheel)
        if (event.ctrlKey) {
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
        else if(event.shiftKey) {
            this.panX.update(x => x - event.deltaX);
            this.panY.update(y => y - event.deltaY);
        }
    }

    // 2. Mouse Down: Initiates Drag Panning
    onMouseDown(event: MouseEvent) {
        // Allow panning if Space is held OR Middle Mouse Button is clicked
        if (this.isPanning() || event.button === 1) {
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
        if (this.isPanning()) {
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

    // 5. Spacebar Logic: Toggles 'Grab' mode
    @HostListener('window:keydown.space', ['$event'])
    onSpaceDown(event: any) {
        // Prevent page scroll when pressing space
        // Only trigger if not already pressed (prevents repeat events)
        event.preventDefault();
        if (!this.isPanning()) {
            this.isPanning.set(true);
        }
    }

    @HostListener('window:keyup.space')
    onSpaceUp() {
        this.isPanning.set(false);
        this.isDragging = false; // Stop dragging if space is released
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
    boardItems = signal<BoardItem[]>([]);

    addItem(type: 'note' | 'task' | 'image') {
        const center = this.getViewportCenterInWorldSpace();
        const newItem: BoardItem = {
            id: Date.now(),
            type,
            x: center.x,
            y: center.y,
            width: 200,  // Default Width
            height: 150, // Default Height
            content: type === 'note' ? 'New Idea' : 'To Do',
            color: type === 'note' ? '#fff9c4' : '#e1f5fe'
        };
        this.boardItems.update(items => [...items, newItem]);

    }
}