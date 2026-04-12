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
import { ExamplesService } from './examples.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@ApiTags('examples')
@Controller('examples')
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new example' })
  @ApiResponse({ status: 201, description: 'Example created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.examplesService.create(createExampleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all examples' })
  @ApiResponse({ status: 200, description: 'List of examples' })
  findAll() {
    return this.examplesService.findAll();
  }

  @Get('component/:componentId')
  @ApiOperation({
    summary: 'Get all examples for a component ordered by position',
  })
  @ApiParam({ name: 'componentId', description: 'Component UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of examples for the component',
  })
  findByComponent(@Param('componentId') componentId: string) {
    return this.examplesService.findByComponent(componentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an example by ID' })
  @ApiParam({ name: 'id', description: 'Example UUID' })
  @ApiResponse({ status: 200, description: 'Example found' })
  @ApiResponse({ status: 404, description: 'Example not found' })
  findOne(@Param('id') id: string) {
    return this.examplesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an example' })
  @ApiParam({ name: 'id', description: 'Example UUID' })
  @ApiResponse({ status: 200, description: 'Example updated' })
  @ApiResponse({ status: 404, description: 'Example not found' })
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.examplesService.update(id, updateExampleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an example' })
  @ApiParam({ name: 'id', description: 'Example UUID' })
  @ApiResponse({ status: 204, description: 'Example deleted' })
  @ApiResponse({ status: 404, description: 'Example not found' })
  remove(@Param('id') id: string) {
    return this.examplesService.remove(id);
  }
}
