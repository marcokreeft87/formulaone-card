import ConstructorStandings from '../../src/cards/constructor-standings';
import { createMock } from 'ts-auto-mock';
import { getRenderString, getRenderStringAsync } from '../utils';
import { MRData } from '../testdata/constructorStandings.json'
import { FormulaOneCardConfig } from '../../src/types/formulaone-card-types';
import ErgastClient from '../../src/api/ergast-client';
import { Mrdata, Root } from '../../src/api/f1-models';
import { getApiErrorMessage } from '../../src/utils';
import FormulaOneCard from '../../src';

describe('Testing constructor-standings file', () => {
    const parent = createMock<FormulaOneCard>({ 
        config: createMock<FormulaOneCardConfig>()
    });
    const card = new ConstructorStandings(parent);

    test('Calling render with api returning data', async () => {   
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);

        expect(htmlResult).toMatch('<table> <thead> <tr> <th class="width-50">&nbsp;</th> <th>Constructor</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td>Red Bull</td> <td class="width-60 text-center">576</td> <td class="text-center">13</td> </tr> <tr> <td class="width-50 text-center">2</td> <td>Ferrari</td> <td class="width-60 text-center">439</td> <td class="text-center">4</td> </tr> <tr> <td class="width-50 text-center">3</td> <td>Mercedes</td> <td class="width-60 text-center">373</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">4</td> <td>McLaren</td> <td class="width-60 text-center">129</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">5</td> <td>Alpine F1 Team</td> <td class="width-60 text-center">125</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">6</td> <td>Alfa Romeo</td> <td class="width-60 text-center">52</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">7</td> <td>Aston Martin</td> <td class="width-60 text-center">37</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">8</td> <td>Haas F1 Team</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">9</td> <td>AlphaTauri</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">10</td> <td>Williams</td> <td class="width-60 text-center">6</td> <td class="text-center">0</td> </tr> </tbody> </table>');
    }),
    test('Calling render with api and show_teamlogo returning data', async () => {   
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve({ MRData : <Mrdata>MRData });
        }));
        
        card.config.standings = {
            show_teamlogo: true
        }
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        
        expect(htmlResult).toMatch('<table> <thead> <tr> <th class="width-50">&nbsp;</th> <th>Constructor</th> <th class="width-60 text-center">Pts</th> <th class="text-center">Wins</th> </tr> </thead> <tbody> <tr> <td class="width-50 text-center">1</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/red-bull-racing-logo.png.transform/2col-retina/image.png">&nbsp;Red Bull</td> <td class="width-60 text-center">576</td> <td class="text-center">13</td> </tr> <tr> <td class="width-50 text-center">2</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/ferrari-logo.png.transform/2col-retina/image.png">&nbsp;Ferrari</td> <td class="width-60 text-center">439</td> <td class="text-center">4</td> </tr> <tr> <td class="width-50 text-center">3</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mercedes-logo.png.transform/2col-retina/image.png">&nbsp;Mercedes</td> <td class="width-60 text-center">373</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">4</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/mclaren-logo.png.transform/2col-retina/image.png">&nbsp;McLaren</td> <td class="width-60 text-center">129</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">5</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alpine-logo.png.transform/2col-retina/image.png">&nbsp;Alpine F1 Team</td> <td class="width-60 text-center">125</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">6</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alfa-romeo-logo.png.transform/2col-retina/image.png">&nbsp;Alfa Romeo</td> <td class="width-60 text-center">52</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">7</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/aston-martin-logo.png.transform/2col-retina/image.png">&nbsp;Aston Martin</td> <td class="width-60 text-center">37</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">8</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/haas-f1-team-logo.png.transform/2col-retina/image.png">&nbsp;Haas F1 Team</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">9</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/alphatauri-logo.png.transform/2col-retina/image.png">&nbsp;AlphaTauri</td> <td class="width-60 text-center">34</td> <td class="text-center">0</td> </tr> <tr> <td class="width-50 text-center">10</td> <td><img class="constructor-logo" height="20" width="20" src="https://www.formula1.com/content/dam/fom-website/teams//2023/williams-logo.png.transform/2col-retina/image.png">&nbsp;Williams</td> <td class="width-60 text-center">6</td> <td class="text-center">0</td> </tr> </tbody> </table>');
    }),
    test('Calling render with api not returning data', async () => {   
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(ErgastClient.prototype, 'GetData').mockImplementationOnce((_endpoint) => new Promise<Root>((resolve) => {
            resolve(undefined as unknown as Root);
        }));
        
        const result = card.render();
        const htmlResult = await getRenderStringAsync(result);
        const expectedResult = getRenderString(getApiErrorMessage('standings'));

        expect(htmlResult).toMatch(expectedResult);
    }),
    test('Calling cardSize with hass and sensor', () => { 
        expect(card.cardSize()).toBe(11);
    })    
});