import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDto {
  // Validates for a non-empty string
  @IsNumber({ allowNaN: false }, { each: true })
  public id: number;

  // Gets only validated if it's part of the request's body
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public first_name: string;

  // Validates for an integer
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public last_name: string;

  // Validates for an integer
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public avatar: string;

}