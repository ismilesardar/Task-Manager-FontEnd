import axios from "axios";
import { ErrorToast, SuccessToast } from "../helper/FormHelper";
import {
  getToken,
  removeForget,
  setEmail,
  setOtp,
  setToken,
  setUserDetails
} from "../helper/SessionHelper";
import { SetProfileDetails } from "../redux/slice/profileSlice";
import { HideLoader, ShowLoader } from "../redux/slice/settingsSlice";
import { SetSummary } from "../redux/slice/summarySlice";
import {
  CanceledTask,
  CompletedTask,
  ProgressTask,
  SetNewTask,
} from "../redux/slice/taskSlice";
import store from "../redux/store/store";
import { UnAuthorizeRequest } from "./UnAuthorizeRequest";

const BaseURL = "https://task-manager-ismile.cyclic.app/api/v1";
const AxiosHeader = { headers: { token: getToken() } };
const axiosConfig = { headers: { token: getToken() } };

//Register
export function RegistrationRequest(
  email,
  firstName,
  lastName,
  mobile,
  password,
  photo
) {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/registration`;
  let reqBody = {
    email,
    firstName,
    lastName,
    mobile,
    password,
    photo,
  };
  return axios
    .post(URL, reqBody)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 200) {
        if (res.data["status"] === "fail") {
          if (res.data["data"]["keyPattern"]["email"] === 1) {
            ErrorToast("Email Already Exist");
            return false;
          } else {
            ErrorToast("Something Went Wrong");
            return false;
          }
        } else {
          SuccessToast("Registration Success");
          return true;
        }
      } else {
        ErrorToast("Something Went Wrong");
        return false;
      }
    })
    .catch((error) => {
      store.dispatch(HideLoader());
      ErrorToast("Something Went Wrong");
      UnAuthorizeRequest(error);
      return false;
    });
}

//Login
export function LoginRequest(email, password) {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/login`;
  let reqBody = { email, password };
  return axios
    .post(URL, reqBody)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 200) {
        setToken(res.data["token"]);
        setUserDetails(res.data["data"]);
        SuccessToast("Login Success");
        return true;
      } else {
        ErrorToast("Invalid Email or Password");
        UnAuthorizeRequest(error);
        return false;
      }
    })
    .catch((error) => {
      ErrorToast("Something Went Wrong");
      store.dispatch(HideLoader());
      return false;
    });
}

// New task
export function NewTaskRequest(title, description) {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/createTask`;
  let reqBody = { title: title, description: description, status: "New" };
  return axios
    .post(URL, reqBody, AxiosHeader)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 200) {
        SuccessToast("New Task Created");
        return true;
      } else {
        ErrorToast("Something Went Wrong");
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
      ErrorToast("Something Went Wrong=");
      store.dispatch(HideLoader());
      UnAuthorizeRequest(error);
      return false;
    });
}

// Task List By Status
export function TaskListByStatus(status) {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/listTaskByStatus/${status}`;
  axios
    .get(URL, AxiosHeader)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 200) {
        if (status === "New") {
          store.dispatch(SetNewTask(res.data["data"]));
        } else if (status === "Completed") {
          store.dispatch(CompletedTask(res.data["data"]));
        } else if (status === "Canceled") {
          store.dispatch(CanceledTask(res.data["data"]));
        } else if (status === "Progress") {
          store.dispatch(ProgressTask(res.data["data"]));
        }
      } else {
        ErrorToast("Something Went Wrong");
      }
    })
    .catch((error) => {
      // console.log(error.massage)
      ErrorToast("Something Went Wrong=");
      store.dispatch(HideLoader());
      UnAuthorizeRequest(error);
      return false;
    });
}

// Summary Request
export function SummaryRequest() {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/taskStatusCount`;
  axios
    .get(URL, AxiosHeader)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 200) {
        store.dispatch(SetSummary(res.data["data"]));
      } else {
        ErrorToast("Something Went Wrong");
      }
    })
    .catch((error) => {
      // console.log(error.massage)
      ErrorToast("Something Went Wrong=");
      store.dispatch(HideLoader());
      UnAuthorizeRequest(error);
      return false;
    });
}

// Delete Request
export function DeleteRequest(id) {
  // console.log('AxiosHeader:', axiosConfig);
  // debugger
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/deleteTask/${id}`;
  // debugger
  return axios
    .post(URL, null, axiosConfig)
    .then((res) => {
      // debugger
      store.dispatch(HideLoader());

      if (res.status === 200) {
        SuccessToast("Delete Success!");
        return true;
      } else {
        ErrorToast("Something Went Wrong!");
        return false;
      }
    })
    .catch((error) => {
      // debugger
      console.log(error.message);
      ErrorToast("Something Went Wrong=");
      store.dispatch(HideLoader());
      UnAuthorizeRequest(error);
      return false;
    });
}

//Update Status Request
export function UpdateStatusRequest(id, status) {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/updateStatus/${id}/${status}`;
  // debugger
  return axios
    .post(URL, null, axiosConfig)
    .then((res) => {
      // debugger
      store.dispatch(HideLoader());

      if (res.status === 200) {
        SuccessToast("Update status Success!");
        return true;
      } else {
        ErrorToast("Update status Filed!");
        return false;
      }
    })
    .catch((error) => {
      // debugger
      console.log(error.message);
      ErrorToast("Something Went Wrong");
      store.dispatch(HideLoader());
      UnAuthorizeRequest(error);
      return false;
    });
}

// Profile Details
export function ProfileDetails() {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/profileDetails`;
  axios
    .get(URL, axiosConfig)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 200) {
        store.dispatch(SetProfileDetails(res.data["data"]));
      } else {
        ErrorToast("Something Went Wrong");
      }
    })
    .catch((error) => {
      // console.log(error.massage)
      ErrorToast("Something Went Wrong=");
      store.dispatch(HideLoader());
      UnAuthorizeRequest(error);
      return false;
    });
}

// Profile update
export function ProfileUpdateRequest(
  email,
  firstName,
  lastName,
  mobile,
  password,
  photo
) {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/profileUpdate`;
  let reqBody = {
    email,
    firstName,
    lastName,
    mobile,
    password,
    photo,
  };
  let localBody = {
    email,
    firstName,
    lastName,
    mobile,
    password,
    photo,
  };
  return axios
    .post(URL, reqBody, axiosConfig)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 200) {
        SuccessToast("Profile update success");
        setUserDetails(localBody);
        return true;
      } else {
        ErrorToast("Something Went Wrong");
        return false;
      }
    })
    .catch((error) => {
      store.dispatch(HideLoader());
      ErrorToast("Something Went Wrong");
      UnAuthorizeRequest(error);
      return false;
    });
}

// Forgat Password
export function VerifyEmailRequest(email) {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/verifyEmail/${email}`;
  return axios
    .get(URL)
    .then((res) => {
      store.dispatch(HideLoader());
      // debugger
      if (res.status === 200) {
        if (res.data["status"] === "fail") {
          ErrorToast("No user found");
          return false;
        } else {
          setEmail(email);
          SuccessToast(
            "A 6 Digit verification code has been sent to your email address."
          );
          return true;
        }
      } else {
        ErrorToast("Request Failed");
      }
    })
    .catch((error) => {
      // debugger
      console.log(error.message);
      ErrorToast("Something Went Wrong=");
      store.dispatch(HideLoader());
      UnAuthorizeRequest(error);
      return false;
    });
}

// VerifyOTPRequest
export function VerifyOTPRequest(email, otp) {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/verifyOtp/${email}/${otp}`;
  return axios
    .get(URL)
    .then((res) => {
      store.dispatch(HideLoader());
      // debugger
      if (res.status === 200) {
        if (res.data["status"] === "fail") {
          ErrorToast(res.data["data"]);
          return false;
        } else {
          setOtp(otp);
          SuccessToast("Code Verification Success");
          return true;
        }
      } else {
        ErrorToast("OTP time out");
        return false;
      }
    })
    .catch((error) => {
      // debugger
      console.log(error.message);
      ErrorToast("Something Went Wrong=");
      store.dispatch(HideLoader());
      UnAuthorizeRequest(error);
      return false;
    });
}

// Reset Password Request
export function ResetPassRequest(email, otp,password) {
  store.dispatch(ShowLoader());
  const URL = `${BaseURL}/resetPassword`;
  let postBody = {email, otp, password }
  return axios
    .post(URL,postBody)
    .then((res) => {
      store.dispatch(HideLoader());
      // debugger
      if (res.status === 200) {
        if (res.data["status"] === "fail") {
          ErrorToast(res.data["data"]);
          return false;
        } else {
          removeForget();
          SuccessToast("New password Created");
          return true;
        }
      } else {
        ErrorToast("OTP time out");
        return false;
      }
    })
    .catch((error) => {
      // debugger
      console.log(error.message);
      ErrorToast("Something Went Wrong=");
      store.dispatch(HideLoader());
      UnAuthorizeRequest(error);
      return false;
    });
}
