import chai, { expect } from 'chai'
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);

import { TextNode, createTextNode } from '../nodes/text'
import { createRootNode } from '../nodes/root'
import { GroupNode, sliceByTextNode, surround } from './tree'
import { createBoldNode } from '../nodes/bold'

describe("tree", () => {
    // #region surround
    it("surround should return correct result (left text, right text)", () => {
        const tree = createRootNode([
            createTextNode('Hello world')
        ])

        const text = tree.children[0] as TextNode;

        const result = surround(tree, text, text, 3, 9, createBoldNode());

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'Hel' },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'lo wor' },
                    ],
                },
                { type: 'token', text: 'ld' },
            ]
        })
    })

    it("surround should return correct result (left text, right tree)", () => {
        const tree = createRootNode([
            createTextNode('AABB'),
            createBoldNode([
                createTextNode('CCDD'),
            ]),
        ])

        const textA = tree.children[0] as TextNode;
        const bold = tree.children[1] as GroupNode;
        const textB = bold.children[0] as TextNode;

        const result = surround(tree, textA, textB, 2, 2, createBoldNode());

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'AA' },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'BB' },
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'CC' },
                            ],
                        },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'DD' },
                    ],
                },
            ]
        })
    })

    it("surround should return correct result (left tree, right text)", () => {
        const tree = createRootNode([
            createBoldNode([
                createTextNode('CCDD'),
            ]),
            createTextNode('AABB'),
        ])

        const bold = tree.children[0] as GroupNode;
        const textA = bold.children[0] as TextNode;
        const textB = tree.children[1] as TextNode;

        const result = surround(tree, textA, textB, 2, 2, createBoldNode());

        expect(result).to.containSubset({
            type: 'group',
            children: [
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'CC' },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'DD' },
                            ],
                        },
                        { type: 'token', text: 'AA' },
                    ],
                },
                { type: 'token', text: 'BB' },
            ]
        })
    })

    it("surround should return correct result (left tree, right tree)", () => { 
        const tree = createRootNode([
            createBoldNode([
                createTextNode('AABB'),
            ]),
            createBoldNode([
                createTextNode('CCDD'),
            ]),
        ])

        const boldA = tree.children[0] as GroupNode;
        const boldB = tree.children[1] as GroupNode;
        const textA = boldA.children[0] as TextNode;
        const textB = boldB.children[0] as TextNode;

        const result = surround(tree, textA, textB, 2, 2, createBoldNode());

        expect(result).to.containSubset({
            type: 'group',
            children: [
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'AA' },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'BB' },
                            ],
                        },
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'CC' },
                            ],
                        },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'DD' },
                    ],
                },
            ]
        })
    })
    
    it("surround should return correct result (left text, between text, right text)", () => { 
        const tree = createRootNode([
            createTextNode('AABB'),
            createTextNode('CCDD'),
            createTextNode('EEFF'),
        ])

        const textA = tree.children[0] as TextNode;
        const textB = tree.children[2] as TextNode;

        const result = surround(tree, textA, textB, 2, 2, createBoldNode());

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'AA' },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'BB' },
                        { type: 'token', text: 'CCDD' },
                        { type: 'token', text: 'EE' },
                    ],
                },
                { type: 'token', text: 'FF' },
            ]
        })
    })

    it("surround should return correct result (left tree, between tree, right tree)", () => { 
        const tree = createRootNode([
            createBoldNode([
                createTextNode('AABB'),
            ]),
            createBoldNode([
                createTextNode('CCDD'),
            ]),
            createBoldNode([
                createTextNode('EEFF'),
            ]),
        ])

        const boldA = tree.children[0] as GroupNode;
        const boldB = tree.children[2] as GroupNode;
        const textA = boldA.children[0] as TextNode;
        const textB = boldB.children[0] as TextNode;

        const result = surround(tree, textA, textB, 2, 2, createBoldNode());

        expect(result).to.containSubset({
            type: 'group',
            children: [
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'AA' },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'BB' },
                            ],
                        },
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'CCDD' },
                            ],
                        },
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'EE' },
                            ],
                        },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'FF' },
                    ],
                },
            ]
        })
    })

    it("surround should return correct result (left text, between tree, right text)", () => { 
        const tree = createRootNode([
            createTextNode('AABB'),
            createBoldNode([
                createTextNode('CCDD'),
            ]),
            createTextNode('EEFF'),
        ])

        const textA = tree.children[0] as TextNode;
        const textB = tree.children[2] as TextNode;

        const result = surround(tree, textA, textB, 2, 2, createBoldNode());

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'AA' },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'BB' },
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'CCDD' },
                            ],
                        },
                        { type: 'token', text: 'EE' },
                    ],
                },
                { type: 'token', text: 'FF' },
            ]
        })
    })

    it("surroundC should return correct result (left tree, between text, right tree)", () => {
        const tree = createRootNode([
            createBoldNode([
                createTextNode('AABB'),
            ]),
            createTextNode('CCDD'),
            createBoldNode([
                createTextNode('EEFF'),
            ]),
        ])

        const boldA = tree.children[0] as GroupNode;
        const boldB = tree.children[2] as GroupNode;
        const textA = boldA.children[0] as TextNode;
        const textB = boldB.children[0] as TextNode;

        const result = surround(tree, textA, textB, 2, 2, createBoldNode());

        expect(result).to.containSubset({
            type: 'group',
            children: [
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'AA' },
                    ]
                },
                {
                    type: 'group',
                    children: [
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'BB' },
                            ]
                        },
                        { type: 'token', text: 'CCDD' },
                        {
                            type: 'group',
                            children: [
                                { type: 'token', text: 'EE' },
                            ]
                        },
                    ],
                },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'FF' },
                    ]
                },
            ]
        })
    })

    it("surround should return correct result (left text, right text, select inside)", () => {
        const tree = createRootNode([
            createTextNode('AABB'),
            createTextNode('CCDD'),
            createTextNode('EEFF'),
        ])

        const text = tree.children[1] as TextNode;

        const result = surround(tree, text, text, 1, 3, createBoldNode());

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'AABB' },
                { type: 'token', text: 'C' },
                {
                    type: 'group',
                    children: [
                        { type: 'token', text: 'CD' },
                    ],
                },
                { type: 'token', text: 'D' },
                { type: 'token', text: 'EEFF' },
            ]
        })
    })
    // #endregion

    // #region sliceByTextNode
    it("sliceByTextNode should return correct result (text, left slice)", () => {
        const tree = createRootNode([
            createTextNode('Hello world')
        ])

        const text = tree.children[0] as TextNode;

        const { result, newNode } = sliceByTextNode(tree, tree, text, 5, 'left');

        expect(newNode).to.containSubset({ type: 'token', text: 'Hello' });

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'Hello' },
                { type: 'token', text: ' world' },
            ],
        })
    })

    it("sliceByTextNode should return correct result (text, right slice)", () => {
        const tree = createRootNode([
            createTextNode('Hello world')
        ])

        const text = tree.children[0] as TextNode;

        const { result, newNode } = sliceByTextNode(tree, tree, text, 5, 'right');

        expect(newNode).to.containSubset({ type: 'token', text: ' world' });

        expect(result).to.containSubset({
            type: 'group',
            children: [
                { type: 'token', text: 'Hello' },
                { type: 'token', text: ' world' },
            ],
        })
    })

    it("sliceByTextNode should return correct result (text inside bold, left slice)", () => {
        const tree = createRootNode([
            createBoldNode([
                createTextNode('Hello world')
            ])
        ])

        const bold = tree.children[0] as GroupNode;
        const text = bold.children[0] as TextNode;

        const { result, newNode } = sliceByTextNode(tree, tree, text, 5, 'left');

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

    it("sliceByTextNode should return correct result (text inside bold, right slice)", () => {
        const tree = createRootNode([
            createBoldNode([
                createTextNode('Hello world')
            ])
        ])

        const bold = tree.children[0] as GroupNode;
        const text = bold.children[0] as TextNode;

        const { result, newNode } = sliceByTextNode(tree, tree, text, 5, 'right');

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

    it("sliceByTextNode should return correct result (text inside bold inside bold, left slice)", () => {
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

        const { result, newNode } = sliceByTextNode(tree, tree, text, 5, 'left');

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

    it("sliceByTextNode should return correct result (text inside bold inside bold, right slice)", () => {
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

        const { result, newNode } = sliceByTextNode(tree, tree, text, 5, 'right');

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

    it("sliceByTextNode should return correct result (text inside bold, many flat sublings, left slice)", () => {
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

        const { result, newNode } = sliceByTextNode(tree, tree, text, 2, 'left');

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

    it("sliceByTextNode should return correct result (text inside bold, many flat sublings, right slice)", () => {
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

        const { result, newNode } = sliceByTextNode(tree, tree, text, 2, 'right');

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


    it("sliceByTextNode should return correct result (text inside bold, many tree sublings, left slice)", () => {
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

        const { result, newNode } = sliceByTextNode(tree, tree, text, 2, 'left');

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

    it("sliceByTextNode should return correct result (text inside bold, many tree sublings, right slice)", () => {
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

        const { result, newNode } = sliceByTextNode(tree, tree, text, 2, 'right');

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
    // #endregion
})