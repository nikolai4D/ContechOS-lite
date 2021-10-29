import { Injectable } from '@nestjs/common';
import { CreateNodeInput } from '../nodes/dto/create-node.input';
import { Config } from '../config/Config';

@Injectable()
export class ValidationService {
  public validateConfigNode(node: CreateNodeInput): boolean {
    return (
      node.properties.hasOwnProperty('allowedConfigIds') &&
      Array.isArray(node.properties['allowedConfigIds']) &&
      // casting an Array to a Set removes the duplicates --> so if the arraylenght is different from the Setsize there are duplicates and it should be rejected
      new Set(node.properties['allowedConfigIds']).size ===
        node.properties['allowedConfigIds'].length &&
      node.properties['allowedConfigIds'].every(
        (data) => typeof data === 'string' && true && data !== '',
      ) &&
      node.properties.hasOwnProperty('allowedPropertyKeyIds') &&
      Array.isArray(node.properties['allowedPropertyKeyIds']) &&
      new Set(node.properties['allowedPropertyKeyIds']).size ===
        node.properties['allowedPropertyKeyIds'].length &&
      node.properties['allowedPropertyKeyIds'].every(
        (data) => typeof data === 'string' && true && data !== '',
      ) &&
      node.labels.length === 2 &&
      new Set(node.labels).size === node.labels.length &&
      !Config.NODETYPE.includes(
        node.labels.filter((data) => data !== Config.CONFIG)[0],
      )
    );
  }

  public validateDataNode(node: CreateNodeInput): boolean {
    return (
      node.properties.hasOwnProperty('allowedConfigIds') &&
      Array.isArray(node.properties['allowedConfigIds']) &&
      // casting an Array to a Set removes the duplicates --> so if the arraylenght is different from the Setsize there are duplicates and it should be rejected
      new Set(node.properties['allowedConfigIds']).size ===
        node.properties['allowedConfigIds'].length &&
      node.properties['allowedConfigIds'].every(
        (data) => typeof data === 'string' && true && data !== '',
      ) &&
      node.labels.length === 2 &&
      new Set(node.labels).size === node.labels.length &&
      !Config.NODETYPE.includes(
        node.labels.filter((data) => data !== Config.DATA)[0],
      )
    );
  }

  public validatePropertyValueNode(node: CreateNodeInput): boolean {
    return (
      node.properties.hasOwnProperty('value') &&
      typeof node.properties['value'] === 'string' &&
      node.properties['value'] !== null &&
      node.properties['value'] !== '' &&
      node.properties.hasOwnProperty('propertyKeyId') &&
      typeof node.properties['propertyKeyId'] === 'string' &&
      node.properties['propertyKeyId'] !== null &&
      node.properties['propertyKeyId'] !== '' &&
      node.labels.length === 1
    );
  }

  public validatePropertyKeyNode(node: CreateNodeInput): boolean {
    return (
      node.properties.hasOwnProperty('key') &&
      typeof node.properties['key'] === 'string' &&
      node.properties['key'] !== null &&
      node.properties['key'] !== '' &&
      node.properties.hasOwnProperty('isAllowedToCreateNewValue') &&
      typeof node.properties['isAllowedToCreateNewValue'] === 'boolean' &&
      node.properties['isAllowedToCreateNewValue'] !== null &&
      node.properties.hasOwnProperty('datatypeId') &&
      typeof node.properties['datatypeId'] === 'string' &&
      node.properties['datatypeId'] !== null &&
      node.properties['datatypeId'] !== '' &&
      node.labels.length === 1
    );
  }

  public validateDatatypeNode(node: CreateNodeInput): boolean {
    return (
      node.properties.hasOwnProperty('type') &&
      typeof node.properties['type'] === 'string' &&
      node.properties['type'] !== null &&
      node.properties['type'] !== '' &&
      node.labels.length === 1
    );
  }
}
