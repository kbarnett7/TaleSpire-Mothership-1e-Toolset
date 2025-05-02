export interface IFeature<TRequest, TResponse> {
    handle(request: TRequest): TResponse;
}
