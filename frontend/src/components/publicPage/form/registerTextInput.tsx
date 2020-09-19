import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string, any>;

const TextInput: React.FC<Props> = ({
  type,
  style,
  input,
  meta,
  ...rest
}: Props) => (
  <div>
    <input type={type} style={style} {...input} {...rest} />
    <div
      style={{
        height: "20px",
        display: "flex",
        justifyContent: "flexStart",
        alignItems: "flexEnd",
        margin: "0.5rem 0 0 0.5rem",
      }}
    >
      {meta.error && meta.touched && (
        <span style={{ fontSize: "1.2rem", color: "#cc0000" }}>
          * {meta.error}
        </span>
      )}
    </div>
  </div>
);
export default TextInput;
