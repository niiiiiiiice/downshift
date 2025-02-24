import { TreeNode, TreeNodeType } from "./components/TreeCombobox";

export const data: TreeNode[] = [
    {
        id: '1',
        label: 'МКБ-10 Болезни нервной системы',
        type: TreeNodeType.NODE,
        children: [
            {
                id: '1.1',
                label: 'G00-G09 Воспалительные болезни центральной нервной системы',
                type: TreeNodeType.NODE,
                description: 'Подробное описание воспалительных заболеваний ЦНС, включая менингит, энцефалит и миелит.',
                children: [
                    {
                        id: '1.1.1',
                        label: 'G00 Бактериальный менингит, не классифицированный в других рубриках',
                        type: TreeNodeType.NODE,
                        description: 'Включая: арахноидит бактериальный, лептоменингит бактериальный, менингит бактериальный, пахименингит бактериальный',
                        children: [
                            {
                                id: '1.1.1.1',
                                label: '(H45.0*) Кровоизлияние в стекловидное тело при болезнях, классифицированных в других рубриках',
                                type: TreeNodeType.LEAF
                            },
                            {
                                id: '1.1.1.2',
                                label: 'G00.9 Менингит неуточнённый',
                                type: TreeNodeType.LEAF
                            }
                        ]
                    },
                    {
                        id: '1.1.2',
                        label: 'G01 Менингит при бактериальных болезнях, классифицированных в других рубриках',
                        type: TreeNodeType.LEAF,
                        // children: [
                        //     {
                        //         id: '1.1.2.1',
                        //         label: 'G01 G10-G14 Системные атрофии, поражающие преимущественно центральную нервную систему',
                        //         type: TreeNodeType.LEAF
                        //     },
                        // ]
                    },
                    {
                        id: '1.1.3',
                        label: 'G02 Менингит при других инфекционных и паразитарных болезнях, классифицированных в других рубриках',
                        type: TreeNodeType.LEAF
                    },
                    {
                        id: '1.1.4',
                        label: 'G03 Менингит неинфекционный',
                        type: TreeNodeType.LEAF
                    },
                    {
                        id: '1.1.5',
                        label: 'G04 Энцефалит, миелит и энцефаломиелит',
                        type: TreeNodeType.LEAF
                    }
                ]
            },
            {
                id: '1.2',
                label: 'G10-G14 Системные атрофии, поражающие преимущественно центральную нервную систему',
                type: TreeNodeType.NODE,
                children: [
                    {
                        id: '1.2.1',
                        label: 'G10 Болезнь Гентингтона',
                        description: 'Хорея Гентингтона',
                        type: TreeNodeType.LEAF,
                    },
                    {
                        id: '1.2.2',
                        label: 'G11 Наследственная атаксия',
                        type: TreeNodeType.LEAF
                    },
                    {
                        id: '1.2.3',
                        label: 'G12 Спинальная мышечная атрофия и родственные синдромы',
                        type: TreeNodeType.LEAF
                    },
                    {
                        id: '1.2.4',
                        label: 'G13 Системные атрофии, поражающие преимущественно центральную нервную систему, при других болезнях',
                        type: TreeNodeType.LEAF
                    }
                ]
            },
            {
                id: '1.3',
                label: 'G20-G26 Экстрапирамидные и другие двигательные нарушения',
                type: TreeNodeType.NODE,
                children: [
                    {
                        id: '1.3.1',
                        label: 'G20 Болезнь Паркинсона',
                        type: TreeNodeType.LEAF
                    },
                    {
                        id: '1.3.2',
                        label: 'G21 Вторичный паркинсонизм',
                        type: TreeNodeType.LEAF
                    },
                    {
                        id: '1.3.3',
                        label: 'G22 Паркинсонизм при других болезнях',
                        type: TreeNodeType.LEAF
                    },
                    {
                        id: '1.3.4',
                        label: 'G23 Другие дегенеративные болезни базальных ганглиев',
                        type: TreeNodeType.LEAF
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        label: 'МКБ-10 Выбор за тобой',
        type: TreeNodeType.NODE,
        children: [
            {
                id: '2.1',
                label: 'G10 Болезнь Гентингтона',
                type: TreeNodeType.LEAF,
                description: 'Хорея Гентингтона'
            },
            {
                id: '2.2',
                label: 'G11 Наследственная атаксия',
                type: TreeNodeType.LEAF
            },
            {
                id: '2.3',
                label: 'G12 Спинальная мышечная атрофия и родственные синдромы',
                type: TreeNodeType.LEAF
            },
            {
                id: '2.4',
                label: 'G13 Системные атрофии, поражающие преимущественно центральную нервную систему, при других болезнях',
                type: TreeNodeType.LEAF,
            }
        ]
    },
    {
        id: '3',
        label: 'МКБ-10 Болезни с башкой',
        type: TreeNodeType.NODE,
        children: [
            {
                id: '3.1',
                label: 'G20 Болезнь Паркинсона',
                type: TreeNodeType.LEAF,
            },
            {
                id: '3.2',
                label: 'G21 Вторичный паркинсонизм',
                type: TreeNodeType.LEAF,
            },
            {
                id: '3.3',
                label: 'G22 Паркинсонизм при других болезнях',
                type: TreeNodeType.NODE,
                children: [
                    {
                        id: '.3.1',
                        label: 'G23 Другие дегенеративные болезни базальных ганглиев',
                        type: TreeNodeType.LEAF,
                    }
                ]
            }
        ]
    }
];
