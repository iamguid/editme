import { createBoldNode } from "./nodes/bold";
import { createColumnsNode } from "./nodes/columns";
import { createContainerNode } from "./nodes/container";
import { createEditorBlockNode } from "./nodes/editor-block/editor-block";
import { HeaderLevel, createHeaderNode } from "./nodes/header";
import { createItalicNode } from "./nodes/italic";
import { createParagraphNode } from "./nodes/paragraph";
import { RootNode, createRootNode } from "./nodes/root";
import { createTextNode } from "./nodes/text";

export const testtree: RootNode = createRootNode([
    createHeaderNode('Test Header 1', HeaderLevel.H1),
    createHeaderNode('Test Header 2', HeaderLevel.H2),
    createHeaderNode('Test Header 3', HeaderLevel.H3),
    createHeaderNode('Test Header 4', HeaderLevel.H4),
    createHeaderNode('Test Header 5', HeaderLevel.H5),
    createHeaderNode('Test Header 6', HeaderLevel.H6),

    createParagraphNode([
        createTextNode('test text'),
        createBoldNode([
            createItalicNode([
                createTextNode('bold italic')
            ]),
        ]),
    ]),

    createColumnsNode([
        createContainerNode([
            createHeaderNode('Column 1', HeaderLevel.H4),
            createParagraphNode([
                createTextNode('lorem ipsum dolor sit amet'),
            ]),
            createParagraphNode([
                createTextNode('lorem ipsum dolor sit amet'),
            ]),
            createParagraphNode([
                createTextNode('lorem ipsum dolor sit amet'),
            ]),
            createParagraphNode([
                createTextNode('lorem ipsum dolor sit amet'),
            ]),
        ]),
        createContainerNode([
            createHeaderNode('Column 2', HeaderLevel.H4),
            createParagraphNode([
                createTextNode('lorem ipsum dolor sit amet'),
            ]),
            createParagraphNode([
                createTextNode('lorem ipsum dolor sit amet'),
            ]),
            createParagraphNode([
                createTextNode('lorem ipsum dolor sit amet'),
            ]),
            createParagraphNode([
                createTextNode('lorem ipsum dolor sit amet'),
            ]),
        ]),
    ]),

    createEditorBlockNode([
        createTextNode('test text'),
    ]),
])
