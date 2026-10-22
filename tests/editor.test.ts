import { createMock } from 'ts-auto-mock';
import { HomeAssistant } from 'custom-card-helpers';
import { FormulaOneCardEditor } from '../src/editor';
import { FormulaOneCardType } from '../src/types/formulaone-card-types';

describe('FormulaOne card visual editor', () => {
    let editor: FormulaOneCardEditor;

    beforeEach(async () => {
        editor = new FormulaOneCardEditor();
        editor.hass = createMock<HomeAssistant>();
        editor.setConfig({ type: 'custom:formulaone-card' });
        document.body.appendChild(editor);
        await editor.updateComplete;
    });

    afterEach(() => {
        editor.remove();
    });

    test('renders the required card type selector with all supported types', () => {
        const dropdown = editor.shadowRoot.querySelector('ha-combo-box') as HTMLElement & {
            configValue: string;
            items: { value: FormulaOneCardType; label: string }[];
        };

        expect(dropdown.getAttribute('label')).toBe('Card Type (Required)');
        expect(dropdown.configValue).toBe('card_type');
        expect(dropdown.items.map(item => item.value)).toEqual(Object.values(FormulaOneCardType));
        expect(dropdown.closest('.hidden')).toBeNull();
    });

    test.each(['ha-combo-box', 'ha-textfield'])('gives %s full width in the flex layout', (selector) => {
        const style = document.createElement('style');
        style.textContent = FormulaOneCardEditor.styles.cssText;
        document.head.appendChild(style);

        try {
            const control = editor.shadowRoot.querySelector(selector);
            const rules = Array.from(style.sheet.cssRules) as CSSStyleRule[];
            expect(rules.some(rule =>
                rule.selectorText && control.matches(rule.selectorText) &&
                rule.style.width === '100%'
            )).toBe(true);
        } finally {
            style.remove();
        }
    });

    test('emits a valid configuration when a card type is selected', async () => {
        const configChanged = jest.fn();
        editor.addEventListener('config-changed', configChanged);
        const dropdown = editor.shadowRoot.querySelector('ha-combo-box');

        dropdown.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: FormulaOneCardType.Schedule }
        }));
        await editor.updateComplete;

        expect(configChanged).toHaveBeenCalledTimes(1);
        expect(configChanged.mock.calls[0][0].detail.config).toEqual({
            type: 'custom:formulaone-card',
            card_type: FormulaOneCardType.Schedule
        });
    });
});
