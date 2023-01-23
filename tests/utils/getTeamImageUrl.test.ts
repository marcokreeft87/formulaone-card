import { getTeamImageUrl } from '../../src/utils';
import { MRData } from '../testdata/constructorStandings.json'
import 'isomorphic-fetch';

describe('Testing util file function renderHeader', () => {

    MRData.StandingsTable.StandingsLists[0].ConstructorStandings.forEach(constructor => {

        const constructorName = constructor.Constructor.constructorId;
        
        test(`Calling getTeamImageUrl with ${constructorName} should return valid image`, async () => { 

            const imageUrl = getTeamImageUrl(constructorName);
            const result = await fetch(imageUrl);

            expect(result.status).toBe(200);
        });
    })
});