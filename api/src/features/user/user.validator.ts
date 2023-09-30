import { z } from 'zod';

const passwordSchema = z.string().min(8);

const changePasswordRequestObject = {
  body: z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
  }),
};
export const changePasswordRequestSchema = z.object(
  changePasswordRequestObject
);
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;
