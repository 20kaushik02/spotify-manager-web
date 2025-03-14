import React from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClickMethod?: () => void;
};

const Button = ({
  children,
  disabled = false,
  onClickMethod = () => {},
}: ButtonProps): React.ReactNode => {
  const clickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    onClickMethod();
  };
  return (
    <button
      type="button"
      disabled={disabled}
      className={styles.btn_wrapper}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default Button;
