import {assign, css, defineElementNoInputs, html, listen} from 'element-vir';
import {classMap} from 'lit/directives/class-map.js';
import {clearStoredCode, getInitialCode} from '../../data/get-initial-code';
import {pickIf} from '../directives/pick-if';
import {VirEditor} from './vir-editor.element';
import {VirElementViewer} from './vir-element-viewer.element';

export const VirApp = defineElementNoInputs({
    tagName: 'vir-app',
    stateInit: {
        code: '',
        editorLoaded: false,
    },
    styles: css`
        main {
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

        footer {
            margin: 32px;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            gap: 32px;
        }

        .hidden {
            display: none;
        }

        .github {
            height: 38px;
            width: 38px;
        }
    `,
    renderCallback: ({state, updateState}) => {
        return html`
            <main>
                ${pickIf(
                    state.editorLoaded,
                    html`
                        <div class="editor-spacer"></div>
                    `,
                )}
                <${VirEditor}
                    ${assign(VirEditor, {
                        initialText: getInitialCode(),
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
            </main>
            <footer class=${classMap({
                hidden: !state.editorLoaded,
            })}>
                <button
                    ${listen('click', () => {
                        clearStoredCode();
                        window.location.reload();
                    })}
                >reset</button>
                <a href="https://github.com/electrovir/element-vir-playground">
                    <img class="github" src="/github.svg" />
                </a>
            </footer>
        `;
    },
});
