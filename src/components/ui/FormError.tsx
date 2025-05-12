import { type FieldErrors } from "react-hook-form";

type FormErrorProps = {
  errors: FieldErrors;
  className?: string;
};

const FormError = ({
  errors,
  className = "text-yellow-500",
}: FormErrorProps) => {
  const firstError = Object.values(errors).find((err) => err?.message);
  return firstError ? (
    <p className={className}>{String(firstError.message)}</p>
  ) : null;
};

export default FormError;
