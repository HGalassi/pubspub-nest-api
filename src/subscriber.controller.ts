
import {
    Body,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor, Inject,
  } from '@nestjs/common';
//   import CreateSubscriberDto from './dto/createSubscriber.dto';
  import { ClientProxy } from '@nestjs/microservices';
   
  @Controller('subscribers')
  @UseInterceptors(ClassSerializerInterceptor)
  export default class SubscribersController {
    constructor(
      @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
    ) {}
    
    @Post('add')
    async add() {
      return this.subscribersService.send({
        cmd: 'add-subscriber'
      }, 'apisubscriber')
    }

    @Post('emmit')
    async emmit(@Body() subscriber) {
        console.log('emmiting event..', subscriber)
      return this.subscribersService.emit({
        cmd: 'user-created'
      }, subscriber)
    }
   
  }