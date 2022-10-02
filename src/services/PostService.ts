import BaseService from "./BaseService";
import { PostType } from "./types";

class PostService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/orders/post/";
  }

  getPosts = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  createPost = async (post: PostType) => {
    return await this.createResourceJSON(this._apiURL, post);
  };

  getPost = async (pk: number) => {
    return await this.getResource(`${this._apiURL}${pk}`);
  };

  updatePost = async (pk: number, post: PostType) => {
    return await this.updateResourceJSON(`${this._apiURL}${pk}`, post);
  };

  deletePost = async (pk: number) => {
    return await this.deleteResource(`${this._apiURL}${pk}`);
  };
}

export default PostService;
