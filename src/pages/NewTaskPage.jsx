import React, { lazy, Suspense } from "react";
import MasterLayout from "../components/masterLayout/MasterLayout";
const NewTask = lazy(() => import("../components/New/NewTask"));

const NewTaskPage = () => {
  return (
    <>
      <MasterLayout>
        <Suspense fallback={<LazyLoader />}>
          <NewTask />
        </Suspense>
      </MasterLayout>
    </>
  );
};

export default NewTaskPage;
