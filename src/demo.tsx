import { useEffect, useRef, useState } from 'react';
import s from './demo.module.scss'
import { TreeCombobox } from './components/TreeCombobox';
import { RenderItemProps, TreeNode, RenderInputProps, TreeNodeType } from './components/TreeCombobox';
import { Item } from './components/Item';
import { InputRef, Spin } from 'antd';
import { Button, Divider, Input } from 'antd';
import { CirclePlus } from 'lucide-react';
import { useGetHandbook } from './useGetHandbook';

export const Demo = () => {
    const antInputRef = useRef<InputRef>(null);
    const [search, setSearch] = useState('');

    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);


    const { data, isLoading, refresh } = useGetHandbook(search);


    useEffect(() => {
        if (search && data.length > 0) {
            const newExpandedIds = new Set<string>();
            
            const collectExpandedIds = (node: TreeNode, parents: TreeNode[] = []) => {
                if (node.type === TreeNodeType.NODE && node.children && node.children.length > 0) {
                    newExpandedIds.add(node.id);
                    parents.forEach(parent => newExpandedIds.add(parent.id));
                    node.children.forEach(child => 
                        collectExpandedIds(child, [...parents, node])
                    );
                }
            };

            data.forEach(node => collectExpandedIds(node));
            setExpandedNodes(newExpandedIds);
        }
    }, [data, search]);

    // setIsDropdownVisible(filtered.length > 0);

    // if (filtered.length > 0) {
    //     const findFirstMatch = (nodes: TreeNode[]): string | null => {
    //         for (const node of nodes) {
    //             if (node.label.toLowerCase().includes(search.toLowerCase())) {
    //                 return node.id;
    //             }
    //             if (node.type === TreeNodeType.NODE && node.children?.length) {
    //                 const childMatch = findFirstMatch(node.children as TreeNode[]);
    //                 if (childMatch) return childMatch;
    //             }
    //         }
    //         return null;
    //     };

    //     const firstMatchId = findFirstMatch(filtered);
    //     if (firstMatchId) {
    //         setFocusedNodeId(firstMatchId);
    //     }
    // }


    const handleSelect = (node: TreeNode, parentPath: TreeNode[], key?: string) => {
        console.log('Selected:', node, 'parentPath:', parentPath, 'key', key);
    };

    const handleExpand = (nodeId: string) => {
        setExpandedNodes(prev => new Set([...prev, nodeId]));
    };

    const handleCollapse = (nodeId: string) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            newSet.delete(nodeId);
            return newSet;
        });
    };

    const handleTransferControlBack = () => {
        antInputRef.current?.focus();
    };

    const renderItem = (props: RenderItemProps<TreeNode>) => (
        <Item {...props} />
    );

    const renderFooter = () => (
        <Button icon={<CirclePlus />}>Добавить новую фразу</Button>
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.startsWith('Arrow')) {
                antInputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={s.container}>
            <h1 className={s.title}>Справочник МКБ-10</h1>
            <div className={s.input_container}>
                <h3>Кастомный стиль</h3>
                {isLoading && <Spin />}
                <TreeCombobox
                    tree={data}
                    expandedNodes={expandedNodes}
                    searchTerm={search}
                    onSearch={setSearch}
                    width={'50%'}
                    onSelect={handleSelect}
                    onExpand={handleExpand}
                    onCollapse={handleCollapse}
                    onTransferControlBack={handleTransferControlBack}
                    onForceUpdate={refresh}
                    renderItem={renderItem}
                    renderFooter={renderFooter}
                >
                    {(props: RenderInputProps) => (
                        <Input
                            ref={antInputRef}
                            placeholder="Поиск по справочнику..."
                            {...props}
                        />
                    )}
                </TreeCombobox>
            </div>
        </div>
    );
};