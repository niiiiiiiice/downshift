import React, { useState, useRef, useEffect } from 'react';
import s from './TreeCombobox.module.scss';
import { TreeNode, TreeComboboxProps } from '../Model';
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
  value,
  data,
  placeholder = '',
  defaultExpanded = false,

  width,

  onSelect,
  onExpand,
  onTransferControlBack,
  onQuit,
  renderItem,
  renderHeader,
  renderFooter,
  onChange,
  children,
}: TreeComboboxProps<T>): React.ReactElement => {
  const [filteredNodes, setFilteredNodes] = useState<T[]>(data);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    if (!defaultExpanded) return new Set();

    const ids = new Set<string>();
    const collectIds = (nodes: T[]) => {
      nodes.forEach(node => {
        if (node.children?.length) {
          ids.add(node.id);
          collectIds(node.children as T[]);
        }
      });
    };
    collectIds(data);
    return ids;
  });

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
      if (node.children && (defaultExpanded || expandedNodes.has(node.id))) {
        (node.children as T[]).forEach(traverse);
      }
    };

    nodes.forEach(traverse);
    return result;
  };

  /**
   * Функция для поиска родительского узла.
   * @param nodeId - идентификатор узла, для которого нужно найти родителя.
   * @param nodes - массив узлов дерева.
   * @returns Родительский узел, если он найден, или null, если родитель не найден.
   */
  const findParentNode = (nodeId: string, nodes: T[]): T | null => {
    for (const node of nodes) {
      if (node.children?.some(child => child.id === nodeId)) {
        return node;
      }
      if (node.children && (defaultExpanded || expandedNodes.has(node.id))) {
        const parent = findParentNode(nodeId, node.children as T[]);
        if (parent) return parent;
      }
    }
    return null;
  };

  /**
   * Функция для поиска узлов по заданному запросу.
   * @param nodes - массив узлов дерева.
   * @param term - запрос для поиска.
   * @returns Массив найденных узлов.
   */
  const searchNodes = (nodes: T[], term: string): T[] => {
    if (!term) return nodes;

    const newExpandedIds = new Set<string>();
    const termLower = term.toLowerCase();

    const filterTree = (node: T, parents: T[] = []): T | null => {
      const matchesSearch = node.label.toLowerCase().includes(termLower);

      let filteredChildren: T[] = [];
      if (node.children && node.children.length > 0) {
        filteredChildren = (node.children as T[])
          .map(child => filterTree(child, [...parents, node]))
          .filter((child): child is T => child !== null);
      }

      if (matchesSearch || filteredChildren.length > 0) {
        parents.forEach(parent => newExpandedIds.add(parent.id));
        if (filteredChildren.length > 0) {
          newExpandedIds.add(node.id);
        }

        return {
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : undefined
        };
      }

      return null;
    };

    const filteredNodes = nodes
      .map(node => filterTree(node, []))
      .filter((node): node is T => node !== null);

    if (!defaultExpanded) {
      setExpandedNodes(newExpandedIds);
    }

    return filteredNodes;
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

        if (node.children) {
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

  const goNext = () => {
    const visibleNodes = getVisibleNodes(filteredNodes);
    const currentIndex = visibleNodes.findIndex(node => node.id === focusedNodeId);

    if (currentIndex < visibleNodes.length - 1) {
      setFocusedNodeId(visibleNodes[currentIndex + 1].id);
    } else if (visibleNodes.length > 0) {
      setFocusedNodeId(visibleNodes[0].id);
    }
  };

  const goPrevious = () => {
    if (!isDropdownVisible) return;

    const visibleNodes = getVisibleNodes(filteredNodes);
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
    if (!focusedNode?.children?.length || defaultExpanded) {
      return;
    }

    setExpandedNodes(prev => new Set([...prev, focusedNodeId]));
    setFocusedNodeId((focusedNode.children as T[])[0].id);
  };

  const goUp = () => {
    if (!focusedNodeId || defaultExpanded) {
      return;
    }

    const parentNode = findParentNode(focusedNodeId, filteredNodes);
    const focusedNode = getVisibleNodes(filteredNodes).find(node => node.id === focusedNodeId);

    if (focusedNode?.children && expandedNodes.has(focusedNode.id)) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(focusedNode.id);
        return newSet;
      });
      return;
    }

    if (parentNode) {
      setFocusedNodeId(parentNode.id);
    }
  };

  const handleEnter = (visibleNodes: T[], key: string) => {
    if (!focusedNodeId) {
      return;
    }

    const selectedNode = visibleNodes.find(node => node.id === focusedNodeId);
    if (selectedNode) {
      setFocusedNodeId(null);
      handleNodeSelect(selectedNode, key);
    }
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

  const handleForceOpen = (e: React.KeyboardEvent) => {
    const filtered = value ? searchNodes(data, value) : data;
    setFilteredNodes(filtered);

    setIsDropdownVisible(true);
    transferControl(e);
  }

  const transferControl = (e: React.KeyboardEvent) => {
    setIsDropdownControlled(true);

    const visibleNodes = getVisibleNodes(filteredNodes);
    if (focusedNodeId && visibleNodes.some(node => node.id === focusedNodeId)) {
      return;
    }

    if (visibleNodes.length > 0) {
      setFocusedNodeId(visibleNodes[0].id);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDropdownControlled(false)
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      handleForceOpen(e)
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
        goDeeper(getVisibleNodes(filteredNodes));
        break;

      case 'ArrowLeft':
        e.preventDefault();
        goUp();
        break;

      case 'Enter':
        handleEnter(getVisibleNodes(filteredNodes), 'Enter');
        break;

      case 'Tab':
        handleEnter(getVisibleNodes(filteredNodes), 'Tab');
        break;
    }
  };

  const handleNodeSelect = (node: T, key?: string) => {
    const breadcrumbs = buildNodePath(node.id, data);

    onSelect(node, breadcrumbs.slice(0, -1), key);
    setIsDropdownVisible(false);
    setIsDropdownControlled(false);
  };

  const handleNodeExpand = (node: T) => {
    if (!defaultExpanded) {
      setExpandedNodes(prev => new Set([...prev, node.id]));
      onExpand?.(node);
    }
  };

  const handleNodeCollapse = (node: T) => {
    if (!defaultExpanded) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(node.id);
        return newSet;
      });
    }
  };

  const renderTreeItems = (nodes: T[], level: number = 0): React.ReactNode[] => {

    return nodes.map(node => (
      <React.Fragment key={node.id}>
        <TreeItem
          node={node}
          searchTerm={value}
          level={level}
          isFocused={node.id === focusedNodeId}
          isExpanded={defaultExpanded || expandedNodes.has(node.id)}
          expandedNodes={expandedNodes}
          onSelect={handleNodeSelect}
          onExpand={handleNodeExpand}
          onCollapse={handleNodeCollapse}
          renderItem={renderItem}
        />
        {node.children && (defaultExpanded || expandedNodes.has(node.id)) && (
          renderTreeItems(node.children as T[], level + 1)
        )}
      </React.Fragment>
    ));
  };

  useOutsideClick(dropdownRef, () => setIsDropdownVisible(false))

  useEffect(() => {
    if (value) {
      const filtered = searchNodes(data, value);
      setFilteredNodes(filtered);
      setIsDropdownVisible(filtered.length > 0);

      if (filtered.length > 0) {
        const findFirstMatch = (nodes: T[]): string | null => {
          for (const node of nodes) {
            if (node.label.toLowerCase().includes(value.toLowerCase())) {
              return node.id;
            }
            if (node.children?.length) {
              const childMatch = findFirstMatch(node.children as T[]);
              if (childMatch) return childMatch;
            }
          }
          return null;
        };

        const firstMatchId = findFirstMatch(filtered);
        if (firstMatchId) {
          setFocusedNodeId(firstMatchId);
        }
      }
    } else {
      setFilteredNodes(data);

      if (!isDropdownVisible) {
        setFocusedNodeId(null);
      }
    }
  }, [value, data, isDropdownVisible]);

  return (
    <div ref={dropdownRef} className={s.container}>
      <div className={s.inputContainer}>
        {children({
          value,
          placeholder,

          onChange: handleChange,
          onKeyDown: handleKeyDown,
          onSelect: () => { }, //todo implement onSelect
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
          {renderTreeItems(filteredNodes)}
        </div>

        {renderFooter && (
          <div className={s.footer}>
            {renderFooter()}
          </div>
        )}
      </div>
    </div>
  );
};
