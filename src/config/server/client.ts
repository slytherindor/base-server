import * as path from 'path';
import {CLIENT_PATH, prod} from '../../utils/secrets';

export const clientBuildDir = prod
  ? path.join(__dirname, '..', '..', '..', 'client')
  : path.resolve(CLIENT_PATH!);
