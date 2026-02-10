import { Component, computed, OnInit, signal, HostListener } from "@angular/core";
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { ThemeService } from "../../core/theme/theme.service";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
    standalone: true,
    imports:[DragDropModule,RouterLink]
})
export class BoardComponent implements OnInit {
    darkMode:boolean = true;
    constructor(
        private themeServices:ThemeService
    ){
        this.darkMode = this.themeServices.isDarkMode()
    }
    ngOnInit(): void {
        console.log('BoardComponent');
    }
    toggle(){
        this.darkMode = !this.darkMode
        this.themeServices.toggle()
    }

    panX = signal(0);
    panY = signal(0);
    zoom = signal(1);

    // Derived transform string for the CSS
    surfaceTransform = computed(() =>
        `translate(${this.panX()}px, ${this.panY()}px) scale(${this.zoom()})`
    );

    boardItems = signal([
        { id: '1', x: 100, y: 100,type:1, content: 'First Task' },
        { id: '2', x: 450, y: 350,type:2, content: 'Second Task' },
        { id: '3', x: 900, y: 150,type:3, content: 'third Task' },
    ]);

    onDragEnd(event: CdkDragEnd, item: any) {
        const { x, y } = event.dropPoint;
        // Logic to update the signal array with new coordinates
    }


    private isPanning = false;
    private startMouseX = 0;
    private startMouseY = 0;
    private startPanX = 0;
    private startPanY = 0;

    startPanning(event: MouseEvent) {
        // if ((event.target as HTMLElement).classList.contains('viewport') || 
        //     (event.target as HTMLElement).classList.contains('grid-background')) {
        
        //     this.isPanning = true;
        //     this.startMouseX = event.clientX;
        //     this.startMouseY = event.clientY;
        //     this.startPanX = this.panX();
        //     this.startPanY = this.panY();
            
        //     // Change cursor to 'grabbing'
        //     (event.currentTarget as HTMLElement).style.cursor = 'grabbing';
        // }
    }
    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isPanning) return;

        // Calculate how far the mouse has moved
        const dx = event.clientX - this.startMouseX;
        const dy = event.clientY - this.startMouseY;

        // Update the Signals
        this.panX.set(this.startPanX + dx);
        this.panY.set(this.startPanY + dy);
    }

    // 3. Global listener for mouse release
    @HostListener('window:mouseup')
    onMouseUp() {
        this.isPanning = false;
        // Reset cursor
        const viewport = document.querySelector('.viewport') as HTMLElement;
        if (viewport) viewport.style.cursor = 'grab';
    }

    handleZoom(event: WheelEvent) {
        // event.preventDefault(); // Stop the whole page from scrolling

        // const zoomIntensity = 0.1;
        // const wheel = event.deltaY < 0 ? 1 : -1;
        // const zoomFactor = Math.exp(wheel * zoomIntensity);

        // const currentZoom = this.zoom();
        // const nextZoom = Math.min(Math.max(currentZoom * zoomFactor, 0.1), 5); // Limit zoom 0.1x to 5x

        // // 1. Get mouse position relative to the viewport
        // const mouseX = event.clientX;
        // const mouseY = event.clientY;

        // // 2. Calculate mouse position relative to the "World" (Surface)
        // // Formula: (MousePos - CurrentPan) / CurrentZoom
        // const worldX = (mouseX - this.panX()) / currentZoom;
        // const worldY = (mouseY - this.panY()) / currentZoom;

        // // 3. Update Zoom
        // this.zoom.set(nextZoom);

        // // 4. Update Pan to keep the worldX/worldY under the cursor
        // // New Pan = MousePos - (WorldPos * NewZoom)
        // this.panX.set(mouseX - worldX * nextZoom);
        // this.panY.set(mouseY - worldY * nextZoom);
    }
}