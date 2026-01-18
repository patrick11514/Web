import { procedure } from '../api';
import { nina } from '../nina';

export default procedure.GET.query(async () => await nina.getLiveStatus());
