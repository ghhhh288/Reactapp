"use client";

import styles from "./KeyboardKey.module.css";
import classNames from "classnames";

export default function KeyboardKey({ label, subLabel, onPress, variant = "default" }) {
  return (
    <button
      className={classNames(styles.key, styles[variant])}
      onClick={onPress}
      type="button"
      aria-label={subLabel ? `${label} ${subLabel}` : label}
    >
      <span>{label}</span>
      {subLabel && <small>{subLabel}</small>}
    </button>
  );
}
