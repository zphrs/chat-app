"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const _1 = require(".");
class NumberEquals extends Number {
    constructor(value) {
        super(value);
    }
    compareTo(value) {
        return this.valueOf() - value.valueOf();
    }
    equals(value) {
        return this.valueOf() === value.valueOf();
    }
}
(0, mocha_1.describe)('DLList', () => {
    const list = new _1.DLList();
    it('should be empty', () => {
        (0, chai_1.expect)(list.size).to.equal(0);
    });
    it('should add an item', () => {
        list.add(new NumberEquals(1));
        (0, chai_1.expect)(list.toString()).to.equal('1');
    });
    it('should add an item at the end', () => {
        list.add(new NumberEquals(2));
        (0, chai_1.expect)(list.toString()).to.equal('1, 2');
    });
    it('should add an item at the beginning', () => {
        list.insert(0, new NumberEquals(0));
        (0, chai_1.expect)(list.toString()).to.equal('0, 1, 2');
    });
    it('should add an item at the middle', () => {
        list.insert(1, new NumberEquals(3));
        (0, chai_1.expect)(list.toString()).to.equal('0, 3, 1, 2');
    });
    it('should add an item at the end', () => {
        list.insert(4, new NumberEquals(4));
        (0, chai_1.expect)(list.toString()).to.equal('0, 3, 1, 2, 4');
    });
    it('should remove the 1 from the list', () => {
        list.removeValue(new NumberEquals(1));
        (0, chai_1.expect)(list.toString()).to.equal('0, 3, 2, 4');
    });
});
(0, mocha_1.describe)('SortableDLList', () => {
    const list = new _1.SortableDLList();
    it('should be empty', () => {
        (0, chai_1.expect)(list.size).to.equal(0);
    });
    it('should add an item', () => {
        list.add(new NumberEquals(1));
        (0, chai_1.expect)(list.toString()).to.equal('1');
    });
    it('should add an item at the end', () => {
        list.add(new NumberEquals(2));
        (0, chai_1.expect)(list.toString()).to.equal('1, 2');
    });
    it('should add an item at the beginning', () => {
        list.add(new NumberEquals(0));
        (0, chai_1.expect)(list.toString()).to.equal('0, 1, 2');
    });
    it('should add an item at the middle', () => {
        list.add(new NumberEquals(1.5));
        (0, chai_1.expect)(list.toString()).to.equal('0, 1, 1.5, 2');
    });
    it('should add an item at the end', () => {
        list.add(new NumberEquals(4));
        (0, chai_1.expect)(list.toString()).to.equal('0, 1, 1.5, 2, 4');
    });
    it('should remove the 1 from the list', () => {
        list.removeValue(new NumberEquals(1));
        (0, chai_1.expect)(list.toString()).to.equal('0, 1.5, 2, 4');
    });
});
(0, mocha_1.describe)('DLList to SortableDLList', () => {
    const list = new _1.DLList();
    list.add(new NumberEquals(1));
    list.add(new NumberEquals(2));
    list.add(new NumberEquals(0));
    list.add(new NumberEquals(1.5));
    list.add(new NumberEquals(4));
    const sorted = _1.SortableDLList.sort(list);
    it('should be the same length', () => {
        (0, chai_1.expect)(sorted.size).to.equal(5);
    });
    it('should be sorted', () => {
        (0, chai_1.expect)(sorted.toString()).to.equal('0, 1, 1.5, 2, 4');
    });
});
