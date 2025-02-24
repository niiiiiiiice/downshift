import React from "react";
import s from './Item.module.scss';
import { Folder, FolderOpen } from 'lucide-react';
import { RenderItemProps, TreeNode, TreeNodeType } from '../TreeCombobox';
import { ExpandIconWrapper } from './Item.styled';
import { Typography } from "antd";
import cn from "classnames";


export const Item: React.FC<RenderItemProps<TreeNode>> = (
  {
    node,
    isExpanded,
    isFocused,
    onSelect,
    onCollapse,
    onExpand,
  }) => {

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isExpanded) {
      onExpand(e);
    } else {
      onCollapse(e);
    }
  }

  return (
    <div
      className={cn(s.container, {
        [s.focudes]: isFocused
      })}
    >
      {node.type === TreeNodeType.NODE && (
        <ExpandIconWrapper onClick={handleExpandClick}>
          {!isExpanded ? <Folder /> : <FolderOpen />}
        </ExpandIconWrapper>
      )}
      <Typography.Paragraph style={{ flex: 1, margin: 0 }} ellipsis={{ rows: 2, tooltip: true }}>
        {node.label}
      </Typography.Paragraph>
    </div>
  )
}