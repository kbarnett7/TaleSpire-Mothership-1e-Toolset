export interface IAsyncFeature<TRequest, TResponse> {
    handleAsync(request: TRequest): Promise<TResponse>;
}
