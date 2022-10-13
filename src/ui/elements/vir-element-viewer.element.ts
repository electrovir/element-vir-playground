import {randomString, safeMatch} from 'augment-vir';
import * as elementVir from 'element-vir';
import {css, defineElement, html} from 'element-vir';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

(window as any).elementVir = elementVir;

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
        console.log('evaling code', transformedCode);
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
        transformedCode: code
            .replace(/import [^;]+;/g, '')
            .replace(/export/g, '')
            .replace(/ html\s*`/g, ' window.elementVir.html`')
            .replace(/(\W)assign\s*\(/g, '$1window.elementVir.assign(')
            .replace(/(\W)listen\s*\(/g, '$1window.elementVir.listen('),
        tagNames,
    };
}
