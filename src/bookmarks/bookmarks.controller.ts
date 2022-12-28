import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { BookmarksService } from './bookmarks.service';
import { GetUser } from 'src/auth/decorators/get_user.decorator';
import { Body, Param, Req } from '@nestjs/common/decorators';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { Request } from 'express';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarkService: BookmarksService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('')
  getUserBookmarks(@GetUser('userId') userId: string) {
    console.log(userId);
    return this.bookmarkService.getAllUserBookmarks(userId);
  }
  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  getBookmarkById(
    @GetUser('userId') userId: string,
    @Param('id') bookmarkId: string,
  ) {
    console.log('BookmarkId: ' + bookmarkId);
    return this.bookmarkService.getUserBookmarkById(userId, bookmarkId);
  }
  @UseGuards(AuthenticatedGuard)
  @UseGuards(AuthenticatedGuard)
  @Post('create')
  createBookmark(
    @GetUser('userId') userId: string,
    @Body() dto: CreateBookmarkDto,
  ) {
    console.log('Res ' + userId);
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/edit/:id')
  editBookmarkById(
    @GetUser('userId') userId: string,
    @Param('id') bookmarkId: string,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('delete/:id')
  deleteBookmarkById(
    @GetUser('userId') userId: string,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
