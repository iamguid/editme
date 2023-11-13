export class SelectionService {
    init() {
        document.addEventListener('selectionchange', this.onSelectionChange);
    }

    dispose() {
        document.removeEventListener('selectionchange', this.onSelectionChange);
    }

    onSelectionChange(e: Event) {
    }
}