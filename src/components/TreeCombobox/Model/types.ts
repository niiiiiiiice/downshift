export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  isEditable?: boolean;
  description?: string;
}

export interface RenderItemProps<T extends TreeNode> {
  node: T;
  onExpand: (e: React.MouseEvent) => void;
  isExpanded: boolean;
  hasChildren: boolean;
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
  data: T[];
  /**
   * текст для placeholder
   */
  placeholder?: string;
  /**
   * флаг для раскрытия всех узлов по умолчанию
   */
  defaultExpanded?: boolean;

  width?: number | string;

  /**
   * функция для вызова при выборе элемента
   */
  onSelect: (node: T, parentPath: T[], key: 'Tab' | 'Enter') => void;

  /**
   * функция для вызова при раскрытии узла
   */
  onExpand?: (node: T) => void;
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
   * значение поля ввода
   */
  value: string;
  /**
   * функция для вызова при изменении значения поля ввода
   */
  onChange: (value: string) => void;
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
  expandedNodes: Set<string>;
  onSelect: (node: T) => void;
  onExpand: (node: T) => void;
  onCollapse: (node: T) => void;
  renderItem: (props: RenderItemProps<T>) => React.ReactNode;
}
