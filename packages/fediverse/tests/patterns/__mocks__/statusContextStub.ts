import type { GenericStatus } from '../../../src/generics/index.js';
import type { StatusActionHandlers } from '../../../src/components/Status/context.js';

export const STUB_STATUS_CONTEXT = Symbol('test-status-context');

export interface StubStatusContext {
  status: GenericStatus;
  handlers: StatusActionHandlers;
}
