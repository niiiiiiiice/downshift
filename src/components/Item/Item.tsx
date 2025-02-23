import React from "react";


import { Folder, FolderOpen } from 'lucide-react';
import { RenderItemProps } from '../TreeCombobox/types';
import { Label, ExpandIconWrapper, ActionsContainer, ActionButton } from './Item.styled';


type ItemPorps = RenderItemProps;

export const Item: React.FC<ItemPorps> = (
  {
    node,

    onAdd,
    onEdit,
    onDelete,

    onExpand,
    isExpanded,
    hasChildren
  }) => {

  return (
    <>

      {hasChildren && (
        <ExpandIconWrapper onClick={onExpand}>
          {!isExpanded ? <Folder /> : <FolderOpen />}
        </ExpandIconWrapper>
      )}
      <Label maxLines={2}>
        {node.label}
      </Label>
      {node.isEditable && (
        <ActionsContainer className="actions">
          <ActionButton onClick={onAdd}>
            <span>+</span>
            Добавить
          </ActionButton>
          <ActionButton onClick={onEdit}>
            <span>✎</span>
            Изменить
          </ActionButton>
          <ActionButton onClick={onDelete}>
            <span>×</span>
            Удалить
          </ActionButton>
        </ActionsContainer>
      )}
    </>
  )
}