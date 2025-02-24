import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { TreeNode, TreeItemProps } from '../Model/types';

const ItemContainer = styled.div<{ $level: number }>`
  padding-left: ${props => props.$level * 20 + 12}px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 1px 0;
  position: relative;
  
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

  const item = renderItem({
    node,
    isExpanded,
    isFocused,
    onSelect,
    onExpand: () => onExpand(node),
    onCollapse: () => onCollapse(node)
  })

  return (
    <>
      <ItemContainer
        ref={itemRef}
        $level={level}
      >
        {item}
      </ItemContainer>
    </>
  );
};
