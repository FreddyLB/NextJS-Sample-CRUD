import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  tableCellClasses,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { IProduct } from "src/shared/models/product.model";
import { MUIStyledCommonProps } from "@mui/system";
import { useConfirmDialog } from "src/context/ConfirmDialogContext";

const StyledTableCell = styled(TableCell)(
  ({ theme }: MUIStyledCommonProps) => ({
    fontSize: 16,
    fontFamily: "monospace",
    padding: 10,
    whiteSpace: "nowrap",
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme!.palette.common.black,
      color: theme!.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
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
  const { isOpen, setOpen } = useConfirmDialog({
    title: "Delete?",
  });

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
      }}
    >
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Color</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        {/* prettier-ignore */}
        <TableBody>
          {items.map((product) => (
            <StyledTableRow key={product.id}>
              <StyledTableCell>{product.id}</StyledTableCell>
              <StyledTableCell>{product.name}</StyledTableCell>
              <StyledTableCell>${product.price}</StyledTableCell>
              <StyledTableCell>
                <Box>
                  <Paper
                    elevation={3}
                    sx={{
                      backgroundColor: product.color,
                      height: 40,
                      width: "100%",
                    }}
                  ></Paper>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center" sx={{
                  display: "flex", 
                  flexDirection: "row", 
                  justifyContent: "center",
                  gap: 2
                }}>
                <Button variant="contained" color="info">View</Button>
                <Button variant="contained" color="primary">Edit</Button>
                <Button variant="contained" color="error" onClick={() => {
                  setOpen(true);
                }}>Delete</Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
