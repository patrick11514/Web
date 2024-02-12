import { z } from 'zod';
import { adminProcedure } from '../../api';

export const create = adminProcedure.POST.input(
    z.object({
        name: z.string()
    })
).query(async ({ ctx, input }) => {
    console.log(ctx.data);
    console.log(input);

    return 'Ok :)';
});
