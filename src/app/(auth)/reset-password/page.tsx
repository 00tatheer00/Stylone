import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Choose a new secure password for your STYLONE account.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
