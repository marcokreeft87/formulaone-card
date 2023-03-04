import { calculateWindDirection } from "../../src/utils";

describe('Testing util file function calculateWindDirection ', () => {

    test.each`
    windDirection | expected
    ${0}          | ${'N'}
    ${22.5}       | ${'NNE'}
    ${45}         | ${'NE'}
    ${67.5}       | ${'ENE'}
    ${90}         | ${'E'}
    ${112.5}      | ${'ESE'}
    ${135}        | ${'SE'}
    ${157.5}      | ${'SSE'}
    ${180}        | ${'S'}
    ${202.5}      | ${'SSW'}
    ${225}        | ${'SW'}
    ${247.5}      | ${'WSW'}
    ${270}        | ${'W'}
    ${292.5}      | ${'WNW'}
    ${315}        | ${'NW'}
    ${337.5}      | ${'NNW'}
    ${360}        | ${'N'}
    `( 'Passing $windDirection should return $expected', ({ windDirection, expected }) => {
        expect(calculateWindDirection(windDirection)).toBe(expected)
    });
});