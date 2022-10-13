import {assign, css, defineElementNoInputs, html, listen} from 'element-vir';
import {pickIf} from '../directives/pick-if';
import {VirEditor} from './vir-editor.element';
import {VirElementViewer} from './vir-element-viewer.element';

const initialText: string = `import {defineElement, html, css} from 'element-vir';

export const MyElement = defineElement<{text: string}>()({
    tagName: 'my-element',
    styles: css\`
        :host {
            display: inline-block;
            padding: 4px;
            border: 2px solid dodgerblue;
            border-radius: 4px;   
        }
    \`,
    renderCallback: ({inputs}) => {
        return html\`
            hello there
        \`;
    },
});

export const MyElement2 = defineElement<{text: string}>()({
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
            hello there 2
        \`;
    },
});

`;

export const VirApp = defineElementNoInputs({
    tagName: 'vir-app',
    stateInit: {
        code: '',
        editorLoaded: false,
    },
    styles: css`
        :host {
            display: flex;
            align-items: stretch;
            gap: 16px;
        }

        ${VirElementViewer} {
            flex-grow: 1;
        }

        .editor-spacer {
            height: 800px;
            width: 800px;
        }
    `,
    renderCallback: ({state, updateState}) => {
        return html`
            ${pickIf(
                state.editorLoaded,
                html`
                    <div class="editor-spacer"></div>
                `,
            )}
            <${VirEditor}
                ${assign(VirEditor, {
                    initialText,
                })}
                ${listen(VirEditor.events.codeChange, (event) => {
                    updateState({
                        code: event.detail,
                    });
                })}
                ${listen(VirEditor.events.loadedChange, (event) => {
                    updateState({
                        editorLoaded: event.detail,
                    });
                })}
            ></${VirEditor}>
            <${VirElementViewer}
                ${assign(VirElementViewer, {
                    code: state.code,
                })}
            ></${VirElementViewer}>
        `;
    },
});
