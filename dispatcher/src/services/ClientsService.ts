import { PagedList } from "../entities/PagedList";
import ProductionClientDTO from "../entities/ProductionClientDTO";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";
import {
    CreateClientRequest,
    UpdateClientRequest,
} from "./requests/LoginRequest";

export class ClientsService {
    public static SearchAsync(
        query?: string,
        offset: number = 0,
        quantity: number = 5
    ): CancelablePromise<PagedList<ProductionClientDTO>> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/clients?query=${query}&offset=${offset}&quantity=${quantity}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static DeleteAsync(id: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "DELETE",
            url: `/clients/${id}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static UpdateAsync(
        id: number,
        request: UpdateClientRequest
    ): CancelablePromise<ProductionClientDTO> {
        return __request(OpenAPI, {
            method: "PATCH",
            url: `/clients/${id}`,
            body: request,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static CreateAsync(
        request: CreateClientRequest
    ): CancelablePromise<ProductionClientDTO> {
        return __request(OpenAPI, {
            method: "POST",
            url: `/clients`,
            body: request,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}
