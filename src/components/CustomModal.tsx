import { CircularProgress, Modal } from "@mui/material";
import React from "react";
// import ModalSize from "../enums/ModalSize";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  modalTitle?: string;
  children: React.ReactNode;
  modalSize?: number;
  saveBtnLabel?: string;
  saveBtnFunction?: (e?: any) => void;
  saveBtnLoading?: boolean;
  saveBtnStyle?: string;
  disableBackdropClick: boolean;
  className?: string;
}

const CustomModal: React.FC<Props> = ({
  modalTitle,
  isOpen,
  onClose,
  modalSize = 700,
  children,
  saveBtnLabel,
  saveBtnFunction = () => {},
  saveBtnLoading = false,
  saveBtnStyle = "bg-secondary-color",
  disableBackdropClick = true,
  className,
}) => {
  return (
    <Modal
      open={isOpen}
      className={`custom-modal-style ${className ?? "rounded"}`}
      sx={{ width: `${modalSize}px` }}
      slotProps={{
        backdrop: {
          onClick: () => {},
        },
      }}
      onBackdropClick={disableBackdropClick ? undefined : onClose}
      BackdropProps={{
        style: {
          cursor: disableBackdropClick ? undefined : "pointer",
        },
      }}
    >
      <div>
        {modalTitle ? (
          <div className="h-[40px] bg-primary-color w-full capitalize flex justify-between items-center text-white font-bold">
            <p className="px-5">{modalTitle}</p>
            {disableBackdropClick ? (
              <button
                className="bg-red-600 text-white text-xl font-bold h-full w-[50px]"
                onClick={onClose}
              >
                x
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="bg-white px-5 py-5">
          {children}
          {saveBtnLabel ? (
            <button
              onClick={saveBtnFunction}
              className={`mx-auto block text-white rounded mt-5 capitalize h-[35px] min-w-[80px] mt-20 ${saveBtnStyle}`}
              disabled={saveBtnLoading}
            >
              {saveBtnLoading ? (
                <CircularProgress size={16} sx={{ color: "#fff" }} />
              ) : (
                saveBtnLabel
              )}
            </button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
