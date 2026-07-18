import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1),
  organization: z.string().trim().optional().default(''),
  email: z.string().trim().email(),
  type: z.enum(['corporate', 'talent', 'other']),
  message: z.string().trim().min(10),
  consent: z.literal(true),
  // honeypot: 人間は空のまま。検証は通し、APIが値ありをbotとして黙って破棄する
  company_website: z.string().optional().default('')
});

export type ContactInput = z.infer<typeof contactSchema>;
