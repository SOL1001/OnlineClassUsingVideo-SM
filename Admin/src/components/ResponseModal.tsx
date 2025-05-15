import * as React from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Modal from "@mui/material/Modal";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import { CiWarning } from "react-icons/ci";

interface ProfileModalProps {
  open: boolean;
  onConfirm?: () => void;
  onClose: () => void;
  message?: any;
  title?: any;
  success?: boolean;
  btnLabel?: string;
  btnLabel2?: string;
  errorIcon?: any;
  btnConfirm?: boolean;
}

const ResponseModal: React.FC<ProfileModalProps> = ({
  open,
  onConfirm,
  onClose,
  message,
  success,
  title,
  btnConfirm,
  btnLabel2,
  btnLabel,
  errorIcon,
}) => {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        className="fixed inset-0 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="bg-white w-[30%] 2xl:w-[20%] h-fit  relative rounded-[8px] max-md:w-[90%]  ">
          <div className=" flex flex-col h-[fit]  justify-center items-center px-10 pt-5">
            <div className={` text-5xl`}>
              {!btnConfirm ? (
                success ? (
                  <CheckCircleOutlinedIcon
                    fontSize="inherit"
                    className="text-[#00A16A]"
                  />
                ) : errorIcon && errorIcon === "warning" ? (
                  <CiWarning fontSize="inherit" className="text-red-600" />
                ) : (
                  <DangerousOutlinedIcon
                    fontSize="inherit"
                    className="text-red-600"
                  />
                )
              ) : (
                ""
              )}
            </div>

            <h1 className={` text-5xl font-bold mt-2 text-[21px] text-center`}>
              {title}
            </h1>
            <div className="my-5">
              <p className=" text-center text-[#333333]">{message}</p>
            </div>
            {btnConfirm && btnConfirm ? (
              <div className="flex justify-between gap-7">
                <button
                  className="h-full cursor-pointer flex items-center  bg-[#00A16A] px-4 py-1 text-white rounded-lg mb-4 "
                  onClick={onConfirm}
                >
                  {btnLabel2 ? btnLabel2 : "Confirm"}
                </button>

                <button
                  className="h-full cursor-pointer flex items-center  bg-red-500 px-4 py-1 text-white rounded-lg mb-4 "
                  onClick={onClose}
                >
                  {btnLabel ? btnLabel : "cancel"}
                </button>
              </div>
            ) : (
              <button
                className="h-full cursor-pointer flex items-center  bg-[#00A16A] px-4 py-1 text-white rounded-lg mb-4 "
                onClick={onClose}
              >
                {btnLabel ? btnLabel : "OK"}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ResponseModal;
