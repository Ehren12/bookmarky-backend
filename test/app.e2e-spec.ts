import { ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDTO } from '../src/auth/dto';
import { EditDTO } from 'src/user/dto';
import { CreateBookmarkDTO, EditBookMarkDTO } from 'src/bookmark/dto';

jest.setTimeout(8000);
describe('App e2e', () => {
  let prisma: PrismaService;
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = (await moduleRef).createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDTO = {
      email: 'nwokochaehren@gmail.com',
      password: 'ehren123',
    };
    describe('Signup', () => {
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Login', () => {
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAT', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get Me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200);
      });
    });

    describe('Edit User', () => {
      const editDto: EditDTO = {
        firstName: 'Ehren',
        lastName: 'Chicken',
      };
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody(editDto)
          .expectStatus(200);
      });
    });
  });
  describe('Bookmarks', () => {
    describe('Get Empty Bookmarks', () => {
      it('returns bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create Bookmarks', () => {
      const dto: CreateBookmarkDTO = {
        title: 'Ching Chang',
        link: 'https://ching.com',
      };
      it('should create new bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get Bookmarks', () => {
      it('returns bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get bookmarks by id', () => {
      it('returns bookmarks by id', () => {
        return pactum
          .spec()
          .get(`/bookmarks/{id}`)
          .withPathParams('id', `$S{bookmarkId}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectBodyContains(`$S{bookmarkId}`);
      });
    });
    describe('Edit Bookmark', () => {
      const dto: EditBookMarkDTO = {
        description: 'Food store site',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', `$S{bookmarkId}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.description);
      });
    });
    describe('Delete Bookmarks', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', `$S{bookmarkId}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(204);
      });

      it('should get empty bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
