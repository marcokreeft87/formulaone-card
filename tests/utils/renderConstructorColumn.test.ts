import { createMock } from 'ts-auto-mock';
import { Constructor, ConstructorStanding } from '../../src/api/f1-models';
import ConstructorStandings from '../../src/cards/constructor-standings';
import DriverStandings from '../../src/cards/driver-standings';
import FormulaOneCard from '../../src';
import { FormulaOneCardConfig } from '../../src/types/formulaone-card-types';
import { renderConstructorColumn } from '../../src/utils';
import { getRenderString } from '../utils';

describe('Rendering shortened team names', () => {
    const constructor = createMock<Constructor>({
        constructorId: 'cadillac',
        name: 'Cadillac F1 Team',
    });

    test.each([false, true])('shared driver/results column with show_teamlogo=%s', (showTeamLogo) => {
        const parent = createMock<FormulaOneCard>({
            config: createMock<FormulaOneCardConfig>({
                standings: { show_teamlogo: showTeamLogo },
            }),
        });
        const card = new DriverStandings(parent);
        const getLogo = jest.spyOn(card.imageClient, 'GetTeamLogoImage').mockReturnValue('cadillac.png');

        const result = getRenderString(renderConstructorColumn(card, constructor, 2026));

        expect(result).toContain('Cadillac</td>');
        expect(result).not.toContain('F1 Team');
        expect(constructor.name).toBe('Cadillac F1 Team');
        if (showTeamLogo) {
            expect(result).toContain('src="cadillac.png"');
            expect(getLogo).toHaveBeenCalledWith('cadillac', 2026);
        } else {
            expect(result).not.toContain('<img');
            expect(getLogo).not.toHaveBeenCalled();
        }
        getLogo.mockRestore();
    });

    test.each([false, true])('constructor standings row with show_teamlogo=%s', (showTeamLogo) => {
        const parent = createMock<FormulaOneCard>({
            config: createMock<FormulaOneCardConfig>({
                standings: { show_teamlogo: showTeamLogo },
            }),
        });
        const card = new ConstructorStandings(parent);
        const standing = createMock<ConstructorStanding>({ Constructor: constructor });
        const getLogo = jest.spyOn(card.imageClient, 'GetTeamLogoImage').mockReturnValue('cadillac.png');

        const result = getRenderString(card.renderStandingRow(standing, 2026));

        expect(result).toContain('Cadillac </td>');
        expect(result).not.toContain('F1 Team');
        expect(standing.Constructor.name).toBe('Cadillac F1 Team');
        if (showTeamLogo) {
            expect(result).toContain('src="cadillac.png"');
            expect(getLogo).toHaveBeenCalledWith('cadillac', 2026);
        } else {
            expect(result).not.toContain('<img');
            expect(getLogo).not.toHaveBeenCalled();
        }
        getLogo.mockRestore();
    });
});
