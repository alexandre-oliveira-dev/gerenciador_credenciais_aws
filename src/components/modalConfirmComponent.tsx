import React from "react";
import {Modal} from "antd";

export default function ModalConfirmComponent({
  content,
  handleOpen,
  open,
  fn,
  title,
}: {
  handleOpen: () => void;
  fn: () => void;
  content: React.ReactNode;
  open: boolean;
  title: string;
}) {
  return (
    <Modal
      open={open}
      onCancel={handleOpen}
      onOk={fn}
      okText="Salvar"
      cancelText="Cancelar"
      title={`${title}`}
    >
      {content}
    </Modal>
  );
}
