import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable, map } from "rxjs";

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  findAll(id): Observable<AxiosResponse<any>> {
    return this.httpService.get('https://reqres.in/api/users/'+ id)
  }

  subsCribe(user): Observable<AxiosResponse<any>> {
    return this.httpService.post('http://localhost/emmit', user).pipe(
        map(response => response.data),
      );;
  }
}