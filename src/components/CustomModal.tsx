import { CircularProgress, Modal } from "@mui/material";
import React from "react";
// import ModalSize from "../enums/ModalSize";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  children: React.ReactNode;
  modalSize?: number;
  saveBtnLabel?: string;
  saveBtnFunction?: (e?: any) => void;
  saveBtnLoading?: boolean;
  saveBtnStyle?: string;
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
}) => {
  return (
    <Modal
      open={isOpen}
      className={`custom-modal-style`}
      sx={{ width: `${modalSize}px` }}
      disableEscapeKeyDown
      slotProps={{
        backdrop: {
          onClick: () => {},
        },
      }}
    >
      <div className="rounded">
        <div className="h-[40px] bg-primary-color w-full capitalize flex justify-between items-center text-white font-bold">
          <p className="px-5">{modalTitle}</p>
          <button
            className="bg-red-600 text-white text-xl font-bold h-full w-[50px]"
            onClick={onClose}
          >
            x
          </button>
        </div>
        <div className="bg-white px-5 py-5 rounded-bl rounded-br">
          {children}
          {/* <div className="h-[1px] w-full bg-black mt-5 mb-2 opacity-[0.5]"></div> */}
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
