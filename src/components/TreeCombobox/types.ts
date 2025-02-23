export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  parentPath?: TreeNode[];
  isEditable?: boolean;
  description?: string;
}

export interface RenderItemProps {
  node: TreeNode;
  onAdd: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onExpand: (e: React.MouseEvent) => void;
  isExpanded: boolean;
  hasChildren: boolean;
}

export interface RenderInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSelect: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  placeholder?: string;
  ref: React.RefObject<HTMLInputElement>;
}



/**
 * Компонент для отображения древовидной структуры с возможностью поиска
 */
export interface TreeComboboxProps {
  /**
   * массив данных
   */
  data: TreeNode[];
  /**
   * функция для вызова при выборе элемента
   */
  onSelect: (node: TreeNode) => void;
  /**
   * текст для placeholder
   */
  placeholder?: string;
  /**
   * максимальное количество результатов
   */
  maxResults?: number;
  /**
   * функция для вызова при раскрытии узла
   */
  onExpand?: (node: TreeNode) => void;
  /**
   * функция для вызова при добавлении узла
   */
  onAdd?: (parentNode?: TreeNode) => void;
  /**
   * функция для вызова при редактировании узла
   */
  onEdit?: (node: TreeNode) => void;
  /**
   * функция для вызова при удалении узла
   */
  onDelete?: (node: TreeNode) => void;
  /**
   * отображать ли кнопку "добавить"
   */
  showAddButton?: boolean;
  /**
   * узлы по умолчанию раскрыты
   */
  defaultExpanded?: boolean;
  /**
   * значение поля ввода
   */
  value: string;
  /**
   * функция обратного вызова при изменении значения поля ввода
   */
  onChange: (value: string) => void;
  /**
   * функция для рендеринга элемента списка
   */
  renderItem: (props: RenderItemProps) => React.ReactNode;
  /**
   * функция для рендеринга поля ввода
   */
  renderInput: (props: RenderInputProps) => React.ReactNode;
  /**
   * функция для рендеринга заголовка выпадающего списка
   */
  renderHeader?: () => React.ReactNode;
  /**
   * функция для рендеринга подвала выпадающего списка
   */
  renderFooter?: () => React.ReactNode;
}

export interface TreeItemProps {
  node: TreeNode;
  searchTerm: string;
  level: number;
  isSelected: boolean;
  isFocused: boolean;
  isExpanded: boolean;
  expandedNodes: Set<string>;
  onSelect: (node: TreeNode) => void;
  onExpand: (node: TreeNode) => void;
  onCollapse: (node: TreeNode) => void;
  onAdd?: (node: TreeNode) => void;
  onEdit?: (node: TreeNode) => void;
  onDelete?: (node: TreeNode) => void;
  renderItem: (props: RenderItemProps) => React.ReactNode;
}
