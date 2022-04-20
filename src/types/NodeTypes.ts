import { NodeIO } from "./IOTypes"

//Passed type to identify the currently selected Node in the Editor
export interface selectedNode {
    x: () => number,
    y: () => number,
    type: string,
    color: string,
    index: number,
    id: string
}

//Type for the renderd node in the NodeEditor
export interface ReactNode {
    id: string,
    name: string,
    x: number,
    y:number,
    inputs: NodeIO<any>[],
    outpiuts: NodeIO<any>[],
    dragHandler: (id: string) => void | null,
    onInputClicked: (node: selectedNode) => void,
    onoutputClicked: (node: selectedNode) => void,
    updateExtraData: (nodeId: string, input: boolean, index: number, data: any) => void
}

//Logic Node used to compute the graph
export interface LogicNode {
    id: string,
    name: string,
    x: number,
    y: number,
    inputs: NodeIO<any>[],
    outputs: NodeIO<any>[],
    forward: (...io: any[]) => void
}

export interface ProtoNode {
    name: string,
    description: string,
    inputs: NodeIO<any>[],
    outputs: NodeIO<any>[],
    forward: (...io: any[]) => void
}