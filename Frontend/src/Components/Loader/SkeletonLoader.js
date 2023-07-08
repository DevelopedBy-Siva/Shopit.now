import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function SkeletonLoader({ size = 20 }) {
  return (
    <SkeletonTheme color="#E7E7E7" highlightColor="#CFCFCF">
      <div className="skeleton-loading">
        {new Array(size).fill(undefined).map((_, index) => (
          <p className="skeleton" key={index}>
            <Skeleton width="100%" height="100%" count={1} duration={2} />
          </p>
        ))}
      </div>
    </SkeletonTheme>
  );
}
