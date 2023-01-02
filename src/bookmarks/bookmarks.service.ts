import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from '../../types/bookmarks/dto';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  getAllUserBookmarks(userId: string): object {
    try {
      return this.prisma.bookmark.findMany({
        where: {
          userId: userId,
        },
      });
    } catch (err) {
      return err;
    }
  }

  getUserBookmarkById(userId: string, bookmarkId: string) {
    try {
      return this.prisma.bookmark.findFirst({
        where: { id: bookmarkId, userId },
      });
    } catch (error) {
      throw error;
    }
  }
  async createBookmark(userId: string, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: string,
    bookmarkId: string,
    dto: EditBookmarkDto,
  ) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    const editedBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
    console.log('Edited: ' + editedBookmark);
    return editedBookmark;
  }

  async deleteBookmarkById(userId: string, bookmarkId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
