import { DataObject } from "../types/DataObject";
import { ID } from "../types/ID";

export interface Options {
  [key: string]: unknown;
}

export interface Filter<T> {
  where?: Where<T>;
  fields?: (keyof T)[];
  include?: unknown[];
  order?: string[];
  limit?: number;
  skip?: number;
}

export type FilterExcludingWhere<T> = Omit<Filter<T>, 'where'>;

export type Condition<T> =
  | T
  | {
    eq?: T;
    neq?: T;
    gt?: T;
    gte?: T;
    lt?: T;
    lte?: T;
    in?: T[];
    nin?: T[];
    like?: string;
  };

export type FieldFilter<T> = {
  [P in keyof T]?: Condition<T[P]>;
};

export type LogicalOperators<T> = {
  and?: Where<T>[];
  or?: Where<T>[];
  not?: Where<T>;
};

export type Where<T> = FieldFilter<T> & LogicalOperators<T>;


export interface Relations {
  [key: string]: unknown;
}

export interface Count {
  count: number;
}


export abstract class Repository<T> {
  abstract create(entity: Partial<T>, options?: Options): T;
  abstract createAll(entities: DataObject<T>[], options?: Options): T[];
  abstract save(entity: T, options?: Options): Promise<T>;
  abstract find(filter?: Filter<T>, options?: Options): (T & Relations)[];
  abstract findOne(filter?: Filter<T>, options?: Options): (T & Relations) | null;
  abstract findById(id: ID, filter?: FilterExcludingWhere<T>, options?: Options): Promise<T & Relations>;
  abstract update(entity: T, options?: Options): Promise<void>;
  abstract delete(entity: T, options?: Options): Promise<void>;
  abstract updateAll(data: DataObject<T>, where?: Where<T>, options?: Options): Count;
  abstract updateById(id: ID, data: DataObject<T>, options?: Options): Promise<void>;
  abstract replaceById(id: ID, data: DataObject<T>, options?: Options): Promise<void>;
  abstract deleteAll(where?: Where<T>, options?: Options): Count;
  abstract deleteById(id: ID, options?: Options): Promise<void>;
  abstract count(where?: Where<T>, options?: Options): Count;
  abstract exists(id: ID, options?: Options): boolean;
  abstract getAllData(): T[];
  abstract getAllDataDict(): Map<ID, T>;
  abstract clear(): void;
}

// Implementación concreta del repositorio que usa un diccionario en memoria
export class DictionaryRepository<T extends DataObject<T>> extends Repository<T> {
  private readonly data: Map<ID, T> = new Map();
  private nextId: number = 1;

  create(entity: DataObject<T>): T {
    const id = entity.id ?? this.nextId++;
    const newEntity = { ...entity, id } as T;
    this.data.set(id, newEntity);
    return structuredClone(newEntity);
  }

  createAll(entities: DataObject<T>[]): T[] {
    const results: T[] = [];
    for (const entity of entities) {
      const created = this.create(entity);
      results.push(created);
    }
    return results;
  }

  async save(entity: T): Promise<T> {
    const id = entity.id;
    if (!id) {
      throw new Error('Entity must have an id to be saved');
    }
    this.data.set(id, entity);
    return structuredClone(entity);
  }

  find(filter?: Filter<T>): (T & Relations)[] {
    let results = Array.from(this.data.values()) as (T & Relations)[];

    // Aplicar filtro where si existe
    if (filter?.where) {
      results = this.applyWhereFilter(results, filter.where);
    }

    // Aplicar order si existe
    if (filter?.order) {
      results = this.applyOrder(results, filter.order);
    }

    // Aplicar skip y limit
    if (filter?.skip) {
      results = results.slice(filter.skip);
    }
    if (filter?.limit) {
      results = results.slice(0, filter.limit);
    }

    // Aplicar fields si existe
    if (filter?.fields) {
      results = results.map(item => this.selectFields(item, filter.fields!));
    }

    return results;
  }

  findOne(filter?: Filter<T>): (T & Relations) | null {
    const results = this.find(filter);
    return results.length > 0 ? results[0] : null;
  }

  async findById(id: ID, filter?: FilterExcludingWhere<T>): Promise<T & Relations> {
    const entity = this.data.get(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }

    let result = entity as T & Relations;

    // Aplicar fields si existe
    if (filter?.fields) {
      result = this.selectFields(result, filter.fields);
    }

    return result;
  }

  async update(entity: T): Promise<void> {
    const id = entity.id;
    if (!id) {
      throw new Error('Entity must have an id to be updated');
    }
    if (!this.data.has(id)) {
      throw new Error(`Entity with id ${id} not found`);
    }
    this.data.set(id, entity);
  }

  async delete(entity: T): Promise<void> {
    const id = entity.id;
    if (!id) {
      throw new Error('Entity must have an id to be deleted');
    }
    if (!this.data.delete(id)) {
      throw new Error(`Entity with id ${id} not found`);
    }
  }

  updateAll(data: DataObject<T>, where?: Where<T>): Count {
    let count = 0;
    for (const [id, entity] of this.data.entries()) {
      if (!where || this.matchesWhere(entity, where)) {
        const updated = { ...entity, ...data };
        this.data.set(id, updated);
        count++;
      }
    }
    return { count };
  }

  async updateById(id: ID, data: DataObject<T>): Promise<void> {
    const entity = this.data.get(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    const updated = { ...entity, ...data };
    this.data.set(id, updated);
  }

  async replaceById(id: ID, data: DataObject<T>): Promise<void> {
    if (!this.data.has(id)) {
      throw new Error(`Entity with id ${id} not found`);
    }
    this.data.set(id, { ...data, id } as T);
  }

  deleteAll(where?: Where<T>): Count {
    let count = 0;
    const toDelete: ID[] = [];
    for (const [id, entity] of this.data.entries()) {
      if (!where || this.matchesWhere(entity, where)) {
        toDelete.push(id);
        count++;
      }
    }
    for (const id of toDelete) {
      this.data.delete(id);
    }
    return { count };
  }

  async deleteById(id: ID): Promise<void> {
    if (!this.data.delete(id)) {
      throw new Error(`Entity with id ${id} not found`);
    }
  }

  count(where?: Where<T>): Count {
    if (!where) {
      return { count: this.data.size };
    }

    let count = 0;
    for (const entity of this.data.values()) {
      if (this.matchesWhere(entity, where)) {
        count++;
      }
    }

    return { count };
  }

  exists(id: ID): boolean {
    return this.data.has(id);
  }

  // Métodos auxiliares privados
  private applyWhereFilter(items: (T & Relations)[], where: Where<T>): (T & Relations)[] {
    return items.filter(item => this.matchesWhere(item, where));
  }

  private matchesWhere(item: T, where: Where<T>): boolean {
    return this.evaluateWhereCondition(item, where);
  }

  private evaluateWhereCondition(item: T, where: Where<T>): boolean {
    // Evaluar operadores lógicos
    if (where.and) {
      return where.and.every(condition => this.evaluateWhereCondition(item, condition));
    }

    if (where.or) {
      return where.or.some(condition => this.evaluateWhereCondition(item, condition));
    }

    if (where.not) {
      return !this.evaluateWhereCondition(item, where.not);
    }

    // Evaluar condiciones de campo
    for (const [key, condition] of Object.entries(where)) {
      // Saltar operadores lógicos ya procesados
      if (key === 'and' || key === 'or' || key === 'not') {
        continue;
      }

      const fieldValue = (item as Record<string, unknown>)[key];

      if (!this.evaluateFieldCondition(fieldValue, condition)) {
        return false;
      }
    }

    return true;
  }

  private evaluateFieldCondition(fieldValue: unknown, condition: unknown): boolean {
    // Si la condición es un valor directo, verificar igualdad
    if (this.isDirectValue(condition)) {
      return fieldValue === condition;
    }

    // Si la condición es un objeto con operadores
    if (typeof condition === 'object' && condition !== null) {
      return this.evaluateOperatorCondition(fieldValue, condition as Record<string, unknown>);
    }

    // Si llegamos aquí, asumir igualdad directa
    return fieldValue === condition;
  }

  private isDirectValue(condition: unknown): boolean {
    return condition === null || condition === undefined ||
      typeof condition === 'string' || typeof condition === 'number' ||
      typeof condition === 'boolean';
  }

  private evaluateOperatorCondition(fieldValue: unknown, conditionObj: Record<string, unknown>): boolean {
    // Operadores de igualdad
    if ('eq' in conditionObj) {
      return fieldValue === conditionObj.eq;
    }
    if ('neq' in conditionObj) {
      return fieldValue !== conditionObj.neq;
    }

    // Operadores de comparación
    if (this.hasComparisonOperator(conditionObj)) {
      return this.evaluateComparisonOperators(fieldValue, conditionObj);
    }

    // Operadores de array
    if (this.hasArrayOperator(conditionObj)) {
      return this.evaluateArrayOperators(fieldValue, conditionObj);
    }

    // Operador like
    if ('like' in conditionObj) {
      return this.evaluateLikeOperator(fieldValue, conditionObj.like);
    }

    return false;
  }

  private hasComparisonOperator(conditionObj: Record<string, unknown>): boolean {
    return 'gt' in conditionObj || 'gte' in conditionObj || 'lt' in conditionObj || 'lte' in conditionObj;
  }

  private evaluateComparisonOperators(fieldValue: unknown, conditionObj: Record<string, unknown>): boolean {
    if (typeof fieldValue !== 'number') {
      return false;
    }

    if ('gt' in conditionObj && typeof conditionObj.gt === 'number') {
      return fieldValue > conditionObj.gt;
    }
    if ('gte' in conditionObj && typeof conditionObj.gte === 'number') {
      return fieldValue >= conditionObj.gte;
    }
    if ('lt' in conditionObj && typeof conditionObj.lt === 'number') {
      return fieldValue < conditionObj.lt;
    }
    if ('lte' in conditionObj && typeof conditionObj.lte === 'number') {
      return fieldValue <= conditionObj.lte;
    }

    return false;
  }

  private hasArrayOperator(conditionObj: Record<string, unknown>): boolean {
    return 'in' in conditionObj || 'nin' in conditionObj;
  }

  private evaluateArrayOperators(fieldValue: unknown, conditionObj: Record<string, unknown>): boolean {
    if ('in' in conditionObj && Array.isArray(conditionObj.in)) {
      return conditionObj.in.includes(fieldValue);
    }
    if ('nin' in conditionObj && Array.isArray(conditionObj.nin)) {
      return !conditionObj.nin.includes(fieldValue);
    }
    return false;
  }

  private evaluateLikeOperator(fieldValue: unknown, likePattern: unknown): boolean {
    if (typeof fieldValue !== 'string' || typeof likePattern !== 'string') {
      return false;
    }

    // Convertir el patrón LIKE a regex
    const regexPattern = likePattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escapar caracteres especiales
      .replace(/%/g, '.*') // % = cualquier secuencia
      .replace(/_/g, '.'); // _ = cualquier carácter

    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(fieldValue);
  }

  private applyOrder(items: (T & Relations)[], order: string[]): (T & Relations)[] {
    return items.sort((a, b) => this.compareItems(a, b, order));
  }

  private compareItems(a: T & Relations, b: T & Relations, order: string[]): number {
    for (const orderBy of order) {
      const result = this.compareByField(a, b, orderBy);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  }

  private compareByField(a: T & Relations, b: T & Relations, orderBy: string): number {
    const [field, direction = 'ASC'] = orderBy.split(' ');
    const aValue = (a as Record<string, unknown>)[field];
    const bValue = (b as Record<string, unknown>)[field];

    if (!this.areComparableValues(aValue, bValue)) {
      return 0;
    }

    const comparison = this.getValueComparison(aValue, bValue);
    return direction.toUpperCase() === 'DESC' ? -comparison : comparison;
  }

  private areComparableValues(aValue: unknown, bValue: unknown): boolean {
    return (typeof aValue === 'string' && typeof bValue === 'string') ||
      (typeof aValue === 'number' && typeof bValue === 'number');
  }

  private getValueComparison(aValue: unknown, bValue: unknown): number {
    // Type assertion después de verificar con areComparableValues
    const a = aValue as string | number;
    const b = bValue as string | number;

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  private selectFields(item: T & Relations, fields: (keyof T)[]): T & Relations {
    const result: Record<string, unknown> = {};
    for (const field of fields) {
      result[field as string] = (item as Record<string, unknown>)[field as string];
    }
    return result as T & Relations;
  }

  // Método para obtener todos los datos (útil para debugging)
  public getAllDataDict(): Map<ID, T> {
    const copy = new Map<ID, T>();
    for (const [key, value] of this.data.entries()) {
      copy.set(key, structuredClone(value)); // 🔁 Deep copy
    }
    return copy;
  }

  public getAllData(): T[] {
    const copy: T[] = [];
    for (const value of this.data.values()) {
      copy.push(structuredClone(value)); // 🔁 Deep copy
    }
    return copy;
  }


  // Método para limpiar todos los datos
  public clear(): void {
    this.data.clear();
    this.nextId = 1;
  }
}
