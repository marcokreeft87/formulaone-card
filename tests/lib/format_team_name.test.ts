import { formatTeamName } from '../../src/lib/format_team_name';

describe('Testing formatTeamName', () => {
    test.each([
        ['Cadillac F1 Team', 'Cadillac'],
        ['Alpine F1 Team', 'Alpine'],
        ['Haas F1 Team', 'Haas'],
        ['Cadillac Team', 'Cadillac'],
        ['Cadillac f1 TEAM', 'Cadillac'],
        ['Cadillac   F1   Team  ', 'Cadillac'],
        ['Cadillac\tF1\tTeam', 'Cadillac'],
        ['Ferrari', 'Ferrari'],
        ['Red Bull', 'Red Bull'],
        ['Team Lotus', 'Team Lotus'],
        ['Racing Team India', 'Racing Team India'],
        ['Racing F1 Team Junior', 'Racing F1 Team Junior'],
        ['Steam', 'Steam'],
        ['Team', 'Team'],
        ['', ''],
    ])('formats "%s" as "%s"', (name, expected) => {
        expect(formatTeamName(name)).toBe(expected);
    });
});
