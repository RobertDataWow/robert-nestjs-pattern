import { EntityValidationError } from '@core/error/entity-validate.error';
import { today } from '@core/util/dayjs';
import { randomUUID } from 'crypto';
import { Err } from 'oxide.ts';

export interface BaseEntityProps {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntityProps<T> {
  id?: number;
  props: T;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity<EntityProps> {
  constructor({
    id,
    createdAt,
    updatedAt,
    props,
  }: CreateEntityProps<EntityProps>) {
    const now = today();

    this._id = id || null;
    this._aggregateId = randomUUID();

    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;

    this.props = props;
    this.validate();
  }

  protected readonly props: EntityProps;

  private readonly _createdAt: Date;

  private readonly _id: number;

  private readonly _aggregateId: string;

  private _updatedAt: Date;

  get id(): number | null {
    return this._id;
  }

  get aggregateId(): string {
    return this._aggregateId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  /**
   *  Checks if two entities are the same Entity by comparing ID field.
   * @param object Entity
   */
  public equals(object?: Entity<EntityProps>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!Entity.isEntity(object)) {
      return false;
    }

    return this.id ? this.id === object.id : false;
  }

  /**
   * Returns entity properties.
   * @return {*}  {Props & EntityProps}
   * @memberof Entity
   */
  public getProps(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  /**
   * There are certain rules that always have to be true (invariants)
   * for each entity. Validate method is called every time before
   * saving an entity to the database to make sure those rules are respected.
   */
  public abstract validate(): Err<EntityValidationError> | null;
  public abstract toDbValues(): any;
}
