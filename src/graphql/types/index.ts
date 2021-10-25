import { asNexusMethod } from 'nexus';
import { DateTimeResolver } from 'graphql-scalars';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date');

export * from './Collection';
export * from './Upcoming';
export * from './Asset';
export * from './Rank';
export * from './Featured';
export * from './Attribute';
export * from './Trait';
