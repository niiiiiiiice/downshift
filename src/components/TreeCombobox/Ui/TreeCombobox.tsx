import React, { useState, useRef, useEffect } from 'react';
import s from './TreeCombobox.module.scss';
import { TreeNode, TreeComboboxProps, TreeNodeType } from '../Model';
import { TreeItem } from './TreeItem';
import cn from 'classnames';
import { useOutsideClick } from '../Model/useOutsideClick';

/**
 * Компонент TreeCombobox - это поле ввода с возможностью выбора
 * элемента из древовидного списка. 
 *
 * @template T - тип элементов дерева, должен расширять TreeNode
 */
export const TreeCombobox = <T extends TreeNode>({
  searchTerm,
  tree,
  expandedNodes,
  width,
  onSearch,
  onSelect,
  onExpand,
  onCollapse,
  onTransferControlBack,
  onQuit,
  onForceUpdate,
  renderItem,
  renderHeader,
  renderFooter,
  children: renderInput,
}: TreeComboboxProps<T>): React.ReactElement => {

  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownControlled, setIsDropdownControlled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Функция возвращает массив видимых элементов дерева.
   * В visibleNodes попадают только элементы, которые
   * не скрыты родительскими узлами.
   * @param nodes - массив узлов дерева
   * @returns массив видимых узлов
   */
  const getVisibleNodes = (nodes: T[]): T[] => {
    const result: T[] = [];

    const traverse = (node: T) => {
      result.push(node);
      if (node.type === TreeNodeType.NODE && expandedNodes.has(node.id)) {
        (node.children as T[]).forEach(traverse);
      }
    };

    nodes.forEach(traverse);
    return result;
  };

  /**
   * Функция для построения пути к узлу (хлебных крошек)
   * @param nodeId - идентификатор узла
   * @param nodes - массив узлов дерева
   * @returns массив узлов, представляющих путь к узлу
   */
  const buildNodePath = (nodeId: string, nodes: T[]): T[] => {
    const path: T[] = [];

    const traverse = (currentNodes: T[], currentPath: T[]): boolean => {
      for (const node of currentNodes) {
        if (node.id === nodeId) {
          path.push(...currentPath, node);
          return true;
        }

        if (node.type === TreeNodeType.NODE) {
          if (traverse(node.children as T[], [...currentPath, node])) {
            return true;
          }
        }
      }
      return false;
    };

    traverse(nodes, []);
    return path;
  };


  /**
 * Функция для поиска родительского узла.
 * @param nodeId - идентификатор узла, для которого нужно найти родителя.
 * @param nodes - массив узлов дерева.
 * @returns Родительский узел, если он найден, или null, если родитель не найден.
 */
  const findParentNode = (nodeId: string, nodes: T[]): T | null => {
    for (const node of nodes) {
      if (node.type === TreeNodeType.NODE && node.children?.some(child => child.id === nodeId)) {
        return node;
      }
      if (node.type === TreeNodeType.NODE && expandedNodes.has(node.id)) {
        const parent = findParentNode(nodeId, node.children as T[]);
        if (parent) return parent;
      }
    }
    return null;
  };


  const quit = () => {
    if (isDropdownControlled) {
      setIsDropdownControlled(false);
      setFocusedNodeId(null);
      onTransferControlBack?.();
    } else {
      setIsDropdownVisible(false);
      onQuit?.();
    }
  };

  const forceUpdate = (e: React.KeyboardEvent) => {
    onForceUpdate?.();

    setIsDropdownVisible(true);
    transferControl(e);
  }

  const transferControl = (e: React.KeyboardEvent) => {
    setIsDropdownControlled(true);

    const visibleNodes = getVisibleNodes(tree);
    if (focusedNodeId && visibleNodes.some(node => node.id === focusedNodeId)) {
      return;
    }

    if (visibleNodes.length > 0) {
      setFocusedNodeId(visibleNodes[0].id);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDropdownControlled(false)
    onSearch(e.target.value)
  }


  const goNext = () => {
    const visibleNodes = getVisibleNodes(tree);
    const currentIndex = visibleNodes.findIndex(node => node.id === focusedNodeId);

    if (currentIndex < visibleNodes.length - 1) {
      setFocusedNodeId(visibleNodes[currentIndex + 1].id);
    } else if (visibleNodes.length > 0) {
      setFocusedNodeId(visibleNodes[0].id);
    }
  };

  const goPrevious = () => {
    if (!isDropdownVisible) return;

    const visibleNodes = getVisibleNodes(tree);
    const currentIndex = visibleNodes.findIndex(node => node.id === focusedNodeId);

    if (currentIndex > 0) {
      setFocusedNodeId(visibleNodes[currentIndex - 1].id);
    } else if (visibleNodes.length > 0) {
      setFocusedNodeId(visibleNodes[visibleNodes.length - 1].id);
    }
  };

  const goDeeper = (visibleNodes: T[]) => {
    if (!isDropdownVisible || !focusedNodeId) return;

    const focusedNode = visibleNodes.find(node => node.id === focusedNodeId);
    if (focusedNode?.type !== TreeNodeType.NODE || !focusedNode.children?.length) {
      return;
    }

    onExpand(focusedNodeId)
    setFocusedNodeId((focusedNode.children as T[])[0].id);
  };

  const goUp = () => {
    if (!focusedNodeId) {
      return;
    }

    const parentNode = findParentNode(focusedNodeId, tree);
    const focusedNode = getVisibleNodes(tree).find(node => node.id === focusedNodeId);

    if (focusedNode?.type === TreeNodeType.NODE && expandedNodes.has(focusedNode.id)) {
      onCollapse(focusedNode.id)

      return;
    }

    if (parentNode) {
      setFocusedNodeId(parentNode.id);
    }
  };

  const handleEnter = (visibleNodes: T[], key: string) => {
    if (!focusedNodeId) return;

    const selectedNode = visibleNodes.find(node => node.id === focusedNodeId);
    if (selectedNode) {
      setFocusedNodeId(null);
      handleNodeSelect(selectedNode, key);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      forceUpdate(e)
    }

    if (!isDropdownVisible) {
      if (e.key === 'ArrowDown') {
        setIsDropdownVisible(true);
        transferControl(e)
      }
      return;
    }

    if (e.key === 'Escape') {
      quit();
      return;
    }

    if (!isDropdownControlled) {
      if (e.key === 'ArrowDown') {
        transferControl(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        goNext();
        break;

      case 'ArrowUp':
        e.preventDefault();
        goPrevious();
        break;

      case 'ArrowRight':
        e.preventDefault();
        goDeeper(getVisibleNodes(tree));
        break;

      case 'ArrowLeft':
        e.preventDefault();
        goUp();
        break;

      case 'Enter':
        handleEnter(getVisibleNodes(tree), 'Enter');
        break;

      case 'Tab':
        handleEnter(getVisibleNodes(tree), 'Tab');
        break;
    }
  };

  const handleNodeSelect = (node: T, key?: string) => {
    const breadcrumbs = buildNodePath(node.id, tree);

    onSelect(node, breadcrumbs.slice(0, -1), key);
    setIsDropdownVisible(false);
    setIsDropdownControlled(false);
  };

  const handleNodeExpand = (node: T) => {
    onExpand(node.id);
  };

  const handleNodeCollapse = (node: T) => {
    onCollapse(node.id);
  };

  const renderTreeItems = (nodes: T[], level: number = 0): React.ReactNode[] => {
    return nodes.map(node => (
      <React.Fragment key={node.id}>
        <TreeItem
          node={node}
          searchTerm={searchTerm}
          level={level}
          isFocused={node.id === focusedNodeId}
          isExpanded={expandedNodes.has(node.id)}
          onSelect={handleNodeSelect}
          onExpand={handleNodeExpand}
          onCollapse={handleNodeCollapse}
          renderItem={renderItem}
        />
        {node.type === TreeNodeType.NODE && expandedNodes.has(node.id) && (
          renderTreeItems(node.children as T[], level + 1)
        )}
      </React.Fragment>
    ));
  };

  useOutsideClick(dropdownRef, () => setIsDropdownVisible(false));

  useEffect(() => {
    if (searchTerm) {
      setIsDropdownVisible(true);
    }
  }, [searchTerm]);

  return (
    <div ref={dropdownRef} className={s.container}>
      <div className={s.inputContainer}>
        {renderInput({
          value: searchTerm,
          onChange: handleChange,
          onKeyDown: handleKeyDown,
          onSelect: () => { },
        })}
      </div>
      <div
        className={cn(s.combobox, {
          [s.hidden]: !isDropdownVisible,
          [s.controlled]: isDropdownControlled
        })}
        style={{ width }}
      >
        {renderHeader && (
          <div className={s.header}>
            {renderHeader()}
          </div>
        )}
        <div className={s.itemsList}>
          {renderTreeItems(tree)}
        </div>
        {renderFooter && (
          <div className={s.footer}>
            {renderFooter()}
          </div>
        )}
      </div>
    </div>
  );
}
