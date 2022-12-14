import * as TypeScriptSandbox from '@typescript/sandbox';
import {randomString} from 'augment-vir';
import {defineElement, defineElementEvent, html, onDomCreated} from 'element-vir';
import * as monaco from 'monaco-editor';
import {storeCode} from '../../data/get-initial-code';
import {addEventListeners} from '../directives/add-event-listeners';

function getGlobalEditorPromise(): Promise<{
    sandbox: typeof TypeScriptSandbox;
    monaco: Parameters<typeof TypeScriptSandbox['createTypeScriptSandbox']>[1];
    ts: Parameters<typeof TypeScriptSandbox['createTypeScriptSandbox']>[2];
}> {
    return (window as any).editorPromise ?? Promise.reject('editor promise was not set');
}

const debounceTimeout = 1000;

export const VirEditor = defineElement<{initialText: string}>()({
    tagName: 'vir-editor',
    stateInit: {
        loading: true,
        editorElement: undefined as undefined | HTMLDivElement,
        sandbox: undefined as
            | undefined
            | ReturnType<typeof TypeScriptSandbox['createTypeScriptSandbox']>,
        debounceTimestamp: undefined as undefined | number,
    },
    events: {
        codeChange: defineElementEvent<string>(),
        loadedChange: defineElementEvent<boolean>(),
    },
    renderCallback: ({state, inputs, updateState, events, dispatch}) => {
        function emitCode() {
            if (!state.sandbox) {
                return;
            }
            if (
                state.debounceTimestamp != undefined &&
                Date.now() - state.debounceTimestamp < debounceTimeout
            ) {
                return;
            }

            updateState({debounceTimestamp: Date.now()});

            setTimeout(async () => {
                updateState({debounceTimestamp: undefined});
                if (!state.sandbox) {
                    return;
                }
                storeCode(state.sandbox.getText());
                const result = await state.sandbox.getEmitResult();
                const outputText = result.outputFiles[0]?.text;
                if (!outputText) {
                    throw new Error(`no output text`);
                }

                dispatch(new events.codeChange(outputText));
            }, debounceTimeout);
        }

        return state.loading
            ? html`
                  <div
                      ${onDomCreated(async (element) => {
                          const editorElement = document.createElement('div');
                          editorElement.id = randomString();
                          editorElement.style.width = '800px';
                          editorElement.style.height = '800px';
                          editorElement.style.border = '1px solid black';
                          editorElement.style.position = 'fixed';
                          editorElement.style.top = '0';
                          editorElement.style.left = '0';
                          editorElement.style.visibility = 'hidden';
                          document.body.appendChild(editorElement);
                          const editorParams = await getGlobalEditorPromise();
                          const sandbox = editorParams.sandbox.createTypeScriptSandbox(
                              {
                                  text: inputs.initialText,
                                  compilerOptions: {
                                      module: monaco.languages.typescript.ModuleKind.ES2015,
                                  },
                                  domID: editorElement.id,
                                  logger: {
                                      error: console.error,
                                      log: () => {},
                                      groupCollapsed: () => {},
                                      groupEnd: () => {},
                                  },
                              },
                              editorParams.monaco,
                              editorParams.ts,
                          );
                          sandbox.editor.focus();
                          addEventListeners(
                              editorElement,
                              [
                                  'input',
                                  'paste',
                                  'cut',
                                  'change',
                                  'keyup',
                              ],
                              async () => {
                                  await emitCode();
                              },
                          );
                          updateState({
                              editorElement,
                              sandbox,
                              loading: false,
                          });
                          editorElement.style.visibility = 'visible';
                          dispatch(new events.loadedChange(true));
                          emitCode();
                      })}
                  >
                      Loading...
                  </div>
              `
            : html``;
    },
});
