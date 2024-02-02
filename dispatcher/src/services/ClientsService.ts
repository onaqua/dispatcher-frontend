import { PagedList } from "../entities/PagedList";
import ProductionClientDTO from "../entities/ProductionClientDTO";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";


export class ClientsService
{
    public static SearchAsync(
        query?: string,
        offset: number = 0,
        quantity: number = 5
    ): CancelablePromise<PagedList<ProductionClientDTO>>
    {
        return __request(OpenAPI, {
            method: "GET",
            url: `/clients?query=${ query }&offset=${ offset }&quantity=${ quantity }`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}
