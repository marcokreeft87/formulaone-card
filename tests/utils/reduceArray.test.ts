import { reduceArray } from "../../src/utils";

describe('reduceArray', () => {
    it('should reduce the array to the size of the limit', () => {
        const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
        const limit = 10;
        const result = reduceArray(array, limit);

        expect(result.length).toBe(limit);
    });

    it('should not reduce the array if the limit is greater than the array size', () => {
        const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
        const limit = 20;
        const result = reduceArray(array, limit);

        expect(result.length).toBe(array.length);
    });

    it('should return an empty array if the array is empty', () => {
        const array = [] as string[];
        const limit = 20;
        const result = reduceArray(array, limit);

        expect(result.length).toBe(0);
    });
});
