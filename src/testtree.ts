import { createBoldNode } from "./nodes/bold";
import { createColumnsNode } from "./nodes/columns";
import { createContainerNode } from "./nodes/container";
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

    createColumnsNode([
        createContainerNode([
            createHeaderNode('Column 1', HeaderLevel.H4),
            createParagraphNode([
                createBoldNode([
                    createTextNode('Nostrud occaecat ex consequat ad aliqua aute consectetur irure quis ut. Laborum officia laborum in sit ad sunt veniam occaecat labore aliquip voluptate proident. Minim anim consectetur proident cillum aliquip qui cillum exercitation culpa proident in et incididunt. Culpa cupidatat qui eiusmod consectetur ex ut veniam tempor tempor.')
                ]),
            ]),
            createParagraphNode([
                createBoldNode([
                    createItalicNode([
                        createTextNode('Nostrud occaecat ex consequat ad aliqua aute consectetur irure quis ut. Laborum officia laborum in sit ad sunt veniam occaecat labore aliquip voluptate proident. Minim anim consectetur proident cillum aliquip qui cillum exercitation culpa proident in et incididunt. Culpa cupidatat qui eiusmod consectetur ex ut veniam tempor tempor.'),
                    ]),
                ]),
            ]),
            createParagraphNode([
                createTextNode('Nostrud occaecat ex consequat ad aliqua aute consectetur irure quis ut. Laborum officia laborum in sit ad sunt veniam occaecat labore aliquip voluptate proident. Minim anim consectetur proident cillum aliquip qui cillum exercitation culpa proident in et incididunt. Culpa cupidatat qui eiusmod consectetur ex ut veniam tempor tempor.'),
            ]),
            createParagraphNode([
                createTextNode('Nostrud occaecat ex consequat ad aliqua aute consectetur irure quis ut. Laborum officia laborum in sit ad sunt veniam occaecat labore aliquip voluptate proident. Minim anim consectetur proident cillum aliquip qui cillum exercitation culpa proident in et incididunt. Culpa cupidatat qui eiusmod consectetur ex ut veniam tempor tempor.'),
            ]),
        ]),

        createContainerNode([
            createHeaderNode('Column 2', HeaderLevel.H4),
            createParagraphNode([
                createTextNode('1 Text prepend '),
                createBoldNode([
                    createTextNode('1 bold text prepend '),
                    createItalicNode([
                        createTextNode('1 bold italic text '),
                    ]),
                    createTextNode('1 bold text append '),
                ]),
                createTextNode('1 Text append '),
                createTextNode('2 Text prepend '),
                createBoldNode([
                    createTextNode('2 bold text prepend '),
                    createItalicNode([
                        createTextNode('2 bold italic text '),
                    ]),
                    createTextNode('2 bold text append '),
                ]),
                createTextNode('2 Text append '),
            ]),
        ]),

        createContainerNode([
            createHeaderNode('Column 3', HeaderLevel.H4),
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
])
