import { LogicNode, selectedNode } from "./NodeTypes";

export interface Connection {
    input: selectedNode,
    output: selectedNode
}

export interface NodeEditorState {
    nodes: LogicNode[],
    root: string,
    dragNode: string,
    mousePath: string,
    connections: Connection[],
    contextMenuOptions: ContextMenuOptions
}

export interface ContextMenuOptions {
    showContextMenu: boolean,
    x: number,
    y: number
}