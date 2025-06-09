import { HttpClient } from "./httpClient";
import { UpdateAdressDto } from "@/interfaces/OrganisationInterface/Adress/updateAdressDto";
import { GetAddressDto } from "@/interfaces/EscapeGameInterface/Address/getAddressDto";
import { AddAddressDto } from "@/interfaces/OrganisationInterface/Adress/addAdressDto";
import { ServiceResponse } from "../interfaces/ServiceResponse";
export class AddressAction {
  private httpClient: HttpClient;
  private apibaseurl: string = "http://localhost:7159/escape-game/accueil";
  constructor() {
    this.httpClient = new HttpClient();
    this.httpClient.setBaseUrl(this.apibaseurl);
  }

  /**
   * Gets an address by its ID.
   * @param {number} id - The ID of the address to be retrieved.
   * @returns {Promise<ServiceResponse<GetAddressDto>>} A promise that resolves with a ServiceResponse object.
   *          If the request is successful, the data property of the ServiceResponse object will contain the
   *          requested address. If the request fails, the data property will be null and the success property
   *          will be false.
   * @throws {Error} If the request to get the address fails.
   */
  public async getById(id: number): Promise<ServiceResponse<GetAddressDto>> {
    const res = await this.httpClient
      .GetRequestType(`/${id}`)
      .execute<GetAddressDto>();
    return res;
  }

  /**
   * Adds a new address.
   * @param {AddAddressDto} dto - The new address data.
   * @returns {Promise<ServiceResponse<GetAddressDto>>} A promise that resolves with a ServiceResponse object.
   *          If the request is successful, the data property of the ServiceResponse object will contain the newly
   *          created address. If the request fails, the data property will be null and the success property will
   *          be false.
   * @throws {Error} If the request to add the address fails.
   */
  public async add(
    dto: AddAddressDto
  ): Promise<ServiceResponse<GetAddressDto>> {
    const res = await this.httpClient
      .PostRequestType("")
      .setData(dto)
      .execute<GetAddressDto>();
    return res;
  }

  /**
   * Deletes an address by its ID.
   * @param {number} id - The ID of the address to be deleted.
   * @returns {Promise<ServiceResponse<GetAddressDto>>} A promise that resolves with a ServiceResponse object.
   *          If the request is successful, the data property of the ServiceResponse object will contain the deleted
   *          address. If the request fails, the data property will be null and the success property will
   *          be false.
   * @throws {Error} If the request to delete the address fails.
   */

  public async delete(id: number): Promise<ServiceResponse<GetAddressDto>> {
    const res = await this.httpClient
      .DeleteRequestType(`/${id}`)
      .execute<GetAddressDto>();
    return res;
  }
}
