export interface NodeIO<T> {
name: string,
type: string,
color:string,
data: any,
extra: React.FC<ExtraProps<T>> | null;
value: T
}

export interface ReactIO<T> {
    nodeId: string,
    index: number,
    rype: string,
    label:string,
    color: string,
    value: T,
    extra: React.FC<ExtraProps<T>> | null,
    updateData: (nodeId: string, input: boolean, index: number, data: any) => any
}

export interface ExtraProps<T> {
    setData: (data: any) => void,
    value: T
}