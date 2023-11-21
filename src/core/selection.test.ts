import chai, { expect, assert } from 'chai'
import { fake } from 'sinon'
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);

import { Selection } from './selection'
import { createParagraphNode } from '../nodes/paragraph'
import { TextNode, createTextNode } from '../nodes/text'
import { createRootNode } from '../nodes/root'
import { GroupNode } from './tree'
import { createBoldNode } from '../nodes/bold'

describe("selection", () => {
    it("Selection should be created", () => {
        const selection = new Selection()
        expect(selection).to.be.instanceOf(Selection)
    })

    it("sliceTextNode should return correct result (text, left slice)", () => {        
        const tree = createRootNode([
            createTextNode('Hello world')
        ])

        const text = tree.children[0] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 5, 'left');

        expect(newNode).to.containSubset({ type: 'token', text: 'Hello' });

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'Hello' },
                { type: 'token', text: ' world' },
            ],
        })
    })

    it("sliceTextNode should return correct result (text, right slice)", () => {        
        const tree = createRootNode([
            createTextNode('Hello world')
        ])

        const text = tree.children[0] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 5, 'right');

        expect(newNode).to.containSubset({ type: 'token', text: ' world' });

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'Hello' },
                { type: 'token', text: ' world' },
            ],
        })
    })

    it("sliceTextNode should return correct result (text inside bold, left slice)", () => {        
        const tree = createRootNode([
            createBoldNode([
                createTextNode('Hello world')
            ])
        ])

        const bold = tree.children[0] as GroupNode;
        const text = bold.children[0] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 5, 'left');

        expect(newNode).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'Hello' },
            ],
        })

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { 
                    type: 'group',
                    children: [
                        { type: 'token', text: 'Hello' },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: ' world' },
                    ],
                }
            ]
        })
    })

    it("sliceTextNode should return correct result (text inside bold, right slice)", () => {        
        const tree = createRootNode([
            createBoldNode([
                createTextNode('Hello world')
            ])
        ])

        const bold = tree.children[0] as GroupNode;
        const text = bold.children[0] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 5, 'right');

        expect(newNode).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: ' world' },
            ],
        })

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { 
                    type: 'group',
                    children: [
                        { type: 'token', text: 'Hello' },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: ' world' },
                    ],
                }
            ]
        })
    })
    
    it("sliceTextNode should return correct result (text inside bold inside bold, left slice)", () => {        
        const tree = createRootNode([
            createBoldNode([
                createBoldNode([
                    createTextNode('Hello world')
                ])
            ])
        ])

        const bold1 = tree.children[0] as GroupNode;
        const bold2 = bold1.children[0] as GroupNode;
        const text = bold2.children[0] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 5, 'left');

        expect(newNode).to.containSubset({
            type: 'group',
            children: [
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'Hello' },
                    ],
                },
            ]
        })

        expect(result).to.containSubset({
            type: 'group',
            children: [
                {
                    type: 'group',
                    children: [
                        { 
                            type: 'group',
                            children: [
                                { type: 'token', text: 'Hello' },
                            ],
                        },
                    ]
                },
                {
                    type: 'group',
                    children: [
                        { 
                            type: 'group',
                            children: [
                                { type: 'token', text: ' world' },
                            ],
                        },
                    ]
                },
            ]
        })
    })

    it("sliceTextNode should return correct result (text inside bold inside bold, right slice)", () => {        
        const tree = createRootNode([
            createBoldNode([
                createBoldNode([
                    createTextNode('Hello world')
                ])
            ])
        ])

        const bold1 = tree.children[0] as GroupNode;
        const bold2 = bold1.children[0] as GroupNode;
        const text = bold2.children[0] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 5, 'right');

        expect(newNode).to.containSubset({
            type: 'group',
            children: [
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: ' world' },
                    ],
                },
            ]
        })

        expect(result).to.containSubset({
            type: 'group',
            children: [
                {
                    type: 'group',
                    children: [
                        { 
                            type: 'group',
                            children: [
                                { type: 'token', text: 'Hello' },
                            ],
                        },
                    ]
                },
                {
                    type: 'group',
                    children: [
                        { 
                            type: 'group',
                            children: [
                                { type: 'token', text: ' world' },
                            ],
                        },
                    ]
                },
            ]
        })
    })

    it("sliceTextNode should return correct result (text inside bold, many flat sublings, left slice)", () => {        
        const tree = createRootNode([
            createBoldNode([
                createTextNode('AAAA'),
                createTextNode('BBBB'),
                createTextNode('YYCC'),
                createTextNode('DDDD'),
                createTextNode('EEEE'),
            ])
        ])

        const bold = tree.children[0] as GroupNode;
        const text = bold.children[2] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 2, 'left');

        expect(newNode).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'AAAA' },
                { type: 'token', text: 'BBBB' },
                { type: 'token', text: 'YY' },
            ],
        })

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { 
                    type: 'group',
                    children: [
                        { type: 'token', text: 'AAAA' },
                        { type: 'token', text: 'BBBB' },
                        { type: 'token', text: 'YY' },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'CC' },
                        { type: 'token', text: 'DDDD' },
                        { type: 'token', text: 'EEEE' },
                    ],
                },
            ]
        })
    })

    it("sliceTextNode should return correct result (text inside bold, many flat sublings, right slice)", () => {        
        const tree = createRootNode([
            createBoldNode([
                createTextNode('AAAA'),
                createTextNode('BBBB'),
                createTextNode('YYCC'),
                createTextNode('DDDD'),
                createTextNode('EEEE'),
            ])
        ])

        const bold = tree.children[0] as GroupNode;
        const text = bold.children[2] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 2, 'right');

        expect(newNode).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'CC' },
                { type: 'token', text: 'DDDD' },
                { type: 'token', text: 'EEEE' },
            ],
        })

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { 
                    type: 'group',
                    children: [
                        { type: 'token', text: 'AAAA' },
                        { type: 'token', text: 'BBBB' },
                        { type: 'token', text: 'YY' },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'CC' },
                        { type: 'token', text: 'DDDD' },
                        { type: 'token', text: 'EEEE' },
                    ],
                },
            ]
        })
    })

    
    it("sliceTextNode should return correct result (text inside bold, many tree sublings, left slice)", () => {        
        const tree = createRootNode([
            createBoldNode([
                createBoldNode([
                    createTextNode('AAAA'),
                    createTextNode('BBBB'),
                ]),
                createTextNode('YYCC'),
                createBoldNode([
                    createTextNode('DDDD'),
                    createTextNode('EEEE'),
                ])
            ])
        ])

        const bold = tree.children[0] as GroupNode;
        const text = bold.children[1] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 2, 'left');

        expect(newNode).to.containSubset({
            type: 'group',
            children: [
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'AAAA' },
                        { type: 'token', text: 'BBBB' },
                    ]
                },
                { type: 'token', text: 'YY' },
            ],
        })

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { 
                    type: 'group',
                    children: [
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'AAAA' },
                                { type: 'token', text: 'BBBB' },
                            ]
                        },
                        { type: 'token', text: 'YY' },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'CC' },
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'DDDD' },
                                { type: 'token', text: 'EEEE' },
                            ]
                        }
                    ],
                },
            ]
        })
    })

    it("sliceTextNode should return correct result (text inside bold, many tree sublings, right slice)", () => {        
        const tree = createRootNode([
            createBoldNode([
                createBoldNode([
                    createTextNode('AAAA'),
                    createTextNode('BBBB'),
                ]),
                createTextNode('YYCC'),
                createBoldNode([
                    createTextNode('DDDD'),
                    createTextNode('EEEE'),
                ])
            ])
        ])

        const bold = tree.children[0] as GroupNode;
        const text = bold.children[1] as TextNode;

        const selection = new Selection();
        const { result, newNode } = selection.sliceTextNode(tree, tree, text, 2, 'right');

        expect(newNode).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'CC' },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'DDDD' },
                        { type: 'token', text: 'EEEE' },
                    ]
                }
            ],
        })

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { 
                    type: 'group',
                    children: [
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'AAAA' },
                                { type: 'token', text: 'BBBB' },
                            ]
                        },
                        { type: 'token', text: 'YY' },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'CC' },
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'DDDD' },
                                { type: 'token', text: 'EEEE' },
                            ]
                        }
                    ],
                },
            ]
        })
    })
})