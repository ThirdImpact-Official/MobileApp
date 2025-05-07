import { AddCategoryDto } from '@/interfaces/EscapeGameInterface/Category/addCategoryDto';
import { GetCategoryDto } from '@/interfaces/EscapeGameInterface/Category/getCategoryDto';
import { UpdateCategory } from '@/interfaces/EscapeGameInterface/Category/updateCategory';
import { HttpClient } from './httpClient'; // Assurez-vous que le chemin est correct
import { PaginationResponse, ServiceResponse } from '@/interfaces/ServiceResponse'; // Assurez-vous que le chemin est correct

 // Assurez-vous que les DTOs sont correctement définis

export class CategoryAction {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl('http://localhost:7159/escape-game/categorie'); // Remplacez par l'URL de votre API
    }

    // Méthodes pour les catégories
    public async getAllCategories(): Promise<ServiceResponse<GetCategoryDto[]> | PaginationResponse<GetCategoryDto[]>> {
        return await this.httpClient
            .GetRequestType('')
            .execute<GetCategoryDto[]>();
    }

    public async getCategoryById(catId: number): Promise<ServiceResponse<GetCategoryDto> | PaginationResponse<GetCategoryDto>> {
        return await this.httpClient
            .GetRequestType(`/${catId}`)
            .execute<GetCategoryDto>();
    }

    public async createCategory(category: AddCategoryDto): Promise<ServiceResponse<GetCategoryDto> | PaginationResponse<GetCategoryDto>> {
        return await this.httpClient
            .PostRequestType('')
            .setData(category)
            .execute<GetCategoryDto>();
    }

    public async updateCategory(category: UpdateCategory): Promise<ServiceResponse<GetCategoryDto> | PaginationResponse<GetCategoryDto>> {
        return await this.httpClient
            .PutRequestType('')
            .setData(category)
            .execute<GetCategoryDto>();
    }

    public async deleteCategory(id: number): Promise<ServiceResponse<GetCategoryDto> | PaginationResponse<GetCategoryDto>> {
        return await this.httpClient
            .DeleteRequestType(`/${id}`)
            .execute<GetCategoryDto>();
    }

    // Méthodes pour les sous-catégories
    public async getAllSubCategoriesByCategoryParent(parentId: number): Promise<ServiceResponse<GetCategoryDto[]> | PaginationResponse<GetCategoryDto[]>> {
        return await this.httpClient
            .GetRequestType(`/subcategory/${parentId}`)
            .execute<GetCategoryDto[]>();
    }

    public async getSubCategoryById(id: number): Promise<ServiceResponse<GetCategoryDto> | PaginationResponse<GetCategoryDto>> {
        return await this.httpClient
            .GetRequestType(`/subcategory/id/${id}`)
            .execute<GetCategoryDto>();
    }

    public async createSubCategory(subCategory: AddCategoryDto): Promise<ServiceResponse<GetCategoryDto> | PaginationResponse<GetCategoryDto>> {
        return await this.httpClient
            .PostRequestType('/subcategory')
            .setData(subCategory)
            .execute<GetCategoryDto>();
    }

    public async updateSubCategory(subCategory: UpdateCategory): Promise<ServiceResponse<GetCategoryDto> | PaginationResponse<GetCategoryDto>> {
        return await this.httpClient
            .PutRequestType('/subcategory')
            .setData(subCategory)
            .execute<GetCategoryDto>();
    }

    public async deleteSubCategory(id: number): Promise<ServiceResponse<GetCategoryDto> | PaginationResponse<GetCategoryDto>> {
        return await this.httpClient
            .DeleteRequestType(`/subcategory/${id}`)
            .execute<GetCategoryDto>();
    }
}
