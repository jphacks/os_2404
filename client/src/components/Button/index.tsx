import type { ComponentProps, FC, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
  sm?: boolean;
};

export const Button: FC<ButtonProps> = ({ children, sm, ...rest }) => {
  return (
    <button
      type={rest.type || "button"}
      className={`${
        sm ? "border p-1 text-sm" : "border-2 p-2 text-base"
      } rounded-md transition-all hover:bg-white hover:text-[#083776] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent`}
      {...rest}
    >
      {children}
    </button>
  );
};
