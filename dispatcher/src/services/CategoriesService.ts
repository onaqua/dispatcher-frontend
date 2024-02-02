import { PagedList } from "../entities/PagedList";
import { ProductionCategoryDTO } from "../entities/ProductionCategoryDTO";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";

export class CategoriesService
{
    public static SearchAsync(
        query?: string,
        offset: number = 0,
        quantity: number = 5
    ): CancelablePromise<PagedList<ProductionCategoryDTO>>
    {
        return __request(OpenAPI, {
            method: "GET",
            url: `/categories?query=${ query }&offset=${ offset }&quantity=${ quantity }`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}
