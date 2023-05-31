import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AxiosResponse } from "axios";
import { Observable, map } from "rxjs";
import { User } from "./user.schema";
import { Model } from "mongoose";

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  findAll(id): Observable<AxiosResponse<any>> {
    return this.httpService.get('https://reqres.in/api/users/'+ id).pipe(
        map(response => response.data),
      );;
  }

  subsCribe(user): Observable<AxiosResponse<any>> {
    return this.httpService.post('http://localhost/emmit', user).pipe(
        map(response => response.data),
      );;
  }
}