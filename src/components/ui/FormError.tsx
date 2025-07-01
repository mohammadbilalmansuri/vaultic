import { FieldErrors } from "react-hook-form";
import cn from "@/utils/cn";

interface FormErrorProps {
  errors: FieldErrors;
  className?: string;
}

const FormError = ({ errors, className = "" }: FormErrorProps) => {
  const firstError = Object.values(errors).find((err) => err?.message);
  return firstError ? (
    <p className={cn("text-yellow-600 dark:text-yellow-500", className)}>
      {String(firstError.message)}
    </p>
  ) : null;
};

export default FormError;
