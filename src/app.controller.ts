import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './app.user.service';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDto } from './app.user.dto';


@Controller('/api/user')
export class AppController {
  constructor(private readonly appService: AppService, private  userService: UserService,
     @InjectModel(User.name) private userModel: Model<User>,
     private mailerService: MailerService
     ) {}

  @Get()
  async getUserById(@Query('id') id : number) {



    try{
      let resp = await firstValueFrom(this.userService.findAll(id))
      return resp;
    }catch(err){
      throw new HttpException(err.response.statusText, err.response.status)
    }
  }

  @Post()
  public async newUser(@Body() userDto: UserDto): Promise<UserDto> {

    let user = { 
      id: userDto.id,
      first_name: userDto.first_name,
      last_name: userDto.last_name,
      avatar: userDto.avatar
    }
      
    try{ 
      const createdUser = new this.userModel(user)
      createdUser.save();
      this.sendEmail(createdUser);
      this.userService.subsCribe(user)
    }catch(err){
      console.log(err)
    }

    return userDto;
}

  @Get(':id/avatar')
  async getAvatar(@Param('id') id){

    //checks if image not stored yet
    const existingUSer = await this.userModel.find({id: id}, { avatar:1}).exec();

    //if query returns > 0 results, show result from db
    if (existingUSer){
      console.log(existingUSer)
      return JSON.stringify(existingUSer)
    }

  }
  

  async sendEmail(user){
    console.log('sending email..')
    await this.mailerService.sendMail({
      to: 'hgalassi17@gmail.com',
      from: 'hgalassi17@gmail.com',
      subject: 'Sending Email with NestJS',
      html: `<h3 style="color: red">This email comes from ${user.first_name} pubsub api.. =) User created with success! </h3>`,
    });
  }
}
