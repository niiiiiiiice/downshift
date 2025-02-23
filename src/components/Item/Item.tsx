import React from "react";
import s from './Item.module.scss';
import { EllipsisVertical, Folder, FolderOpen } from 'lucide-react';
import { RenderItemProps, TreeNode } from '../TreeCombobox/Model/types';
import { Label, ExpandIconWrapper } from './Item.styled';
import { Button, Typography } from "antd";
import cn from "classnames";


export const Item: React.FC<RenderItemProps<TreeNode>> = (
  {
    node,
    isExpanded,
    isFocused,
    hasChildren,
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
      onClick={() => { }}
    >
      {hasChildren && (
        <ExpandIconWrapper onClick={handleExpandClick}>
          {!isExpanded ? <Folder /> : <FolderOpen />}
        </ExpandIconWrapper>
      )}
      <Typography.Paragraph style={{ flex: 1, margin: 0 }} ellipsis={{ rows: 2, tooltip: true }}>
        {node.label}
      </Typography.Paragraph>
      {node.isEditable && (
        <Button type='text' icon={<EllipsisVertical color="#00000045"/>} />
      )}
    </div>
  )
}