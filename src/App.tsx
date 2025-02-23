import React, { useState } from 'react';
import styled from 'styled-components';
import { TreeCombobox } from './components/TreeCombobox';
import type { RenderItemProps, TreeNode, RenderInputProps } from './components/TreeCombobox';
import { Item } from './components/Item';
import { AntdInput, CustomInput, DarkInput, MaterialInput } from './components/Inputs';
import { Input } from 'antd';

import { data as initialData } from './data';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  margin-bottom: 24px;
`;

function App() {
    const [data, setData] = useState(initialData);
    const [customStyleValue, setCustomStyleValue] = useState('');
    const [materialStyleValue, setMaterialStyleValue] = useState('');
    const [darkStyleValue, setDarkStyleValue] = useState('');

    const handleSelect = (node: TreeNode) => {
        console.log('Selected:', node);
    };

    const handleExpand = (node: TreeNode) => {
        console.log('Expanded node:', node);
    };

    const handleAdd = (parentNode?: TreeNode) => {
        console.log('Add node to:', parentNode);
    };

    const handleEdit = (node: TreeNode) => {
        console.log('Edit node:', node);
    };

    const handleDelete = (node: TreeNode) => {
        console.log('Delete node:', node);
    };

    const renderItem = (props: RenderItemProps) => (
        <Item {...props} />
    );

    const renderCustomInput = ({ref, ...props}: RenderInputProps) => (
        <AntdInput ref={ref} {...props} />
    );

    const renderMaterialInput = ({ref, ...props}: RenderInputProps) => (
        <MaterialInput ref={ref} {...props} />
    );

    const renderDarkInput = ({ref, ...props}: RenderInputProps) => (
        <DarkInput ref={ref} {...props} />
    );

    return (
        <Container>
            <Title>Справочник МКБ-10</Title>
            <input 
                type="text" 
                value={customStyleValue}
            />
            <InputContainer>
                <h3>Кастомный стиль</h3>
                <TreeCombobox
                    data={data}
                    onSelect={handleSelect}
                    value={customStyleValue}
                    onChange={setCustomStyleValue}
                    onExpand={handleExpand}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    placeholder="Поиск по справочнику..."
                    maxResults={10}
                    showAddButton={true}
                    renderInput={renderCustomInput}
                    renderItem={renderItem}
                />
            </InputContainer>

            <InputContainer>
                <h3>Material стиль</h3>
                <TreeCombobox
                    data={data}
                    onSelect={handleSelect}
                    value={materialStyleValue}
                    onChange={setMaterialStyleValue}
                    onExpand={handleExpand}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    placeholder="Поиск по справочнику..."
                    maxResults={10}
                    showAddButton={true}
                    renderInput={renderMaterialInput}
                    renderItem={renderItem}
                />
            </InputContainer>

            <InputContainer>
                <h3>Темный стиль</h3>
                <TreeCombobox
                    data={data}
                    onSelect={handleSelect}
                    value={darkStyleValue}
                    onChange={setDarkStyleValue}
                    onExpand={handleExpand}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    placeholder="Поиск по справочнику..."
                    maxResults={10}
                    showAddButton={true}
                    renderInput={renderDarkInput}
                    renderItem={renderItem}
                />
            </InputContainer>
        </Container>
    );
}

export default App;