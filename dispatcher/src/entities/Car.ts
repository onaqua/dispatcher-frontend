import { BaseInfo } from "./BaseInfo";
import { CarDriver } from "./CarDriver";
import { CarBrand } from "./CarBrand";


export interface Car extends BaseInfo
{
    volume: number;
    driver?: CarDriver;
    brand?: CarBrand;
}
