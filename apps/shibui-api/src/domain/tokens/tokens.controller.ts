import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { TokensService } from './tokens.service';
import { TokenCategory } from './entities/token.entity';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  @ApiOperation({ summary: 'Get all design tokens from @shibui/ui' })
  @ApiResponse({ status: 200, description: 'Full list of design tokens' })
  findAll() {
    return this.tokensService.findAll();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all available token categories' })
  @ApiResponse({ status: 200, description: 'List of token category identifiers' })
  getCategories() {
    return this.tokensService.getCategories();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get all tokens in a specific category' })
  @ApiParam({
    name: 'category',
    description: 'Token category',
    enum: TokenCategory,
  })
  @ApiResponse({ status: 200, description: 'Tokens filtered by category' })
  findByCategory(@Param('category') category: TokenCategory) {
    return this.tokensService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single token by ID' })
  @ApiParam({ name: 'id', description: 'Token ID, e.g. tok-0001-0000-0000-000000000000' })
  @ApiResponse({ status: 200, description: 'Token found' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  findOne(@Param('id') id: string) {
    return this.tokensService.findOne(id);
  }
}
