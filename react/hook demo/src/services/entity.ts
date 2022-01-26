
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDict {
  title: string;
  dcode: string;
}

export interface IHero extends BaseEntity {
  name: string;
  price: number;
}