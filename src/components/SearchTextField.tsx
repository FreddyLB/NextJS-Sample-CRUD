import styled from "@emotion/styled";
import { ChangeEvent } from "react";
import { TextField, TextFieldProps } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& input": {
    color: "white",
  },
  "& label": {
    color: "white",
  },
  "& .MuiInput-underline": {
    borderBottomColor: "white",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
});

export type SearchTextFieldProps = TextFieldProps & {
  value: string;
  onSearch: (term: string) => void;
  className?: string;
};

export function SearchTextField({
  value,
  onSearch,
  className,
  ...rest
}: SearchTextFieldProps) {
  return (
    <StyledTextField
      {...rest}
      label="Search"
      className={`w-full md:w-1/2 ${className || ""}`}
      value={value}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          onSearch(value);
        }
      }}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
      }}
    />
  );
}
