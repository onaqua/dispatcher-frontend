import { Component } from "./Component";


export interface RecipeStructure
{
    recipeId: number;
    componentId: number;
    componentName: string;
    amount: number;
    recalculatedAmount: number;
    recalculatedAmount2: number;
    mixOrder: number;
    correct: number;
    isSetCorrect: boolean;
    component: Component;
}
