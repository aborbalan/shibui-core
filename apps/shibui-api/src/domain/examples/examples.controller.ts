import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExamplesService } from './examples.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Controller('examples')
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.examplesService.create(createExampleDto);
  }

  @Get()
  findAll() {
    return this.examplesService.findAll();
  }

  @Get('component/:componentId')
  findByComponent(@Param('componentId') componentId: string) {
    return this.examplesService.findByComponent(componentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examplesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.examplesService.update(id, updateExampleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.examplesService.remove(id);
  }
}
