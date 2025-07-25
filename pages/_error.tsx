import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { NextPageContext } from "next";

type ErrorProps = {
  statusCode: number;
};

const CustomErrorComponent = (props: ErrorProps) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  const statusCode = contextData.res?.statusCode || contextData.err?.statusCode || 404;
  return { statusCode };
};

export default CustomErrorComponent;
