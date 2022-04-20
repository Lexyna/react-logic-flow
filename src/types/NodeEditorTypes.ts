import { ProtoNode, selectedNode } from "./NodeTypes";

export interface Connection {
    input: selectedNode,
    output: selectedNode
}

export interface NodeEditorProps {
    id: string,
    config: ProtoNode[],
    root: ProtoNode,
    liveUpdate: boolean
}

export interface ContextMenuOptions {
    showContextMenu: boolean,
    x: number,
    y: number
}