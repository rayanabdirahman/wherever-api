import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './api/registrable.controller';
import ProductController from './api/product/product.controller';
import CategoryController from './api/category/category.controller';
import OrderController from './api/order/order.controller';
import UserController from './api/user/user.controller';
import AddressController from './api/address/address.controller';
import {
  CategoryService,
  CategoryServiceImpl
} from './services/category.service';
import {
  CategoryRepository,
  CategoryRepositoryImpl
} from './database/repositories/category.repository';
import { ProductService, ProductServiceImpl } from './services/product.service';
import {
  ProductRepository,
  ProductRepositoryImpl
} from './database/repositories/product.repository';
import OrganisationController from './api/organisation/organisation.controller';
import {
  OrganisationService,
  OrganisationServiceImpl
} from './services/organisation.service';
import {
  OrganisationRepository,
  OrganisationRepositoryImpl
} from './database/repositories/organisation.repository';
import StoreController from './api/store/store.controller';
import { StoreService, StoreServiceImpl } from './services/store.service';
import {
  StoreRepository,
  StoreRepositoryImpl
} from './database/repositories/store.repository';
import { AccountService, AccountServiceImpl } from './services/account.service';
import {
  UserRepository,
  UserRepositoryImpl
} from './database/repositories/user.repository';
import AccountController from './api/account/account.controller';
import { UserService, UserServiceImpl } from './services/user.service';
import { AddressService, AddressServiceImpl } from './services/address.service';
import {
  AddressRepository,
  AddressRepositoryImpl
} from './database/repositories/address.repository';

const container = new Container();

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(ProductController);
container.bind<RegistrableController>(TYPES.Controller).to(CategoryController);
container.bind<RegistrableController>(TYPES.Controller).to(OrderController);
container.bind<RegistrableController>(TYPES.Controller).to(UserController);
container
  .bind<RegistrableController>(TYPES.Controller)
  .to(OrganisationController);
container.bind<RegistrableController>(TYPES.Controller).to(StoreController);
container.bind<RegistrableController>(TYPES.Controller).to(AccountController);
container.bind<RegistrableController>(TYPES.Controller).to(UserController);
container.bind<RegistrableController>(TYPES.Controller).to(AddressController);

// services
container.bind<CategoryService>(TYPES.CategoryService).to(CategoryServiceImpl);
container.bind<ProductService>(TYPES.ProductService).to(ProductServiceImpl);
container
  .bind<OrganisationService>(TYPES.OrganisationService)
  .to(OrganisationServiceImpl);
container.bind<StoreService>(TYPES.StoreService).to(StoreServiceImpl);
container.bind<AccountService>(TYPES.AccountService).to(AccountServiceImpl);
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl);
container.bind<AddressService>(TYPES.AddressService).to(AddressServiceImpl);

// repository
container
  .bind<CategoryRepository>(TYPES.CategoryRepository)
  .to(CategoryRepositoryImpl);
container
  .bind<ProductRepository>(TYPES.ProductRepository)
  .to(ProductRepositoryImpl);
container
  .bind<OrganisationRepository>(TYPES.OrganisationRepository)
  .to(OrganisationRepositoryImpl);
container.bind<StoreRepository>(TYPES.StoreRepository).to(StoreRepositoryImpl);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
container
  .bind<AddressRepository>(TYPES.AddressRepository)
  .to(AddressRepositoryImpl);

export default container;
