import {Form, FormInstance, Input, Modal} from "antd";
import TextArea from "antd/es/input/TextArea";

type Props = {
  open: boolean;
  handleOpen: () => void;
  create: () => void;
  form: FormInstance;
};

export default function InsertComponent({
  create,
  form,
  handleOpen,
  open,
}: Props) {
  return (
    <Modal
      okText="salvar"
      cancelText="cancelar"
      title={"Inserir nova credencial"}
      open={open}
      centered
      onOk={() => create()}
      onCancel={() => handleOpen()}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          rules={[{required: true}]}
          name={"accessKeyId"}
          label="AccessKeyId"
        >
          <Input placeholder="Digite a chave"></Input>
        </Form.Item>
        <Form.Item
          rules={[{required: true}]}
          name={"secretKeyId"}
          label="SecretKeyId"
        >
          <Input placeholder="Insira a chave secreta"></Input>
        </Form.Item>
        <Form.Item rules={[{required: true}]} name={"stage"} label="Stage">
          <Input placeholder="Insira o nome do stage"></Input>
        </Form.Item>
        <Form.Item name={"sessionToken"} label="sessionToken">
          <TextArea placeholder="Insira o sessionToken (opcional)"></TextArea>
        </Form.Item>
        <span id="toas-error"></span>
      </Form>
    </Modal>
  );
}
