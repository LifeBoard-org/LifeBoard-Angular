import { Injectable, signal, computed } from '@angular/core';
import { BoardItem } from '../../board/pages/board.types';

@Injectable({
    providedIn: 'root'
})
export class BoardStateService {
    // Global state holding all board items
    public items = signal<BoardItem[]>([]);

    constructor() { }

    /**
     * Add a new item to the board.
     */
    addItem(item: BoardItem): void {
        this.items.update(items => [...items, item]);
    }

    /**
     * Update an existing item, carefully preserving superficial vs date elements.
     * If a partial update doesn't include a date/dateRangeType, the old ones are strictly kept.
     */
    updateItem(updatedItem: BoardItem): void {
        this.items.update(items => {
            const existingIndex = items.findIndex(i => i.id === updatedItem.id);
            if (existingIndex > -1) {
                const oldItem = items[existingIndex];
                const newItems = [...items];

                // Merge aggressively but prioritize existing dates if not explicitly redefined
                newItems[existingIndex] = {
                    ...updatedItem,
                    // If the update payload for some reason strips the date out, fall back to what we had
                    date: updatedItem.date || oldItem.date,
                    dateRangeType: updatedItem.dateRangeType || oldItem.dateRangeType
                };

                return newItems;
            }
            // If we try to update an item that doesn't exist, we just add it
            return [...items, updatedItem];
        });
    }

    /**
     * Delete an item from the board.
     */
    deleteItem(id: number): void {
        this.items.update(items => items.filter(i => i.id !== id));
    }

    /**
     * Check if a given `targetDateStr` (YYYY-MM-DD) falls within an item's date anchor + range.
     */
    private isDateInRange(targetDateStr: string, itemDateStr: string, rangeType: 'day' | 'week' | 'month' | 'year' = 'day'): boolean {
        if (!itemDateStr) return false;

        // Fast path: exact match
        if (targetDateStr === itemDateStr && rangeType === 'day') {
            return true;
        }

        const targetDate = new Date(targetDateStr);
        const itemDate = new Date(itemDateStr);

        if (isNaN(targetDate.getTime()) || isNaN(itemDate.getTime())) {
            return false; // Malformed strings
        }

        switch (rangeType) {
            case 'day':
                return targetDateStr === itemDateStr; // Strict YYYY-MM-DD comparison is safe here

            case 'week':
                // A week is typically the 7 days encompassing the item Date (e.g. Sunday to Saturday)
                // For simplicity, let's say the week is 3 days before and 3 days after the item date,
                // or starting from the item date + 6 days. Let's start from itemDate and go +6 days.
                const itemEndWeek = new Date(itemDate);
                itemEndWeek.setDate(itemEndWeek.getDate() + 6);
                return targetDate >= itemDate && targetDate <= itemEndWeek;

            case 'month':
                return targetDate.getFullYear() === itemDate.getFullYear() &&
                    targetDate.getMonth() === itemDate.getMonth();

            case 'year':
                return targetDate.getFullYear() === itemDate.getFullYear();

            default:
                return false;
        }
    }

    /**
     * Retrieves items that encompass the target date (YYYY-MM-DD).
     */
    getItemsForDate(targetDate: string): BoardItem[] {
        return this.items().filter(item => {
            // If an item has no date, treat it as orphaned/global (or handle differently based on spec)
            if (!item.date) return false;
            return this.isDateInRange(targetDate, item.date, item.dateRangeType);
        });
    }

    /**
     * Gets a list of unique colors of items present on a specific date. 
     * Useful for the Week View dots.
     */
    getUniqueItemColorsForDate(targetDate: string): string[] {
        const items = this.getItemsForDate(targetDate);
        const colors = new Set<string>();
        items.forEach(item => {
            if (item.color) {
                colors.add(item.color);
            }
        });
        return Array.from(colors);
    }

    /**
     * Gets the total count of items present on a specific date.
     * Useful for the Life Map heatmap.
     */
    getItemCountForDate(targetDate: string): number {
        return this.getItemsForDate(targetDate).length;
    }
}
