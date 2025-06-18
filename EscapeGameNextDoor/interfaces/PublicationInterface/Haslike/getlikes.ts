export interface GetlikeDto {
  getAllThelikes: LikesDto[] | null;
}

export interface LikesDto {
  numberLikes: number | null;
  typeLike: number | null;
}