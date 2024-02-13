import { PagedList } from "../entities/PagedList";
import ProductionRecipeDTO from "../entities/ProductionRecipeDTO";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";

export class RecipesService {
    public static SearchAsync(
        categoryId: number,
        query?: string,
        offset: number = 0,
        quantity: number = 5
    ): CancelablePromise<PagedList<ProductionRecipeDTO>> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/recipes?categoryId=${categoryId}&query=${query}&offset=${offset}&quantity=${quantity}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static GetAsync(
        id: number
    ): CancelablePromise<ProductionRecipeDTO> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/recipes/${id}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}
