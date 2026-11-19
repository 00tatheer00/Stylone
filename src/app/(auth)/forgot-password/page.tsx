import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Recover access to your STYLONE account with a secure password reset link.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
