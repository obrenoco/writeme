import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

export const Select: React.FC<DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>> = ({
  className = "",
  ...props
}) => <select {...props} className={`select ${className}`} />;
