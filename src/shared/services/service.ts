import { Repository, Filter, FilterExcludingWhere, Where, Count, Relations } from '@shared/repositories/repository';
import { DataObject } from '../types/DataObject';
import { ID } from '../types/ID';


export interface PaginatedResponse<T> {
  data?: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export abstract class Service<T> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  /**
   * Crear una nueva entidad
   */
  create(entity: Partial<T>): T {
    return this.repository.create(entity);
  }

  /**
   * Contar entidades que coincidan con los criterios
   */
  count(where?: Where<T>): Count {
    return this.repository.count(where);
  }

  /**
   * Buscar entidades con filtros (alias para findAll)
   */
  async find(filter?: Filter<T>): Promise<PaginatedResponse<T & Relations>> {
    return this.findAll(filter);
  }

  /**
   * Buscar todas las entidades con filtros y paginación
   */
  findAll(filter?: Filter<T>): PaginatedResponse<T & Relations> {
    // Obtener el total de registros para paginación
    const totalCount = this.repository.count(filter?.where);
    const results = this.repository.find(filter);
    // Calcular información de paginación
    const limit = filter?.limit || results.length;
    const skip = filter?.skip || 0;
    const page = Math.floor(skip / limit) + 1;
    const hasNext = (skip + limit) < totalCount.count;
    const hasPrev = skip > 0;
    return {
      data: results,
      pagination: {
        total: totalCount.count,
        page,
        limit,
        hasNext,
        hasPrev
      }
    }
  }

  /**
   * Actualizar múltiples entidades
   */
  updateAll(data: DataObject<T>, where?: Where<T>): Count {
    // message: `${result.count} entities updated successfully`
    return this.repository.updateAll(data, where);
  }

  /**
   * Buscar entidad por ID
   */
  async findById(id: ID, filter?: FilterExcludingWhere<T>): Promise<T & Relations> {
    // message: 'Entity found successfully'
    // error: error instanceof Error ? error.message : 'Entity not found'
    return await this.repository.findById(id, filter);
  }

  /**
   * Actualizar entidad por ID
   */
  async updateById(id: ID, data: DataObject<T>): Promise<void> {
    // message: 'Entity updated successfully'
    // error: error instanceof Error ? error.message : 'Failed to update entity'
    return await this.repository.updateById(id, data);
  }

  /**
   * Reemplazar entidad por ID (reemplaza completamente la entidad)
   */
  async replaceById(id: ID, data: DataObject<T>): Promise<void> {
    // message: 'Entity replaced successfully'
    // error: error instanceof Error ? error.message : 'Failed to replace entity'
    return await this.repository.replaceById(id, data);
  }

  /**
   * Eliminar entidad por ID
   */
  async deleteById(id: ID): Promise<void> {
    // message: 'Entity deleted successfully'
    // error: error instanceof Error ? error.message : 'Failed to delete entity'
    return await this.repository.deleteById(id);
  }

  // Métodos adicionales útiles

  /**
   * Verificar si existe una entidad por ID
   */
  async exists(id: ID): Promise<boolean> {
    this.validateId(id);
    // message: exists ? 'Entity exists' : 'Entity does not exist'
    return this.repository.exists(id);
  }

  /**
   * Buscar una sola entidad con filtros
   */
  findOne(filter?: Filter<T>): T & Relations | null {
    // message: entity ? 'Entity found' : 'No entity found'
    return this.repository.findOne(filter);
  }

  /**
   * Eliminar múltiples entidades
   */
  deleteAll(where?: Where<T>): Count {
    // message: `${result.count} entities deleted successfully`
    // error: error instanceof Error ? error.message : 'Failed to delete entities'
    return this.repository.deleteAll(where);
  }

  /**
   * Crear múltiples entidades
   */
  async createAll(entities: DataObject<T>[]): Promise<T[]> {
    if (!entities || entities.length === 0) {
      throw new Error('No entities provided for creation');
    }
    entities.forEach((entity, index) => {
      try {
        this.validateEntity(entity as T);
      } catch (error) {
        throw new Error(`Validation failed for entity at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
    // message: `${created.length} entities created successfully`
    return this.repository.createAll(entities);
  }

  protected validateEntity(entity: T): void {
    if (!entity) {
      throw new Error('Entity cannot be null or undefined');
    }
    // Validaciones específicas pueden ser implementadas en subclases
  }

  protected validateId(id: ID): void {
    if (id === null || id === undefined || id === '') {
      throw new Error('ID cannot be null, undefined, or empty');
    }
  }

  getAll(): T[] {
    return this.repository.getAllData()
  }

  getAllDict(): Map<ID, T> {
    return this.repository.getAllDataDict()
  }

}
