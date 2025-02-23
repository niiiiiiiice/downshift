import React from "react";


import { Folder, FolderOpen } from 'lucide-react';
import { RenderItemProps, TreeNode } from '../TreeCombobox/Model/types';
import { Label, ExpandIconWrapper} from './Item.styled';


export const Item: React.FC<RenderItemProps<TreeNode>> = (
  {
    node,
    isExpanded,
    hasChildren,
    onExpand,
  }) => {

  return (
    <>

      {hasChildren && (
        <ExpandIconWrapper onClick={onExpand}>
          {!isExpanded ? <Folder /> : <FolderOpen />}
        </ExpandIconWrapper>
      )}
      <Label>
        {node.label}
      </Label>
      {node.isEditable && (
        <span>Editable</span>
      )}
    </>
  )
}