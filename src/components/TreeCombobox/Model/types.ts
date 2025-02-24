export enum TreeNodeType {
  NODE = 'node',
  LEAF = 'leaf',
}

export type TreeNode = {
  id: string;
  label: string;
  description?: string;
} & ({
  type: TreeNodeType.NODE;
  children?: TreeNode[];
} | {
  type: TreeNodeType.LEAF;
})

export interface RenderItemProps<T extends TreeNode> {
  node: T;
  onSelect: (node: T) => void;
  onExpand: (e: React.MouseEvent) => void;
  onCollapse: (e: React.MouseEvent) => void;
  isExpanded: boolean;
  isFocused: boolean;
}

export interface RenderInputProps {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSelect: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}

/**
 * Компонент для отображения древовидной структуры с возможностью поиска
 */
export interface TreeComboboxProps<T extends TreeNode> {
  /**
   * массив данных
   */
  tree: T[];

  loading?: boolean

  expandedNodes: Set<string>;

  /**
   * флаг для раскрытия всех узлов по умолчанию
   */
  defaultExpanded?: boolean;

  width?: number | string;

  selectKey?: Exclude<string, 'Escape' | 'Space' | 'ArrowDown' | 'ArrowUp' | 'ArrowRight' | 'ArrowLeft' | 'Enter' | 'Tab'>[];
  /**
   * значение поля ввода
   */
  searchTerm: string;
  /**
   * функция для вызова при изменении значения поля ввода
   */
  onSearch: (value: string) => void;

  /**
   * функция для вызова при выборе элемента
   */
  onSelect: (node: T, parentPath: T[], key?: string) => void;

  /**
   * функция для вызова при раскрытии узла
   */

  onExpand: (nodeId: string) => void;

  onCollapse: (nodeId: string) => void;
  onForceUpdate?: () => void;
  /**
   * функция для вызова при переносе управления обратно
   */
  onTransferControlBack?: () => void;
  /**
   * функция для вызова при выходе
   */
  onQuit?: () => void;

  /**
   * функция для рендеринга элемента
   */
  renderItem: (props: RenderItemProps<T>) => React.ReactNode;
  /**
   * функция для рендеринга заголовка
   */
  renderHeader?: () => React.ReactNode;
  /**
   * функция для рендеринга подвала
   */
  renderFooter?: () => React.ReactNode;
  /**
   * Функция рендеринга поля ввода
   */
  children: (props: RenderInputProps) => React.ReactNode;
}

export interface TreeItemProps<T extends TreeNode> {
  node: T;
  searchTerm: string;
  level: number;
  isFocused: boolean;
  isExpanded: boolean;
  onSelect: (node: T) => void;
  onExpand: (node: T) => void;
  onCollapse: (node: T) => void;
  renderItem: (props: RenderItemProps<T>) => React.ReactNode;
}
