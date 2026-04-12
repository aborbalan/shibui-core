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
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@ApiTags('components')
@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new component' })
  @ApiResponse({ status: 201, description: 'Component created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  create(@Body() createComponentDto: CreateComponentDto) {
    return this.componentsService.create(createComponentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all components' })
  @ApiResponse({ status: 200, description: 'List of components' })
  findAll() {
    return this.componentsService.findAll();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get all components in a category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of components in the category',
  })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.componentsService.findByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a component by ID' })
  @ApiParam({ name: 'id', description: 'Component UUID' })
  @ApiResponse({ status: 200, description: 'Component found' })
  @ApiResponse({ status: 404, description: 'Component not found' })
  findOne(@Param('id') id: string) {
    return this.componentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a component' })
  @ApiParam({ name: 'id', description: 'Component UUID' })
  @ApiResponse({ status: 200, description: 'Component updated' })
  @ApiResponse({ status: 404, description: 'Component not found' })
  update(
    @Param('id') id: string,
    @Body() updateComponentDto: UpdateComponentDto,
  ) {
    return this.componentsService.update(id, updateComponentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a component' })
  @ApiParam({ name: 'id', description: 'Component UUID' })
  @ApiResponse({ status: 204, description: 'Component deleted' })
  @ApiResponse({ status: 404, description: 'Component not found' })
  remove(@Param('id') id: string) {
    return this.componentsService.remove(id);
  }
}
