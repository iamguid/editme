import {createContext} from '@lit/context';
import { Editor } from './core/editor';

export const editorContext = createContext<Editor>('editor');
