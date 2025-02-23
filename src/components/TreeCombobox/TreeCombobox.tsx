import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { TreeNode, TreeComboboxProps } from './types';
import { TreeItem } from './TreeItem';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Dropdown = styled.div<{ visible: boolean }>`
  display: ${props => props.visible ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;

  /* Стилизация скроллбара */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    
    &:hover {
      background: #555;
    }
  }
`;

/**
 * Компонент TreeCombobox - это поле ввода с возможностью выбора
 * элемента из древовидного списка. 
 *
 * @param {TreeNode[]} data древовидный список элементов
 * @param {string} [placeholder] текст, отображаемый в поле ввода, если оно пустое
 * @param {number} [maxResults] максимальное количество элементов, отображаемых в списке
 * @param {(node: TreeNode) => void} [onExpand] функция, вызываемая, когда пользователь разворачивает ветку
 * @param {(node: TreeNode) => void} [onAdd] функция, вызываемая, когда пользователь добавляет новый элемент
 * @param {(node: TreeNode) => void} [onEdit] функция, вызываемая, когда пользователь редактирует существующий элемент
 * @param {(node: TreeNode) => void} [onDelete] функция, вызываемая, когда пользователь удаляет существующий элемент
 * @param {boolean} [showAddButton] флаг, указывающий, отображать ли кнопку добавления нового элемента
 * @param {boolean} [defaultExpanded] флаг, указывающий, должны ли все ветки быть развернутыми по умолчанию
 * @param {(props: RenderItemProps) => React.ReactNode} renderItem Функция, которая будет использоваться для отображения  каждого элемента дерева
 * @param {string} value значение поля ввода
 * @param {(value: string) => void} onChange функция, вызываемая при изменении значения поля ввода
 */
export const TreeCombobox: React.FC<TreeComboboxProps> = ({
  data,
  onSelect,
  placeholder = '',
  maxResults = 10,
  onExpand,
  onAdd,
  onEdit,
  onDelete,
  defaultExpanded = false,
  renderItem,
  renderInput,
  renderHeader,
  renderFooter,
  value,
  onChange,
}) => {
  const [filteredNodes, setFilteredNodes] = useState<TreeNode[]>(data);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    if (!defaultExpanded) return new Set();

    const ids = new Set<string>();
    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.children?.length) {
          ids.add(node.id);
          collectIds(node.children);
        }
      });
    };
    collectIds(data);
    return ids;
  });

  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownControlled, setIsDropdownControlled] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Функция возвращает массив видимых элементов дерева.
   * В visibleNodes попадают только элементы, которые
   * не скрыты родительскими узлами.
   * @param nodes - массив узлов дерева
   * @returns массив видимых узлов
   */
  const getVisibleNodes = (nodes: TreeNode[]): TreeNode[] => {
    const result: TreeNode[] = [];

    const traverse = (node: TreeNode) => {
      result.push(node);
      if (node.children && (defaultExpanded || expandedNodes.has(node.id))) {
        node.children.forEach(traverse);
      }
    };

    nodes.forEach(traverse);
    return result;
  };

  /**
   * Функция для поиска родительского узла.
   * @param nodeId - идентификатор узла, для которого нужно найти родителя.
   * @param nodes - массив узлов дерева.
   * @returns Родительский узел, если он найден, или null, если родитель не найден.
   */
  const findParentNode = (nodeId: string, nodes: TreeNode[]): TreeNode | null => {
    for (const node of nodes) {
      if (node.children?.some(child => child.id === nodeId)) {
        return node;
      }
      if (node.children && (defaultExpanded || expandedNodes.has(node.id))) {
        const parent = findParentNode(nodeId, node.children);
        if (parent) return parent;
      }
    }
    return null;
  };

  /**
   * Функция для поиска узлов по заданному запросу.
   * @param nodes - массив узлов дерева.
   * @param term - запрос для поиска.
   * @returns Массив найденных узлов.
   */
  const searchNodes = (nodes: TreeNode[], term: string): TreeNode[] => {
    if (!term) return nodes;

    const newExpandedIds = new Set<string>();
    const termLower = term.toLowerCase();

    const filterTree = (node: TreeNode, parents: TreeNode[] = []): TreeNode | null => {
      const matchesSearch = node.label.toLowerCase().includes(termLower);

      let filteredChildren: TreeNode[] = [];
      if (node.children && node.children.length > 0) {
        filteredChildren = node.children
          .map(child => filterTree(child, [...parents, node]))
          .filter((child): child is TreeNode => child !== null);
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
      .filter((node): node is TreeNode => node !== null);

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
  const buildNodePath = (nodeId: string, nodes: TreeNode[]): TreeNode[] => {
    const path: TreeNode[] = [];
    
    const traverse = (currentNodes: TreeNode[], currentPath: TreeNode[]): boolean => {
      for (const node of currentNodes) {
        if (node.id === nodeId) {
          path.push(...currentPath, node);
          return true;
        }
        
        if (node.children) {
          if (traverse(node.children, [...currentPath, node])) {
            return true;
          }
        }
      }
      return false;
    };
    
    traverse(nodes, []);
    return path;
  };

  const findLastSearchMatch = (text: string, searchTerm: string): [number, number] => {
    if (!searchTerm) return [-1, -1];
    
    const lastSpaceIndex = text.lastIndexOf(' ');
    const lastPart = text.slice(lastSpaceIndex + 1);
    const termLower = searchTerm.toLowerCase();
    
    // Сначала ищем в последней части текста (после пробела)
    if (lastPart.toLowerCase().includes(termLower)) {
      const matchStart = lastSpaceIndex + 1 + lastPart.toLowerCase().indexOf(termLower);
      return [matchStart, matchStart + searchTerm.length];
    }
    
    // Если не нашли в последней части, ищем во всем тексте
    const matchIndex = text.toLowerCase().lastIndexOf(termLower);
    if (matchIndex !== -1) {
      return [matchIndex, matchIndex + searchTerm.length];
    }
    
    return [-1, -1];
  };

  const handleArrowDown = () => {

    const visibleNodes = getVisibleNodes(filteredNodes);
    const currentIndex = visibleNodes.findIndex(node => node.id === focusedNodeId);

    if (currentIndex < visibleNodes.length - 1) {
      setFocusedNodeId(visibleNodes[currentIndex + 1].id);
    } else if (visibleNodes.length > 0) {
      setFocusedNodeId(visibleNodes[0].id);
    }
  };

  const handleArrowUp = () => {
    if (!isDropdownVisible) return;

    const visibleNodes = getVisibleNodes(filteredNodes);
    const currentIndex = visibleNodes.findIndex(node => node.id === focusedNodeId);

    if (currentIndex > 0) {
      setFocusedNodeId(visibleNodes[currentIndex - 1].id);
    } else if (visibleNodes.length > 0) {
      setFocusedNodeId(visibleNodes[visibleNodes.length - 1].id);
    }
  };

  const handleArrowRight = (visibleNodes: TreeNode[]) => {
    if (!isDropdownVisible || !focusedNodeId) return;

    const focusedNode = visibleNodes.find(node => node.id === focusedNodeId);
    if (!focusedNode?.children?.length || defaultExpanded) {
      return;
    }

    setExpandedNodes(prev => new Set([...prev, focusedNodeId]));
    setFocusedNodeId(focusedNode.children[0].id);
  };

  const handleArrowLeft = () => {
    if (!focusedNodeId || defaultExpanded) {
      return;
    }

    const parentNode = findParentNode(focusedNodeId, filteredNodes);
    const focusedNode = getVisibleNodes(filteredNodes).find(node => node.id === focusedNodeId);

    // Если узел развернут, сворачиваем его
    if (focusedNode?.children && expandedNodes.has(focusedNode.id)) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(focusedNode.id);
        return newSet;
      });
      return;
    }

    // Переходим к родителю только если он существует
    if (parentNode) {
      setFocusedNodeId(parentNode.id);
    }
  };

  const handleEnter = (visibleNodes: TreeNode[]) => {
    if (!focusedNodeId) {
      return;
    }

    const selectedNode = visibleNodes.find(node => node.id === focusedNodeId);
    if (selectedNode) {
      handleNodeSelect(selectedNode);
    }
  };

  const handleEscape = () => {
    setIsDropdownVisible(false);
    setIsDropdownControlled(false);
    setFocusedNodeId(null); // Убираем выделение при возврате контроля инпуту
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Сохраняем текущую позицию каретки
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart);
    }

    // Обработка Ctrl+Space для обновления списка
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      setFilteredNodes(data);
      setIsDropdownVisible(true);
      setIsDropdownControlled(true);
      // Выделяем первый элемент при получении контроля
      const visibleNodes = getVisibleNodes(data);
      if (visibleNodes.length > 0) {
        setFocusedNodeId(visibleNodes[0].id);
      }
      return;
    }

    // Если дропдаун не виден, проверяем только стрелку вниз
    if (!isDropdownVisible) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsDropdownVisible(true);
        setIsDropdownControlled(true);
        // Выделяем первый элемент при получении контроля
        const visibleNodes = getVisibleNodes(filteredNodes);
        if (visibleNodes.length > 0) {
          setFocusedNodeId(visibleNodes[0].id);
        }
      }
      return;
    }

    // Если дропдаун не контролируется, но видим
    if (!isDropdownControlled) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsDropdownControlled(true);
        // Выделяем первый элемент при получении контроля
        const visibleNodes = getVisibleNodes(filteredNodes);
        if (visibleNodes.length > 0) {
          setFocusedNodeId(visibleNodes[0].id);
        }
      }
      return;
    }

    // Обработка клавиш когда дропдаун контролируется
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        handleArrowDown();
        break;

      case 'ArrowUp':
        e.preventDefault();
        handleArrowUp();
        break;

      case 'ArrowRight':
        e.preventDefault();
        handleArrowRight(getVisibleNodes(filteredNodes));
        break;

      case 'ArrowLeft':
        e.preventDefault();
        handleArrowLeft();
        break;

      case 'Enter':
        handleEnter(getVisibleNodes(filteredNodes));
        break;

      case 'Escape':
        handleEscape();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  // Эффект для обработки поискового запроса
  useEffect(() => {
    if (value) {
      const filtered = searchNodes(data, value);
      setFilteredNodes(filtered);
      setIsDropdownVisible(filtered.length > 0);

      // Выделяем первый элемент только если дропдаун контролируется
      if (isDropdownControlled && filtered.length > 0) {
        const visibleNodes = getVisibleNodes(filtered);
        if (visibleNodes.length > 0) {
          setFocusedNodeId(visibleNodes[0].id);
        }
      }
    } else {
      setFilteredNodes(data);
      // Не показываем дропдаун если нет поискового запроса
      if (!isDropdownVisible) {
        setFocusedNodeId(null);
      }
    }
  }, [value, data, maxResults, isDropdownControlled]);

  // Эффект для восстановления позиции каретки
  useEffect(() => {
    if (cursorPosition !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, focusedNodeId]);

  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNodeId(node.id);
    const breadcrumbs = buildNodePath(node.id, data);
    
    if (inputRef.current) {
      const input = inputRef.current;
      const cursorPosition = input.selectionStart || 0;
      const insertValue = node.label;
      
      // Получаем текст до курсора и ищем последнее слово
      const textBeforeCursor = value.slice(0, cursorPosition);
      const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
      const searchTerm = textBeforeCursor.slice(lastSpaceIndex + 1);
      
      // Сохраняем текущее состояние для истории
      input.focus();
      
      if (searchTerm) {
        // Если есть поисковый запрос, заменяем его
        const start = cursorPosition - searchTerm.length;
        const end = cursorPosition;
        
        // Устанавливаем выделение для истории
        input.setSelectionRange(start, end);
        
        // Создаем новое значение
        const newValue = 
          value.slice(0, start) + 
          insertValue + 
          value.slice(end);
        
        // Эмитим низкоуровневое событие onchange
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
        
        // Устанавливаем новую позицию курсора
        requestAnimationFrame(() => {
          input.setSelectionRange(start + insertValue.length, start + insertValue.length);
        });
      } else {
        // Если нет поискового запроса, вставляем в текущую позицию
        const newValue = 
          value.slice(0, cursorPosition) + 
          insertValue + 
          value.slice(cursorPosition);
        
        // Обновляем значение через onChange
        onChange(newValue);
        
        // Устанавливаем новую позицию курсора
        requestAnimationFrame(() => {
          input.setSelectionRange(cursorPosition + insertValue.length, cursorPosition + insertValue.length);
        });
      }
    }

    onSelect({ ...node, parentPath: breadcrumbs.slice(0, -1) });
    setIsDropdownVisible(false);
    setIsDropdownControlled(false);
  };

  const handleNodeExpand = (node: TreeNode) => {
    if (!defaultExpanded) {
      setExpandedNodes(prev => new Set([...prev, node.id]));
      onExpand?.(node);
    }
  };

  const handleNodeCollapse = (node: TreeNode) => {
    if (!defaultExpanded) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(node.id);
        return newSet;
      });
    }
  };

  const renderTreeItems = (nodes: TreeNode[], level: number = 0): React.ReactNode[] => {

    return nodes.map(node => (
      <React.Fragment key={node.id}>
        <TreeItem
          node={node}
          searchTerm={value}
          level={level}
          isSelected={node.id === selectedNodeId}
          isFocused={node.id === focusedNodeId}
          isExpanded={defaultExpanded || expandedNodes.has(node.id)}
          expandedNodes={expandedNodes}
          onSelect={handleNodeSelect}
          onExpand={handleNodeExpand}
          onCollapse={handleNodeCollapse}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          renderItem={renderItem}
        />
        {node.children && (defaultExpanded || expandedNodes.has(node.id)) && (
          renderTreeItems(node.children, level + 1)
        )}
      </React.Fragment>
    ));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node) &&
          !inputRef.current?.contains(e.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setIsDropdownVisible(true);
  };

  const renderCustomInput = () => {
    return renderInput({
      ref: inputRef,
      value: value,
      onChange: handleInputChange,
      onKeyDown: handleKeyDown,
      onFocus: handleInputFocus,
      onBlur: () => {}, //todo implement onBlur
      onSelect: handleSelect,
      placeholder
    });
  };

  return (
    <Container>
      {renderCustomInput()}
      <Dropdown
        ref={dropdownRef}
        visible={isDropdownVisible}
      >
        {renderHeader && renderHeader()}
        {renderTreeItems(filteredNodes)}
        {renderFooter && renderFooter()}
      </Dropdown>
    </Container>
  );
};
