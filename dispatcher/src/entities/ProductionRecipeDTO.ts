export type ProductionRecipeDTO = {
    id: number;
    name: string;
    structures: Array<ProductionRecipeStructureDTO>
};

export default ProductionRecipeDTO;

export type ProductionMixerDTO = {
    number: number;
    volume: number;
    virtualNumber: number;
};

export type ProductionRecipeStructureDTO = {
    amount: number;
    mixerOrder: number;
    component: ProductionComponentDTO;
}

export type ProductionComponentDTO = {
    id: number;
    name: string;
    humidity: number;
    impurity: number;
    density: number;
}