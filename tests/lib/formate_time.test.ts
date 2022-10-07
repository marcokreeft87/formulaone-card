import { FrontendLocaleData, NumberFormat, TimeFormat } from "custom-card-helpers";
import { formatTime } from "../../src/lib/format_time";

describe('Testing formate_time file', () => {
    const locale: FrontendLocaleData = {
        language: 'NL', 
        number_format: NumberFormat.comma_decimal,
        time_format: TimeFormat.language
    }

    test('Passing date, locale', () => {           
        const date = new Date('2022-01-01 10:00:00')

        expect(formatTime(date, locale)).toBe('10:00');
    })
})

