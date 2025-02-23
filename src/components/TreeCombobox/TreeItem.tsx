import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { TreeItemProps } from './types';

const ItemContainer = styled.div<{ level: number; isSelected: boolean; isFocused: boolean }>`
  padding: 6px 12px;
  padding-left: ${props => props.level * 20 + 12}px;
  cursor: pointer;
  background-color: ${props => {
    if (props.isSelected) return '#E6F7FF';
    if (props.isFocused) return '#F0F7FF';
    return 'transparent';
  }};
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  margin: 1px 0;
  position: relative;
  min-height: 32px;
  border: 1px solid transparent;
  border-color: ${props => {
    if (props.isSelected) return '#1890ff';
    if (props.isFocused) return '#91d5ff';
    return 'transparent';
  }};

  &:hover {
    background-color: ${props => {
    if (props.isSelected) return '#E6F7FF';
    if (props.isFocused) return '#F0F7FF';
    return '#F5F5F5';
  }};
    .actions {
      opacity: 1;
    }
  }
`;

export const TreeItem: React.FC<TreeItemProps> = ({
  node,
  searchTerm,
  level,
  isSelected,
  isFocused,
  isExpanded,
  onSelect,
  onExpand,
  onCollapse,
  onAdd,
  onEdit,
  onDelete,

  renderItem
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [isFocused]);

  const hasChildren: boolean = Boolean(node.children && node.children.length > 0);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      isExpanded ? onCollapse(node) : onExpand(node);
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd?.(node);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(node);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(node);
  };


  const item = renderItem({
    node,
    onAdd: handleAdd,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onExpand: handleExpandClick,

    isExpanded,
    hasChildren
  })

  return (
    <>
      <ItemContainer
        ref={itemRef}
        level={level}
        isSelected={isSelected}
        isFocused={isFocused}
        onClick={() => onSelect(node)}
      >
        {item}
      </ItemContainer>
    </>
  );
};
