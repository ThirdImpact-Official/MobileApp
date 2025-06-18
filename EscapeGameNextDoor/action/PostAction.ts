import { AddPostForumDto } from '@/interfaces/PublicationInterface/Post/addPostForumDto';
import { GetPostForumDto } from '@/interfaces/PublicationInterface/Post/getPostForumDto';
import { HttpClient } from './httpClient'; // Assurez-vous que le chemin est correct
import { ServiceResponse, PaginationResponse } from '@/interfaces/ServiceResponse'; // Assurez-vous que le chemin est correct
import { GetHasLikeDto } from '@/interfaces/PublicationInterface/Haslike/getHasLikeDto';
import { RemoveHasLikeDto } from '@/interfaces/PublicationInterface/Haslike/removeHasLikeDto';
import { AddHasLikeDto } from '@/interfaces/PublicationInterface/Haslike/addHasLikeDto';
import { GetlikeDto } from '@/interfaces/PublicationInterface/Haslike/getlikes';


export class PostAction {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl('http://localhost:7159/publication/post'); // Remplacez par l'URL de votre API
    }

    // Méthodes pour les Posts
    public async getPostsByForumId(forumId: number, page: number, pageSize: number): Promise<ServiceResponse<GetPostForumDto> | PaginationResponse<GetPostForumDto>> {
        const param: string =`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType(`/forum/${forumId}`+param)
            .executePagination<GetPostForumDto>();
    }
    public async getPostsFromPostParentId(parentId: number, page: number, pageSize: number): Promise<ServiceResponse<GetPostForumDto> | PaginationResponse<GetPostForumDto>> {
        const param: string =`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType(`/postparent/${parentId}`+param)
            .executePagination<GetPostForumDto>();
    }
    public async getPostById(id: number): Promise<ServiceResponse<GetPostForumDto> | PaginationResponse<GetPostForumDto>> {
        return await this.httpClient
            .GetRequestType(`/${id}`)
            .execute<GetPostForumDto>();
    }

    public async createPostForForum(forumId: number, post: AddPostForumDto): Promise<ServiceResponse<GetPostForumDto> | PaginationResponse<GetPostForumDto>> {
        post.forumId = forumId; // Associer le post au forum
        return await this.httpClient
            .PostRequestType(`/forum/${forumId}`)
            .setData(post)
            .execute<GetPostForumDto>();
    }

    public async createPostForPostParent(postParentId: number, post: AddPostForumDto): Promise<ServiceResponse<GetPostForumDto> | PaginationResponse<GetPostForumDto>> {
        post.postparentId = postParentId; // Associer le post à un post parent
        return await this.httpClient
            .PostRequestType(`/post/${postParentId}`)
            .setData(post)
            .execute<GetPostForumDto>();
    }

    public async deletePost(id: number): Promise<ServiceResponse<GetPostForumDto> | PaginationResponse<GetPostForumDto>> {
        return await this.httpClient
            .DeleteRequestType(`/${id}`)
            .execute<GetPostForumDto>();
    }
      public async AddlikeToForum(item: AddHasLikeDto): Promise<ServiceResponse<GetHasLikeDto> | PaginationResponse<GetHasLikeDto>> {
            return await this.httpClient
                .PostRequestType(`/haslike`)
                .setData(item)
                .execute<GetHasLikeDto>();
        }
         public async RemovelikeToForum(item:RemoveHasLikeDto): Promise<ServiceResponse<GetHasLikeDto> | PaginationResponse<GetHasLikeDto>> {
            return await this.httpClient
                .DeleteRequestType(`/haslike`)
                .setData(item)
                .execute<GetHasLikeDto>();
        }
         public async GetlikeToForum(id:number): Promise<ServiceResponse<GetlikeDto> | PaginationResponse<GetlikeDto>> {
            return await this.httpClient
                .GetRequestType(`/haslike/${id}`)
                .execute<GetlikeDto>();
        }
         public async Verifylike(id: number): Promise<ServiceResponse<boolean> | PaginationResponse<boolean>> {
            return await this.httpClient
                .GetRequestType(`/haslike/verify/${id}`)
                .execute<boolean>();
        }
}