import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { TreeNode, TreeItemProps } from '../Model/types';

const ItemContainer = styled.div<{ $level: number; $isFocused: boolean }>`
  padding: 6px 12px;
  padding-left: ${props => props.$level * 20 + 12}px;
  cursor: pointer;
  background-color: ${props => {
    if (props.$isFocused) return '#F0F7FF';
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
    if (props.$isFocused) return '#91d5ff';
    return 'transparent';
  }};

  &:hover {
    background-color: ${props => {
    if (props.$isFocused) return '#F0F7FF';
    return '#F5F5F5';
  }};
    .actions {
      opacity: 1;
    }
  }
`;

export const TreeItem = <T extends TreeNode>({
  node,
  searchTerm,
  level,
  isFocused,
  isExpanded,
  onSelect,
  onExpand,
  onCollapse,
  renderItem
}: TreeItemProps<T>) => {
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

  const item = renderItem({
    node,
    isExpanded,
    hasChildren,
    onExpand: handleExpandClick,
  })

  return (
    <>
      <ItemContainer
        ref={itemRef}
        $level={level}
        $isFocused={isFocused}
        onClick={() => onSelect(node)}
      >
        {item}
      </ItemContainer>
    </>
  );
};
