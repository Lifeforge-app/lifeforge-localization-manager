import React from "react";
import ErrorScreen from "./ErrorScreen";
import LoadingScreen from "./LoadingScreen";

function APIFallbackComponent<T>({
  data,
  children,
  showLoading = true,
}: {
  data: T | "loading" | "error";
  children: (data: T) => React.ReactElement | false;
  showLoading?: boolean;
}): React.ReactElement {
  switch (data) {
    case "loading":
      return showLoading ? <LoadingScreen /> : <></>;
    case "error":
      return <ErrorScreen message="Failed to fetch data from server." />;
    default:
      return <>{children(data)}</>;
  }
}

export default APIFallbackComponent;
