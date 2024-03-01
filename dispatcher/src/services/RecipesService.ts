import { PagedList } from "../entities/PagedList";
import { Recipe } from "../entities/Recipe";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";

export class RecipesService {
    public static SearchAsync(
        query?: string,
        categoryId?: number,
        mixerNumber?: number,
        page: number = 0,
        pageSize: number = 5
    ): CancelablePromise<PagedList<Recipe>> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/recipes?query=${query}&mixerNumber=${mixerNumber}&categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static GetAsync(id: number): CancelablePromise<Recipe> {
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
