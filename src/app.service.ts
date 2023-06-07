import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<User>){}
  getHello(): string {
    return 'Hello World!';
  }

  async saveUser(user) {
    const createdUser = await new this.userModel(user)
    return createdUser.save()
  }

  async findUser(id){
    let result = await this.userModel.find({id: id}, { avatar:1}).exec();
    return result
  }
}
