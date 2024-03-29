import Head from "next/head";
import Header from "../../../components/Header";
import SideMenu from "../../../components/SideMenu";
import BackToDashboard from "../../../components/BackToDashboard";
import CreateExamForm from "../../../components/forms/CreateExamForm";
import ExamCard, { ExamCardPlaceholder } from "../../../components/ExamCard";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { RpcRequest } from "../../../lib/rpc";
import { NotifyCard } from "../../../components/forms/SignUpForm";
import { useRouter } from "next/router";
import InvalidViewportSize from "../../../components/InvalidViewportSize";

function Exam({ auth }) {
  const [showForm, setShowForm] = useState();
  const router = useRouter();
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function fetchExams() {
    // console.log(auth);

    const body = {
      req: {
        auth: {
          token: auth.token,
        },
        body: null,
      },
    };

    setFetching(true);

    const res = await RpcRequest("exams.list", body);

    if (res.success) {
      setData(res.data.reverse());

      // console.log(res.data);
    } else {
      setError(res.error.message);
      console.log(res.error);
    }

    setFetching(false);
  }

  useEffect(() => {
    if (router.query.action === "new") {
      setShowForm(true);
    }
  }, []);

  useEffect(() => {
    if (showForm) return;
    fetchExams();
  }, [showForm, error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title> Exams | {process.env.NEXT_PUBLIC_APP_NAME} </title>
      </Head>

      <InvalidViewportSize />

      <div className="bg-white  min-h-screen hidden md:block  px-4  w-full">
        <SideMenu />
        <Header />

        <div
          style={{ fontFamily: "Montserrat" }}
          className=" p-6 mt-20 ml-[16%] w-[84%] overflow-auto self-start  order-2  border rounded-lg relative"
        >
          {error && (
            <NotifyCard
              closeOnError={() => setError(null)}
              id={data && data.length}
              error={error}
              eMsg="Unable to load exams"
              errorText="Retry"
            />
          )}

          <BackToDashboard />

          <hr className="mb-4" />

          {/* Create New Exam Form  */}

          {showForm ? (
            <CreateExamForm close={(e) => setShowForm(false)} />
          ) : (
            <>
              {/* Dashboard Content  */}

              <div className="flex flex-col justify-center text-left    items-start space-y-2">
                <div className="rounded-lg flex flex-row justify-between items-center p-6 py-12 bg-[#5522A9] w-full ">
                  <h2 className="text-3xl text-white font-bold text-left ">
                    {" "}
                    Exams
                  </h2>

                  <div
                    onClick={(e) => setShowForm(true)}
                    className="text-white font-bold cursor-pointer rounded-lg bg-black/40 py-1 px-2 hover:bg-black/60 transition-colors"
                  >
                    <span className="inline-block align-bottom text-sm">
                      {" "}
                      <i className="bi-plus text-xl "></i> Add new exam
                    </span>
                  </div>
                </div>
              </div>

              {/* List of courses  */}

              <div className="grid grid-cols-1  lg:grid-cols-3 md:grid-cols-2  gap-y-4  gap-x-4 mt-8">
                {data && data.length
                  ? data.map((c, i) => {
                      return <ExamCard {...c} key={i} />;
                    })
                  : [1, 2, 3, 4, 5, 6, 7, 8, 9].map((a, i) => {
                      return <ExamCardPlaceholder key={i} active={fetching} />;
                    })}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProtectedRoute({ RenderProp: Exam });
