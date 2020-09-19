import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string, any>;

const TextInput: React.FC<Props> = ({ type, input, meta, ...rest }: Props) => (
  <div>
    <input type={type} {...input} {...rest} />
  </div>
);
export default TextInput;
