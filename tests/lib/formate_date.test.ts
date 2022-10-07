import { FrontendLocaleData, NumberFormat, TimeFormat } from "custom-card-helpers";
import { formatDate, formatDateNumeric } from "../../src/lib/format_date";

describe('Testing formate_date file', () => {
    const locale: FrontendLocaleData = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }

    test('Passing date, locale and en locale', () => {           
        const date = new Date('2022-01-01')

        expect(formatDate(date, locale, 'en')).toBe('01/01');
    }),
    test('Passing date and locale', () => {           
        const date = new Date('2022-01-01')

        expect(formatDate(date, locale)).toBe('01-01');
    }),
    test('Passing date, locale and en locale', () => {           
        const date = new Date('2022-01-01')

        expect(formatDateNumeric(date, locale, 'en')).toBe('01/01/2022');
    }),
    test('Passing date and locale', () => {           
        const date = new Date('2022-01-01')

        expect(formatDateNumeric(date, locale)).toBe('01-01-22');
    })
    
})

