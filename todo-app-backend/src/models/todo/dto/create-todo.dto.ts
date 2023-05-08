import { TodoStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsEnum(TodoStatus)
  status: TodoStatus;
}
