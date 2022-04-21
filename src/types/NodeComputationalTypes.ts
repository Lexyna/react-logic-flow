export interface AbstractNode {
  id: string,
  loopCount: number,
  isComputed: boolean,
  visited: boolean,
  inputs: AbstractInput[],
  outputs: AbstractOutput[]
}

export interface AbstractInput {
  output: AbstractOutput | null,
  node: AbstractNode,
  index: number
}

export interface AbstractOutput {
  node: AbstractNode,
  paths: AbstractInput[],
  index: number
}