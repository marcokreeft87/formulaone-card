import { FrontendLocaleData, NumberFormat, TimeFormat } from "custom-card-helpers";
import { formatDateTime, formatDateTimeRaceInfo } from "../../src/lib/format_date_time";

describe('Testing formate_date_time file', () => {
    const locale: FrontendLocaleData = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }

    test('Passing date, locale formatDateTime', () => {           
        const date = new Date('2022-01-01 10:00:00')

        expect(formatDateTime(date, locale)).toBe('1 januari 2022 om 10:00');
    }),
    test('Passing date and locale formatDateTimeRaceInfo', () => {           
        const date = new Date('2022-01-01 10:00:00')

        expect(formatDateTimeRaceInfo(date, locale)).toBe('za 10:00');
    }),
    test('Passing date, locale and en locale formatDateTime', () => {           
        const date = new Date('2022-01-01 10:00:00')
        locale.time_format = TimeFormat.am_pm;

        expect(formatDateTime(date, locale)).toBe('1 januari 2022 om 10:00 a.m.');
    }),
    test('Passing date and locale en locale formatDateTimeRaceInfo', () => {           
        const date = new Date('2022-01-01 10:00:00')
        locale.time_format = TimeFormat.am_pm;

        expect(formatDateTimeRaceInfo(date, locale)).toBe('za 10:00 a.m.');
    }),
    test('Passing date, locale and timeformat system formatDateTime', () => {           
        const date = new Date('2022-01-01 10:00:00')
        locale.time_format = TimeFormat.system;

        expect(formatDateTime(date, locale)).toBe('1 januari 2022 om 10:00');
    }),
    test('Passing date and locale timeformat system formatDateTimeRaceInfo', () => {           
        const date = new Date('2022-01-01 10:00:00')
        locale.time_format = TimeFormat.system;

        expect(formatDateTimeRaceInfo(date, locale)).toBe('za 10:00 a.m.');
    }) 
})

