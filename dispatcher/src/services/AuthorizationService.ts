import { ProductionApplicationDTO } from "../entities/ApplicationDTO";
import { ProductionCarDTO } from "../entities/ProductionCarDTO";
import ProductionClientDTO from "../entities/ProductionClientDTO";
import ProductionRecipeDTO from "../entities/ProductionRecipeDTO";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";
import { AddApplicationInPreQueueRequest, LoginRequest } from "./requests/LoginRequest";

export class CarsService {
    public static SearchAsync(
        query?: string,
        offset: number = 0,
        quantity: number = 5
    ): CancelablePromise<Array<ProductionCarDTO>> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/cars?query=${query}&offset=${offset}&quantity=${quantity}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}

export class ConnectionsService {
    public static CheckAsync(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/connections/check`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}

export class ClientsService {
    public static SearchAsync(
        query?: string,
        offset: number = 0,
        quantity: number = 5
    ): CancelablePromise<Array<ProductionClientDTO>> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/clients?query=${query}&offset=${offset}&quantity=${quantity}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}

export class ApplicationsService {
    public static GetAllInQueueAsync(): CancelablePromise<
        Array<ProductionApplicationDTO>
    > {
        return __request(OpenAPI, {
            method: "GET",
            url: `/applications/inQueue`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static AddInQueueAsync(
        applicationId: number
    ): CancelablePromise<Array<ProductionApplicationDTO>> {
        return __request(OpenAPI, {
            method: "POST",
            url: `/applications/inQueue/${applicationId}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static AddInPreQueueAsync(
        request: AddApplicationInPreQueueRequest
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "POST",
            body: request,
            url: `/applications/inPreQueue`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static DeleteInQueueAsync(
        applicationId: number
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "DELETE",
            url: `/applications/inQueue/${applicationId}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static DeleteInPreQueueAsync(
        applicationId: number
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "DELETE",
            url: `/applications/inPreQueue/${applicationId}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static GetAllInPreQueueAsync(): CancelablePromise<
        Array<ProductionApplicationDTO>
    > {
        return __request(OpenAPI, {
            method: "GET",
            url: `/applications/inPreQueue`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static GetInQueueAsync(
        applicationId: number
    ): CancelablePromise<ProductionApplicationDTO> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/applications/inQueue/${applicationId}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
                503: `Service unavailable`,
            },
        });
    }

    public static GetInPreQueueAsync(
        applicationId: number
    ): CancelablePromise<ProductionApplicationDTO> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/applications/inPreQueue/${applicationId}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
                503: `Service unavailable`,
            },
        });
    }
}

export class RecipesService {
    public static SearchAsync(
        query?: string,
        offset: number = 0,
        quantity: number = 5
    ): CancelablePromise<Array<ProductionRecipeDTO>> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/recipes?query=${query}&offset=${offset}&quantity=${quantity}`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}

export class AuthorizationService {
    public static SignInAsync(body: LoginRequest): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/authorization/signin",
            body: body,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static RefreshAsync(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/authorization/refresh",
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}
