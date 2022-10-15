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

        const result = formatDateTime(date, locale).split(' ');
        '1 januari 2022 10:00'.split(' ').forEach((x: string) => expect(result).toContain(x));
    }),
    test('Passing date and locale formatDateTimeRaceInfo', () => {           
        const date = new Date('2022-01-01 10:00:00')
        
        const result = formatDateTimeRaceInfo(date, locale).split(' ');
        'za 10:00'.split(' ').forEach((x: string) => expect(result).toContain(x));
    }),
    test('Passing date, locale and en locale formatDateTime', () => {           
        const date = new Date('2022-01-01 10:00:00')
        locale.time_format = TimeFormat.am_pm;
        
        const result = formatDateTime(date, locale).split(' ');
        '1 januari 2022 10:00 a.m.'.split(' ').forEach((x: string) => expect(result).toContain(x));
    }),
    test('Passing date and locale en locale formatDateTimeRaceInfo', () => {           
        const date = new Date('2022-01-01 10:00:00')
        locale.time_format = TimeFormat.am_pm;

        const result = formatDateTimeRaceInfo(date, locale).split(' ');
        'za 10:00 a.m.'.split(' ').forEach((x: string) => expect(result).toContain(x));
    }),
    test('Passing date, locale and timeformat system formatDateTime', () => {           
        const date = new Date('2022-01-01 10:00:00')
        locale.time_format = TimeFormat.system;

        const result = formatDateTime(date, locale).split(' ');
        '1 januari 2022 10:00'.split(' ').forEach((x: string) => expect(result).toContain(x));
    }),
    test('Passing date and locale timeformat system formatDateTimeRaceInfo', () => {           
        const date = new Date('2022-01-01 10:00:00')
        locale.time_format = TimeFormat.system;

        const result = formatDateTimeRaceInfo(date, locale).split(' ');
        'za 10:00'.split(' ').forEach((x: string) => expect(result).toContain(x));
    }) 
})

