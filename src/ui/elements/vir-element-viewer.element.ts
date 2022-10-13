import {randomString, safeMatch} from 'augment-vir';
import {css, defineElement, html} from 'element-vir';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

export const VirElementViewer = defineElement<{
    code: string;
}>()({
    tagName: 'vir-element-viewer',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    `,
    renderCallback: ({inputs}) => {
        const {transformedCode, tagNames} = transformCode(inputs.code);
        eval(transformedCode);
        return html`
            ${unsafeHTML(tagNames.map((tagName) => `<${tagName}></${tagName}>`).join('<br />'))}
        `;
    },
});

function transformCode(code: string) {
    let tagNameDefinitions = safeMatch(code, /tagName: '.+'/g);
    tagNameDefinitions.forEach((tagNameDefinition) => {
        code = code.replace(
            tagNameDefinition,
            tagNameDefinition.replace(/\: '(.+)'/, `: '$1-${randomString()}'`),
        );
    });
    tagNameDefinitions = safeMatch(code, /tagName: '.+'/g);
    const tagNames = tagNameDefinitions.map(
        (tagNameDefinition) => safeMatch(tagNameDefinition, /tagName: '(.+)'/)[1],
    );

    return {
        transformedCode: code.replace(/import [^;]+;/g, '').replace(/export/g, ''),
        tagNames,
    };
}
