import { NextPageContext } from "next";

type ErrorProps = {
  statusCode?: number;
};

export default function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <h1
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingTop: "15%",
        color: "red",
        fontSize: "calc(20px + 1vw)",
        fontFamily: "monospace",
      }}
    >
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </h1>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
