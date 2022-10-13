const defaultInitText: string = `import {css, defineElement, html} from 'element-vir';

export const MyElement = defineElement<{text: string}>()({
    tagName: 'my-element',
    styles: css\`
        :host {
            display: inline-block;
            padding: 4px;
            border: 2px solid dodgerblue;
            border-radius: 4px;
            cursor: pointer;
        }

        :host(:hover) {
            border-color: red;
        }
    \`,
    renderCallback: ({inputs}) => {
        return html\`
            \${inputs.text || 'hello there'}
        \`;
    },
});

export const MyElement2 = defineElement()({
    tagName: 'my-element-2',
    styles: css\`
        :host {
            display: inline-block;
            padding: 4px;
            border: 2px solid mediumvioletred;
            border-radius: 4px;
        }
    \`,
    renderCallback: ({inputs}) => {
        return html\`
            <\${MyElement}
                \${assign(MyElement, { text: 'yo' })}
            ></\${MyElement}>
        \`;
    },
});
`;

const version = 2;

const key = `element-vir-code-input-v${version}`;

export function getInitialCode() {
    return window.localStorage.getItem(key) ?? defaultInitText;
}

export function storeCode(code: string) {
    window.localStorage.setItem(key, code);
}

export function clearStoredCode() {
    window.localStorage.removeItem(key);
}
