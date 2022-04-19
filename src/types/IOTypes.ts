export interface NodeIO<T> {
name: string,
type: string,
color:string,
data: any,
extra: React.FC<ExtraProps<T>> | null;
value: T
}

export interface ExtraProps<T> {
    setData: (data: any) => void,
    value: T
}