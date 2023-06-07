import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './app.user.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDto } from './app.user.dto';


@Controller('/api/user')
export class AppController {
  constructor(private readonly appService: AppService, private  userService: UserService, private mailerService: MailerService
     ) {}

  @Get()
  async getUserById(@Query('id') id : number) {
    try{
      let resp =  (await firstValueFrom(this.userService.findAll(id))).data
      return resp;
    }catch(err){
      console.log('err on catch..', err)
      this.someErrorLoggingThings(err)
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
      this.appService.saveUser(user).then(res => {
        console.log(res)
        this.sendEmail(res)
        this.userService.subsCribe(res)
      })

    }catch(err){
      console.log(err)
      throw new HttpException(err.response.statusText, err.response.status)
    }

    return userDto;
}

  @Get(':id/avatar')
  async getAvatar(@Param('id') id){

    //checks if image not stored yet
    const existingUSer = this.appService.findUser(id)

    //if query returns > 0 results, show result from db
    if (existingUSer){
      return JSON.stringify(existingUSer)
    }

  }
  

  async sendEmail(user){
    console.log('sending email..')
    await this.mailerService.sendMail({
      to: 'hgalassi17@gmail.com',
      from: 'hgalassi17@gmail.com',
      subject: 'Sending Email with NestJS',
      html: `<h3 style="color: red">This email comes from ${user.first_name} ${user.last_name} pubsub api.. =) User created with success! </h3>`,
    });
  }

  public someErrorLoggingThings(err) {
    //do smthing
    console.log(err)
  }
}


