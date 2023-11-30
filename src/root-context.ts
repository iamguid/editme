import {createContext} from '@lit/context';
import { Ref } from 'lit/directives/ref.js';

export const rootContext = createContext<Ref<HTMLDivElement>>('root');
