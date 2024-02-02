import { PagedList } from "../entities/PagedList";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";


export class CarsService
{
    public static SearchAsync(
        query?: string,
        offset: number = 0,
        quantity: number = 5
    ): CancelablePromise<PagedList<ProductionCarDTO>>
    {
        return __request(OpenAPI, {
            method: "GET",
            url: `/cars?query=${ query }&offset=${ offset }&quantity=${ quantity }`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}
