import { getTeamImage } from '../../src/utils';
import { MRData } from '../testdata/constructorStandings.json'
import 'isomorphic-fetch';
import { createMock } from 'ts-auto-mock';
import { BaseCard } from '../../src/cards/base-card';

describe('Testing util file function renderHeader', () => {

    const card = createMock<BaseCard>();
    MRData.StandingsTable.StandingsLists[0].ConstructorStandings.forEach(constructor => {

        const constructorName = constructor.Constructor.constructorId;
        
        test(`Calling getTeamImageUrl with ${constructorName} should return valid image`, async () => { 

            const imageUrl = getTeamImage(card, constructorName);
            const result = await fetch(imageUrl);

            expect(result.status).toBe(200);
        });
    })
});