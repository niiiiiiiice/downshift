import { useEffect, useState } from 'react';
import { data } from './data'
import { TreeNode, TreeNodeType } from './components/TreeCombobox';

const searchNodes = (nodes: TreeNode[], term: string): Promise<TreeNode[]> => {
    if (!term) return new Promise(resolve => setTimeout(() => {
        resolve(nodes);
    }, 1000));;

    const termLower = term.toLowerCase();

    const filterTree = (node: TreeNode, parents: TreeNode[] = []): TreeNode | null => {
        const matchesSearch = node.label.toLowerCase().includes(termLower);

        if (node.type === TreeNodeType.NODE) {
            // Если нода совпала с поиском, возвращаем её с пустым children
            if (matchesSearch) {
                return {
                    ...node,
                    children: [] // Означает что дети есть, но не загружены
                };
            }

            // Если нода не совпала, проверяем детей
            if (node.children && node.children.length > 0) {
                const filteredChildren = node.children
                    .map(child => filterTree(child, [...parents, node]))
                    .filter((child): child is TreeNode => child !== null);

                // Возвращаем ноду только если у неё есть совпавшие дети
                if (filteredChildren.length > 0) {
                    return {
                        ...node,
                        children: filteredChildren
                    };
                }
            }

            return null;
        }

        // Для листьев просто проверяем совпадение
        return matchesSearch ? node : null;
    };

    const filteredNodes = nodes
        .map(node => filterTree(node))
        .filter((node): node is TreeNode => node !== null);

    return new Promise(resolve => setTimeout(() => {
        resolve(filteredNodes);
    }, 1000));
};

export const useGetHandbook = (searchTerm: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState(data);

    const fetchFilteredData = (searchTerm: string) => {
        return searchNodes(data, searchTerm);
    }

    const refresh = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFilteredData(searchTerm);
            setFilteredData(result);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [searchTerm]);

    return {
        data: filteredData,
        isLoading,
        refresh
    }
}