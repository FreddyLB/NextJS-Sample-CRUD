import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IProduct } from "src/shared/models/product.model";
import { Box, MUIStyledCommonProps } from "@mui/system";

const StyledTableCell = styled(TableCell)(
  ({ theme }: MUIStyledCommonProps) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme!.palette.common.black,
      color: theme!.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 18,
    },
  })
);

const StyledTableRow = styled(TableRow)(({ theme }: MUIStyledCommonProps) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme!.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export interface ProductTableProps {
  items: IProduct[];
}

export default function ProductTable({ items }: ProductTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="right">Name</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">Color</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((product) => (
            <StyledTableRow key={product.id}>
              <StyledTableCell component="th" scope="row">
                {product.name}
              </StyledTableCell>
              <StyledTableCell align="right">{product.price}</StyledTableCell>
              <StyledTableCell align="right">
                <Box color={product.color}></Box>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
