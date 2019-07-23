import { Identifier, Record } from 'ra-core';
import { TreeItem, Tree } from './types';

export const DEFAULT_TREE_ROOT_ID = 'RA/DEFAULT_TREE_ROOT_ID';

const getTreeItem = (
    parentSource: string,
    expandedNodeIds: Identifier[],
    item: Record,
    items: Record[]
): TreeItem => {
    const children = items.filter(child => child[parentSource] === item.id);
    const childrenIds = children.map(child => child.id);

    return {
        id: item.id,
        children: childrenIds,
        hasChildren: item.hasChildren || children.length > 0,
        isExpanded: expandedNodeIds.some(id => id == item.id), // eslint-disable-line eqeqeq
        isChildrenLoading: false,
        data: item,
    };
};

/**
 * Build a tree representation of the data returned by the List component for usage with @atlaskit/tree
 */
export default (
    data: Record[],
    parentSource: string,
    expandedNodeIds: Identifier[]
): Tree => {
    const roots = data.filter(item => item[parentSource] == undefined); // eslint-disable-line eqeqeq
    const rootId = roots.length === 1 ? roots[0].id : DEFAULT_TREE_ROOT_ID;
    const items = data.reduce((acc, item) => {
        acc[item.id] = getTreeItem(parentSource, expandedNodeIds, item, data);
        return acc;
    }, {});

    if (roots.length > 1) {
        items[DEFAULT_TREE_ROOT_ID] = {
            id: DEFAULT_TREE_ROOT_ID,
            children: roots.map(root => root.id),
            hasChildren: true,
            isExpanded: false,
            isChildrenLoading: false,
            data: {},
        };
    }

    return {
        rootId,
        items,
    };
};