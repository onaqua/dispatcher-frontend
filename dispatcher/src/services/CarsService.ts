import { Car } from "../entities/Car";
import { PagedList } from "../entities/PagedList";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";
import { UpdateCarRequest } from "./requests/LoginRequest";

export class CarsService {
    public static SearchAsync(
        query?: string,
        offset: number = 0,
        quantity: number = 5
    ): CancelablePromise<PagedList<Car>> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/cars?query=${query}&offset=${offset}&quantity=${quantity}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static DeleteAsync(id: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "DELETE",
            url: `/cars/${id}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static CreateAsync(
        request: UpdateCarRequest
    ): CancelablePromise<Car> {
        return __request(OpenAPI, {
            method: "POST",
            url: `/cars`,
            body: request,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static UpdateAsync(
        id: number,
        request: UpdateCarRequest
    ): CancelablePromise<Car> {
        return __request(OpenAPI, {
            method: "PATCH",
            url: `/cars/${id}`,
            body: request,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}
