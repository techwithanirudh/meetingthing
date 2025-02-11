import { CheckCircle } from 'lucide-react';

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className='flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-emerald-500 text-sm'>
      <CheckCircle size={16} />
      <p>{message}</p>
    </div>
  );
};