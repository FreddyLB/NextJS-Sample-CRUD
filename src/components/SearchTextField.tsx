import styled from "@emotion/styled";
import { ChangeEvent } from "react";
import { TextField } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "gray",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "gray",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
});

export interface SearchTextFieldProps {
  value: string;
  onSearch: (term: string) => void;
  className?: string;
}

export function SearchTextField({
  value,
  onSearch,
  className,
}: SearchTextFieldProps) {
  return (
    <StyledTextField
      label="Search"
      variant="standard"
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
