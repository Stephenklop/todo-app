import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    const { title, status } = createTodoDto;

    return await this.prismaService.todo.create({
      data: {
        title,
        status,
      },
    });
  }

  async findAll() {
    return await this.prismaService.todo.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.todo.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
