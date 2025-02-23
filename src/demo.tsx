import { useRef, useState } from 'react';
import s from './demo.module.scss'
import { TreeCombobox } from './components/TreeCombobox';
import type { RenderItemProps, TreeNode, RenderInputProps } from './components/TreeCombobox';
import { Item } from './components/Item';

import { data as initialData } from './data';
import { Button, Divider, Input, InputRef } from 'antd';
import { CirclePlus } from 'lucide-react';

export const Demo = () => {

    const antInputRef = useRef<InputRef>(null);

    const [data,] = useState(initialData);
    const [customStyleValue, setCustomStyleValue] = useState('');

    const handleSelect = (node: TreeNode, parentPath: TreeNode[], key?: string) => {
        console.log('Selected:', node, 'parentPath:', parentPath, 'key', key);
    };

    const handleExpand = (node: TreeNode) => {
        console.log('Expanded node:', node);
    };

    const handleTransferControlBack = () => {
        antInputRef.current?.focus();
    }

    const renderItem = (props: RenderItemProps<TreeNode>) => (
        <Item  {...props} />
    );

    const renderFooter = () => (
        <>
            <Button icon={<CirclePlus />}>Добавить новую фразу</Button>
        </>
    )

    return (
        <div className={s.container}>
            <h1 className={s.title}>Справочник МКБ-10</h1>
            <div className={s.input_container}>
                <h3>Кастомный стиль</h3>
                <TreeCombobox
                    data={data}
                    value={customStyleValue}
                    width={'50%'}
                    placeholder="Поиск по справочнику..."
                    onSelect={handleSelect}
                    onChange={setCustomStyleValue}
                    onExpand={handleExpand}
                    onTransferControlBack={handleTransferControlBack}
                    renderItem={renderItem}
                    renderFooter={renderFooter}
                >
                    {(inputProps) => (
                        <Input ref={antInputRef} {...inputProps} />
                    )}
                </TreeCombobox>
            </div>
        </div>
    );
}