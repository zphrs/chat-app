import DLList from './DLList';
export default class SortableDLList extends DLList {
    constructor() {
        super();
    }
    add(value) {
        if (this.size === 0) {
            super.add(value);
            return;
        }
        let current = this.getItem(0);
        let index = 0;
        while (current.value && current.value.compareTo(value) < 0) {
            if (current.next === null) {
                break;
            }
            current = current.next;
            index++;
        }
        this.insert(index, value);
    }
    static sort(input) {
        const out = new SortableDLList();
        for (const item of input) {
            out.add(item);
        }
        return out;
    }
    sort() {
        this.clear();
        for (const item of this) {
            this.add(item);
        }
        return this;
    }
}
